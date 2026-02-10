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
      className={`fixed inset-0 bg-white z-[9998] flex items-center justify-center overflow-hidden gpu-accelerated ${phase === 'exit' ? 'opacity-0' : 'opacity-100'
        }`}
      style={{ transition: 'opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {/* Optional: Very subtle background pattern or gradient could go here if "plain white" is too flat, 
          but keeping it pure white as requested. */}

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        <div className="logo-container">
          <div className="relative flex items-center justify-center">
            <img
              src={getStoredImageUrl('logo', '/logo.jpg')}
              alt="Quick Home Prefab"
              className="h-48 sm:h-64 md:h-72 relative z-10"
              style={{
                animation: 'logoScale 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
                // No filters needed on white background
              }}
            />
          </div>
        </div>

        {/* Loading indicator */}
        <div
          className="mt-8 h-0.5 w-20 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
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
            filter: blur(10px);
          }
          100% {
            transform: scale(1);
            opacity: 1;
            filter: blur(0);
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
