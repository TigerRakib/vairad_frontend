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
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600 text-sm">No annotations yet</p>
        <p className="text-gray-500 text-xs mt-2">
          Start drawing to add annotations
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-800">
          Annotations ({annotations.length})
        </h3>
      </div>
      <div className="divide-y max-h-96 overflow-y-auto">
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            onClick={() => onAnnotationSelect?.(annotation)}
            className={`p-3 cursor-pointer transition-colors ${
              selectedAnnotation?.id === annotation.id
                ? 'bg-blue-50 border-l-4 border-blue-500'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">
                  {annotation.label || `Polygon #${annotation.id}`}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Points: {annotation.points.length}
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
                  className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors ml-2"
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
