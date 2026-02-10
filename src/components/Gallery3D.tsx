import { useState, useEffect } from 'react';
import { Home, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  type: string;
  size: string;
  location: string;
  description: string;
  icon: typeof Home;
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
  },
  {
    id: 2,
    title: 'Tech Startup Office',
    type: 'Commercial',
    size: '250 sqm',
    location: 'Cebu',
    description: 'Modern workspace with flexible layouts',
    icon: Briefcase,
  },
  {
    id: 3,
    title: 'Coastal Villa',
    type: 'Residential',
    size: '180 sqm',
    location: 'Batangas',
    description: '4-bedroom luxury home with ocean views',
    icon: Home,
  },
  {
    id: 4,
    title: 'Eco-Friendly Home',
    type: 'Residential',
    size: '95 sqm',
    location: 'Tagaytay',
    description: '2-bedroom sustainable living space',
    icon: Home,
  },
  {
    id: 5,
    title: 'Medical Clinic',
    type: 'Commercial',
    size: '150 sqm',
    location: 'Quezon City',
    description: 'Professional healthcare facility',
    icon: Briefcase,
  },
];

export default function Gallery3D() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      next();
    }
    if (touchStart - touchEnd < -75) {
      prev();
    }
  };

  const getPosition = (index: number) => {
    const diff = index - activeIndex;
    const pos = ((diff + galleryItems.length) % galleryItems.length);

    if (isMobile) {
      if (pos === 0) return 'center';
      if (pos === 1) return 'right';
      if (pos === galleryItems.length - 1) return 'left';
      return 'hidden';
    }

    if (pos === 0) return 'center';
    if (pos === 1 || pos === galleryItems.length - 1) return pos === 1 ? 'right' : 'left';
    if (pos === 2 || pos === galleryItems.length - 2) return pos === 2 ? 'far-right' : 'far-left';
    return 'hidden';
  };

  return (
    <div
      className="relative py-12 md:py-20 flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-teal-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative w-full h-[480px] md:h-[550px] flex items-center justify-center">
        {galleryItems.map((item, index) => {
          const position = getPosition(index);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`absolute transition-all duration-700 ease-out ${position !== 'center' ? 'cursor-pointer' : ''} ${position === 'center'
                  ? 'z-30 scale-100 opacity-100 translate-x-0'
                  : position === 'left'
                    ? isMobile
                      ? 'z-20 scale-75 opacity-30 -translate-x-[200px]'
                      : 'z-20 scale-90 opacity-60 -translate-x-[320px] lg:-translate-x-[420px]'
                    : position === 'right'
                      ? isMobile
                        ? 'z-20 scale-75 opacity-30 translate-x-[200px]'
                        : 'z-20 scale-90 opacity-60 translate-x-[320px] lg:translate-x-[420px]'
                      : position === 'far-left'
                        ? 'z-10 scale-75 opacity-20 -translate-x-[480px] lg:-translate-x-[680px]'
                        : position === 'far-right'
                          ? 'z-10 scale-75 opacity-20 translate-x-[480px] lg:translate-x-[680px]'
                          : 'z-0 scale-50 opacity-0'
                }`}
              onClick={() => position !== 'center' && setActiveIndex(index)}
              style={{
                transform: `${isMobile
                    ? 'none'
                    : position === 'center'
                      ? 'perspective(1200px) rotateY(0deg) rotateX(0deg)'
                      : position === 'left'
                        ? 'perspective(1200px) rotateY(28deg) rotateX(3deg)'
                        : position === 'right'
                          ? 'perspective(1200px) rotateY(-28deg) rotateX(3deg)'
                          : position === 'far-left'
                            ? 'perspective(1200px) rotateY(40deg) rotateX(5deg)'
                            : position === 'far-right'
                              ? 'perspective(1200px) rotateY(-40deg) rotateX(5deg)'
                              : ''
                  }`,
              }}
            >
              <div className={`w-[85vw] max-w-[280px] sm:w-[300px] lg:w-[380px] h-[60vh] max-h-[400px] sm:h-[420px] bg-white rounded-3xl overflow-hidden transition-all duration-700 ${position === 'center'
                  ? 'shadow-2xl border border-gray-100'
                  : 'shadow-lg border border-gray-200'
                }`}>
                <div className="relative h-48 sm:h-56 bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent)]"></div>
                  <div className={`absolute inset-0 bg-black/30 transition-all duration-700 ${position === 'center' ? 'bg-black/20' : 'bg-black/35'
                    }`}></div>
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${position === 'center' ? 'scale-100' : 'scale-90'
                    }`}>
                    <Icon className={`transition-all duration-700 ${position === 'center'
                        ? 'text-white/90 drop-shadow-lg'
                        : 'text-white/70'
                      }`} size={position === 'center' ? (isMobile ? 80 : 110) : (isMobile ? 60 : 90)} />
                  </div>
                  <div className={`absolute top-4 left-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold transition-all duration-700 ${item.type === 'Residential'
                      ? 'bg-teal-600 text-white'
                      : 'bg-blue-600 text-white'
                    }`}>
                    {item.type.toUpperCase()}
                  </div>
                </div>
                <div className={`p-4 sm:p-6 transition-all duration-700 ${position === 'center' ? 'h-52' : 'h-52'
                  }`}>
                  <h3 className={`font-bold text-blue-900 mb-2 transition-all duration-700 line-clamp-2 ${position === 'center' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                    }`}>{item.title}</h3>
                  <p className={`mb-3 sm:mb-4 transition-all duration-700 line-clamp-2 ${position === 'center'
                      ? 'text-gray-600 text-xs sm:text-sm'
                      : 'text-gray-600 text-xs opacity-80'
                    }`}>{item.description}</p>
                  <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">Size</span>
                      <span className="font-semibold text-blue-900">{item.size}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">Location</span>
                      <span className="font-semibold text-blue-900 text-xs">{item.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={prev}
        className="absolute left-2 md:left-4 lg:left-6 z-40 bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 active:from-teal-800 active:to-teal-900 text-white w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group touch-manipulation"
        aria-label="Previous"
      >
        <ChevronLeft className="group-hover:translate-x-0.5 transition-transform" size={24} />
      </button>

      <button
        onClick={next}
        className="absolute right-2 md:right-4 lg:right-6 z-40 bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 active:from-teal-800 active:to-teal-900 text-white w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group touch-manipulation"
        aria-label="Next"
      >
        <ChevronRight className="group-hover:-translate-x-0.5 transition-transform" size={24} />
      </button>

      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-40 backdrop-blur-sm bg-white/30 px-3 md:px-4 py-2 md:py-3 rounded-full">
        {galleryItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`transition-all duration-500 rounded-full touch-manipulation ${index === activeIndex
                ? 'bg-gradient-to-r from-teal-600 to-blue-600 w-7 md:w-8 h-2.5 shadow-lg'
                : 'bg-white/60 hover:bg-white/80 active:bg-white w-2.5 h-2.5'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
