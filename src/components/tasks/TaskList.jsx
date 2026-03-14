'use client';

import { useState } from 'react';
import TaskCard from './TaskCard';
import { Loader2, LayoutGrid, List } from 'lucide-react';
import { STATUS_CONFIG } from '@/utils/constants';

export default function TaskList({ tasks, isLoading, onTaskClick }) {
  const [viewMode, setViewMode] = useState('board'); // 'board' or 'list'

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-500" />
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)] text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <CheckSquare className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">No tasks found</h3>
        <p className="text-sm max-w-sm">
          Get started by creating a new task, or adjust your filters if you're looking for something specific.
        </p>
      </div>
    );
  }

  // Board view (Kanban columns)
  if (viewMode === 'board') {
    const columns = [
      { id: 'todo', label: STATUS_CONFIG['todo'].label, color: STATUS_CONFIG['todo'].color },
      { id: 'in-progress', label: STATUS_CONFIG['in-progress'].label, color: STATUS_CONFIG['in-progress'].color },
      { id: 'done', label: STATUS_CONFIG['done'].label, color: STATUS_CONFIG['done'].color },
    ];

    return (
      <div>
        {/* View Toggle */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center bg-[var(--surface-elevated)] rounded-lg p-1 border border-[var(--border)]">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'board' ? 'bg-[var(--surface)] shadow-sm text-brand-600' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[var(--surface)] shadow-sm text-brand-600' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start overflow-x-auto pb-4">
          {columns.map(col => {
            const columnTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="flex flex-col gap-3 min-w-[280px]">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                    <h3 className="font-semibold text-sm text-[var(--text-primary)]">{col.label}</h3>
                  </div>
                  <span className="text-xs font-medium bg-[var(--surface-elevated)] px-2 py-0.5 rounded-full text-[var(--text-muted)] border border-[var(--border)]">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Column Tasks */}
                <div className="flex flex-col gap-3">
                  {columnTasks.map(task => (
                    <div key={task._id} className="animate-fade-in">
                      <TaskCard
                        task={task}
                        onClick={() => onTaskClick?.(task)}
                        onEdit={() => onTaskClick?.(task)}
                      />
                    </div>
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="p-4 rounded-xl border border-dashed border-[var(--border)] text-center text-sm text-[var(--text-muted)]">
                      Empty
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

  // List view
  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex items-center bg-[var(--surface-elevated)] rounded-lg p-1 border border-[var(--border)]">
          <button
            onClick={() => setViewMode('board')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'board' ? 'bg-[var(--surface)] shadow-sm text-brand-600' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[var(--surface)] shadow-sm text-brand-600' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {tasks.map(task => (
          <div key={task._id} className="animate-fade-up">
            <TaskCard
              task={task}
              onClick={() => onTaskClick?.(task)}
              onEdit={() => onTaskClick?.(task)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Ensure CheckSquare is imported if used in the empty state
import { CheckSquare } from 'lucide-react';
