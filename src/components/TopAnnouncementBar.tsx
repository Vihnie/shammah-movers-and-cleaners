import React from 'react';
import { Phone, ShieldCheck, Clock, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TopAnnouncementBar: React.FC = () => {
  const { setCurrentView, dbConnected } = useApp();

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center flex-wrap gap-4 justify-center sm:justify-start">
          <span className="flex items-center gap-1.5 font-medium text-amber-400">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            £100,000 Goods in Transit Insured
          </span>
          <span className="hidden md:inline-block text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            Mon-Sun: 7:00 AM – 8:00 PM Dispatch
          </span>
          <span className="hidden lg:inline-block text-slate-600">•</span>
          <span className="hidden lg:flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Autumn Booking Offer: Free Mattress Covers Included
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="tel:+442079460912"
            className="flex items-center gap-1.5 font-semibold text-white hover:text-amber-400 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>020 7946 0912</span>
          </a>
          <button
            onClick={() => setCurrentView('tracking')}
            className="text-slate-300 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
          >
            Track My Move
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-0.5 rounded text-[11px] font-medium border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
          >
            Dispatcher Portal
          </button>
        </div>
      </div>
    </div>
  );
};
