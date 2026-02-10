import { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { getStoredImageUrl } from './AdminPanel';

export default function FloatingFAB({ isVisible }: { isVisible: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePhoneClick = () => {
    window.location.href = 'tel:+1-555-123-4567';
    setIsOpen(false);
  };

  const handleMessengerClick = () => {
    window.open('https://m.me/quickhomeprefab', '_blank');
    setIsOpen(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 flex flex-col items-end gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {isOpen && (
        <>
          <div className="absolute bottom-20 lg:bottom-24 right-0 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              onClick={handlePhoneClick}
              className="group flex items-center gap-3 bg-white hover:bg-gray-50 active:bg-gray-100 text-blue-900 px-5 py-3.5 rounded-full shadow-xl border-2 border-blue-200 hover:border-blue-400 transition-all hover:scale-105 active:scale-95 font-semibold text-sm min-h-[48px] touch-manipulation"
            >
              <Phone className="group-hover:animate-bounce flex-shrink-0" size={20} />
              <span>Call Us</span>
            </button>
            <button
              onClick={handleMessengerClick}
              className="group flex items-center gap-3 bg-white hover:bg-gray-50 active:bg-gray-100 text-blue-900 px-5 py-3.5 rounded-full shadow-xl border-2 border-blue-200 hover:border-blue-400 transition-all hover:scale-105 active:scale-95 font-semibold text-sm min-h-[48px] touch-manipulation"
            >
              <MessageCircle className="group-hover:animate-bounce flex-shrink-0" size={20} />
              <span>Message</span>
            </button>
          </div>

          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 transform hover:scale-110 active:scale-95 touch-manipulation ${isOpen
          ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800'
          : 'bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 active:from-teal-800 active:to-teal-900'
          }`}
        aria-label="Contact options"
      >
        {isOpen ? (
          <X size={26} className="text-white animate-spin-fast" />
        ) : (
          <img
            src={getStoredImageUrl('logo', '/logo.jpg')}
            alt="Quick Home Prefab"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover group-hover:scale-110 transition-transform"
          />
        )}
        <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse group-hover:bg-white/30 transition-all"></div>
      </button>
    </div>
  );
}
