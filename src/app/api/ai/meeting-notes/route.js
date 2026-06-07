import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // MOCK RESPONSE FOR UI DEMO - SIMULATING AI PROCESSING
    // In a real app, this would send `text` to OpenAI to extract actionable tasks.
    
    // Artificial delay to simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 2000));

    const generatedTasks = [
      {
        title: 'Draft Q3 Marketing Strategy',
        description: 'Based on the meeting notes, create the initial draft for Q3 marketing and email to the team.',
        assigneeIds: ['mock-user-2'],
        priority: 'high',
        status: 'todo',
        tags: ['Marketing', 'Planning']
      },
      {
        title: 'Fix Login Timeout Issue',
        description: 'Investigate the DB connection timeout happening during the sign-in flow.',
        assigneeIds: ['mock-user-123'],
        priority: 'urgent',
        status: 'todo',
        tags: ['Engineering', 'Bug']
      },
      {
        title: 'Schedule Follow-up with Design',
        description: 'Set up a meeting next week to finalize the new avatar components.',
        assigneeIds: ['mock-user-3'],
        priority: 'medium',
        status: 'todo',
        tags: ['Design', 'Meeting']
      }
    ];

    return NextResponse.json({ tasks: generatedTasks });
  } catch (error) {
    console.error('Meeting notes parser error:', error);
    return NextResponse.json({ error: 'Failed to process notes' }, { status: 500 });
  }
}
