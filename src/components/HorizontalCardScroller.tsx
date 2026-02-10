import { ReactNode, useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalCardScrollerProps {
  children: ReactNode;
  showArrows?: boolean;
}

export default function HorizontalCardScroller({ children, showArrows = true }: HorizontalCardScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const container = scrollRef.current;
    if (!container) return;

    // Use ResizeObserver instead of window resize for better perf
    const observer = new ResizeObserver(checkScroll);
    observer.observe(container);
    return () => observer.disconnect();
  }, [children, checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {/* Horizontal scroll container for mobile, grid for desktop */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className={`
          flex gap-4 md:gap-6 pb-4 scrollbar-hide
          ${isDesktop
            ? 'lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:overflow-visible'
            : 'overflow-x-auto snap-x snap-mandatory scroll-smooth-touch'
          }
        `}
        style={{
          /* Pad first/last cards so they can center on mobile */
          ...(isDesktop ? {} : { paddingLeft: '4px', paddingRight: '4px' })
        }}
      >
        {children}
      </div>

      {/* Desktop scroll arrows */}
      {showArrows && isDesktop && (
        <>
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-xl rounded-full p-3 hover:scale-110 transition-all z-10 border border-gray-200"
              aria-label="Scroll left"
            >
              <ChevronLeft className="text-blue-900" size={24} />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-xl rounded-full p-3 hover:scale-110 transition-all z-10 border border-gray-200"
              aria-label="Scroll right"
            >
              <ChevronRight className="text-blue-900" size={24} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
