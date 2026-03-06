'use client';

import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isToday,
} from 'date-fns';
import CalendarEvent from './CalendarEvent';

export default function WeekView({ currentDate, tasks, onTaskClick, onDateClick }) {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });

  // Generate days array
  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col h-[600px] lg:h-[700px]">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-[var(--border)] bg-[var(--surface-elevated)]">
        {days.map((date) => {
          const isTodayDate = isToday(date);
          return (
            <div key={date.toString()} className="py-4 flex flex-col items-center justify-center border-r border-[var(--border)] last:border-r-0">
              <span className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isTodayDate ? 'text-brand-500' : 'text-[var(--text-secondary)]'}`}>
                {format(date, 'EEE')}
              </span>
              <span className={`
                w-8 h-8 flex items-center justify-center rounded-full text-base font-bold
                ${isTodayDate ? 'bg-brand-500 text-white shadow-glow' : 'text-[var(--text-primary)]'}
              `}>
                {format(date, 'd')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 overflow-y-auto no-scrollbar">
        {days.map((date) => {
          // Find tasks for this day
          const dayTasks = tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), date));
          
          return (
            <div
              key={date.toString()}
              onClick={() => onDateClick?.(date)}
              className="border-r border-[var(--border)] last:border-r-0 p-2 flex flex-col gap-2 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02] cursor-pointer"
            >
              {dayTasks.map((task) => (
                <div key={task._id} className="h-20">
                  <CalendarEvent
                    task={task}
                    variant="block"
                    onClick={onTaskClick}
                  />
                </div>
              ))}
              {dayTasks.length === 0 && (
                <div className="h-full min-h-[100px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-2xl text-[var(--text-muted)] font-light">+</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
