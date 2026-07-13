'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, startOfWeek, addDays } from 'date-fns';
import { apiService } from '@/services/apiService';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { Task, AnnotationImage, PolygonAnnotation } from '@/types';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilSquareIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

export default function ReportsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
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
    loadData();
  }, []);

  const loadData = async () => {
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

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const completionRate = total ? Math.round((done / total) * 100) : 0;

  const high = tasks.filter((t) => t.priority === 'high').length;
  const medium = tasks.filter((t) => t.priority === 'medium').length;
  const low = tasks.filter((t) => t.priority === 'low').length;

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weeklyData = weekDays.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return {
      label: format(day, 'EEE'),
      shortLabel: format(day, 'EEE'),
      count: tasks.filter(
        (t) => t.status === 'done' && t.updated_at?.startsWith(dateStr)
      ).length,
    };
  });
  const maxWeekly = Math.max(...weeklyData.map((d) => d.count), 1);

  const annotatedImages = new Set(
    annotations.map((a) => a.image)
  ).size;
  const pendingImages = images.length - annotatedImages;

  const labelCounts: Record<string, number> = {};
  annotations.forEach((a) => {
    if (a.label) {
      labelCounts[a.label] = (labelCounts[a.label] || 0) + 1;
    }
  });
  const topLabels = Object.entries(labelCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const downloadCSV = () => {
    const headers = ['Title', 'Status', 'Priority', 'Due Date', 'Tags', 'Created At'];
    const rows = tasks.map((t) => [
      t.title,
      t.status,
      t.priority,
      t.due_date,
      (t.tags || []).join('; '),
      t.created_at || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const doneCount = tasks.filter((t) => t.status === 'done').length;
    const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
    const todoCount = tasks.filter((t) => t.status === 'todo').length;

    w.document.write(`
      <html><head><title>Task Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #1F2937; }
        h1 { font-size: 22px; margin-bottom: 4px; }
        .subtitle { color: #6B7280; font-size: 13px; margin-bottom: 24px; }
        .stats { display: flex; gap: 24px; margin-bottom: 24px; }
        .stat { padding: 12px 16px; border: 1px solid #E7E9F2; border-radius: 8px; }
        .stat-value { font-size: 24px; font-weight: bold; }
        .stat-label { font-size: 12px; color: #6B7280; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th { text-align: left; font-size: 11px; text-transform: uppercase; color: #6B7280; border-bottom: 2px solid #E7E9F2; padding: 8px; }
        td { padding: 8px; border-bottom: 1px solid #E7E9F2; font-size: 13px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .badge-done { background: #DCFCE7; color: #16A34A; }
        .badge-progress { background: #FEF3C7; color: #D97706; }
        .badge-todo { background: #EEF0FF; color: #5B5CEB; }
        .badge-high { background: #FEE2E2; color: #DC2626; }
        .badge-medium { background: #FEF3C7; color: #D97706; }
        .badge-low { background: #DCFCE7; color: #16A34A; }
      </style></head><body>
      <h1>Task Report</h1>
      <p class="subtitle">Generated on ${format(new Date(), 'MMMM dd, yyyy')}</p>
      <div class="stats">
        <div class="stat"><div class="stat-value">${total}</div><div class="stat-label">Total Tasks</div></div>
        <div class="stat"><div class="stat-value">${doneCount}</div><div class="stat-label">Done</div></div>
        <div class="stat"><div class="stat-value">${inProgressCount}</div><div class="stat-label">In Progress</div></div>
        <div class="stat"><div class="stat-value">${todoCount}</div><div class="stat-label">To Do</div></div>
        <div class="stat"><div class="stat-value">${annotations.length}</div><div class="stat-label">Annotations</div></div>
      </div>
      <table>
        <thead><tr><th>Title</th><th>Status</th><th>Priority</th><th>Due Date</th><th>Tags</th></tr></thead>
        <tbody>
          ${tasks.map((t) => `<tr>
            <td>${t.title}</td>
            <td><span class="badge badge-${t.status === 'done' ? 'done' : t.status === 'in_progress' ? 'progress' : 'todo'}">${t.status === 'todo' ? 'To Do' : t.status === 'in_progress' ? 'In Progress' : 'Done'}</span></td>
            <td><span class="badge badge-${t.priority.toLowerCase()}">${t.priority}</span></td>
            <td>${t.due_date}</td>
            <td>${(t.tags || []).join(', ')}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <div className="min-h-screen bg-surface-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px]">
        <TopNavbar
          title="Reports"
          subtitle="Task and annotation analytics"
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          {/* Export Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button onClick={downloadCSV} className="btn btn-outline btn-small">
              <ArrowDownTrayIcon className="w-4 h-4 mr-1.5" />
              Download CSV
            </button>
            <button onClick={downloadPDF} className="btn btn-primary btn-small">
              <ArrowDownTrayIcon className="w-4 h-4 mr-1.5" />
              Download PDF
            </button>
          </div>

          {/* Top Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-text-secondary">Total Tasks</p>
              </div>
              <p className="text-3xl font-bold text-text-primary">{total}</p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-success" />
                </div>
                <p className="text-sm text-text-secondary">Completion</p>
              </div>
              <p className="text-3xl font-bold text-text-primary">{completionRate}%</p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-warning" />
                </div>
                <p className="text-sm text-text-secondary">In Progress</p>
              </div>
              <p className="text-3xl font-bold text-text-primary">
                {tasks.filter((t) => t.status === 'in_progress').length}
              </p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <PencilSquareIcon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-text-secondary">Annotations</p>
              </div>
              <p className="text-3xl font-bold text-text-primary">{annotations.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Completion Rate Ring */}
            <section className="card p-6">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">
                Task Completion Rate
              </h2>
              <div className="flex items-center gap-8">
                <div className="relative w-36 h-36 flex-shrink-0">
                  <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#E7E9F2" strokeWidth="10" />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - completionRate / 100)}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-text-primary">{completionRate}%</span>
                    <span className="text-xs text-text-secondary">completed</span>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Done</span>
                    <span className="text-sm font-semibold text-success">{done}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">In Progress</span>
                    <span className="text-sm font-semibold text-warning">
                      {tasks.filter((t) => t.status === 'in_progress').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">To Do</span>
                    <span className="text-sm font-semibold text-primary">
                      {tasks.filter((t) => t.status === 'todo').length}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Priority Breakdown */}
            <section className="card p-6">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">
                Priority Breakdown
              </h2>
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">High</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {high} <span className="font-normal text-text-secondary">({total ? Math.round((high / total) * 100) : 0}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-danger rounded-full transition-all duration-500"
                      style={{ width: total ? `${(high / total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">Medium</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {medium} <span className="font-normal text-text-secondary">({total ? Math.round((medium / total) * 100) : 0}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-warning rounded-full transition-all duration-500"
                      style={{ width: total ? `${(medium / total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">Low</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {low} <span className="font-normal text-text-secondary">({total ? Math.round((low / total) * 100) : 0}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success rounded-full transition-all duration-500"
                      style={{ width: total ? `${(low / total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Weekly Productivity */}
            <section className="card p-6">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">
                Weekly Productivity
              </h2>
              <p className="text-xs text-text-secondary mb-4">
                Tasks completed per day ({format(weekStart, 'MMM dd')} — {format(addDays(weekStart, 6), 'MMM dd')})
              </p>
              <div className="flex items-end justify-between gap-2 h-40">
                {weeklyData.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-xs font-medium text-text-secondary">{day.count}</span>
                    <div className="w-full flex justify-center">
                      <div
                        className="w-8 bg-primary rounded-t-lg transition-all duration-500 min-h-[4px]"
                        style={{ height: `${(day.count / maxWeekly) * 100}px` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-text-secondary">{day.shortLabel}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Annotation Stats */}
            <section className="card p-6">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">
                Annotation Stats
              </h2>
              <div className="space-y-6">
                {/* Image progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">Images Annotated</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {annotatedImages} / {images.length}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{
                        width: images.length
                          ? `${(annotatedImages / images.length) * 100}%`
                          : '0%',
                      }}
                    />
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    {pendingImages} pending
                  </p>
                </div>

                {/* Top Labels */}
                <div>
                  <p className="text-sm font-medium text-text-primary mb-3">Top Annotation Labels</p>
                  {topLabels.length === 0 ? (
                    <p className="text-sm text-text-secondary">No labels yet</p>
                  ) : (
                    <div className="space-y-2.5">
                      {topLabels.map(([label, count], i) => (
                        <div key={label} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-md bg-primary-50 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                          </div>
                          <span className="text-sm text-text-primary flex-1">{label}</span>
                          <span className="text-sm font-semibold text-text-secondary">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
