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
          <h2 className="text-xl font-bold text-gray-800">
            Save Annotation
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              Polygon created with <span className="font-semibold">{points.length}</span> points
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary"
              disabled={isLoading}
            >
              Discard
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
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
