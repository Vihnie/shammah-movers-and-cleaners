import React from 'react';
import { Truck, ShieldCheck, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC<{
  onOpenPolicy?: (type: string) => void;
  onOpenCalculator?: () => void;
  onOpenBooking?: () => void;
}> = ({ onOpenPolicy, onOpenCalculator, onOpenBooking }) => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow-sm">
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                SwiftMove <span className="text-amber-400 font-normal text-sm">Relocations</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier UK removals, commercial logistics, and secure climate-controlled storage operator. Fully insured, transparently priced, and trusted by over 12,000 households.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>£100,000 Goods in Transit Policy No. UK-TR-882910</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Services</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentView('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Residential Home Moves
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Office Relocations
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Professional Packing
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Secure Storage
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Piano &amp; Antique Specialists
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Planning</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentView('calculator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Price Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('booking')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Book Move Online
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('tracking')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Live Move Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Our Crew
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Dispatcher Login
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Dispatch Desk</h4>
            <div className="space-y-2 text-xs">
              <a href="tel:+442079460912" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>020 7946 0912</span>
              </a>
              <a href="mailto:dispatch@swiftmove.co.uk" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>dispatch@swiftmove.co.uk</span>
              </a>
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Kensington Logistics Depot, London W14 8DJ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Accreditations */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} SwiftMove Relocations &amp; Storage Ltd. Registered in England &amp; Wales.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenPolicy?.('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Business
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicy?.('insurance')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Insurance Summary
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicy?.('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
