import { ReactNode, Children, cloneElement, isValidElement, useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalCardScrollerProps {
  children: ReactNode;
  showArrows?: boolean;
  fadeBg?: string;     // CSS color for the fade edge, e.g. "#ffffff" or "#f9fafb"
}

export default function HorizontalCardScroller({
  children,
  showArrows = true,
  fadeBg,
}: HorizontalCardScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Desktop detection
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Scroll-triggered reveal via IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Scroll state & progress tracking
  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);

      // Calculate scroll progress (0 to 100)
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress((scrollLeft / maxScroll) * 100);
      } else {
        setScrollProgress(100); // Everything fits — fully "scrolled"
      }
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const container = scrollRef.current;
    if (!container) return;
    const observer = new ResizeObserver(checkScroll);
    observer.observe(container);
    return () => observer.disconnect();
  }, [children, checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Wrap each child with reveal + stagger + premium classes
  const wrappedChildren = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;

    const staggerClass = `card-stagger-${Math.min(index, 5)}`;
    const existingClassName = (child.props as { className?: string }).className || '';

    return (
      <div
        className={`card-reveal ${staggerClass} ${revealed ? 'revealed' : ''} perspective-container`}
      >
        {cloneElement(child as React.ReactElement<{ className?: string }>, {
          className: `${existingClassName} premium-card card-shine card-glow`,
        })}
      </div>
    );
  });

  // Fade edge class based on scroll position
  const fadeClass = `scroll-fade-edges ${!canScrollLeft ? 'at-start' : ''} ${!canScrollRight ? 'at-end' : ''}`;

  return (
    <div
      ref={containerRef}
      className="relative"
      style={fadeBg ? { '--fade-bg': fadeBg } as React.CSSProperties : undefined}
    >
      {/* Scroll container */}
      <div className={isDesktop ? '' : fadeClass}>
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className={`
            flex gap-4 md:gap-6 pb-2 scrollbar-hide
            ${isDesktop
              ? 'lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:overflow-visible lg:gap-6'
              : 'overflow-x-auto snap-x snap-mandatory scroll-smooth-touch'
            }
          `}
          style={{
            ...(isDesktop ? {} : { paddingLeft: '8px', paddingRight: '8px' }),
          }}
        >
          {wrappedChildren}
        </div>

        {/* Scroll progress indicator — mobile only */}
        {!isDesktop && (
          <div className="scroll-progress-track">
            <div
              className="scroll-progress-fill"
              style={{ width: `${Math.max(scrollProgress, 15)}%` }}
            />
          </div>
        )}
      </div>

      {/* Desktop scroll arrows */}
      {showArrows && isDesktop && (
        <>
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 bg-white/95 backdrop-blur-sm shadow-premium-lg rounded-full p-3.5 hover:scale-110 active:scale-95 transition-all z-10 border border-gray-200/80"
              aria-label="Scroll left"
            >
              <ChevronLeft className="text-blue-900" size={22} />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 bg-white/95 backdrop-blur-sm shadow-premium-lg rounded-full p-3.5 hover:scale-110 active:scale-95 transition-all z-10 border border-gray-200/80"
              aria-label="Scroll right"
            >
              <ChevronRight className="text-blue-900" size={22} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
