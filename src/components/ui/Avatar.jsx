'use client';

/* eslint-disable @next/next/no-img-element */
import React from 'react';

export default function Avatar({ name, image, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  if (image) {
    return (
      <img
        src={image}
        alt={name || 'Avatar'}
        className={`
          rounded-full object-cover ring-2 ring-[var(--border)]
          ${sizeClasses[size]}
          ${className}
        `}
      />
    );
  }

  return (
    <div
      className={`
        rounded-full flex items-center justify-center font-semibold
        bg-gradient-to-br from-brand-500 to-accent-500 text-white
        ring-2 ring-[var(--border)]
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
