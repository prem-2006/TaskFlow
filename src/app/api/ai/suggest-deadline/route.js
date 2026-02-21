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

    const { title, description, priority, activeTasks, nearestDeadline } = await request.json();

    const today = new Date().toISOString().split('T')[0];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a scheduling assistant. Suggest a realistic deadline for a task.
Today's date is ${today}.
Consider the task complexity, priority, and the user's current workload.

Return a JSON object with:
- suggestedDate (string): ISO date string for the suggested deadline
- reasoning (string): Brief explanation of why this date makes sense`,
        },
        {
          role: 'user',
          content: `Task: ${title}
${description ? `Description: ${description}` : ''}
Priority: ${priority || 'medium'}
Current active tasks: ${activeTasks || 0}
Nearest existing deadline: ${nearestDeadline || 'none'}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 200,
    });

    const parsed = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('AI suggest-deadline error:', error);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}
