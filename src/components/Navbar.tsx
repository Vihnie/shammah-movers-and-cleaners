import React, { useState } from 'react';
import { Truck, Phone, Menu, X, ShieldCheck, Calculator, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems = [
    { label: 'Services', view: 'services' },
    { label: 'Price Calculator', view: 'calculator' },
    { label: 'How It Works', view: 'home', hash: 'how-it-works' },
    { label: 'Why Us', view: 'home', hash: 'why-choose-us' },
    { label: 'Coverage Areas', view: 'home', hash: 'areas-we-serve' },
    { label: 'Track Move', view: 'tracking' },
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact' }
  ];

  const handleNavClick = (item: { label: string; view: string; hash?: string }) => {
    setCurrentView(item.view);
    setMobileMenuOpen(false);
    if (item.hash) {
      setTimeout(() => {
        const el = document.getElementById(item.hash!);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md group-hover:bg-amber-400 transition-colors">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
                SwiftMove
              </div>
              <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-widest leading-none mt-1">
                Relocations &amp; Storage
              </div>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`transition-colors hover:text-amber-600 cursor-pointer ${
                  currentView === item.view && !item.hash ? 'text-amber-600' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA & Phone */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="tel:+442079460912"
              className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-amber-600 mr-2"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>020 7946 0912</span>
            </a>

            <button
              onClick={() => setCurrentView('booking')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Book Online</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setCurrentView('booking')}
              className="bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-amber-600 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="tel:+442079460912"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-slate-900 font-bold text-xs"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              <span>Call Dispatch: 020 7946 0912</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
