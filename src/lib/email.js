import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendReminderEmail({ to, taskTitle, dueDate, priority, url }) {
  const isOverdue = new Date(dueDate) < new Date();
  
  const subject = isOverdue 
    ? `Action Required: Task "${taskTitle}" is overdue`
    : `Reminder: Upcoming task "${taskTitle}"`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #333;">TaskFlow Reminder</h2>
      <p style="color: #555; font-size: 16px;">
        This is a reminder for your task: <strong>${taskTitle}</strong>.
      </p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Due Date:</strong> ${new Date(dueDate).toLocaleString()}</p>
        <p style="margin: 0;"><strong>Priority:</strong> <span style="text-transform: capitalize;">${priority}</span></p>
      </div>

      <a href="${url}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        View Task in TaskFlow
      </a>
      
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        You are receiving this email because you have reminders enabled for this task in TaskFlow.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send reminder email:', error);
    return false;
  }
}
