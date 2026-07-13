import { create } from 'zustand';
import { format } from 'date-fns';
import { Task, TaskStatus } from '@/types';

interface TaskState {
  tasks: Task[];
  selectedDate: Date;
  isLoading: boolean;
  error: string | null;

  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: number, task: Task) => void;
  deleteTask: (id: number) => void;
  setSelectedDate: (date: Date) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getTasksByDate: (date: Date) => Task[];
  getTasksByStatus: (status: TaskStatus, date: Date) => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedDate: new Date(),
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => {
    const { tasks } = get();
    set({ tasks: [...tasks, task] });
  },
  updateTask: (id, updatedTask) => {
    const { tasks } = get();
    set({ tasks: tasks.map((t) => (t.id === id ? updatedTask : t)) });
  },
  deleteTask: (id) => {
    const { tasks } = get();
    set({ tasks: tasks.filter((t) => t.id !== id) });
  },
  setSelectedDate: (date) => set({ selectedDate: date }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  getTasksByDate: (date) => {
    const { tasks } = get();
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter((task) => task.due_date === dateStr);
  },

  getTasksByStatus: (status, date) => {
    const { tasks } = get();
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(
      (task) => task.status === status && task.due_date === dateStr
    );
  },
}));
