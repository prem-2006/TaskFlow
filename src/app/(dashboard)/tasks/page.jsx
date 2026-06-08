'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTasks, createTask, updateTask } from '@/hooks/useTasks';
import TaskList from '@/components/tasks/TaskList';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskForm from '@/components/tasks/TaskForm';
import TaskDetail from '@/components/tasks/TaskDetail';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

function TasksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(searchParams.get('new') === 'true');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    projectId: '',
    tag: '',
    search: '',
    page: 1,
    limit: 50,
  });

  const { tasks, pagination, isLoading, mutateTasks } = useTasks(filters);

  // Handle URL params on mount
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setIsFormOpen(true);
      // Clean up URL
      router.replace('/tasks');
    }
  }, [searchParams, router]);

  function handleTaskClick(task) {
    setSelectedTask(task);
    setIsDetailOpen(true);
  }

  function handleEditClick(task) {
    setTaskToEdit(task || selectedTask);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  }

  async function handleFormSubmit(data) {
    try {
      if (taskToEdit) {
        await updateTask(taskToEdit._id, data);
        toast.success('Task updated successfully');
      } else {
        await createTask(data);
        toast.success('Task created successfully');
      }
      setIsFormOpen(false);
      setTaskToEdit(null);
      mutateTasks(); // Refresh list
    } catch (error) {
      // Error is handled in the hook
    }
  }

  function closeForm() {
    setIsFormOpen(false);
    setTaskToEdit(null);
  }

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Tasks</h1>
          <p className="text-[var(--text-secondary)] text-sm">Manage and track your work</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="w-full md:w-auto">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="mb-6">
        <TaskFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Task List Content */}
      <div className="flex-1 min-h-[400px]">
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onTaskClick={handleTaskClick}
        />
      </div>

      {/* Pagination (Simple) */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          <span className="text-sm text-[var(--text-muted)]">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={taskToEdit ? 'Edit Task' : 'Create Task'}
        size="lg"
      >
        <TaskForm
          initialData={taskToEdit || {}}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        size="lg"
        className="overflow-hidden" // Remove padding for full edge-to-edge
      >
        <div className="h-[80vh] flex flex-col -m-6">
          <TaskDetail
            task={selectedTask}
            onEdit={() => handleEditClick()}
            onClose={() => setIsDetailOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={null}>
      <TasksContent />
    </Suspense>
  );
}
