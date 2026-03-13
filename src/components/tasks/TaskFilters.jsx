'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/utils/constants';

export default function TaskFilters({ filters, onChange }) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  function handleFilterChange(key, value) {
    onChange({ ...filters, [key]: value, page: 1 }); // reset to page 1 on filter change
  }

  function clearFilters() {
    onChange({ search: '', status: '', priority: '', projectId: '', tag: '', page: 1 });
  }

  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) => k !== 'search' && k !== 'page' && k !== 'limit' && v
  ).length;

  const FilterContent = () => (
    <>
      <select
        value={filters.status || ''}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="px-3 py-2 text-sm rounded-xl bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--border)] focus-ring outline-none"
      >
        <option value="">All Statuses</option>
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <option key={key} value={key}>{config.label}</option>
        ))}
      </select>

      <select
        value={filters.priority || ''}
        onChange={(e) => handleFilterChange('priority', e.target.value)}
        className="px-3 py-2 text-sm rounded-xl bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--border)] focus-ring outline-none"
      >
        <option value="">All Priorities</option>
        {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
          <option key={key} value={key}>{config.label}</option>
        ))}
      </select>

      {/* Basic project placeholder — real app would fetch projects here or receive them as props */}
      
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
        >
          Clear All
        </button>
      )}
    </>
  );

  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center w-full">
      {/* Search Input */}
      <div className="flex-1 min-w-[200px]">
        <Input
          icon={Search}
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex items-center gap-3">
        <FilterContent />
      </div>

      {/* Mobile Filters Toggle */}
      <div className="md:hidden flex items-center justify-between">
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl text-sm font-medium"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 flex items-center justify-center bg-brand-500 text-white rounded-full text-[10px]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filters Expanded */}
      {isMobileFiltersOpen && (
        <div className="md:hidden flex flex-col gap-3 p-4 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl animate-scale-in origin-top">
          <FilterContent />
        </div>
      )}
    </div>
  );
}
