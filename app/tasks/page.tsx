'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DropResult } from 'react-beautiful-dnd';
import toast from 'react-hot-toast';
import { apiService } from '@/services/apiService';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { Task, TaskStatus } from '@/types';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { DateSelector } from '@/components/DateSelector';
import { Board } from '@/components/Board';
import { TaskModal } from '@/components/TaskModal';
import { TaskDetailsModal } from '@/components/TaskDetailsModal';
import { format } from 'date-fns';
import {
  PlusIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';

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
  } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [modalInitialStatus, setModalInitialStatus] = useState<TaskStatus>('todo');
  const [viewingTask, setViewingTask] = useState<Task | undefined>();
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setIsDateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await apiService.getTasks({ due_date: dateStr });
      const raw = response.results || response;
      const normalized = raw.map((t: any) => ({
        ...t,
        status: t.status?.toLowerCase(),
        priority: t.priority?.toLowerCase(),
      }));
      setTasks(normalized);
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

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
  };

  const handleSaveTask = async (taskData: any) => {
    try {
      setLoading(true);
      const dataToSend = {
        ...taskData,
        priority: taskData.priority.toUpperCase(),
        status: taskData.status.toUpperCase(),
        due_date: format(selectedDate, 'yyyy-MM-dd'),
      };

      if (editingTask) {
        await apiService.updateTask(editingTask.id, dataToSend);
        toast.success('Task updated!');
      } else {
        await apiService.createTask(dataToSend);
        toast.success('Task created!');
      }

      await loadTasks();
      setIsModalOpen(false);
      setEditingTask(undefined);
    } catch (error: any) {
      console.error('Save task error:', error.response?.data || error.message);
      toast.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      setLoading(true);
      await apiService.deleteTask(id);
      await loadTasks();
      toast.success('Task deleted!');
      setViewingTask(undefined);
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

    try {
      setLoading(true);
      await apiService.updateTask(taskId, {
        status: destination.droppableId.toUpperCase(),
      });
      await loadTasks();
      toast.success('Task status updated!');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const tasksForSelectedDate = getTasksByDate(selectedDate);

  return (
    <div className="min-h-screen bg-surface-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px]">
        {/* Top Navbar */}
        <TopNavbar
          title="Tasks"
          subtitle="Manage your tasks by date"
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Date Selector Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 lg:mb-8">
            <div className="flex items-center gap-3">
              {/* Calendar Icon */}
              <div className="relative" ref={dateRef}>
                <button
                  onClick={() => setIsDateOpen(!isDateOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-button border border-border text-text-primary hover:border-primary/30 transition-colors"
                >
                  <CalendarDaysIcon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{format(selectedDate, 'MMM dd, yyyy')}</span>
                </button>
                {isDateOpen && (
                  <div className="absolute left-0 top-full mt-2 z-50">
                    <DateSelector
                      selectedDate={selectedDate}
                      onDateChange={(date) => {
                        setSelectedDate(date);
                        setIsDateOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Prev/Next Navigation */}
              <div className="flex items-center gap-1 bg-white rounded-button border border-border overflow-hidden">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-slate-50 transition-colors text-text-secondary"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-border" />
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-slate-50 transition-colors text-text-secondary"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => handleAddTask('todo')}
              className="btn btn-primary btn-small"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Task
            </button>
          </div>

          {/* Kanban Board */}
          {tasksForSelectedDate.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-card flex items-center justify-center mx-auto mb-4">
                  <CheckBadgeIcon className="w-8 h-8 text-text-secondary" />
                </div>
                <p className="text-text-primary font-medium mb-1">No tasks for this date</p>
                <p className="text-text-secondary text-sm mb-4">Create your first task to get started</p>
                <button
                  onClick={() => handleAddTask('todo')}
                  className="btn btn-primary btn-small"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Create Task
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
              onViewTask={handleViewTask}
            />
          )}
        </div>
      </main>

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

      <TaskDetailsModal
        task={viewingTask}
        onClose={() => setViewingTask(undefined)}
        onDelete={handleDeleteTask}
        onEdit={(task) => {
          setViewingTask(undefined);
          handleEditTask(task);
        }}
      />
    </div>
  );
}
