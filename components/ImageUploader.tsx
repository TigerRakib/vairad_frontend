'use client';

import { useState } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
  accept?: string;
}

export function ImageUploader({
  onUpload,
  isLoading,
  accept = 'image/*',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400'
      }`}
    >
      <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        Drag and drop your images
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        or click below to select files
      </p>
      <label>
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={isLoading}
          className="hidden"
        />
        <span className="inline-block btn btn-primary cursor-pointer">
          {isLoading ? 'Uploading...' : 'Select Image'}
        </span>
      </label>
      <p className="text-xs text-gray-500 mt-4">
        Supported formats: JPG, PNG, GIF, WebP (Max 10MB)
      </p>
    </div>
  );
}
