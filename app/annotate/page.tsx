'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiService } from '@/services/apiService';
import { useAuthStore } from '@/store/authStore';
import { useAnnotationStore } from '@/store/annotationStore';
import { PolygonAnnotation } from '@/types';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { ImageUploader } from '@/components/ImageUploader';
import { ImageCarousel } from '@/components/ImageCarousel';
import { AnnotationCanvas } from '@/components/AnnotationCanvas';
import { AnnotationPanel } from '@/components/AnnotationPanel';
import { SaveAnnotationModal } from '@/components/SaveAnnotationModal';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function AnnotatePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const {
    images,
    currentImageIndex,
    isDrawing,
    currentPolygon,
    isLoading,
    setImages,
    setCurrentImageIndex,
    setAnnotations,
    setIsDrawing,
    setCurrentPolygon,
    addPointToPolygon,
    clearCurrentPolygon,
    addAnnotation,
    setLoading,
    getCurrentImage,
    getCurrentAnnotations,
    deleteAnnotation,
  } = useAnnotationStore();

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<PolygonAnnotation>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAnnotationImages();
      setImages(response.results || response);
      
      if ((response.results || response).length > 0) {
        loadAnnotationsForImage((response.results || response)[0].id);
      }
    } catch (error) {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const loadAnnotationsForImage = async (imageId: number) => {
    try {
      const response = await apiService.getPolygonAnnotations({ image: imageId });
      setAnnotations(response.results || response);
    } catch (error) {
      setAnnotations([]);
    }
  };

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    try {
      const newImage = await apiService.uploadAnnotationImage(file);
      setImages([...images, newImage]);
      setCurrentImageIndex(images.length);
      setAnnotations([]);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to upload image';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
    clearCurrentPolygon();
    setIsDrawing(false);
    setSelectedAnnotation(undefined);
    loadAnnotationsForImage(images[index].id);
  };

  const handleImageDelete = async (id: number) => {
    setLoading(true);
    try {
      await apiService.deleteAnnotationImage(id);
      const newImages = images.filter((img) => img.id !== id);
      setImages(newImages);
      
      if (newImages.length === 0) {
        setCurrentImageIndex(0);
        setAnnotations([]);
      } else if (currentImageIndex >= newImages.length) {
        setCurrentImageIndex(newImages.length - 1);
        loadAnnotationsForImage(newImages[newImages.length - 1].id);
      } else {
        loadAnnotationsForImage(newImages[currentImageIndex].id);
      }
      
      toast.success('Image deleted');
    } catch (error) {
      toast.error('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDrawing = () => {
    clearCurrentPolygon();
    setIsDrawing(true);
  };

  const handleFinishDrawing = () => {
    if (currentPolygon.length < 3) {
      toast.error('A polygon must have at least 3 points');
      return;
    }
    setIsDrawing(false);
    setIsSaveModalOpen(true);
  };

  const handleCancelDrawing = () => {
    clearCurrentPolygon();
    setIsDrawing(false);
    toast('Drawing cancelled');
  };

  const handleUndoPoint = () => {
    if (currentPolygon.length > 0) {
      setCurrentPolygon(currentPolygon.slice(0, -1));
    }
  };

  const handleSaveAnnotation = async (label: string) => {
    const currentImage = getCurrentImage();
    if (!currentImage) {
      toast.error('No image selected');
      return;
    }

    setLoading(true);
    try {
      const annotationData = {
        image: currentImage.id,
        points: currentPolygon,
        label: label || undefined,
      };

      const newAnnotation = await apiService.createPolygonAnnotation(annotationData);
      addAnnotation(newAnnotation);
      clearCurrentPolygon();
      setIsSaveModalOpen(false);
      setSelectedAnnotation(newAnnotation);
      toast.success('Annotation saved!');
    } catch (error) {
      toast.error('Failed to save annotation');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnotation = async (id: number) => {
    setLoading(true);
    try {
      await apiService.deletePolygonAnnotation(id);
      deleteAnnotation(id);
      setSelectedAnnotation(undefined);
      toast.success('Annotation deleted');
    } catch (error) {
      toast.error('Failed to delete annotation');
    } finally {
      setLoading(false);
    }
  };

  const currentImage = getCurrentImage();
  const currentAnnotations = getCurrentAnnotations();

  return (
    <div className="min-h-screen bg-surface-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px]">
        <TopNavbar
          title="Annotation"
          subtitle="Annotate images with polygon drawings"
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8">
          {images.length === 0 ? (
            <div className="bg-white rounded-card shadow-card border border-border p-6 sm:p-8">
              <ImageUploader onUpload={handleImageUpload} isLoading={isLoading} />
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <ImageCarousel
                images={images}
                currentIndex={currentImageIndex}
                onImageChange={handleImageChange}
                onDelete={handleImageDelete}
                isLoading={isLoading}
              />

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="lg:col-span-3 bg-white rounded-card shadow-card border border-border p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <h2 className="text-lg font-semibold text-text-primary">Draw Annotations</h2>
                    <div className="flex gap-2">
                      {!isDrawing ? (
                        <button
                          onClick={handleStartDrawing}
                          disabled={!currentImage || isLoading}
                          className="btn btn-primary btn-small"
                        >
                          <SparklesIcon className="w-4 h-4 mr-1.5" />
                          Start Drawing
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={handleFinishDrawing}
                            disabled={currentPolygon.length < 3 || isLoading}
                            className="btn btn-primary btn-small"
                          >
                            <SparklesIcon className="w-4 h-4 mr-1.5" />
                            Finish & Save
                          </button>
                          <button
                            onClick={handleCancelDrawing}
                            disabled={isLoading}
                            className="btn btn-danger btn-small"
                          >
                            <XMarkIcon className="w-4 h-4 mr-1.5" />
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {currentImage ? (
                    <AnnotationCanvas
                      imageSrc={currentImage.image_url || currentImage.image}
                      annotations={currentAnnotations}
                      currentPolygon={currentPolygon}
                      isDrawing={isDrawing}
                      selectedAnnotation={selectedAnnotation}
                      onPointAdd={addPointToPolygon}
                      onPointUndo={handleUndoPoint}
                      onAnnotationSelect={setSelectedAnnotation}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-64 sm:h-96 bg-surface-bg rounded-button border border-dashed border-border">
                      <p className="text-text-secondary text-sm">No image available</p>
                    </div>
                  )}

                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
                    <p className="text-sm text-text-secondary mb-4">Add more images</p>
                    <ImageUploader onUpload={handleImageUpload} isLoading={isLoading} />
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <AnnotationPanel
                    annotations={currentAnnotations}
                    selectedAnnotation={selectedAnnotation}
                    onAnnotationSelect={setSelectedAnnotation}
                    onAnnotationDelete={handleDeleteAnnotation}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <SaveAnnotationModal
        isOpen={isSaveModalOpen}
        points={currentPolygon}
        onClose={() => {
          setIsSaveModalOpen(false);
          clearCurrentPolygon();
        }}
        onSave={handleSaveAnnotation}
        isLoading={isLoading}
      />
    </div>
  );
}
