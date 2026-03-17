'use client';

import { useState, useRef, useEffect } from 'react';

export default function Dropdown({ trigger, children, align = 'right', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 min-w-[200px]
            bg-[var(--surface)] dark:bg-[var(--surface)]
            border border-[var(--border)]
            rounded-xl shadow-lg
            py-1.5
            animate-scale-in origin-top
            ${alignmentClasses[align]}
            ${className}
          `}
        >
          {typeof children === 'function' ? children({ close: () => setIsOpen(false) }) : children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, icon: Icon, danger = false, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-2.5 px-3 py-2 text-sm
        transition-colors duration-150
        ${danger
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
          : 'text-[var(--text-primary)] hover:bg-slate-50 dark:hover:bg-white/5'
        }
        ${className}
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
