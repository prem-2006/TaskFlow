'use client';

import { useState } from 'react';
import { formatDate, formatDateTime } from '@/utils/dates';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { Calendar, Folder, Clock, Tag, FileText, CheckSquare, Sparkles, X, Edit2, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import SubtaskList from './SubtaskList';
import { updateTask, deleteTask } from '@/hooks/useTasks';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function TaskDetail({ task, onEdit, onClose }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!task) return null;

  const completedSubtasks = task.subtasks?.filter(s => s.done).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const hasSubtasks = totalSubtasks > 0;
  const progressPercent = hasSubtasks ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  async function toggleStatus() {
    if (isUpdating) return;
    setIsUpdating(true);
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    
    try {
      await updateTask(task._id, { status: newStatus });
      if (newStatus === 'done') toast.success('Task completed!');
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleSubtaskChange(newSubtasks) {
    try {
      await updateTask(task._id, { subtasks: newSubtasks });
    } catch (error) {
      // Error handled in hook
    }
  }

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task._id);
        if (onClose) onClose();
        else router.push('/tasks');
      } catch (error) {
        // Error handled in hook
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-[var(--surface)]">
      {/* Header Actions */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] sticky top-0 bg-[var(--surface)]/95 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleStatus} disabled={isUpdating}>
            <CheckSquare className={`w-4 h-4 ${task.status === 'done' ? 'text-emerald-500' : ''}`} />
            {task.status === 'done' ? 'Mark Undone' : 'Complete'}
          </Button>
          {task.aiGenerated && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded-full">
              <Sparkles className="w-3 h-3" /> AI Generated
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onEdit} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-white/5 transition-colors" title="Edit Task">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={handleDelete} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Delete Task">
            <Trash2 className="w-4 h-4" />
          </button>
          {onClose && (
            <>
              <div className="w-px h-6 bg-[var(--border)] mx-1" />
              <button onClick={onClose} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* Title & Status */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
          <h1 className={`text-2xl font-bold ${task.status === 'done' ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}`}>
            {task.title}
          </h1>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Due Date</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center text-pink-500">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Project</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {task.projectId ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.projectId.color }} />
                    {task.projectId.name}
                  </span>
                ) : 'None'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Estimated Time</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {task.estimatedMinutes ? `${task.estimatedMinutes} minutes` : 'Not set'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Tag className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--text-muted)]">Tags</p>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {task.tags?.length > 0 ? (
                  task.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] truncate max-w-[80px]">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm font-medium text-[var(--text-primary)]">None</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-3">
            <FileText className="w-4 h-4 text-[var(--text-muted)]" />
            Description
          </h3>
          {task.description ? (
            <div className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap bg-[var(--surface-elevated)] p-4 rounded-xl border border-[var(--border)]">
              {task.description}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)] italic">No description provided.</p>
          )}
        </div>

        {/* Subtasks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <CheckSquare className="w-4 h-4 text-[var(--text-muted)]" />
              Subtasks
            </h3>
            {hasSubtasks && (
              <span className="text-xs font-medium text-[var(--text-muted)] bg-[var(--surface-elevated)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                {completedSubtasks} / {totalSubtasks} ({progressPercent}%)
              </span>
            )}
          </div>
          
          <div className="bg-[var(--surface-elevated)] p-4 rounded-xl border border-[var(--border)]">
            <SubtaskList
              subtasks={task.subtasks || []}
              onChange={handleSubtaskChange}
            />
          </div>
        </div>

        {/* Footer Meta */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--text-muted)]">
          <p>Created: {formatDateTime(task.createdAt)}</p>
          <p>Last updated: {formatDateTime(task.updatedAt)}</p>
          {task.completedAt && <p className="text-emerald-500">Completed: {formatDateTime(task.completedAt)}</p>}
        </div>
      </div>
    </div>
  );
}
