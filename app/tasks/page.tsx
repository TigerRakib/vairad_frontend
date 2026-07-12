'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DropResult } from 'react-beautiful-dnd';
import toast from 'react-hot-toast';
import { apiService } from '@/services/apiService';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { Task, TaskStatus } from '@/types';
import { Navigation } from '@/components/Navigation';
import { DateSelector } from '@/components/DateSelector';
import { Board } from '@/components/Board';
import { TaskModal } from '@/components/TaskModal';
import { format } from 'date-fns';

export default function TasksPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const {
    tasks,
    selectedDate,
    isLoading,
    setTasks,
    setSelectedDate,
    setLoading,
    getTasksByDate,
    updateTask,
    deleteTask,
    addTask,
  } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [modalInitialStatus, setModalInitialStatus] = useState<TaskStatus>('todo');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Load tasks on mount and when date changes
  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await apiService.getTasks({ due_date: dateStr });
      setTasks(response.results || response);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    setEditingTask(undefined);
    setModalInitialStatus(status);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: any) => {
    try {
      setLoading(true);
      const dataToSend = {
        ...taskData,
        due_date: format(selectedDate, 'yyyy-MM-dd'),
      };

      if (editingTask) {
        const updated = await apiService.updateTask(editingTask.id, dataToSend);
        updateTask(editingTask.id, updated);
        toast.success('Task updated!');
      } else {
        const created = await apiService.createTask(dataToSend);
        addTask(created);
        toast.success('Task created!');
      }

      setIsModalOpen(false);
      setEditingTask(undefined);
    } catch (error) {
      toast.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      setLoading(true);
      await apiService.deleteTask(id);
      deleteTask(id);
      toast.success('Task deleted!');
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskId = parseInt(draggableId.split('-')[1]);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) return;

    const updatedTask = {
      ...task,
      status: destination.droppableId as TaskStatus,
    };

    try {
      setLoading(true);
      const result = await apiService.updateTask(taskId, {
        status: destination.droppableId,
      });
      updateTask(taskId, result);
      toast.success('Task status updated!');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const tasksForSelectedDate = getTasksByDate(selectedDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Task Management</h1>
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {isLoading && tasksForSelectedDate.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          </div>
        ) : tasksForSelectedDate.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-gray-600 mb-4">No tasks for this date</p>
              <button
                onClick={() => handleAddTask('todo')}
                className="btn btn-primary"
              >
                Create First Task
              </button>
            </div>
          </div>
        ) : (
          <Board
            tasks={tasksForSelectedDate}
            onDragEnd={handleDragEnd}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        initialStatus={modalInitialStatus}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(undefined);
        }}
        onSave={handleSaveTask}
        isLoading={isLoading}
      />
    </div>
  );
}
