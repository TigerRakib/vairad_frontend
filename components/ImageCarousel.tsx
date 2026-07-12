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
  if (images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const handlePrevious = () => {
    onImageChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    onImageChange(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600">
            Image {currentIndex + 1} of {images.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ID: {currentImage.id}
          </p>
        </div>
        {onDelete && (
          <button
            onClick={() => {
              if (confirm('Delete this image? All annotations will be removed.')) {
                onDelete(currentImage.id);
              }
            }}
            disabled={isLoading}
            className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors"
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
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </button>

          <div className="flex gap-1 flex-wrap justify-center py-2">
            {images.slice(0, 5).map((img, idx) => (
              <button
                key={img.id}
                onClick={() => onImageChange(idx)}
                disabled={isLoading}
                className={`w-12 h-12 rounded-lg border-2 transition-all overflow-hidden ${
                  currentIndex === idx
                    ? 'border-blue-500 ring-2 ring-blue-300'
                    : 'border-gray-300 hover:border-gray-400'
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
              <div className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
                +{images.length - 5}
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
}
