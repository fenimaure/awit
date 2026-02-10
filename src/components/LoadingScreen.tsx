import { useEffect, useState } from 'react';

export default function LoadingScreen({ isExiting }: { isExiting?: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-teal-800 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-700 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-teal-400 rounded-full blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -right-40 w-[900px] h-[900px] bg-blue-500 rounded-full blur-3xl opacity-15 animate-float-delayed"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-300 rounded-full blur-3xl opacity-10 animate-float-slow"></div>

        <div className="absolute inset-0 opacity-30 hidden md:block">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 hidden md:block">
          <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="animate-grid-flow" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-6">

        <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto text-center">
          <div className="overflow-hidden">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white animate-text-reveal tracking-tight">
              {Array.from('Building').map((char, i) => (
                <span
                  key={i}
                  className="inline-block animate-char-appear"
                  style={{
                    animationDelay: `${i * 0.02}s`,
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>
          </div>

          <div className="overflow-hidden">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white animate-text-reveal tracking-tight drop-shadow-lg">
              {Array.from('Smarter,').map((char, i) => (
                <span
                  key={i}
                  className="inline-block animate-char-appear"
                  style={{
                    animationDelay: `${0.2 + i * 0.02}s`,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
          </div>

          <div className="overflow-hidden">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white animate-text-reveal tracking-tight">
              {Array.from('Living Better.').map((char, i) => (
                <span
                  key={i}
                  className="inline-block animate-char-appear"
                  style={{
                    animationDelay: `${0.4 + i * 0.02}s`,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
          </div>

          <div className="pt-8 sm:pt-12 overflow-hidden">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-sm sm:text-lg md:text-xl text-teal-200 font-light animate-fade-in-up px-2" style={{ animationDelay: '0.7s' }}>
              {['Prefab Homes', 'Fast Delivery', 'Durable', 'Affordable'].map((text, i) => (
                <span
                  key={i}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 animate-badge-appear whitespace-nowrap"
                  style={{ animationDelay: `${0.8 + i * 0.1}s` }}
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-20 max-w-md mx-auto animate-fade-in px-4" style={{ animationDelay: '1s' }}>
          <div className="relative h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-teal-400/20 to-cyan-400/20 animate-shimmer"></div>
            <div
              className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-slide-right"></div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-teal-200/80 text-sm font-light tracking-wider">
              {Math.min(Math.round(progress), 100)}%
            </span>
          </div>
        </div>
      </div>

      <style>{`
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
        @keyframes particle {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100vh) scale(1); opacity: 0; }
        }
        @keyframes charAppear {
          0% {
            opacity: 0;
            transform: translateY(20px) rotateX(-90deg);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
            filter: blur(0px);
          }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes badgeAppear {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gridFlow {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
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
        .animate-particle {
          animation: particle 6s ease-in infinite;
        }
        .animate-char-appear {
          display: inline-block;
          opacity: 0;
          animation: charAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-text-reveal {
          opacity: 0;
          animation: fadeIn 0.1s forwards;
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-badge-appear {
          opacity: 0;
          animation: badgeAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .animate-slide-right {
          animation: slideRight 1s ease-in-out infinite;
        }
        .animate-grid-flow {
          animation: gridFlow 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
