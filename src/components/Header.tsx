import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Menu,
  X,
  Calculator,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  Lock,
  Layers,
  HelpCircle,
  Image,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TopAnnouncementBar } from './TopAnnouncementBar';

interface HeaderProps {
  onOpenBooking?: () => void;
  onOpenCalculator?: () => void;
}

export function Header({ onOpenBooking, onOpenCalculator }: HeaderProps) {
  const { currentRoute, navigateTo, settings, isAdminAuthenticated } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { route: '/', label: 'Home' },
    { route: '/services', label: 'Services' },
    { route: '/quote', label: 'Get Quote' },
    { route: '/gallery', label: 'Work Gallery' },
    { route: '/about', label: 'About' },
    { route: '/faq', label: 'FAQ' },
    { route: '/contact', label: 'Contact' },
  ];

  const handleNavClick = (route: string) => {
    navigateTo(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="sticky top-0 z-40 bg-white">
      {/* Top Announcement Bar from Settings */}
      <TopAnnouncementBar />

      <header
        className={`transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-slate-200'
            : 'bg-white py-3.5 border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="h-11 w-11 sm:h-12 sm:w-12 bg-white rounded-xl shadow-xs border border-slate-200 p-1 flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/logo.svg" alt="Shammah Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl text-blue-900 tracking-tight leading-none italic">
                  SHAMMAH
                </span>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                  KENYA
                </span>
              </div>
              <span className="text-[10px] sm:text-xs tracking-wider text-slate-500 font-bold uppercase block -mt-0.5">
                Movers & Cleaners
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                currentRoute === item.route ||
                (item.route === '/services' && currentRoute.startsWith('/services/'));
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & Portal Link */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => handleNavClick('/quote')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all hover:scale-102 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-800" />
              <span>Instant Quote</span>
            </button>

            <button
              onClick={() => {
                if (onOpenBooking) {
                  onOpenBooking();
                } else {
                  handleNavClick('/quote');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-800 hover:from-blue-800 hover:to-purple-700 shadow-md shadow-blue-950/15 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4 text-purple-200" />
              <span>Book Move</span>
            </button>

            {/* Portal Link */}
            <button
              onClick={() => handleNavClick('/admin')}
              className={`p-2 rounded-xl border transition-all text-xs font-bold flex items-center gap-1 cursor-pointer ${
                isAdminAuthenticated
                  ? 'bg-purple-50 text-purple-900 border-purple-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title={isAdminAuthenticated ? 'Admin Management Dashboard' : 'Staff Login'}
            >
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden xl:inline">{isAdminAuthenticated ? 'Admin Portal' : 'Staff'}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 animate-fade-in shadow-xl">
            <div className="grid grid-cols-1 gap-1">
              {navItems.map((item) => {
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => handleNavClick(item.route)}
                    className={`w-full px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                      isActive ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => handleNavClick('/admin')}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between text-purple-900 bg-purple-50 hover:bg-purple-100 transition-colors mt-2"
              >
                <span>Staff & Management Portal</span>
                <Lock className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-800 font-bold flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4 text-blue-900" />
                <span>Call {settings.phone}</span>
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp}?text=Hello%20Shammah%20Movers%2C%20I%20would%20like%20a%20quote.`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>
            {settings.phone2 && (
              <div className="pt-1.5 text-center">
                <a
                  href={`tel:${settings.phone2.replace(/[^0-9+]/g, '')}`}
                  className="text-[11px] text-slate-500 hover:text-blue-900 font-semibold inline-flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>Alt Dispatch Line: {settings.phone2}</span>
                </a>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}
