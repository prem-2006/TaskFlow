import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mockTasks } from '@/lib/mockData';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // MOCK FOR UI DEMO
  const task = mockTasks.find(t => t._id === params.id) || mockTasks[0];
  return NextResponse.json({ task });
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // MOCK FOR UI DEMO
  const body = await request.json();
  const task = mockTasks.find(t => t._id === params.id) || mockTasks[0];
  const updatedTask = { ...task, ...body };
  return NextResponse.json({ task: updatedTask });
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // MOCK FOR UI DEMO
  return NextResponse.json({ message: 'Task deleted' });
}
