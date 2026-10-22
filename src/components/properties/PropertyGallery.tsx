'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2, Play } from 'lucide-react';
import { getVideoEmbedUrl, getVideoThumbnailUrl } from '@/lib/video';

interface PropertyGalleryProps {
  images: string[];
  title: string;
  videoUrl?: string | null;
}

type GalleryItem = 
  | { type: 'image'; url: string }
  | { type: 'video'; embedUrl: string; thumbnailUrl: string | null };

export function PropertyGallery({ images = [], title, videoUrl }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Construir la lista unificada de elementos:
  // Si hay video, se inserta en segundo lugar (índice 1)
  const items: GalleryItem[] = useMemo(() => {
    const rawImages = images || [];
    const embedUrl = getVideoEmbedUrl(videoUrl);
    const thumbUrl = getVideoThumbnailUrl(videoUrl);

    if (!embedUrl) {
      return rawImages.map(url => ({ type: 'image', url }));
    }

    const videoItem: GalleryItem = {
      type: 'video',
      embedUrl,
      thumbnailUrl: thumbUrl || rawImages[0] || null,
    };

    if (rawImages.length === 0) {
      return [videoItem];
    }

    // El video siempre aparece en SEGUNDO lugar (índice 1)
    const result: GalleryItem[] = [
      { type: 'image', url: rawImages[0] },
      videoItem,
      ...rawImages.slice(1).map(url => ({ type: 'image' as const, url }))
    ];

    return result;
  }, [images, videoUrl]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextItem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (items.length <= 1) return;
    setLightboxIndex((prev) => (prev + 1) % items.length);
  };

  const prevItem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (items.length <= 1) return;
    setLightboxIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') nextItem();
      if (e.key === 'ArrowLeft') prevItem();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items.length]);

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

  if (!items || items.length === 0) {
    return (
      <div className="relative aspect-[4/3] rounded-xl bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">Sin imágenes ni video disponibles</span>
      </div>
    );
  }

  const currentMainItem = items[activeIndex] || items[0];
  const currentLightboxItem = items[lightboxIndex] || items[0];

  return (
    <>
      {/* Desktop/Tablet Layout: Main Display + Vertical Thumbnail Column */}
      <div className="hidden md:grid grid-cols-5 gap-4 mb-8 w-full h-[380px] lg:h-[480px] xl:h-[560px] min-h-0">
        {/* Main Display Area (Left 4 cols) */}
        <div className="col-span-4 relative h-full min-h-0 rounded-2xl overflow-hidden bg-black/90 shadow-sm hover:shadow-md transition-all duration-300">
          {currentMainItem.type === 'video' ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <iframe
                src={currentMainItem.embedUrl}
                title={`${title} - Video de la propiedad`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              <span className="absolute top-4 left-4 z-10 bg-red-600/90 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-md">
                <Play className="w-3.5 h-3.5 fill-white" />
                Video Recorrido
              </span>
            </div>
          ) : (
            <div 
              onClick={() => openLightbox(activeIndex)}
              className="relative w-full h-full cursor-pointer group"
            >
              <Image
                src={currentMainItem.url}
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
                Elemento {activeIndex + 1} de {items.length}
              </span>
            </div>
          )}
        </div>

        {/* Vertical Thumbnail Column (Right 1 col) */}
        <div className="col-span-1 h-full flex flex-col min-h-0">
          <div 
            ref={thumbnailContainerRef}
            className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent max-h-full"
            style={{ scrollBehavior: 'smooth' }}
          >
            {items.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative aspect-[4/3] w-full rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex-shrink-0 bg-gray-900 ${
                    isSelected
                      ? 'ring-2 ring-primary-500 scale-98 shadow-md'
                      : 'opacity-70 hover:opacity-100 hover:scale-[1.02]'
                  }`}
                >
                  {item.type === 'video' ? (
                    <>
                      {item.thumbnailUrl ? (
                        <Image
                          src={item.thumbnailUrl}
                          alt={`${title} - Miniatura Video`}
                          fill
                          className="object-cover opacity-80"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center" />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-white translate-x-0.5" />
                        </div>
                        <span className="text-[10px] text-white font-bold tracking-wider uppercase bg-black/60 px-1.5 py-0.5 rounded">Video</span>
                      </div>
                    </>
                  ) : (
                    <Image
                      src={item.url}
                      alt={`${title} - Miniatura ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary-500/10 border-2 border-primary-500 rounded-xl" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Layout: Main Display + Horizontal Thumbnail Row */}
      <div className="md:hidden flex flex-col gap-3 mb-8">
        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black/90">
          {currentMainItem.type === 'video' ? (
            <div className="relative w-full h-full bg-black">
              <iframe
                src={currentMainItem.embedUrl}
                title={`${title} - Video de la propiedad`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div 
              onClick={() => openLightbox(activeIndex)}
              className="relative w-full h-full"
            >
              <Image
                src={currentMainItem.url}
                alt={title}
                fill
                className="object-cover"
                priority
              />
              <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full font-medium">
                {activeIndex + 1} / {items.length}
              </span>
            </div>
          )}
        </div>

        {/* Horizontal Scrolling Thumbnails */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
          {items.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-[4/3] w-20 rounded-lg overflow-hidden flex-shrink-0 snap-start transition-all duration-200 bg-gray-900 ${
                  isSelected
                    ? 'ring-2 ring-primary-500 opacity-100 scale-95'
                    : 'opacity-60'
                }`}
              >
                {item.type === 'video' ? (
                  <>
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt="Video Thumbnail"
                        fill
                        className="object-cover opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-900" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center">
                        <Play className="w-3 h-3 fill-white translate-x-0.5" />
                      </div>
                    </div>
                  </>
                ) : (
                  <Image
                    src={item.url}
                    alt={`${title} - Miniatura ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            );
          })}
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
                {lightboxIndex + 1} / {items.length}
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
            {items.length > 1 && (
              <button
                onClick={prevItem}
                className="absolute left-4 md:left-8 p-3 text-white hover:text-primary-400 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-md transition-all duration-200 focus:outline-none z-20"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Current Item */}
            <div className="relative w-full h-[65vh] md:h-[75vh] flex items-center justify-center">
              {currentLightboxItem.type === 'video' ? (
                <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                  <iframe
                    src={currentLightboxItem.embedUrl}
                    title={`${title} - Video Lightbox`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <Image
                  src={currentLightboxItem.url}
                  alt={`${title} - Vista completa`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  priority
                />
              )}
            </div>

            {/* Next Button */}
            {items.length > 1 && (
              <button
                onClick={nextItem}
                className="absolute right-4 md:right-8 p-3 text-white hover:text-primary-400 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-md transition-all duration-200 focus:outline-none z-20"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>

          {/* Thumbnail Carousel at the bottom of the modal */}
          {items.length > 1 && (
            <div className="p-4 md:p-6 bg-black/50 border-t border-white/5 backdrop-blur-md max-w-full overflow-x-auto">
              <div className="flex justify-center gap-2 md:gap-3 mx-auto w-max max-w-full pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 bg-gray-900 ${
                      idx === lightboxIndex
                        ? 'ring-2 ring-primary-500 scale-105 opacity-100'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <Play className="w-4 h-4 text-red-500 fill-red-500" />
                      </div>
                    ) : (
                      <Image
                        src={item.url}
                        alt={`Miniatura Lightbox ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    )}
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
