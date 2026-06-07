'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sparkles, CheckSquare, Clock, AlertCircle, Flame, Calendar, ArrowRight } from 'lucide-react';
import TaskCard from '@/components/tasks/TaskCard';
import CalendarEvent from '@/components/calendar/CalendarEvent';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data, isLoading } = useSWR('/api/dashboard');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mb-4" />
      </div>
    );
  }

  const { todayTasks, upcomingTasks, stats, streak } = data || {
    todayTasks: [],
    upcomingTasks: [],
    stats: { completedToday: 0, totalActive: 0, totalCompleted: 0, overdue: 0 },
    streak: { current: 0, longest: 0 }
  };

  const progressToday = todayTasks.length + stats.completedToday > 0 
    ? Math.round((stats.completedToday / (todayTasks.length + stats.completedToday)) * 100) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            {greeting}, {session?.user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            You have {todayTasks.length} tasks to do today and {stats.overdue} overdue tasks.
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Flame className={`w-5 h-5 ${streak.current > 0 ? 'fill-current' : ''}`} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Streak</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">{streak.current} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500">
              <CheckSquare className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Completed Today</p>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.completedToday}</p>
        </div>
        
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Active Tasks</p>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalActive}</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">All-time Done</p>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalCompleted}</p>
        </div>

        <div className={`bg-[var(--surface)] border rounded-2xl p-5 transition-shadow ${stats.overdue > 0 ? 'border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5' : 'border-[var(--border)] hover:shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stats.overdue > 0 ? 'bg-red-100 dark:bg-red-500/20 text-red-600' : 'bg-slate-100 dark:bg-slate-800 text-[var(--text-muted)]'}`}>
              <AlertCircle className="w-4 h-4" />
            </div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${stats.overdue > 0 ? 'text-red-600/80 dark:text-red-400' : 'text-[var(--text-muted)]'}`}>Overdue</p>
          </div>
          <p className={`text-2xl font-bold ${stats.overdue > 0 ? 'text-red-600 dark:text-red-400' : 'text-[var(--text-primary)]'}`}>{stats.overdue}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Today's Focus */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
            {/* Progress Background */}
            <div 
              className="absolute bottom-0 left-0 h-1 bg-brand-500 transition-all duration-1000"
              style={{ width: `${progressToday}%` }}
            />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-500" />
                Today&apos;s Focus
              </h2>
              {todayTasks.length > 0 && (
                <span className="text-sm font-medium text-[var(--text-muted)]">
                  {progressToday}% complete
                </span>
              )}
            </div>

            <div className="space-y-3 relative z-10">
              {todayTasks.length > 0 ? (
                todayTasks.map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    onClick={() => router.push(`/tasks/${task._id}`)}
                    onEdit={() => router.push(`/tasks/${task._id}`)}
                  />
                ))
              ) : (
                <div className="py-12 text-center text-[var(--text-muted)]">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckSquare className="w-8 h-8 opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">You&apos;re all caught up!</h3>
                  <p className="text-sm max-w-sm mx-auto">
                    Take a break, or grab a task from the backlog to get ahead.
                  </p>
                  <Button variant="outline" className="mt-6" onClick={() => router.push('/tasks')}>
                    View All Tasks
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming & Suggestions */}
        <div className="space-y-6">
          
          {/* AI Focus Suggestion */}
          {upcomingTasks.length > 0 && (
            <div className="gradient-bg rounded-3xl p-6 text-white shadow-glow relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" />
                AI Focus Tip
              </h3>
              <p className="text-sm text-white/90 leading-relaxed mb-4">
                You have {upcomingTasks.length} tasks coming up this week. Consider knocking out &quot;{upcomingTasks[0]?.title}&quot; today since it&apos;s the highest priority.
              </p>
              <Button size="sm" className="w-full bg-white text-brand-600 hover:bg-slate-50" onClick={() => router.push(`/tasks/${upcomingTasks[0]?._id}`)}>
                View Task <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Upcoming Deadlines */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Upcoming Deadlines
            </h2>
            
            <div className="space-y-3">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.slice(0, 5).map(task => (
                  <CalendarEvent 
                    key={task._id} 
                    task={task} 
                    variant="block" 
                    onClick={() => router.push(`/tasks/${task._id}`)}
                  />
                ))
              ) : (
                <p className="text-sm text-[var(--text-muted)] text-center py-6">
                  No upcoming deadlines in the next 7 days.
                </p>
              )}
            </div>
            
            {upcomingTasks.length > 5 && (
              <Button variant="ghost" className="w-full mt-4 text-xs" onClick={() => router.push('/calendar')}>
                View all in Calendar
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
