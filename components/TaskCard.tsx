'use client';

import { Task } from '@/types';
import { getPriorityColor, formatDate } from '@/utils/helpers';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
  isDragging?: boolean;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  isDragging,
}: TaskCardProps) {
  return (
    <div
      className={`card p-4 cursor-move transition-all ${
        isDragging ? 'opacity-50 shadow-lg' : 'hover:shadow-lg'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-800 flex-1 line-clamp-2">
          {task.title}
        </h3>
        <div className="flex gap-1 ml-2">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 hover:bg-blue-100 rounded text-blue-600 transition-colors"
              title="Edit task"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 hover:bg-red-100 rounded text-red-600 transition-colors"
              title="Delete task"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-2">
        <span className={`badge ${getPriorityColor(task.priority)}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Due: {formatDate(task.due_date)}
      </p>
    </div>
  );
}
