'use client';

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import CalendarEvent from './CalendarEvent';

export default function MonthView({ currentDate, tasks, onTaskClick, onDateClick }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Generate days array
  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col h-[600px] lg:h-[700px]">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-[var(--border)] bg-[var(--surface-elevated)]">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-6">
        {days.map((date, i) => {
          const isCurrentMonth = isSameMonth(date, monthStart);
          const isTodayDate = isToday(date);
          
          // Find tasks for this day
          const dayTasks = tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), date));
          
          return (
            <div
              key={date.toString()}
              onClick={() => onDateClick?.(date)}
              className={`
                min-h-[100px] border-b border-r border-[var(--border)] p-1.5 flex flex-col
                transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02] cursor-pointer
                ${!isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-900/50 text-[var(--text-muted)]' : 'bg-[var(--surface)]'}
                ${i % 7 === 6 ? 'border-r-0' : ''} /* Remove right border for Sunday */
              `}
            >
              <div className="flex justify-end mb-1">
                <span
                  className={`
                    w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium
                    ${isTodayDate ? 'bg-brand-500 text-white shadow-glow' : ''}
                    ${!isTodayDate && isCurrentMonth ? 'text-[var(--text-primary)]' : ''}
                  `}
                >
                  {format(date, 'd')}
                </span>
              </div>
              
              <div className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
                {dayTasks.slice(0, 3).map((task) => (
                  <CalendarEvent
                    key={task._id}
                    task={task}
                    variant="chip"
                    onClick={onTaskClick}
                  />
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-[10px] text-[var(--text-muted)] font-medium px-1.5 py-0.5">
                    + {dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
