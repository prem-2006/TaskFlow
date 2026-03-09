'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'
];

export default function ProjectForm({ initialData = {}, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    color: initialData.color || COLORS[10], // Default blue
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Project Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g., Q3 Marketing Campaign"
        required
        autoFocus
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[var(--text-primary)]">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What is this project about?"
          rows={3}
          className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--surface)] border border-[var(--border)] focus-ring outline-none resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--text-primary)]">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, color }))}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-transform
                ${formData.color === color ? 'ring-2 ring-offset-2 ring-offset-[var(--surface)] ring-[var(--text-primary)] scale-110' : 'hover:scale-110'}
              `}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--border)]">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData._id ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
