import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, ShieldCheck, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FooterProps {
  onOpenCalculator?: () => void;
  onOpenBooking?: () => void;
}

export function Footer({ onOpenCalculator, onOpenBooking }: FooterProps) {
  const { navigateTo, settings } = useApp();

  const handleNav = (route: string) => {
    navigateTo(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl p-1.5 flex items-center justify-center shadow-xs">
                <img src="/logo.svg" alt="Shammah Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-black text-2xl text-white italic tracking-tight block leading-none">
                  SHAMMAH
                </span>
                <span className="text-xs text-purple-300 font-extrabold uppercase tracking-widest">
                  Movers & Cleaners Kenya
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Kenya’s premier relocation and deep cleaning service provider. Fully insured transit trucks, trained packing specialists, eco-friendly detergents, and transparent pricing in Kenyan Shillings (Ksh).
            </p>

            <div className="pt-1 text-xs text-slate-300 space-y-1">
              <p>
                <strong className="text-white">M-Pesa Buy Goods Till:</strong>{' '}
                <span className="text-emerald-400 font-mono font-bold">{settings.mpesa_till}</span>
              </p>
              <p>
                <strong className="text-white">Headquarters:</strong>{' '}
                <span>{settings.physical_address}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-900 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Call Shammah"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp}?text=Hello%20Shammah%20Movers%2C%20I%20would%20like%20a%20quotation.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-950 hover:bg-emerald-800 text-emerald-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp Shammah"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-purple-900 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Email Shammah"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-purple-300 mb-4">
              Explore Pages
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('/')} className="hover:text-white transition-colors cursor-pointer">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services')} className="hover:text-white transition-colors cursor-pointer">
                  All 10 Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/quote')} className="hover:text-white transition-colors cursor-pointer">
                  Detailed Price Calculator (Ksh)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/gallery')} className="hover:text-white transition-colors cursor-pointer">
                  Work Gallery & Photos
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/about')} className="hover:text-white transition-colors cursor-pointer">
                  About Our Crew & Fleet
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/faq')} className="hover:text-white transition-colors cursor-pointer">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact Dispatch Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Services */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-purple-300 mb-4">
              Top Services (Ksh)
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('/services/residential-moving')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Residential Home Moving
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services/commercial-moving')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Corporate & Office Relocation
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services/deep-cleaning')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Move-In / Move-Out Deep Clean
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services/carpet-steam')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Carpet & Sofa Steam Wash
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services/packing-unpacking')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Professional Packing & Crating
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services/pest-control')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Fumigation & Pest Control
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Hotline & Portal */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-purple-300 mb-4">
              Operations & Contact
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">Dispatch Lines</span>
                  <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-blue-300 block">
                    {settings.phone}
                  </a>
                  {settings.phone2 && (
                    <a href={`tel:${settings.phone2.replace(/[^0-9+]/g, '')}`} className="hover:text-blue-300 block mt-0.5">
                      {settings.phone2}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">Email Channels</span>
                  <a href={`mailto:${settings.email}`} className="hover:text-purple-300 block break-all">
                    {settings.email}
                  </a>
                  {settings.email2 && (
                    <a href={`mailto:${settings.email2}`} className="hover:text-purple-300 block break-all mt-0.5 text-slate-400">
                      {settings.email2}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">24/7 WhatsApp Desk</span>
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=Hello%20Shammah%20Movers%2C%20I%20would%20like%20a%20quotation.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-300"
                  >
                    +{settings.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Juja (Sanne Square, JKUAT Main Gate) • Nairobi & Countrywide</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleNav('/admin')}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-800 cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-purple-400" />
                  <span>Staff / Admin CRM Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {settings.company_name}. All Rights Reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button onClick={() => handleNav('/privacy')} className="hover:text-slate-300 cursor-pointer">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => handleNav('/terms')} className="hover:text-slate-300 cursor-pointer">
              Terms & Conditions
            </button>
            <span>•</span>
            <span>All Quotes in Kenyan Shillings (Ksh)</span>
            <span>•</span>
            <span className="text-purple-300 font-semibold">Reliable Movers • Spotless Cleaners</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
