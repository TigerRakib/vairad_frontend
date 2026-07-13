'use client';

import { Task } from '@/types';
import { formatDate } from '@/utils/helpers';
import { useAuthStore } from '@/store/authStore';
import {
  XMarkIcon,
  CalendarDaysIcon,
  TrashIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

interface TaskDetailsModalProps {
  task?: Task;
  onClose: () => void;
  onDelete?: (id: number) => void;
  onEdit?: (task: Task) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  todo: { label: 'Todo', className: 'bg-slate-100 text-text-primary' },
  in_progress: { label: 'In Progress', className: 'bg-warning/10 text-warning' },
  done: { label: 'Done', className: 'bg-success/10 text-success' },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  low: { label: 'Low', className: 'text-success bg-success/10' },
  medium: { label: 'Medium', className: 'text-warning bg-warning/10' },
  high: { label: 'High', className: 'text-danger bg-danger/10' },
  urgent: { label: 'Urgent', className: 'text-danger bg-danger/15' },
};

export function TaskDetailsModal({ task, onClose, onDelete }: TaskDetailsModalProps) {
  const { user } = useAuthStore();
  if (!task) return null;

  const status = statusConfig[task.status] || statusConfig.todo;
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  const creatorName = user && task.created_by === user.id
    ? user.username || user.email
    : task.created_by
    ? `User #${task.created_by}`
    : 'N/A';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-white rounded-modal shadow-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: '700px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}>
              {status.label}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${priority.className}`}>
              {priority.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-button transition-colors text-text-secondary hover:text-text-primary"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h2 className="text-xl font-bold text-text-primary mb-3">{task.title}</h2>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {task.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {task.description && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Description</h4>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap bg-surface-bg rounded-button p-4">
                {task.description}
              </p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 pt-5 border-t border-border">
            {/* Due Date */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-button flex items-center justify-center">
                <CalendarDaysIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">Due Date</p>
                <p className="text-sm font-medium text-text-primary">{formatDate(task.due_date)}</p>
              </div>
            </div>

            {/* Created By */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-button flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {creatorName !== 'N/A' ? creatorName.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div>
                <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">Created By</p>
                <p className="text-sm font-medium text-text-primary">{creatorName}</p>
              </div>
            </div>

            {/* Created At */}
            {task.created_at && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-button flex items-center justify-center">
                  <TagIcon className="w-4 h-4 text-text-secondary" />
                </div>
                <div>
                  <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">Created At</p>
                  <p className="text-sm font-medium text-text-primary">{formatDate(task.created_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          {onDelete && (
            <button
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
              className="btn btn-danger-outline btn-small"
            >
              <TrashIcon className="w-4 h-4 mr-1.5" />
              Delete
            </button>
          )}
          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="btn btn-outline btn-small"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
