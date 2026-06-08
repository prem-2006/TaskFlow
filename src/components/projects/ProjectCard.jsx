'use client';

import { Folder, MoreVertical, Edit2, Archive, CheckSquare } from 'lucide-react';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';
import { useRouter } from 'next/navigation';

export default function ProjectCard({ project, onEdit, onArchive }) {
  const router = useRouter();

  const completed = project.completedCount || 0;
  const total = project.taskCount || 0;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div 
      onClick={() => router.push(`/projects/${project._id}`)}
      className="group bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col h-full relative overflow-hidden"
    >
      {/* Decorative top border */}
      <div 
        className="absolute top-0 left-0 right-0 h-1" 
        style={{ backgroundColor: project.color || 'var(--brand-500)' }} 
      />

      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
          style={{ backgroundColor: project.color || 'var(--brand-500)' }}
        >
          <Folder className="w-5 h-5" />
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          <Dropdown
            align="right"
            trigger={
              <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-slate-100 dark:hover:bg-white/5">
                <MoreVertical className="w-5 h-5" />
              </button>
            }
          >
            {({ close }) => (
              <>
                <DropdownItem icon={Edit2} onClick={() => { onEdit(); close(); }}>
                  Edit Project
                </DropdownItem>
                <DropdownItem icon={Archive} danger onClick={() => { onArchive(); close(); }}>
                  Archive
                </DropdownItem>
              </>
            )}
          </Dropdown>
        </div>
      </div>

      <div className="mb-4 flex-1">
        <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-1 truncate">
          {project.name}
        </h3>
        {project.description ? (
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
            {project.description}
          </p>
        ) : (
          <p className="text-sm text-[var(--text-muted)] italic">
            No description
          </p>
        )}
      </div>

      {/* Progress Footer */}
      <div className="mt-auto pt-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2">
          <span className="flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5" />
            {completed} / {total} tasks
          </span>
          <span className="font-medium text-[var(--text-primary)]">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500 rounded-full"
            style={{ 
              width: `${progress}%`,
              backgroundColor: project.color || 'var(--brand-500)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
