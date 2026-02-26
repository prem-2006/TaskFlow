import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import Reminder from '@/models/Reminder';
import { calculateReminderTime } from '@/utils/dates';
import { addEventToCalendar } from '@/lib/googleCalendar';

/**
 * GET /api/tasks — List tasks for the authenticated user
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const projectId = searchParams.get('projectId');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const dueDateFrom = searchParams.get('dueDateFrom');
    const dueDateTo = searchParams.get('dueDateTo');

    // Build query
    const query = { userId: session.user.id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (projectId) query.projectId = projectId;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (dueDateFrom || dueDateTo) {
      query.dueDate = {};
      if (dueDateFrom) query.dueDate.$gte = new Date(dueDateFrom);
      if (dueDateTo) query.dueDate.$lte = new Date(dueDateTo);
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('projectId', 'name color icon')
        .lean(),
      Task.countDocuments(query),
    ]);

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/tasks — Create a new task
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    const task = await Task.create({
      userId: session.user.id,
      title: body.title,
      description: body.description || '',
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      dueDate: body.dueDate || null,
      tags: body.tags || [],
      subtasks: body.subtasks || [],
      projectId: body.projectId || null,
      aiGenerated: body.aiGenerated || false,
      estimatedMinutes: body.estimatedMinutes || null,
    });

    // Auto-create reminder if dueDate is set
    if (task.dueDate) {
      const triggerAt = calculateReminderTime(task.dueDate, task.estimatedMinutes);
      if (triggerAt && triggerAt > new Date()) {
        await Reminder.create({
          userId: session.user.id,
          taskId: task._id,
          type: 'email',
          triggerAt,
        });
      }

      // Sync to Google Calendar
      const eventId = await addEventToCalendar(session.user.id, task);
      if (eventId) {
        task.googleCalendarEventId = eventId;
        await task.save();
      }
    }

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
