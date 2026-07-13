'use client';

import { useEffect, useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TaskModalProps {
  isOpen: boolean;
  task?: Task;
  initialStatus?: TaskStatus;
  onClose: () => void;
  onSave: (task: any) => void;
  isLoading?: boolean;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  tags: string[];
}

const priorities: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const availableTags = ['Backend', 'Frontend', 'API', 'React', 'UI', 'Design', 'Testing', 'Database'];

export function TaskModal({
  isOpen,
  task,
  initialStatus,
  onClose,
  onSave,
  isLoading,
}: TaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    due_date: new Date().toISOString().split('T')[0],
    tags: [],
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        due_date: task.due_date,
        tags: task.tags || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: initialStatus || 'todo',
        due_date: new Date().toISOString().split('T')[0],
        tags: [],
      });
    }
  }, [task, initialStatus, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-white rounded-modal shadow-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-button transition-colors text-text-secondary hover:text-text-primary"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              className="input"
              required
              disabled={isLoading}
            />
          </div>

          {/* Priority + Due Date Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="input"
                disabled={isLoading}
              >
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="input"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isActive = formData.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-150 ${
                      isActive
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-text-secondary border-border hover:border-primary/30 hover:text-primary'
                    }`}
                    disabled={isLoading}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a description..."
              rows={4}
              className="input resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-small"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-small"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
