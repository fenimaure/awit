import { useState, useEffect, useCallback, useRef } from 'react';
import { Home, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { getStoredImageUrl, hasStoredImage } from './AdminPanel';

interface GalleryItem {
  id: number;
  title: string;
  type: string;
  size: string;
  location: string;
  description: string;
  icon: typeof Home;
  imageKey: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'Modern Family Home',
    type: 'Residential',
    size: '120 sqm',
    location: 'Manila',
    description: '3-bedroom contemporary design with open floor plan',
    icon: Home,
    imageKey: 'gallery-1',
  },
  {
    id: 2,
    title: 'Tech Startup Office',
    type: 'Commercial',
    size: '250 sqm',
    location: 'Cebu',
    description: 'Modern workspace with flexible layouts',
    icon: Briefcase,
    imageKey: 'gallery-2',
  },
  {
    id: 3,
    title: 'Coastal Villa',
    type: 'Residential',
    size: '180 sqm',
    location: 'Batangas',
    description: '4-bedroom luxury home with ocean views',
    icon: Home,
    imageKey: 'gallery-3',
  },
  {
    id: 4,
    title: 'Eco-Friendly Home',
    type: 'Residential',
    size: '95 sqm',
    location: 'Tagaytay',
    description: '2-bedroom sustainable living space',
    icon: Home,
    imageKey: 'gallery-4',
  },
  {
    id: 5,
    title: 'Medical Clinic',
    type: 'Commercial',
    size: '150 sqm',
    location: 'Quezon City',
    description: 'Professional healthcare facility',
    icon: Briefcase,
    imageKey: 'gallery-5',
  },
];

export default function Gallery3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchRef = useRef({ startX: 0, startY: 0, isDragging: false });
  const autoPlayRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Auto-play carousel
  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % galleryItems.length);
    }, 4000);
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current !== null) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % galleryItems.length);
    stopAutoPlay();
    startAutoPlay();
  }, [stopAutoPlay, startAutoPlay]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
    stopAutoPlay();
    startAutoPlay();
  }, [stopAutoPlay, startAutoPlay]);

  // Improved touch handling — prevent vertical scroll hijacking
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      isDragging: false,
    };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const deltaX = Math.abs(e.touches[0].clientX - touchRef.current.startX);
    const deltaY = Math.abs(e.touches[0].clientY - touchRef.current.startY);
    // Only trigger horizontal swipe if delta X > delta Y (not scrolling up/down)
    if (deltaX > deltaY && deltaX > 10) {
      touchRef.current.isDragging = true;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current.isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchRef.current.startX - endX;
    if (diff > 50) next();
    else if (diff < -50) prev();
  }, [next, prev]);

  const getCardStyle = (index: number): React.CSSProperties => {
    const diff = index - activeIndex;
    const total = galleryItems.length;
    let pos = ((diff % total) + total) % total;

    // Normalize to [-2, 2] range
    if (pos > Math.floor(total / 2)) pos -= total;

    const base: React.CSSProperties = {
      transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'absolute',
      willChange: 'transform, opacity',
    };

    if (isMobile) {
      if (pos === 0) {
        return { ...base, transform: 'translateX(0) scale(1)', opacity: 1, zIndex: 30 };
      }
      if (pos === 1) {
        return { ...base, transform: 'translateX(65%) scale(0.85)', opacity: 0.4, zIndex: 20 };
      }
      if (pos === -1) {
        return { ...base, transform: 'translateX(-65%) scale(0.85)', opacity: 0.4, zIndex: 20 };
      }
      return { ...base, transform: 'translateX(0) scale(0.7)', opacity: 0, zIndex: 0, pointerEvents: 'none' };
    }

    // Desktop
    if (pos === 0) {
      return { ...base, transform: 'perspective(1200px) translateX(0) scale(1) rotateY(0deg)', opacity: 1, zIndex: 30 };
    }
    if (pos === 1) {
      return { ...base, transform: 'perspective(1200px) translateX(110%) scale(0.88) rotateY(-15deg)', opacity: 0.6, zIndex: 20 };
    }
    if (pos === -1) {
      return { ...base, transform: 'perspective(1200px) translateX(-110%) scale(0.88) rotateY(15deg)', opacity: 0.6, zIndex: 20 };
    }
    if (pos === 2) {
      return { ...base, transform: 'perspective(1200px) translateX(200%) scale(0.75) rotateY(-25deg)', opacity: 0.25, zIndex: 10 };
    }
    if (pos === -2) {
      return { ...base, transform: 'perspective(1200px) translateX(-200%) scale(0.75) rotateY(25deg)', opacity: 0.25, zIndex: 10 };
    }
    return { ...base, transform: 'scale(0.6)', opacity: 0, zIndex: 0, pointerEvents: 'none' };
  };

  return (
    <div
      ref={containerRef}
      className="relative py-8 md:py-16"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Cards Container */}
      <div className="relative w-full h-[350px] xs:h-[400px] sm:h-[460px] md:h-[500px] flex items-center justify-center">
        {galleryItems.map((item, index) => {
          const Icon = item.icon;
          const isCenter = index === activeIndex;
          const hasImage = hasStoredImage(item.imageKey);

          return (
            <div
              key={item.id}
              style={getCardStyle(index)}
              className={`${!isCenter ? 'cursor-pointer' : ''}`}
              onClick={() => !isCenter && setActiveIndex(index)}
              role={!isCenter ? 'button' : undefined}
              tabIndex={!isCenter ? 0 : undefined}
              aria-label={!isCenter ? `View ${item.title}` : undefined}
            >
              <div className={`w-[75vw] max-w-[280px] sm:w-[300px] sm:max-w-[300px] lg:w-[380px] lg:max-w-[380px] bg-white rounded-2xl overflow-hidden gpu-accelerated ${isCenter ? 'shadow-2xl ring-1 ring-black/5' : 'shadow-lg'
                }`}>
                {/* Image area */}
                <div className="relative h-36 sm:h-44 md:h-52 bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600 overflow-hidden">
                  {hasImage ? (
                    <img
                      src={getStoredImageUrl(item.imageKey, '')}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent)]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="text-white/80" size={isMobile ? 64 : 80} />
                      </div>
                    </>
                  )}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${item.type === 'Residential' ? 'bg-teal-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                    {item.type.toUpperCase()}
                  </div>
                </div>

                {/* Content area */}
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-1.5 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="space-y-1.5 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Size</span>
                      <span className="font-semibold text-blue-900">{item.size}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Location</span>
                      <span className="font-semibold text-blue-900">{item.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur-sm text-blue-900 w-11 h-11 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all touch-manipulation touch-target"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={next}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur-sm text-blue-900 w-11 h-11 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all touch-manipulation touch-target"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-6 md:mt-8">
        {galleryItems.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              stopAutoPlay();
              startAutoPlay();
            }}
            className={`transition-all duration-400 rounded-full touch-manipulation ${index === activeIndex
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 w-7 h-2.5 shadow-md'
              : 'bg-gray-300 hover:bg-gray-400 w-2.5 h-2.5'
              }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === activeIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
