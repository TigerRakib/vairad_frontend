'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Point } from '@/types';

interface SaveAnnotationModalProps {
  isOpen: boolean;
  points: Point[];
  onClose: () => void;
  onSave: (label: string) => void;
  isLoading?: boolean;
}

export function SaveAnnotationModal({
  isOpen,
  points,
  onClose,
  onSave,
  isLoading,
}: SaveAnnotationModalProps) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLabel('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(label);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Save Annotation</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-indigo-50 rounded-lg p-3">
            <p className="text-sm text-indigo-700">
              Polygon created with <span className="font-semibold">{points.length}</span> points
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Annotation Label (optional)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Tumor, Lesion, Area of Interest..."
              className="input"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-outline btn-small"
              disabled={isLoading}
            >
              Discard
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary btn-small"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Annotation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
