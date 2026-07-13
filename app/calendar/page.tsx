'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { apiService } from '@/services/apiService';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { Task } from '@/types';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function CalendarPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { setSelectedDate } = useTaskStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await apiService.getTasks();
      setTasks(response.results || response);
    } catch {
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter((t) => t.due_date === dateStr);
  };

  const selectedDayTasks = selectedDay ? getTasksForDate(selectedDay) : [];

  const navigateToTasks = (date: Date) => {
    setSelectedDate(date);
    router.push('/tasks');
  };

  return (
    <div className="min-h-screen bg-surface-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px]">
        <TopNavbar
          title="Calendar"
          subtitle="View tasks by date"
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Grid */}
            <div className="lg:col-span-2 card p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-2 rounded-button hover:bg-slate-100 transition-colors text-text-secondary"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-bold text-text-primary">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2 rounded-button hover:bg-slate-100 transition-colors text-text-secondary"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-text-secondary py-2">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((d, i) => {
                  const dayTasks = getTasksForDate(d);
                  const inMonth = isSameMonth(d, currentMonth);
                  const today = isToday(d);
                  const selected = selectedDay && isSameDay(d, selectedDay);
                  const hasHigh = dayTasks.some((t) => t.priority.toUpperCase() === 'HIGH');
                  const hasMedium = dayTasks.some((t) => t.priority.toUpperCase() === 'MEDIUM');
                  const hasLow = dayTasks.some((t) => t.priority.toUpperCase() === 'LOW');

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(d)}
                      className={`
                        relative flex flex-col items-center py-2 sm:py-3 rounded-button transition-all duration-150 min-h-[56px] sm:min-h-[72px]
                        ${!inMonth ? 'text-slate-300' : 'text-text-primary'}
                        ${today ? 'bg-primary-50 font-bold' : ''}
                        ${selected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-slate-50'}
                      `}
                    >
                      <span
                        className={`text-sm ${
                          today
                            ? 'w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center'
                            : ''
                        }`}
                      >
                        {format(d, 'd')}
                      </span>
                      {dayTasks.length > 0 && inMonth && (
                        <div className="flex gap-0.5 mt-1">
                          {hasHigh && <div className="w-1.5 h-1.5 rounded-full bg-danger" />}
                          {hasMedium && <div className="w-1.5 h-1.5 rounded-full bg-warning" />}
                          {hasLow && <div className="w-1.5 h-1.5 rounded-full bg-success" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Day Detail Panel */}
            <div className="card p-6 h-fit">
              {selectedDay ? (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">
                        {format(selectedDay, 'EEEE')}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {format(selectedDay, 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedDay(null)}
                      className="p-1.5 rounded-button hover:bg-slate-100 text-text-secondary transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {selectedDayTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-text-secondary mb-3">No tasks for this day</p>
                      <button
                        onClick={() => navigateToTasks(selectedDay)}
                        className="btn btn-primary btn-small"
                      >
                        Create Task
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        {selectedDayTasks.length} task{selectedDayTasks.length > 1 ? 's' : ''}
                      </p>
                      {selectedDayTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 rounded-button border border-border hover:border-primary/30 transition-colors cursor-pointer"
                          onClick={() => navigateToTasks(selectedDay)}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <p className="text-sm font-medium text-text-primary line-clamp-1">
                              {task.title}
                            </p>
                            <div
                              className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                                task.priority.toUpperCase() === 'HIGH'
                                  ? 'bg-danger'
                                  : task.priority.toUpperCase() === 'MEDIUM'
                                  ? 'bg-warning'
                                  : 'bg-success'
                              }`}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`badge text-[10px] ${
                                task.status.toUpperCase() === 'DONE'
                                  ? 'bg-success/10 text-success'
                                  : task.status.toUpperCase() === 'IN_PROGRESS'
                                  ? 'bg-warning/10 text-warning'
                                  : 'bg-primary-50 text-primary'
                              }`}
                            >
                              {task.status.toUpperCase() === 'TODO'
                                ? 'To Do'
                                : task.status.toUpperCase() === 'IN_PROGRESS'
                                ? 'In Progress'
                                : 'Done'}
                            </span>
                            <span className="text-[10px] text-text-secondary uppercase font-medium">
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => navigateToTasks(selectedDay)}
                        className="btn btn-outline btn-small w-full mt-2"
                      >
                        Open in Tasks
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-text-secondary">Select a day to view tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
