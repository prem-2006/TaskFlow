'use client';

import { useState } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { updateTask, createTask } from '@/hooks/useTasks';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import Modal from '@/components/ui/Modal';
import TaskDetail from '@/components/tasks/TaskDetail';
import TaskForm from '@/components/tasks/TaskForm';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CalendarPage() {
  const { tasks, isLoading, mutate, updateRange } = useCalendar();

  // Modals state
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [prefilledDate, setPrefilledDate] = useState(null);

  // Handle clicking an existing task
  function handleTaskClick(task) {
    setSelectedTask(task);
    setIsDetailOpen(true);
  }

  // Handle clicking an empty date cell (to create new task on that date)
  function handleDateClick(date) {
    setPrefilledDate(date);
    setIsFormOpen(true);
  }

  // Switch from detail view to edit mode
  function handleEditClick() {
    setTaskToEdit(selectedTask);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  }

  // Handle form submission (create or update)
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
      setPrefilledDate(null);
      mutate(); // Refresh calendar data
    } catch (error) {
      // Error is handled in the hook
    }
  }

  function closeForm() {
    setIsFormOpen(false);
    setTaskToEdit(null);
    setPrefilledDate(null);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Calendar</h1>
        <p className="text-[var(--text-secondary)] text-sm">Visualize your schedule and deadlines</p>
      </div>

      <div className="flex-1 min-h-[500px] relative">
        {isLoading && tasks.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--surface)]/50 backdrop-blur-sm z-10 rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-500" />
            <p className="text-[var(--text-muted)]">Loading calendar...</p>
          </div>
        ) : null}
        
        <CalendarGrid
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onDateClick={handleDateClick}
          onDateChange={updateRange} // Optional: trigger fetch if user navigates months
        />
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        size="lg"
        className="overflow-hidden"
      >
        <div className="h-[80vh] flex flex-col -m-6">
          <TaskDetail
            task={selectedTask}
            onEdit={handleEditClick}
            onClose={() => setIsDetailOpen(false)}
          />
        </div>
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={taskToEdit ? 'Edit Task' : 'Create Task'}
        size="lg"
      >
        <TaskForm
          initialData={taskToEdit || (prefilledDate ? { dueDate: prefilledDate } : {})}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
        />
      </Modal>
    </div>
  );
}
