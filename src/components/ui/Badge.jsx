'use client';

import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/utils/constants';

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function Badge({ children, color, bgColor, className = '', size = 'md' }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-semibold rounded-full
        whitespace-nowrap select-none
        ${sizeClasses[size]}
        ${className}
      `}
      style={{
        color: color,
        backgroundColor: bgColor,
      }}
    >
      {children}
    </span>
  );
}

export function PriorityBadge({ priority, size = 'md' }) {
  const config = PRIORITY_CONFIG[priority];
  if (!config) return null;

  return (
    <Badge color={config.color} bgColor={config.bgColor} size={size}>
      {config.label}
    </Badge>
  );
}

export function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <Badge color={config.color} bgColor={config.bgColor} size={size}>
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </Badge>
  );
}

export default Badge;
