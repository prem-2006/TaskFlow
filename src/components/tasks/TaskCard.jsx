'use client';

import { useState } from 'react';
import { formatDate, isOverdue, isDueSoon } from '@/utils/dates';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { CheckSquare, Calendar, Folder, MoreVertical, Trash, Edit, Clock } from 'lucide-react';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';
import Avatar from '@/components/ui/Avatar';
import { updateTask, deleteTask } from '@/hooks/useTasks';
import toast from 'react-hot-toast';

export default function TaskCard({ task, onClick, onEdit }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const completedSubtasks = task.subtasks?.filter(s => s.done).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const hasSubtasks = totalSubtasks > 0;
  const progressPercent = hasSubtasks ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const isTaskOverdue = task.status !== 'done' && isOverdue(task.dueDate);
  const isTaskDueSoon = task.status !== 'done' && isDueSoon(task.dueDate);

  async function toggleStatus(e) {
    e.stopPropagation();
    if (isUpdating) return;
    
    setIsUpdating(true);
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    
    try {
      await updateTask(task._id, { status: newStatus });
      if (newStatus === 'done') {
        toast.success('Task completed!');
      }
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete(closeDropdown) {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task._id);
      closeDropdown();
    }
  }

  return (
    <div 
      className={`
        relative group p-4 rounded-xl transition-all duration-200 cursor-pointer
        bg-[var(--surface)] dark:bg-[var(--surface)] border
        ${task.status === 'done' 
          ? 'opacity-60 border-[var(--border)] dark:border-[var(--border)]' 
          : 'border-[var(--border)] hover:border-brand-300 dark:hover:border-brand-500/50 hover:shadow-card-hover'}
        ${isTaskOverdue ? 'border-red-300/50 dark:border-red-500/30 bg-red-50/30 dark:bg-red-500/5' : ''}
      `}
      onClick={onClick}
    >
      {/* Project Color Indicator */}
      {task.projectId?.color && (
        <div 
          className="absolute left-0 top-4 bottom-4 w-1 rounded-r-md" 
          style={{ backgroundColor: task.projectId.color }} 
        />
      )}

      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={toggleStatus}
          disabled={isUpdating}
          className={`
            mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all flex-shrink-0
            ${task.status === 'done' 
              ? 'bg-emerald-500 border-emerald-500 text-white' 
              : 'border-[var(--text-muted)] hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10'}
          `}
        >
          {task.status === 'done' && <CheckSquare className="w-3.5 h-3.5" />}
        </button>

        <div className="flex-1 min-w-0">
          {/* Title & Actions */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`font-semibold text-sm truncate ${task.status === 'done' ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
              {task.title}
            </h3>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
              <Dropdown
                align="right"
                trigger={
                  <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/5 text-[var(--text-muted)]">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                }
              >
                {({ close }) => (
                  <>
                    <DropdownItem icon={Edit} onClick={() => { onEdit?.(); close(); }}>
                      Edit Task
                    </DropdownItem>
                    <DropdownItem icon={Trash} danger onClick={() => handleDelete(close)}>
                      Delete Task
                    </DropdownItem>
                  </>
                )}
              </Dropdown>
            </div>
          </div>

          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <PriorityBadge priority={task.priority} />
            
            {task.projectId && (
              <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-elevated)]">
                <Folder className="w-3 h-3" style={{ color: task.projectId.color }} />
                {task.projectId.name}
              </span>
            )}

            {task.dueDate && (
              <span className={`
                flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border
                ${isTaskOverdue 
                  ? 'text-red-600 bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20' 
                  : isTaskDueSoon 
                    ? 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20'
                    : 'text-[var(--text-muted)] border-[var(--border)] bg-[var(--surface-elevated)]'
                }
              `}>
                <Calendar className="w-3 h-3" />
                {formatDate(task.dueDate)}
                {isTaskOverdue && ' (Overdue)'}
              </span>
            )}
            
            {task.estimatedMinutes && (
              <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-elevated)]">
                <Clock className="w-3 h-3" />
                {task.estimatedMinutes >= 60 ? `${(task.estimatedMinutes / 60).toFixed(1)}h` : `${task.estimatedMinutes}m`}
              </span>
            )}
          </div>

          {/* Tags */}
          {task.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map(tag => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Subtask Progress */}
          {hasSubtasks && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-1">
                <div className="flex items-center gap-1">
                  <CheckSquare className="w-3 h-3" />
                  <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
                </div>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Assignees */}
          {task.assignees?.length > 0 && (
            <div className="flex items-center justify-end mt-3 -space-x-2">
              {task.assignees.map((assignee, i) => (
                <div key={assignee._id} className={`relative z-[${10 - i}] border-2 border-[var(--surface)] rounded-full`}>
                  <Avatar name={assignee.name} image={assignee.image} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
