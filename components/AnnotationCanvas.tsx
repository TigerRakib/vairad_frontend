'use client';

import { useEffect, useRef, useState } from 'react';
import { PolygonAnnotation, Point } from '@/types';
import { drawPolygon, calculateCanvasPoint } from '@/utils/helpers';

interface AnnotationCanvasProps {
  imageSrc: string;
  annotations: PolygonAnnotation[];
  currentPolygon: Point[];
  isDrawing: boolean;
  selectedAnnotation?: PolygonAnnotation;
  onPointAdd: (point: Point) => void;
  onPointUndo?: () => void;
  onAnnotationSelect?: (annotation: PolygonAnnotation) => void;
  drawingColor?: string;
}

export function AnnotationCanvas({
  imageSrc,
  annotations,
  currentPolygon,
  isDrawing,
  selectedAnnotation,
  onPointAdd,
  onPointUndo,
  onAnnotationSelect,
  drawingColor = 'rgb(59, 130, 246)',
}: AnnotationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Load image and set canvas size
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const maxWidth = 1200;
      const maxHeight = 800;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      setCanvasSize({ width, height });
      imageRef.current = img;
      redrawCanvas(img, width, height);
    };
  }, [imageSrc]);

  // Redraw canvas when annotations or polygon changes
  useEffect(() => {
    if (!imageRef.current) return;
    redrawCanvas(imageRef.current, canvasSize.width, canvasSize.height);
  }, [annotations, currentPolygon, selectedAnnotation, canvasSize]);

  const redrawCanvas = (img: HTMLImageElement, width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw image
    ctx.drawImage(img, 0, 0, width, height);

    // Draw existing annotations
    annotations.forEach((annotation) => {
      const isSelected = selectedAnnotation?.id === annotation.id;
      const fillColor = isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)';
      const strokeColor = isSelected ? 'rgb(59, 130, 246)' : 'rgb(156, 163, 175)';
      
      drawPolygon(ctx, annotation.points, annotation.label, fillColor, strokeColor);
    });

    // Draw current polygon being drawn
    if (currentPolygon.length > 0) {
      drawPolygon(ctx, currentPolygon, '', 'rgba(34, 197, 94, 0.2)', drawingColor);

      // Draw line from last point to mouse
      if (currentPolygon.length > 0) {
        ctx.strokeStyle = drawingColor;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(currentPolygon[currentPolygon.length - 1].x, currentPolygon[currentPolygon.length - 1].y);
        ctx.lineTo(currentPolygon[0].x, currentPolygon[0].y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const point = calculateCanvasPoint(e, canvasRef.current!);
    
    // Check if clicking on first point to close polygon
    if (currentPolygon.length > 2) {
      const firstPoint = currentPolygon[0];
      const distance = Math.sqrt(
        Math.pow(point.x - firstPoint.x, 2) + Math.pow(point.y - firstPoint.y, 2)
      );
      
      if (distance < 10) {
        // Close polygon
        return;
      }
    }

    onPointAdd(point);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentPolygon.length === 0) return;

    const point = calculateCanvasPoint(e, canvasRef.current!);
    // Update visual feedback with mouse position
    redrawCanvas(imageRef.current!, canvasSize.width, canvasSize.height);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw line to mouse cursor
    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(currentPolygon[currentPolygon.length - 1].x, currentPolygon[currentPolygon.length - 1].y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative inline-block border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          className={`block ${isDrawing ? 'cursor-crosshair' : 'cursor-default'}`}
        />
      </div>

      {currentPolygon.length > 0 && (
        <div className="flex gap-2 text-sm">
          <span className="text-gray-600">
            Points added: <span className="font-bold">{currentPolygon.length}</span>
          </span>
          {onPointUndo && (
            <button
              onClick={onPointUndo}
              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
            >
              Undo Point
            </button>
          )}
        </div>
      )}
    </div>
  );
}
