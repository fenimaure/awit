import { Home, Zap, Shield, DollarSign, Clock, Award, ChevronRight, Hammer, Lightbulb, Leaf, Star, ChevronDown, Send, Menu, X, Phone, Mail, MapPin, CheckCircle, Trophy, Briefcase } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Gallery3D from './components/Gallery3D';
import LoadingScreen from './components/LoadingScreen';
import LogoDisplay from './components/LogoDisplay';
import HorizontalCardScroller from './components/HorizontalCardScroller';
import MobileBottomNav from './components/MobileBottomNav';
import { getStoredImageUrl, hasStoredImage } from './components/AdminPanel';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex justify-between items-center active:bg-gray-50 transition-colors text-left touch-manipulation touch-target"
        aria-expanded={open}
      >
        <span className="font-semibold text-blue-900 text-sm sm:text-base pr-4">{question}</span>
        <ChevronDown
          className={`text-teal-600 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>
      <div className={`accordion-content ${open ? 'accordion-open' : ''}`}>
        <div className="accordion-inner">
          <div className="px-5 py-4 bg-gray-50/80 border-t border-gray-100">
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const heroVideoUrl = '/hero.mp4';
  const heroImageUrl = getStoredImageUrl('hero-bg-image', '');

  // Throttled scroll handler — only update scrolled state
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active section tracking (replaces expensive getBoundingClientRect)
  useEffect(() => {
    const sections = ['home', 'about', 'features', 'prefab-types', 'benefits', 'trust', 'services', 'process', 'projects', 'testimonials', 'contact', 'faq'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsExiting(true);
      setShowLogo(true);
      setTimeout(() => setIsLoading(false), 800);
    }, 1200);
    return () => clearTimeout(loadingTimer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Features' },
    { id: 'prefab-types', label: 'Types' },
    { id: 'process', label: 'Process' },
    { id: 'projects', label: 'Gallery' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-white main-content lg:!pb-0">
      {isLoading && <LoadingScreen isExiting={isExiting} />}
      {showLogo && <LogoDisplay onComplete={() => setShowLogo(false)} />}
      <MobileBottomNav isVisible={true} onNavigate={scrollToSection} activeSection={activeSection} />
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-2 sm:py-3' : 'bg-white/95 backdrop-blur-sm shadow-sm py-3 sm:py-4'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center touch-manipulation"
              aria-label="Go to home"
            >
              <img
                src={getStoredImageUrl('logo', '/logo.jpg')}
                alt="Quick Home Prefab"
                className={`transition-all duration-300 ${scrolled ? 'h-10 sm:h-12' : 'h-12 sm:h-14'}`}
              />
            </button>

            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${activeSection === item.id
                    ? 'text-teal-600 bg-teal-50'
                    : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              <a
                href="tel:5551234567"
                className="text-gray-700 hover:text-teal-600 transition-colors p-2"
                aria-label="Call us"
              >
                <Phone size={20} />
              </a>
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-2.5 rounded-lg active:scale-[0.97] transition-transform duration-150 font-medium shadow-md touch-manipulation"
              >
                Get Started
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-teal-600 active:text-teal-700 transition-colors p-2 touch-manipulation"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} onClick={() => setMobileMenuOpen(false)} />

      <div className={`fixed right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
          <img
            src={getStoredImageUrl('logo', '/logo.jpg')}
            alt="Quick Home Prefab"
            className="h-10 sm:h-12"
          />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-700 hover:text-teal-600 active:text-teal-700 transition-colors p-2 touch-manipulation"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 sm:p-6 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full text-left px-4 py-3.5 rounded-lg font-semibold transition-all min-h-[48px] touch-manipulation ${activeSection === item.id
                ? 'text-teal-600 bg-teal-50 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-gray-200 bg-white">
          <button
            onClick={() => scrollToSection('contact')}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3.5 rounded-lg hover:from-teal-700 hover:to-teal-800 active:from-teal-800 active:to-teal-900 transition-all font-bold shadow-lg min-h-[52px] touch-manipulation"
          >
            Get Started
          </button>
          <a
            href="tel:5551234567"
            className="flex items-center justify-center gap-2 mt-3 text-gray-600 hover:text-teal-600 active:text-teal-700 transition-colors py-2 touch-manipulation"
          >
            <Phone size={18} />
            <span className="font-medium">(555) 123-4567</span>
          </a>
        </div>
      </div>

      <section id="home" className="relative hero-fullscreen flex items-end justify-center overflow-hidden bg-slate-900">
        {/* Background Media */}
        <div className="absolute inset-0 z-0">
          {heroVideoUrl && !videoError ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/hero.png"
              className="w-full h-full object-cover img-cover"
              key={heroVideoUrl}
              onError={() => setVideoError(true)}
              preload="metadata"
            >
              <source src={heroVideoUrl} type="video/mp4" />
            </video>
          ) : heroImageUrl ? (
            <img
              src={heroImageUrl}
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-950 via-blue-900 to-teal-700 relative overflow-hidden">
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-400 rounded-full opacity-20" style={{ filter: 'blur(80px)' }} />
              <div className="absolute -bottom-20 -right-40 w-full h-96 bg-blue-600 rounded-full opacity-15" style={{ filter: 'blur(80px)' }} />
            </div>
          )}

          {/* Cinematic Gradient Overlay - clear top, dark bottom for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        </div>

        {/* Minimal Bottom-Anchored Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 text-center sm:text-left pb-24 sm:pb-28 mb-safe">
          <div className="max-w-xl mx-auto sm:mx-0 animate-fade-in-up">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-200 text-xs font-medium tracking-wide">
              <Star size={12} className="fill-teal-200" />
              <span>PREMIUM PREFAB HOMES</span>
            </div>

            {/* Punchy Headline */}
            <h1 className="hero-headline font-bold text-white mb-4">
              Building Smarter, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-cyan-200">
                Living Better.
              </span>
            </h1>

            {/* Micro-copy features */}
            <p className="text-teal-100/90 hero-subtext mb-6 sm:mb-8 font-medium tracking-wide mx-auto sm:mx-0">
              Prefab Homes • Fast Delivery • Durable • Affordable
            </p>

            {/* Single Primary Action */}
            <button
              onClick={() => scrollToSection('projects')}
              className="w-full sm:w-auto bg-white text-slate-900 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] active:scale-[0.98] transition-all duration-200 touch-manipulation touch-target flex items-center justify-center gap-2 group"
            >
              Explore Our Homes
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>
        </div>
      </section>


      <section id="about" className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] sm:aspect-square rounded-2xl shadow-2xl relative overflow-hidden">
                <img
                  src={getStoredImageUrl('prefab-about', '/images/prefab-about.svg')}
                  alt="Quick Home Prefab Building"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-teal-400 rounded-full opacity-20 blur-3xl"></div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-6">
                About Quick Home Prefab
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                With over 15 years of experience in prefab home construction, Quick Home Prefab has established itself as the leading provider of innovative housing solutions in the Philippines. Our team of dedicated architects, engineers, and construction specialists are committed to revolutionizing the way homes are built.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <Briefcase className="text-teal-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-1">15+ Years of Experience</h3>
                    <p className="text-gray-600">Serving Filipino families with innovative housing solutions since 2009</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <MapPin className="text-teal-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-1">Local Expertise in the Philippines</h3>
                    <p className="text-gray-600">Deep understanding of local climate, building codes, and community needs across all regions</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <Home className="text-teal-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-1">500+ Happy Families</h3>
                    <p className="text-gray-600">Trusted by thousands of homeowners who now live in their dream homes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">Key Benefits of Our Homes</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Everything you need, nothing you don't</p>
          </div>

          <HorizontalCardScroller>
            {[
              { icon: Clock, title: 'Fast Construction', desc: '3-4 months from concept to completion. Build faster than traditional methods without sacrificing quality.' },
              { icon: DollarSign, title: 'Affordable Pricing', desc: 'Competitive prices that don\'t compromise on quality. More house for your budget means smart investment.' },
              { icon: Hammer, title: 'Customizable Designs', desc: 'Personalize every detail. From layout to finishes, create the exact home you\'ve always imagined.' },
              { icon: MapPin, title: 'Local Expertise', desc: 'Deep-rooted in Philippine communities. We understand regional needs, climate, and preferences perfectly.' },
            ].map((feature, i) => (
              <div key={i} className="group bg-white p-5 sm:p-8 rounded-2xl shadow-md active:shadow-lg transition-shadow duration-300 border border-gray-100 mobile-card snap-center lg:min-w-0">
                <div className="bg-gradient-to-br from-teal-100 to-teal-50 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <feature.icon className="text-teal-600" size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{feature.desc}</p>
              </div>
            ))}
          </HorizontalCardScroller>
        </div>
      </section>

      <section id="prefab-types" className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">Prefab Types We Offer</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Versatile solutions for every need</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-teal-300 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48 sm:h-72 overflow-hidden bg-gray-200">
                <img
                  src={getStoredImageUrl('prefab-residential', '/images/prefab-residential.svg')}
                  alt="Houses"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="absolute top-4 left-4 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                  RESIDENTIAL
                </div>
              </div>
              <div className="p-5 sm:p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Houses</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Beautiful, energy-efficient homes designed for modern living. Perfect for families looking for quality housing with quick delivery.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Size:</strong> 50-200 sqm</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Materials:</strong> Steel frame, insulated panels</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Lead Time:</strong> 3-4 months</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Features:</strong> 2-4 bedrooms, modern amenities</span>
                  </div>
                </div>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full bg-gradient-to-r from-teal-600 to-blue-900 text-white py-3 rounded-lg hover:from-teal-700 hover:to-blue-950 transition-all font-semibold flex items-center justify-center gap-2 group/btn"
                >
                  Learn More
                  <ChevronRight className="group-hover/btn:translate-x-1 transition-transform" size={18} />
                </button>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-teal-300 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48 sm:h-72 overflow-hidden bg-gray-200">
                <img
                  src={getStoredImageUrl('prefab-commercial', '/images/prefab-commercial.svg')}
                  alt="Offices & Commercial Spaces"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                  COMMERCIAL
                </div>
              </div>
              <div className="p-5 sm:p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Offices & Commercial Spaces</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Professional workspaces built to spec. Ideal for startups, branch offices, and growing businesses needing flexible solutions.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Size:</strong> 30-500 sqm</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Materials:</strong> Commercial-grade steel, fire-resistant</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Lead Time:</strong> 2-3 months</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Features:</strong> Open layouts, modern HVAC, IT-ready</span>
                  </div>
                </div>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full bg-gradient-to-r from-teal-600 to-blue-900 text-white py-3 rounded-lg hover:from-teal-700 hover:to-blue-950 transition-all font-semibold flex items-center justify-center gap-2 group/btn"
                >
                  Learn More
                  <ChevronRight className="group-hover/btn:translate-x-1 transition-transform" size={18} />
                </button>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-teal-300 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48 sm:h-72 overflow-hidden bg-gray-200">
                <img
                  src={getStoredImageUrl('prefab-modular', '/images/prefab-modular.svg')}
                  alt="Modular Units"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="absolute top-4 left-4 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                  MODULAR
                </div>
              </div>
              <div className="p-5 sm:p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Modular Units</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Expandable and stackable units perfect for temporary housing, dormitories, classrooms, or multi-purpose facilities.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Size:</strong> 15-60 sqm per unit</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Materials:</strong> Lightweight steel, weatherproof panels</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Lead Time:</strong> 4-8 weeks</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700"><strong>Features:</strong> Stackable, relocatable, expandable</span>
                  </div>
                </div>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full bg-gradient-to-r from-teal-600 to-blue-900 text-white py-3 rounded-lg hover:from-teal-700 hover:to-blue-950 transition-all font-semibold flex items-center justify-center gap-2 group/btn"
                >
                  Learn More
                  <ChevronRight className="group-hover/btn:translate-x-1 transition-transform" size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-6">
                The Future of Home Building
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
                Our prefabricated homes combine cutting-edge technology with sustainable practices
                to deliver exceptional living spaces. Each home is precision-engineered in our
                state-of-the-art facility, ensuring consistent quality and reduced construction time.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Zap, title: 'Energy Efficient', desc: 'Advanced insulation and smart design reduce energy costs significantly.' },
                  { icon: Award, title: 'Quality Assured', desc: 'Every component is inspected and tested before installation.' },
                  { icon: Home, title: 'Customizable Designs', desc: 'Tailor your home to match your lifestyle and preferences.' },
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="bg-teal-500 rounded-full p-2 flex-shrink-0">
                      <benefit.icon className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900 mb-1">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="aspect-[4/3] sm:aspect-square bg-gradient-to-br from-blue-900 to-teal-600 rounded-2xl shadow-2xl relative overflow-hidden">
                {hasStoredImage('benefits-image') ? (
                  <img
                    src={getStoredImageUrl('benefits-image', '')}
                    alt="The Future of Home Building"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Home className="text-white/20" size={200} />
                    </div>
                  </>
                )}
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-teal-400 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">Why Our Clients Trust Us</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Industry recognition and proven credentials</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            <div className="bg-white p-6 sm:p-8 rounded-xl border-2 border-teal-100 hover:border-teal-300 transition-all shadow-sm hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="text-teal-600 flex-shrink-0" size={32} />
                <div>
                  <h3 className="text-2xl font-bold text-blue-900">Best Builder</h3>
                  <p className="text-sm text-gray-500">2023 Philippines</p>
                </div>
              </div>
              <p className="text-gray-600">Award-winning prefab construction excellence recognized by the National Housing Association</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl border-2 border-teal-100 hover:border-teal-300 transition-all shadow-sm hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-teal-600 flex-shrink-0" size={32} />
                <div>
                  <h3 className="text-2xl font-bold text-blue-900">ISO 9001</h3>
                  <p className="text-sm text-gray-500">Quality Certified</p>
                </div>
              </div>
              <p className="text-gray-600">International quality management system certification ensuring consistent excellence</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl border-2 border-teal-100 hover:border-teal-300 transition-all shadow-sm hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Award className="text-teal-600 flex-shrink-0" size={32} />
                <div>
                  <h3 className="text-2xl font-bold text-blue-900">Green Building</h3>
                  <p className="text-sm text-gray-500">Certified Partner</p>
                </div>
              </div>
              <p className="text-gray-600">Recognized partner in sustainable and eco-friendly construction initiatives</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: '15+', label: 'Years in Business', icon: Briefcase },
              { number: '98%', label: 'Client Satisfaction', icon: Star },
              { number: '500+', label: 'Homes Delivered', icon: Home },
              { number: '50', label: 'Awards Won', icon: Trophy },
            ].map((stat, i) => (
              <div key={i} className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 sm:p-8 rounded-xl border border-teal-100 text-center hover:shadow-lg transition-all">
                <stat.icon className="text-teal-600 mx-auto mb-3" size={40} />
                <div className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 bg-gradient-to-r from-blue-900 to-teal-600 rounded-2xl p-6 sm:p-12 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Philippine Building Code Compliant</h3>
            <p className="text-lg text-blue-100 mb-6">All our homes meet and exceed the Philippines' Building Code requirements. We're licensed and registered with the Housing and Land Use Regulatory Board (HLURB) and comply with all regional construction standards.</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={24} className="flex-shrink-0" />
                <span>HLURB Licensed Developer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={24} className="flex-shrink-0" />
                <span>NHMFC Accredited</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={24} className="flex-shrink-0" />
                <span>Full BIR Compliance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">Our Services</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Complete solutions for your prefab home journey</p>
          </div>

          <HorizontalCardScroller>
            {[
              { icon: Hammer, title: 'Custom Design', desc: 'Personalized floor plans tailored to your specific needs and preferences.' },
              { icon: Lightbulb, title: 'Smart Home Integration', desc: 'Built-in automation and energy management systems for modern living.' },
              { icon: Leaf, title: 'Eco-Friendly Options', desc: 'Sustainable materials and carbon-neutral construction methods available.' },
              { icon: Home, title: 'Installation Support', desc: 'Professional on-site installation and setup guidance included.' },
              { icon: Shield, title: 'Extended Warranty', desc: '10-year comprehensive warranty covering structural and mechanical components.' },
              { icon: DollarSign, title: 'Financing Options', desc: 'Flexible payment plans and partnerships with leading financial institutions.' },
            ].map((service, i) => (
              <div key={i} className="bg-white p-5 sm:p-8 rounded-xl border border-teal-100 transition-shadow duration-300 shadow-sm active:shadow-md mobile-card snap-center lg:min-w-0">
                <service.icon className="text-teal-600 mb-4" size={28} />
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{service.desc}</p>
              </div>
            ))}
          </HorizontalCardScroller>
        </div>
      </section>

      <section id="process" className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Simple, transparent process from start to finish</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-4">
            {[
              {
                icon: Lightbulb,
                title: 'Choose Your Design',
                desc: 'Browse our catalog or share your vision. Select from houses, offices, or modular units that fit your needs.'
              },
              {
                icon: Hammer,
                title: 'Customize Your Layout',
                desc: 'Work with our designers to personalize floor plans, finishes, and features. Make it uniquely yours.'
              },
              {
                icon: Award,
                title: 'Prefab Units Are Built',
                desc: 'Precision manufacturing in our controlled facility. Quality-checked at every stage for excellence.'
              },
              {
                icon: Home,
                title: 'Delivered & Assembled',
                desc: 'Professional delivery to your site. Expert installation ensures everything is perfect and ready.'
              },
              {
                icon: CheckCircle,
                title: 'Move In & Enjoy',
                desc: 'Final walkthrough and handover. Start living in your dream space with ongoing support.'
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                {i < 4 && (
                  <div className="hidden lg:block absolute top-14 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-teal-500 to-teal-300 z-0">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                      <ChevronRight className="text-teal-500" size={20} />
                    </div>
                  </div>
                )}
                <div className="relative z-10 bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-200 hover:border-teal-400 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="bg-gradient-to-br from-teal-500 to-blue-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                    <step.icon className="text-white" size={24} />
                  </div>
                  <div className="text-center">
                    <div className="text-xs sm:text-sm font-bold text-teal-600 mb-1 sm:mb-2">STEP {i + 1}</div>
                    <h3 className="text-sm sm:text-lg font-bold text-blue-900 mb-2 sm:mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-gradient-to-r from-teal-600 to-blue-900 text-white px-8 py-4 rounded-lg active:scale-[0.97] transition-transform duration-150 font-semibold text-lg shadow-lg inline-flex items-center gap-2 touch-manipulation touch-target"
            >
              Start Your Project Today
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      <section id="projects" className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">3D Portfolio Gallery</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Explore our completed projects in an immersive 3D experience</p>
          </div>

          <Gallery3D />

          <div className="mt-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">Featured Projects</h3>
              <p className="text-gray-600">Explore more of our exceptional work</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600 overflow-hidden">
                {hasStoredImage('featured-project-1') ? (
                  <img
                    src={getStoredImageUrl('featured-project-1', '')}
                    alt="Modern Family Home"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Home className="text-white/60 group-hover:scale-110 transition-transform duration-500" size={140} />
                    </div>
                  </>
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute top-3 left-3 sm:top-6 sm:left-6 space-y-2">
                  <div className="bg-teal-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold inline-block">
                    RESIDENTIAL
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold inline-block ml-2">
                    Featured Project
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-8 text-white">
                <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Modern Family Home</h3>
                <p className="text-blue-100 mb-2 sm:mb-4 text-xs sm:text-base">3-bedroom contemporary design with open floor plan and eco-friendly features</p>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <div className="text-blue-200">Size</div>
                    <div className="font-semibold">120 sqm</div>
                  </div>
                  <div>
                    <div className="text-blue-200">Location</div>
                    <div className="font-semibold">Manila</div>
                  </div>
                  <div>
                    <div className="text-blue-200">Completed</div>
                    <div className="font-semibold">2024</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-teal-700 via-teal-600 to-blue-700 overflow-hidden">
                {hasStoredImage('featured-project-2') ? (
                  <img
                    src={getStoredImageUrl('featured-project-2', '')}
                    alt="Tech Startup Office"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.1),transparent)]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Briefcase className="text-white/60 group-hover:scale-110 transition-transform duration-500" size={140} />
                    </div>
                  </>
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute top-3 left-3 sm:top-6 sm:left-6">
                  <div className="bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold inline-block">
                    COMMERCIAL
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-8 text-white">
                <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Tech Startup Office</h3>
                <p className="text-blue-100 mb-2 sm:mb-4 text-xs sm:text-base">Modern workspace with flexible layouts and smart building systems</p>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <div className="text-blue-200">Size</div>
                    <div className="font-semibold">250 sqm</div>
                  </div>
                  <div>
                    <div className="text-blue-200">Location</div>
                    <div className="font-semibold">Cebu</div>
                  </div>
                  <div>
                    <div className="text-blue-200">Completed</div>
                    <div className="font-semibold">2023</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <HorizontalCardScroller showArrows={false}>
            {[
              { name: 'Coastal Villa', type: 'Residential', size: '180', location: 'Batangas', bedrooms: '4', imageKey: 'project-coastal-villa' },
              { name: 'Eco-Friendly Home', type: 'Residential', size: '95', location: 'Tagaytay', bedrooms: '2', imageKey: 'project-eco-home' },
              { name: 'Medical Clinic', type: 'Commercial', size: '150', location: 'Quezon City', bedrooms: null, imageKey: 'project-medical-clinic' },
              { name: 'Resort Cottages', type: 'Modular', size: '45', location: 'Palawan', bedrooms: '1', imageKey: 'project-resort-cottages' },
              { name: 'Student Dormitory', type: 'Modular', size: '500', location: 'Baguio', bedrooms: '20', imageKey: 'project-student-dorm' },
              { name: 'Retail Space', type: 'Commercial', size: '200', location: 'Makati', bedrooms: null, imageKey: 'project-retail-space' },
            ].map((project, i) => (
              <div key={i} className="group overflow-hidden rounded-xl shadow-md active:shadow-lg transition-shadow duration-300 bg-white border border-gray-200 mobile-card snap-center lg:min-w-0">
                <div className="relative h-44 sm:h-56 bg-gradient-to-br from-blue-800 via-teal-600 to-blue-900 overflow-hidden">
                  {hasStoredImage(project.imageKey) ? (
                    <img
                      src={getStoredImageUrl(project.imageKey, '')}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        {project.type === 'Residential' && <Home className="text-white/70 group-hover:scale-110 transition-transform duration-300" size={64} />}
                        {project.type === 'Commercial' && <Briefcase className="text-white/70 group-hover:scale-110 transition-transform duration-300" size={64} />}
                        {project.type === 'Modular' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg"></div>
                            <div className="w-10 h-10 bg-white/30 rounded-lg"></div>
                            <div className="w-10 h-10 bg-white/30 rounded-lg"></div>
                            <div className="w-10 h-10 bg-white/20 rounded-lg"></div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute top-4 left-4 bg-white/90 text-blue-900 px-3 py-1 rounded-full text-xs font-bold">
                    {project.type.toUpperCase()}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/40 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={14} />
                        <span className="font-medium">{project.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-blue-900 mb-3">{project.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Size:</span>
                      <span className="font-semibold text-blue-900">{project.size} sqm</span>
                    </div>
                    {project.bedrooms && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bedrooms:</span>
                        <span className="font-semibold text-blue-900">{project.bedrooms}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </HorizontalCardScroller>

          <div className="mt-8 sm:mt-12 bg-gradient-to-r from-blue-900 to-teal-600 rounded-2xl p-6 sm:p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Want to See More?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">Schedule a virtual tour or visit our showroom to explore our full portfolio of completed projects and current designs.</p>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-white text-blue-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition-all font-semibold inline-flex items-center gap-2 shadow-lg"
            >
              Schedule a Tour
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Real reviews from satisfied homeowners</p>
          </div>

          <HorizontalCardScroller showArrows={false}>
            {[
              {
                name: "Sarah Johnson",
                role: "Homeowner",
                text: "The entire process was seamless. From consultation to move-in, Quick Home Prefab exceeded all my expectations. My new home is everything I dreamed of!",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Business Owner",
                text: "Incredible quality and craftsmanship. The fast delivery timeline was crucial for my project, and they delivered perfectly. Highly recommend!",
                rating: 5
              },
              {
                name: "Emma Williams",
                role: "Environmental Advocate",
                text: "Finally, a company that truly cares about sustainability. My eco-friendly prefab home is beautiful, affordable, and guilt-free. Thank you!",
                rating: 5
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-blue-50 p-5 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-100 mobile-card snap-center lg:min-w-0">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="text-yellow-400 fill-yellow-400" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-blue-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </HorizontalCardScroller>
        </div>
      </section>

      <section id="contact" className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Get Your Free Consultation</h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">Let's discuss your dream home. Fill out the form below and we'll be in touch within 24 hours.</p>
          </div>

          <div className="bg-white p-5 sm:p-8 md:p-12 rounded-2xl shadow-2xl">
            {submitted && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 flex items-center gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="font-semibold">Thank you! We'll be in touch within 24 hours.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full text-base px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full text-base px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
                />
              </div>

              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-base px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
              />

              <textarea
                placeholder="Tell us about your project"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full text-base px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 resize-none transition-all"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-blue-900 text-white px-8 py-4 rounded-lg active:scale-[0.97] transition-transform duration-150 font-semibold text-lg flex items-center justify-center gap-2 shadow-lg touch-manipulation touch-target"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section id="faq" className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Find answers to common questions about our homes</p>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="What is the typical timeline for delivery?"
              answer="Most projects take 3-4 months from consultation to delivery, significantly faster than traditional construction. The exact timeline depends on design complexity and site preparation."
            />
            <FAQItem
              question="Can I customize the home design?"
              answer="Absolutely! We offer complete customization options. Our design team will work with you to create a home that perfectly matches your vision and requirements."
            />
            <FAQItem
              question="What warranty do you provide?"
              answer="We provide a comprehensive 10-year warranty covering all structural and mechanical components. We stand behind the quality of every home we build."
            />
            <FAQItem
              question="Are your homes energy efficient?"
              answer="Yes! Our homes use advanced insulation, high-performance windows, and smart HVAC systems. Many customers report 40-50% lower energy bills compared to traditional homes."
            />
            <FAQItem
              question="Do you offer financing options?"
              answer="We partner with leading financial institutions to offer flexible financing solutions. Our team can discuss payment plans that work for your budget."
            />
            <FAQItem
              question="How sustainable are prefab homes?"
              answer="Very! Our manufacturing process minimizes waste, we use eco-friendly materials, and our efficient construction reduces environmental impact significantly."
            />
          </div>
        </div>
      </section>

      <footer className="bg-blue-900 text-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <img
                src={getStoredImageUrl('logo', '/logo.jpg')}
                alt="Quick Home Prefab"
                className="h-16 w-auto mb-4 brightness-0 invert"
                loading="lazy"
              />
              <p className="text-blue-200 leading-relaxed">
                Building smarter, living better with innovative prefab solutions.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-blue-200">
                {navItems.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <button onClick={() => scrollToSection(item.id)} className="hover:text-teal-400 transition-colors">
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Services</h3>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Custom Design</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Smart Homes</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Eco-Friendly</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Installation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-3 text-blue-200">
                <li className="flex items-start gap-2">
                  <Mail size={18} className="flex-shrink-0 mt-1" />
                  <a href="mailto:info@quickhomeprefab.com" className="hover:text-teal-400 transition-colors">
                    info@quickhomeprefab.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone size={18} className="flex-shrink-0 mt-1" />
                  <a href="tel:5551234567" className="hover:text-teal-400 transition-colors">
                    (555) 123-4567
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={18} className="flex-shrink-0 mt-1" />
                  <span>Mon-Fri 9AM-6PM EST</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-blue-300 text-sm">
            <p>&copy; 2024 Quick Home Prefab. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
}

export default App;
