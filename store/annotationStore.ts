import { create } from 'zustand';
import { AnnotationImage, PolygonAnnotation, Point } from '@/types';

interface AnnotationState {
  images: AnnotationImage[];
  currentImageIndex: number;
  annotations: PolygonAnnotation[];
  isDrawing: boolean;
  currentPolygon: Point[];
  isLoading: boolean;
  error: string | null;

  setImages: (images: AnnotationImage[]) => void;
  setCurrentImageIndex: (index: number) => void;
  setAnnotations: (annotations: PolygonAnnotation[]) => void;
  addAnnotation: (annotation: PolygonAnnotation) => void;
  deleteAnnotation: (id: number) => void;
  setIsDrawing: (drawing: boolean) => void;
  setCurrentPolygon: (polygon: Point[]) => void;
  addPointToPolygon: (point: Point) => void;
  clearCurrentPolygon: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getCurrentImage: () => AnnotationImage | undefined;
  getCurrentAnnotations: () => PolygonAnnotation[];
}

export const useAnnotationStore = create<AnnotationState>((set, get) => ({
  images: [],
  currentImageIndex: 0,
  annotations: [],
  isDrawing: false,
  currentPolygon: [],
  isLoading: false,
  error: null,

  setImages: (images) => set({ images }),
  setCurrentImageIndex: (index) => set({ currentImageIndex: index }),
  setAnnotations: (annotations) => set({ annotations }),
  addAnnotation: (annotation) => {
    const { annotations } = get();
    set({ annotations: [...annotations, annotation] });
  },
  deleteAnnotation: (id) => {
    const { annotations } = get();
    set({ annotations: annotations.filter((a) => a.id !== id) });
  },
  setIsDrawing: (drawing) => set({ isDrawing: drawing }),
  setCurrentPolygon: (polygon) => set({ currentPolygon: polygon }),
  addPointToPolygon: (point) => {
    const { currentPolygon } = get();
    set({ currentPolygon: [...currentPolygon, point] });
  },
  clearCurrentPolygon: () => set({ currentPolygon: [] }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  getCurrentImage: () => {
    const { images, currentImageIndex } = get();
    return images[currentImageIndex];
  },

  getCurrentAnnotations: () => {
    const { annotations, currentImageIndex, images } = get();
    const currentImage = images[currentImageIndex];
    if (!currentImage) return [];
    return annotations.filter((a) => a.image === currentImage.id);
  },
}));
