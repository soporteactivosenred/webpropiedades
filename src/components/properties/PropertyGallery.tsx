'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation for lightbox
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

  // Center active thumbnail in scroll view
  useEffect(() => {
    const container = thumbnailContainerRef.current;
    if (!container) return;

    const activeEl = container.children[activeIndex] as HTMLElement;
    if (!activeEl) return;

    const containerHeight = container.clientHeight;
    const activeHeight = activeEl.clientHeight;
    const activeTop = activeEl.offsetTop;

    container.scrollTo({
      top: activeTop - containerHeight / 2 + activeHeight / 2,
      behavior: 'smooth',
    });
  }, [activeIndex]);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/3] rounded-xl bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">Sin imágenes disponibles</span>
      </div>
    );
  }

  return (
    <>
      {/* Desktop/Tablet Layout: Main image + Vertical Thumbnail Carousel */}
      <div className="hidden md:grid grid-cols-5 gap-4 mb-8 w-full h-[350px] lg:h-[450px] xl:h-[550px] min-h-0">
        {/* Main Display Area (Left 4 cols) */}
        <div 
          onClick={() => openLightbox(activeIndex)}
          className="col-span-4 relative h-full min-h-0 rounded-2xl overflow-hidden bg-gray-200 cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Image
            src={images[activeIndex]}
            alt={title}
            fill
            className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
            priority
          />
          {/* Subtle overlay & Zoom button */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-black/60 backdrop-blur-md text-white p-4 rounded-full transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg">
              <Maximize2 className="w-6 h-6" />
            </span>
          </div>
          <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium">
            Foto {activeIndex + 1} de {images.length}
          </span>
        </div>

        {/* Vertical Thumbnail Column (Right 1 col) */}
        <div className="col-span-1 h-full flex flex-col min-h-0">
          <div 
            ref={thumbnailContainerRef}
            className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent max-h-full"
            style={{ scrollBehavior: 'smooth' }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-[4/3] w-full rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex-shrink-0 ${
                  idx === activeIndex
                    ? 'ring-2 ring-primary-500 scale-98 shadow-md'
                    : 'opacity-70 hover:opacity-100 hover:scale-[1.02]'
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} - Miniatura ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                {idx === activeIndex && (
                  <div className="absolute inset-0 bg-primary-500/10 border-2 border-primary-500 rounded-xl" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Layout: Main Image + Horizontal Thumbnail Row */}
      <div className="md:hidden flex flex-col gap-3 mb-8">
        <div 
          onClick={() => openLightbox(activeIndex)}
          className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-200"
        >
          <Image
            src={images[activeIndex]}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full font-medium">
            {activeIndex + 1} / {images.length}
          </span>
        </div>

        {/* Horizontal Scrolling Thumbnails */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-[4/3] w-20 rounded-lg overflow-hidden flex-shrink-0 snap-start transition-all duration-200 ${
                idx === activeIndex
                  ? 'ring-2 ring-primary-500 opacity-100 scale-95'
                  : 'opacity-60'
              }`}
            >
              <Image
                src={img}
                alt={`${title} - Miniatura ${idx + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal (Fullscreen) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm select-none transition-all duration-300">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 text-white z-10">
            <span className="text-sm md:text-base font-medium truncate max-w-[70%]">
              {title}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 font-medium font-mono">
                {lightboxIndex + 1} / {images.length}
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
                src={images[lightboxIndex]}
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

          {/* Thumbnail Carousel at the bottom of the modal */}
          {images.length > 1 && (
            <div className="p-4 md:p-6 bg-black/50 border-t border-white/5 backdrop-blur-md max-w-full overflow-x-auto">
              <div className="flex justify-center gap-2 md:gap-3 mx-auto w-max max-w-full pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                      idx === lightboxIndex
                        ? 'ring-2 ring-primary-500 scale-105 opacity-100'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Miniatura Lightbox ${idx + 1}`}
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
