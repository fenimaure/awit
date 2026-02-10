import { useEffect, useState, useMemo } from 'react';

export default function LoadingScreen({ isExiting }: { isExiting?: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1100; // ms

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);
      // Ease-out curve for natural feel
      const eased = 100 * (1 - Math.pow(1 - rawProgress / 100, 3));
      setProgress(eased);

      if (elapsed < duration) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Memoize keyword badges to avoid re-renders
  const keywords = useMemo(() => ['Prefab Homes', 'Fast Delivery', 'Durable', 'Affordable'], []);

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-teal-800 z-[9999] flex items-center justify-center overflow-hidden gpu-accelerated ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      style={{ transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)' }}
      aria-live="polite"
      role="status"
    >
      {/* Background glow — simplified, GPU-composited */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-teal-400 rounded-full opacity-15"
          style={{ filter: 'blur(120px)', willChange: 'transform' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-blue-500 rounded-full opacity-10"
          style={{ filter: 'blur(120px)', willChange: 'transform' }}
        />
      </div>

      <div className="relative z-10 px-6 w-full max-w-lg mx-auto">
        {/* Headline text */}
        <div className="space-y-2 text-center">
          <div className="overflow-hidden">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight animate-slide-up">
              Building
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight animate-slide-up"
              style={{ animationDelay: '150ms' }}
            >
              Smarter,
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight animate-slide-up"
              style={{ animationDelay: '300ms' }}
            >
              Living Better.
            </h1>
          </div>
        </div>

        {/* Keyword badges */}
        <div
          className="flex flex-wrap justify-center gap-2 mt-8 animate-fade-up"
          style={{ animationDelay: '500ms' }}
        >
          {keywords.map((text, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-full bg-white/8 backdrop-blur-sm border border-white/10 text-teal-200 text-sm font-light animate-fade-up"
              style={{ animationDelay: `${600 + i * 80}ms` }}
            >
              {text}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-10 animate-fade-up" style={{ animationDelay: '800ms' }}>
          <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 rounded-full"
              style={{
                width: `${Math.min(progress, 100)}%`,
                transition: 'width 100ms linear',
              }}
            />
          </div>
          <div className="mt-3 text-center">
            <span className="text-teal-200/70 text-xs font-light tracking-widest">
              {Math.min(Math.round(progress), 100)}%
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          opacity: 0;
          animation: slideUp 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-up {
          opacity: 0;
          animation: fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
