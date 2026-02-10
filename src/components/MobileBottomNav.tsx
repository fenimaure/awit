import { Home, Briefcase, Star, Phone, MessageCircle } from 'lucide-react';

interface MobileBottomNavProps {
  isVisible: boolean;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export default function MobileBottomNav({ isVisible, onNavigate, activeSection }: MobileBottomNavProps) {
  if (!isVisible) return null;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'prefab-types', label: 'Types', icon: Briefcase },
    { id: 'projects', label: 'Gallery', icon: Star },
    { id: 'contact', label: 'Contact', icon: MessageCircle },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-300 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[70px] touch-manipulation ${isActive
                  ? 'text-teal-600 bg-teal-50 scale-105'
                  : 'text-gray-600 hover:text-teal-600 active:scale-95'
                }`}
            >
              <Icon size={22} className={`transition-all ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-xs font-semibold ${isActive ? 'text-teal-600' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        <a
          href="tel:+1-555-123-4567"
          className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-lg hover:shadow-xl active:scale-95 transition-all min-w-[70px] touch-manipulation"
        >
          <Phone size={22} />
          <span className="text-xs font-semibold">Call</span>
        </a>
      </div>
    </div>
  );
}
