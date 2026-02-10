import { Home, Briefcase, Star, Phone, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MobileBottomNavProps {
  isVisible: boolean;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export default function MobileBottomNav({ isVisible, onNavigate, activeSection }: MobileBottomNavProps) {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    setIsLargeScreen(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsLargeScreen(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  if (!isVisible || isLargeScreen) return null;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'prefab-types', label: 'Types', icon: Briefcase },
    { id: 'projects', label: 'Gallery', icon: Star },
    { id: 'contact', label: 'Contact', icon: MessageCircle },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200/80 shadow-[0_-2px_20px_-4px_rgba(0,0,0,0.12)] pb-safe gpu-accelerated"
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-around px-1 pt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-xl transition-all duration-200 min-w-[64px] touch-manipulation press-scale touch-target ${isActive
                  ? 'text-teal-600'
                  : 'text-gray-500 active:text-teal-600'
                }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Navigate to ${item.label}`}
            >
              <div className={`relative transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-600" />
                )}
              </div>
              <span className={`text-[10px] font-semibold leading-tight ${isActive ? 'text-teal-600' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        <a
          href="tel:+1-555-123-4567"
          className="flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg active:shadow-sm active:scale-95 transition-all duration-150 min-w-[64px] touch-manipulation touch-target"
          aria-label="Call us"
        >
          <Phone size={22} strokeWidth={2} />
          <span className="text-[10px] font-semibold leading-tight">Call</span>
        </a>
      </div>
    </nav>
  );
}
