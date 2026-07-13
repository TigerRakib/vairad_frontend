'use client';

import { PolygonAnnotation } from '@/types';
import { TrashIcon } from '@heroicons/react/24/outline';

interface AnnotationPanelProps {
  annotations: PolygonAnnotation[];
  selectedAnnotation?: PolygonAnnotation;
  onAnnotationSelect?: (annotation: PolygonAnnotation) => void;
  onAnnotationDelete?: (id: number) => void;
  isLoading?: boolean;
}

export function AnnotationPanel({
  annotations,
  selectedAnnotation,
  onAnnotationSelect,
  onAnnotationDelete,
  isLoading,
}: AnnotationPanelProps) {
  if (annotations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
        <p className="text-slate-500 text-sm">No annotations yet</p>
        <p className="text-slate-400 text-xs mt-1">Start drawing to add annotations</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-sm text-slate-800">
          Annotations ({annotations.length})
        </h3>
      </div>
      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            onClick={() => onAnnotationSelect?.(annotation)}
            className={`p-3 cursor-pointer transition-colors ${
              selectedAnnotation?.id === annotation.id
                ? 'bg-indigo-50 border-l-4 border-indigo-500'
                : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 text-sm truncate">
                  {annotation.label || `Polygon #${annotation.id}`}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {annotation.points.length} points
                </p>
              </div>
              {onAnnotationDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this annotation?')) {
                      onAnnotationDelete(annotation.id);
                    }
                  }}
                  disabled={isLoading}
                  className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                  title="Delete annotation"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
