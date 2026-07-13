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
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
      }`}
    >
      <CloudArrowUpIcon className="w-10 h-10 mx-auto text-slate-400 mb-3" />
      <h3 className="text-sm font-semibold text-slate-700 mb-1">
        Drag and drop your images
      </h3>
      <p className="text-xs text-slate-400 mb-4">
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
        <span className="inline-block btn btn-primary btn-small cursor-pointer">
          {isLoading ? 'Uploading...' : 'Select Image'}
        </span>
      </label>
      <p className="text-[11px] text-slate-400 mt-3">
        Supported formats: JPG, PNG, GIF, WebP (Max 10MB)
      </p>
    </div>
  );
}
