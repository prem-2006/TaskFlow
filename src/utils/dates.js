import {
  format,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isYesterday,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addHours,
  isBefore,
  isAfter,
  differenceInDays,
  differenceInHours,
} from 'date-fns';

/**
 * Format a date for display
 */
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
}

/**
 * Format a date with time
 */
export function formatDateTime(date) {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy · h:mm a');
}

/**
 * Get relative time string (e.g., "in 2 days", "3 hours ago")
 */
export function getRelativeTime(date) {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Check if a date is overdue (before today's start)
 */
export function isOverdue(date) {
  if (!date) return false;
  return isBefore(new Date(date), startOfDay(new Date()));
}

/**
 * Check if a date is due soon (within next 48 hours)
 */
export function isDueSoon(date) {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();
  return isAfter(d, now) && differenceInHours(d, now) <= 48;
}

/**
 * Get date range for calendar views
 */
export function getDateRange(date, view) {
  const d = new Date(date);
  switch (view) {
    case 'day':
      return { start: startOfDay(d), end: endOfDay(d) };
    case 'week':
      return { start: startOfWeek(d, { weekStartsOn: 1 }), end: endOfWeek(d, { weekStartsOn: 1 }) };
    case 'month':
      return { start: startOfMonth(d), end: endOfMonth(d) };
    default:
      return { start: startOfDay(d), end: endOfDay(d) };
  }
}

/**
 * Calculate smart reminder time based on effort estimate
 */
export function calculateReminderTime(dueDate, estimatedMinutes) {
  if (!dueDate) return null;
  const d = new Date(dueDate);

  if (estimatedMinutes && estimatedMinutes >= 120) {
    // High-effort: remind 2 days before
    return addDays(d, -2);
  } else if (estimatedMinutes && estimatedMinutes < 60) {
    // Quick task: remind 1 hour before
    return addHours(d, -1);
  }
  // Default: remind 1 day before
  return addDays(d, -1);
}

/**
 * Get the number of days until a date
 */
export function getDaysUntil(date) {
  if (!date) return null;
  return differenceInDays(new Date(date), startOfDay(new Date()));
}

export {
  format,
  isToday,
  isTomorrow,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  isBefore,
  isAfter,
};
