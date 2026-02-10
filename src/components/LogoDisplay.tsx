import { useEffect, useState } from 'react';

export default function LogoDisplay({ onComplete }: { onComplete: () => void }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onComplete(), 1500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-teal-800 z-[9998] flex items-center justify-center overflow-hidden transition-opacity duration-1500 ${isExiting ? 'opacity-0' : 'opacity-100'
      }`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-teal-400 rounded-full blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -right-40 w-[900px] h-[900px] bg-blue-500 rounded-full blur-3xl opacity-15 animate-float-delayed"></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-300 rounded-full blur-3xl opacity-10 animate-float-slow"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        <div className="animate-logo-emerge">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/30 to-cyan-300/30 blur-3xl rounded-full animate-pulse-soft"></div>
            <img
              src="/logo.jpg"
              alt="Quick Home Prefab"
              className="h-80 drop-shadow-2xl relative z-10 animate-logo-glow"
            />
          </div>
        </div>

        <div className="mt-12 h-1 w-32 bg-gradient-to-r from-teal-400 to-cyan-300 rounded-full animate-pulse"></div>
      </div>

      <style>{`
        @keyframes logoEmerge {
          0% {
            transform: scale(0) translateY(40px);
            opacity: 0;
            filter: blur(20px);
          }
          50% {
            transform: scale(1.05) translateY(-5px);
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
            filter: blur(0px);
          }
        }

        @keyframes logoGlow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(20, 184, 166, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(20, 184, 166, 0.6));
          }
        }

        @keyframes pulseSoft {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes floatDelayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.05); }
          66% { transform: translate(30px, -20px) scale(0.95); }
        }

        @keyframes floatSlow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(5deg); }
        }

        .animate-logo-emerge {
          animation: logoEmerge 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-logo-glow {
          animation: logoGlow 3s ease-in-out infinite;
        }

        .animate-pulse-soft {
          animation: pulseSoft 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: floatDelayed 25s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: floatSlow 30s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
