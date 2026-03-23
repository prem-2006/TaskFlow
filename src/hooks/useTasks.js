import useSWR from 'swr';
import { mutate } from 'swr';
import toast from 'react-hot-toast';

/**
 * Hook to fetch and manage a list of tasks
 */
export function useTasks(filters = {}) {
  // Build query string from filters
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });
  const queryString = query.toString();
  const url = `/api/tasks${queryString ? `?${queryString}` : ''}`;

  const { data, error, isLoading, isValidating } = useSWR(url);

  return {
    tasks: data?.tasks || [],
    pagination: data?.pagination || null,
    isLoading,
    isValidating,
    error,
    mutateTasks: () => mutate(url),
    url, // Expose url for targeted optimistic updates
  };
}

/**
 * Hook to fetch a single task
 */
export function useTask(taskId) {
  const url = taskId ? `/api/tasks/${taskId}` : null;
  const { data, error, isLoading, mutate: mutateTask } = useSWR(url);

  return {
    task: data?.task || null,
    isLoading,
    error,
    mutateTask,
  };
}

/**
 * Helper to create a new task
 */
export async function createTask(taskData) {
  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create task');
    }
    
    const data = await res.json();
    
    // Invalidate dashboard and generic task lists
    mutate('/api/dashboard');
    mutate((key) => typeof key === 'string' && key.startsWith('/api/tasks?'));
    
    return data.task;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
}

/**
 * Helper to update a task
 */
export async function updateTask(taskId, updates) {
  try {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to update task');
    }
    
    const data = await res.json();
    
    // Revalidate specific task and dashboard
    mutate(`/api/tasks/${taskId}`, data, false);
    mutate('/api/dashboard');
    mutate((key) => typeof key === 'string' && key.startsWith('/api/tasks?'));
    
    return data.task;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
}

/**
 * Helper to delete a task
 */
export async function deleteTask(taskId) {
  try {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete task');
    }
    
    // Invalidate caches
    mutate(`/api/tasks/${taskId}`, null, false);
    mutate('/api/dashboard');
    mutate((key) => typeof key === 'string' && key.startsWith('/api/tasks?'));
    
    toast.success('Task deleted');
    return true;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
}
