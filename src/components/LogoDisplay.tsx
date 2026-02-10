import { useEffect, useState } from 'react';
import { getStoredImageUrl } from './AdminPanel';

export default function LogoDisplay({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    // Enter → Hold after animation
    const holdTimer = setTimeout(() => setPhase('hold'), 800);
    // Hold → Exit
    const exitTimer = setTimeout(() => setPhase('exit'), 2000);
    // Complete
    const completeTimer = setTimeout(() => onComplete(), 3200);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-teal-800 z-[9998] flex items-center justify-center overflow-hidden gpu-accelerated ${phase === 'exit' ? 'opacity-0' : 'opacity-100'
        }`}
      style={{ transition: 'opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-teal-400 rounded-full opacity-15"
          style={{ filter: 'blur(120px)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-blue-50 rounded-full opacity-10"
          style={{ filter: 'blur(120px)' }}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        <div className="logo-container">
          <div className="relative flex items-center justify-center">
            {/* Soft white glow behind logo for contrast against dark bg */}
            <div
              className="absolute rounded-full"
              style={{
                width: '110%',
                height: '110%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.15) 65%, transparent 80%)',
                filter: 'blur(8px)',
              }}
            />
            <img
              src={getStoredImageUrl('logo', '/logo.jpg')}
              alt="Quick Home Prefab"
              // Keep mobile optimization: constrained height and max-width
              className="h-32 sm:h-48 md:h-64 w-auto max-w-[70vw] object-contain relative z-10 rounded-2xl"
              style={{
                animation: 'logoScale 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}
            />
          </div>
        </div>

        {/* Subtle loading indicator */}
        <div
          className="mt-8 h-0.5 w-20 bg-gradient-to-r from-teal-400 to-cyan-300 rounded-full"
          style={{
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes logoScale {
          0% {
            transform: scale(0.6);
            opacity: 0;
            // Start with brightness boost to pop against dark
            filter: blur(10px) brightness(1) contrast(1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
            // End with brightness boost
            filter: blur(0) brightness(1.15) contrast(1.1);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
