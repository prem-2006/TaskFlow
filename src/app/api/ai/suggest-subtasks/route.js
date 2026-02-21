import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import openai from '@/lib/openai';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'AI features are not configured' }, { status: 503 });
    }

    const { title, description } = await request.json();
    if (!title) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a productivity assistant. Break down a task into 3-7 actionable subtasks.
Each subtask should be:
- Specific and actionable
- Small enough to complete in one sitting
- Ordered logically

Return a JSON object with a "subtasks" array where each item has:
- title (string): Clear subtask name
- estimatedMinutes (number): Rough time estimate`,
        },
        {
          role: 'user',
          content: `Task: ${title}${description ? `\nDescription: ${description}` : ''}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 500,
    });

    const parsed = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json({ subtasks: parsed.subtasks || [] });
  } catch (error) {
    console.error('AI suggest-subtasks error:', error);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}
