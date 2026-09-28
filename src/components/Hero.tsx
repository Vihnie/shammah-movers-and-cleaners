import React from 'react';
import { Truck, ShieldCheck, Star, ArrowRight, CheckCircle2, Calendar, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceType } from '../types';

interface HeroProps {
  onSelectService?: (service: ServiceType) => void;
  onOpenBooking?: () => void;
  onScrollToCalculator?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectService, onOpenBooking, onScrollToCalculator }) => {
  const { setCurrentView } = useApp();

  return (
    <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and Value Props */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-medium text-amber-300">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span>Rated 4.9/5 by 850+ London &amp; UK Homeowners</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Stress-Free Moving, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400">
                Handled With Precision.
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              From historic townhouses to modern office towers, SwiftMove delivers white-glove relocations, full packing, and secure storage with zero hidden fees.
            </p>

            {/* Value checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fixed, transparent price quotes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>£100,000 comprehensive transit cover</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Uniformed, DBS-checked moving crew</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Punctual arrival window guarantee</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => setCurrentView('booking')}
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-7 py-3.5 rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all text-base cursor-pointer"
              >
                <span>Book Your Move Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('calculator')}
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3.5 rounded-lg border border-slate-700 hover:border-slate-600 transition-all text-base cursor-pointer"
              >
                <span>Instant Price Calculator</span>
              </button>
            </div>
          </div>

          {/* Right Column: Quick Rate Card / Feature Highlight */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Instant Move Estimate</h2>
                  <p className="text-xs text-slate-400">Calculate your relocation in 30 seconds</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                  <Truck className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Pickup Location (Postcode / City)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g., Kensington, W8 or London"
                      defaultValue="London, W8"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Destination Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g., Winchester, SO21 or Bristol"
                      defaultValue="Winchester, SO21"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Property Size</label>
                    <select
                      defaultValue="2-bed"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="1-bed">1 Bed Flat</option>
                      <option value="2-bed">2 Bed Home</option>
                      <option value="3-bed">3 Bed House</option>
                      <option value="4-bed">4+ Bed Estate</option>
                      <option value="office">Office Space</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Packing Required</label>
                    <select
                      defaultValue="self"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="self">I will pack myself</option>
                      <option value="fragile">Fragile items only</option>
                      <option value="full">Full packing service</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('calculator')}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
                >
                  <span>Calculate Real-Time Price</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  No card required
                </span>
                <span>•</span>
                <span>Free 14-day price lock</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
