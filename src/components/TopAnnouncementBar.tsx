import React from 'react';
import { Phone, MessageCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function TopAnnouncementBar() {
  const { settings } = useApp();

  if (!settings.announcement_active) return null;

  return (
    <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-blue-100 text-xs py-1.5 px-4 border-b border-blue-900/40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white tracking-wide">
            {settings.announcement_text}
          </span>
          <span className="hidden md:inline text-blue-300/60">•</span>
          <span className="hidden md:flex items-center gap-1 text-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Vetted Crew & Up to 100% Care Guarantee
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold ml-auto">
          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center gap-1 text-blue-200 hover:text-white transition-colors"
            title="Call Primary Line"
          >
            <Phone className="w-3 h-3 text-purple-300" />
            <span className="hidden sm:inline">Call:</span> {settings.phone}
          </a>
          {settings.phone2 && (
            <>
              <span className="text-blue-700">/</span>
              <a
                href={`tel:${settings.phone2.replace(/[^0-9+]/g, '')}`}
                className="text-blue-200 hover:text-white transition-colors"
                title="Call Alternative Line"
              >
                {settings.phone2}
              </a>
            </>
          )}
          <span className="text-blue-700">|</span>
          <a
            href={`https://wa.me/${settings.whatsapp}?text=Hello%20Shammah%20Movers%2C%20I%20would%20like%20to%20inquire%20about%20your%20services`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
