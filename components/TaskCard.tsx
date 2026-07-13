'use client';

import { Task } from '@/types';
import { formatDate } from '@/utils/helpers';
import { ClockIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
  onView?: (task: Task) => void;
  isDragging?: boolean;
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  low: { label: 'Low', className: 'text-success bg-success/10' },
  medium: { label: 'Medium', className: 'text-warning bg-warning/10' },
  high: { label: 'High', className: 'text-danger bg-danger/10' },
  urgent: { label: 'Urgent', className: 'text-danger bg-danger/15' },
};

export function TaskCard({ task, onEdit, onDelete, onView, isDragging }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div
      className={`bg-white rounded-card border border-border p-4 flex flex-col justify-between cursor-grab active:cursor-grabbing transition-all duration-200 min-h-[140px] ${
        isDragging
          ? 'shadow-card-hover ring-2 ring-primary/30 opacity-90 scale-[1.02]'
          : 'shadow-sm hover:shadow-card hover:-translate-y-0.5'
      }`}
      onClick={() => onView?.(task)}
    >
      {/* Top Row: Title + Priority */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-text-primary text-sm line-clamp-1 flex-1 mr-2">{task.title}</h4>
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded-button text-text-secondary hover:text-text-primary hover:bg-slate-100 transition-colors"
            >
              <EllipsisVerticalIcon className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-card shadow-card py-1 z-20 min-w-[120px]">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(task);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-slate-50"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-red-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Priority Badge */}
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md ${priority.className}`}>
          {priority.label}
        </span>
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 my-2">
          {task.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-text-secondary">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="pt-2 border-t border-border mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <ClockIcon className="w-3.5 h-3.5" />
            <span className="text-xs">{formatDate(task.due_date)}</span>
          </div>
        </div>
        {task.description && (
          <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">{task.description}</p>
        )}
      </div>
    </div>
  );
}
