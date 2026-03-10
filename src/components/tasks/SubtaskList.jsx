'use client';

import { useState } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function SubtaskList({ subtasks, onChange, readOnly = false }) {
  const [newTitle, setNewTitle] = useState('');

  function handleAdd(e) {
    e?.preventDefault();
    if (!newTitle.trim()) return;
    
    onChange([...subtasks, { title: newTitle.trim(), done: false }]);
    setNewTitle('');
  }

  function handleToggle(index) {
    if (readOnly) return;
    const updated = [...subtasks];
    updated[index].done = !updated[index].done;
    onChange(updated);
  }

  function handleRemove(index) {
    if (readOnly) return;
    const updated = subtasks.filter((_, i) => i !== index);
    onChange(updated);
  }

  function handleTitleChange(index, title) {
    if (readOnly) return;
    const updated = [...subtasks];
    updated[index].title = title;
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      {subtasks.map((subtask, index) => (
        <div key={index} className="flex items-center gap-2 group">
          {!readOnly && (
            <div className="text-[var(--border)] cursor-grab">
              <GripVertical className="w-4 h-4" />
            </div>
          )}
          
          <input
            type="checkbox"
            checked={subtask.done}
            onChange={() => handleToggle(index)}
            disabled={readOnly}
            className="w-4 h-4 rounded border-[var(--border)] text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          
          <input
            type="text"
            value={subtask.title}
            onChange={(e) => handleTitleChange(index, e.target.value)}
            disabled={readOnly || subtask.done}
            className={`
              flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-0 py-1 text-sm
              ${subtask.done ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}
            `}
          />
          
          {!readOnly && (
            <button
              onClick={() => handleRemove(index)}
              className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-muted)] hover:text-red-500 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}

      {!readOnly && (
        <form onSubmit={handleAdd} className="flex items-center gap-2 mt-2">
          <div className="w-4 h-4 flex-shrink-0" /> {/* Spacer for alignment */}
          <div className="relative flex-1">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add a subtask..."
              className="w-full bg-transparent border-b border-dashed border-[var(--border)] focus:border-brand-500 px-0 py-1.5 text-sm focus:outline-none transition-colors"
            />
          </div>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={!newTitle.trim()}
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </form>
      )}
    </div>
  );
}
