import { useAnnotationStore } from '@/store/annotationStore';

export function useAnnotations() {
  return useAnnotationStore();
}
