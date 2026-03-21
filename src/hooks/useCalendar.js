import { useState } from 'react';
import useSWR from 'swr';
import { startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';

export function useCalendar(initialDate = new Date()) {
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(subMonths(initialDate, 1)), // Fetch prev, current, next month for smooth nav
    end: endOfMonth(addMonths(initialDate, 1))
  });

  // Convert dates to ISO strings for query params
  const query = new URLSearchParams({
    dueDateFrom: dateRange.start.toISOString(),
    dueDateTo: dateRange.end.toISOString(),
    limit: 500, // Large limit for calendar view
  });

  const url = `/api/tasks?${query.toString()}`;
  
  const { data, error, isLoading, mutate } = useSWR(url);

  // Expose function to update fetch range if user navigates far away
  function updateRange(newDate) {
    setDateRange({
      start: startOfMonth(subMonths(newDate, 1)),
      end: endOfMonth(addMonths(newDate, 1))
    });
  }

  return {
    tasks: data?.tasks || [],
    isLoading,
    error,
    mutate,
    updateRange,
  };
}
