'use client';

import { AnnotationImage } from '@/types';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ImageCarouselProps {
  images: AnnotationImage[];
  currentIndex: number;
  onImageChange: (index: number) => void;
  onDelete?: (id: number) => void;
  isLoading?: boolean;
}

export function ImageCarousel({
  images,
  currentIndex,
  onImageChange,
  onDelete,
  isLoading,
}: ImageCarouselProps) {
  if (images.length === 0) return null;

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const handlePrevious = () => {
    onImageChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    onImageChange(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-700">
            Image {currentIndex + 1} of {images.length}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">ID: {currentImage.id}</p>
        </div>
        {onDelete && (
          <button
            onClick={() => {
              if (confirm('Delete this image? All annotations will be removed.')) {
                onDelete(currentImage.id);
              }
            }}
            disabled={isLoading}
            className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
            title="Delete image"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {hasMultiple && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex gap-1.5 flex-wrap justify-center py-2">
            {images.slice(0, 5).map((img, idx) => (
              <button
                key={img.id}
                onClick={() => onImageChange(idx)}
                disabled={isLoading}
                className={`w-11 h-11 rounded-lg border-2 transition-all overflow-hidden ${
                  currentIndex === idx
                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                title={`Image ${idx + 1}`}
              >
                <img
                  src={img.image_url || img.image}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {images.length > 5 && (
              <div className="w-11 h-11 rounded-lg border-2 border-slate-200 flex items-center justify-center text-xs font-medium text-slate-500">
                +{images.length - 5}
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <ChevronRightIcon className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      )}
    </div>
  );
}
