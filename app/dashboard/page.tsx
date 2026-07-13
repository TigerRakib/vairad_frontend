'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, addDays } from 'date-fns';
import { apiService } from '@/services/apiService';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { Task, AnnotationImage, PolygonAnnotation } from '@/types';
import {
  CheckBadgeIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { setSelectedDate } = useTaskStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [images, setImages] = useState<AnnotationImage[]>([]);
  const [annotations, setAnnotations] = useState<PolygonAnnotation[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [tasksRes, imagesRes, annotationsRes] = await Promise.all([
        apiService.getTasks(),
        apiService.getAnnotationImages(),
        apiService.getPolygonAnnotations(),
      ]);
      setTasks(tasksRes.results || tasksRes);
      setImages(imagesRes.results || imagesRes);
      setAnnotations(annotationsRes.results || annotationsRes);
    } catch {
    }
  };

  const todoTasks = tasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter((t) => t.status === 'DONE');

  const highPriority = tasks.filter((t) => t.priority === 'HIGH');
  const mediumPriority = tasks.filter((t) => t.priority === 'MEDIUM');
  const lowPriority = tasks.filter((t) => t.priority === 'LOW');

  const today = format(new Date(), 'yyyy-MM-dd');
  const weekEnd = format(addDays(new Date(), 7), 'yyyy-MM-dd');
  const upcomingTasks = tasks
    .filter((t) => t.due_date >= today && t.due_date <= weekEnd && t.status !== 'DONE')
    .sort((a, b) => a.due_date.localeCompare(b.due_date));

  const recentTasks = [...tasks]
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
    .slice(0, 5);

  const navigateToTasks = () => {
    router.push('/tasks');
  };

  const navigateToDate = (date: string) => {
    setSelectedDate(new Date(date + 'T00:00:00'));
    router.push('/tasks');
  };

  return (
    <div className="min-h-screen bg-surface-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px]">
        <TopNavbar
          title="Dashboard"
          subtitle="Overview of your tasks and annotations"
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          {/* Task Summary Cards */}
          <section>
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
              Task Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Todo */}
              <button
                onClick={() => navigateToTasks()}
                className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-bold text-text-primary">{todoTasks.length}</p>
                  <p className="text-sm text-text-secondary">To Do</p>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-text-secondary flex-shrink-0" />
              </button>

              {/* In Progress */}
              <button
                onClick={() => navigateToTasks()}
                className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <ArrowUpIcon className="w-6 h-6 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-bold text-text-primary">{inProgressTasks.length}</p>
                  <p className="text-sm text-text-secondary">In Progress</p>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-text-secondary flex-shrink-0" />
              </button>

              {/* Done */}
              <button
                onClick={() => navigateToTasks()}
                className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-6 h-6 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-bold text-text-primary">{doneTasks.length}</p>
                  <p className="text-sm text-text-secondary">Done</p>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-text-secondary flex-shrink-0" />
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Priority Breakdown */}
            <section className="card p-6">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-5">
                Priority Breakdown
              </h2>
              <div className="space-y-4">
                {/* High */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-text-primary">High</span>
                    <span className="text-sm font-semibold text-text-primary">{highPriority.length}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-danger rounded-full transition-all duration-500"
                      style={{
                        width: tasks.length
                          ? `${(highPriority.length / tasks.length) * 100}%`
                          : '0%',
                      }}
                    />
                  </div>
                </div>

                {/* Medium */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-text-primary">Medium</span>
                    <span className="text-sm font-semibold text-text-primary">{mediumPriority.length}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-warning rounded-full transition-all duration-500"
                      style={{
                        width: tasks.length
                          ? `${(mediumPriority.length / tasks.length) * 100}%`
                          : '0%',
                      }}
                    />
                  </div>
                </div>

                {/* Low */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-text-primary">Low</span>
                    <span className="text-sm font-semibold text-text-primary">{lowPriority.length}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success rounded-full transition-all duration-500"
                      style={{
                        width: tasks.length
                          ? `${(lowPriority.length / tasks.length) * 100}%`
                          : '0%',
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Annotation Progress */}
            <section className="card p-6">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-5">
                Annotation Progress
              </h2>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-32 h-32 mb-5">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#E7E9F2"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#5B5CEB"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={
                        images.length
                          ? 2 * Math.PI * 50 * (1 - annotations.length / images.length)
                          : 2 * Math.PI * 50
                      }
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-text-primary">
                      {images.length ? Math.round((annotations.length / images.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm text-text-secondary">
                    <span className="font-semibold text-text-primary">{annotations.length}</span> annotations
                  </p>
                  <p className="text-sm text-text-secondary">
                    across <span className="font-semibold text-text-primary">{images.length}</span> images
                  </p>
                </div>
              </div>
            </section>

            {/* Upcoming Deadlines */}
            <section className="card p-6">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-5">
                Upcoming Deadlines
              </h2>
              {upcomingTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarDaysIcon className="w-8 h-8 text-text-secondary mb-2" />
                  <p className="text-sm text-text-secondary">No upcoming deadlines</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-2.5 rounded-button hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => navigateToDate(task.due_date)}
                    >
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          task.priority === 'HIGH'
                            ? 'bg-danger'
                            : task.priority === 'MEDIUM'
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{task.title}</p>
                        <p className="text-xs text-text-secondary">
                          {format(new Date(task.due_date + 'T00:00:00'), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <span
                        className={`badge text-[10px] ${
                          task.status === 'TODO'
                            ? 'bg-primary-50 text-primary'
                            : 'bg-warning/10 text-warning'
                        }`}
                      >
                        {task.status === 'TODO' ? 'To Do' : 'In Progress'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Recent Activity */}
          <section className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                Recent Activity
              </h2>
              <button
                onClick={() => navigateToTasks()}
                className="text-sm font-medium text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
              >
                View all <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            {recentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckBadgeIcon className="w-8 h-8 text-text-secondary mb-2" />
                <p className="text-sm text-text-secondary">No tasks yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider pb-3 pr-4">
                        Task
                      </th>
                      <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider pb-3 pr-4">
                        Status
                      </th>
                      <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider pb-3 pr-4">
                        Priority
                      </th>
                      <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider pb-3">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => navigateToDate(task.due_date)}
                      >
                        <td className="py-3 pr-4">
                          <p className="text-sm font-medium text-text-primary truncate max-w-[200px]">
                            {task.title}
                          </p>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`badge ${
                              task.status === 'DONE'
                                ? 'bg-success/10 text-success'
                                : task.status === 'IN_PROGRESS'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-primary-50 text-primary'
                            }`}
                          >
                            {task.status === 'TODO'
                              ? 'To Do'
                              : task.status === 'IN_PROGRESS'
                              ? 'In Progress'
                              : 'Done'}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`badge ${
                              task.priority === 'HIGH'
                                ? 'bg-danger/10 text-danger'
                                : task.priority === 'MEDIUM'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-success/10 text-success'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-text-secondary">
                            {format(new Date(task.due_date + 'T00:00:00'), 'MMM dd, yyyy')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
