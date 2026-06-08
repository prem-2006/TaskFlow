import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import jsonStore from '@/lib/jsonStore';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const project = jsonStore.projects.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    let tasks = jsonStore.tasks.find({
      projectId: params.id,
      userId: session.user.id,
    });
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ project, tasks });
  } catch (error) {
    console.error('GET /api/projects/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    const existingProject = jsonStore.projects.findOne({ _id: params.id, userId: session.user.id });
    if (!existingProject) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const project = jsonStore.projects.update(params.id, body);

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('PUT /api/projects/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const existingProject = jsonStore.projects.findOne({ _id: params.id, userId: session.user.id });
    if (!existingProject) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // Soft delete — archive
    const project = jsonStore.projects.update(params.id, { archived: true });

    // Unlink tasks from project
    const tasksToUpdate = jsonStore.tasks.find({ projectId: params.id, userId: session.user.id });
    for (let t of tasksToUpdate) {
      jsonStore.tasks.update(t._id, { projectId: null });
    }

    return NextResponse.json({ message: 'Project archived' });
  } catch (error) {
    console.error('DELETE /api/projects/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
