import { NextResponse } from 'next/server';
import jsonStore from '@/lib/jsonStore';
import { sendReminderEmail } from '@/lib/email';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// This endpoint is meant to be called by a cron job (e.g. Vercel Cron)
// We use a simple CRON_SECRET to secure it.
export async function GET(request) {
  try {
    const authHeader = headers().get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Simple protection: only run if the secret matches
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find unsent reminders where triggerAt is in the past
    const pendingReminders = jsonStore.reminders.find().filter(r => !r.sent && new Date(r.triggerAt) <= new Date());

    let sentCount = 0;

    for (const reminder of pendingReminders) {
      const user = jsonStore.users.findOne({ _id: reminder.userId });
      const task = jsonStore.tasks.findOne({ _id: reminder.taskId });

      // Skip if task was completed or deleted
      if (!task || task.status === 'done' || !user) {
        jsonStore.reminders.update(reminder._id, { sent: true });
        continue;
      }

      if (reminder.type === 'email' && user.preferences?.reminderEmail !== false) {
        // Send email
        const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const taskUrl = `${appUrl}/tasks/${task._id}`;
        
        const success = await sendReminderEmail({
          to: user.email,
          taskTitle: task.title,
          dueDate: task.dueDate,
          priority: task.priority,
          url: taskUrl
        });

        if (success) {
          jsonStore.reminders.update(reminder._id, { sent: true });
          sentCount++;
        }
      } else {
        // If it's a push notification, handle web-push logic here
        // (Assuming web-push is implemented separately via Service Worker)
        jsonStore.reminders.update(reminder._id, { sent: true });
      }
    }

    return NextResponse.json({ message: 'Processed reminders', count: sentCount }, { status: 200 });

  } catch (error) {
    console.error('Cron reminder error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
