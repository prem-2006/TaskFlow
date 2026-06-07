import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mockDashboardData } from '@/lib/mockData';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // MOCK FOR UI DEMO
  return NextResponse.json(mockDashboardData, { status: 200 });
}
