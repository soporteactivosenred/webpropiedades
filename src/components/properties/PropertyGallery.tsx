'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/3] rounded-xl bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">Sin imágenes disponibles</span>
      </div>
    );
  }

  const hasMultiple = images.length > 1;
  const remainingCount = images.length - 5;

  return (
    <>
      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Main image (left, spans 2 columns on md/lg) */}
        <div 
          onClick={() => openLightbox(0)}
          className="relative aspect-[4/3] md:col-span-2 rounded-xl overflow-hidden bg-gray-200 cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Image
            src={images[0]}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
        </div>

        {/* Secondary images grid (right, 1 column of 2 rows, or grid) */}
        {hasMultiple && (
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {images.slice(1, 5).map((img, i) => {
              const actualIndex = i + 1;
              const isLast = i === 3 && remainingCount > 0;

              return (
                <div
                  key={i}
                  onClick={() => openLightbox(actualIndex)}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Image
                    src={img}
                    alt={`${title} - ${actualIndex + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {isLast ? (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white transition-all duration-300 group-hover:bg-black/50">
                      <span className="text-2xl font-bold font-sans">+{remainingCount}</span>
                      <span className="text-xs uppercase tracking-wider font-semibold">Fotografías</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm select-none transition-all duration-300">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 text-white z-10">
            <span className="text-sm md:text-base font-medium truncate max-w-[70%]">
              {title}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 font-medium">
                {currentIndex + 1} / {images.length}
              </span>
              <button
                onClick={closeLightbox}
                className="p-2 text-gray-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Stage */}
          <div className="flex-1 flex items-center justify-center relative px-4 md:px-16">
            {/* Prev Button */}
            {images.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-4 md:left-8 p-3 text-white hover:text-primary-400 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-md transition-all duration-200 focus:outline-none"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Current Image */}
            <div className="relative w-full h-[65vh] md:h-[75vh] flex items-center justify-center">
              <Image
                src={images[currentIndex]}
                alt={`${title} - Vista completa`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                priority
              />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 md:right-8 p-3 text-white hover:text-primary-400 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-md transition-all duration-200 focus:outline-none"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>

          {/* Thumbnail Carousel at the bottom */}
          {images.length > 1 && (
            <div className="p-4 md:p-6 bg-black/50 border-t border-white/5 backdrop-blur-md max-w-full overflow-x-auto">
              <div className="flex justify-center gap-2 md:gap-3 mx-auto w-max max-w-full pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                      idx === currentIndex
                        ? 'ring-2 ring-primary-500 scale-105 opacity-100'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
