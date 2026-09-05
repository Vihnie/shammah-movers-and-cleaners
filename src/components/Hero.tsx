import React from 'react';
import { Calculator, CalendarCheck, Shield, Sparkles, Truck, Award, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { ServiceType } from '../types';

interface HeroProps {
  onSelectService: (service: ServiceType) => void;
  onOpenBooking: () => void;
  onScrollToCalculator: () => void;
}

export function Hero({ onSelectService, onOpenBooking, onScrollToCalculator }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-blue-900 text-white pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Decorative background gradients & shapes */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-purple-300/30 text-purple-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>5-Star Rated Moving & Deep Cleaning in One Place</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-tight">
              Stress-Free Moving & <br />
              <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-blue-200 bg-clip-text text-transparent italic">
                Spotless Deep Cleaning.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Transparent, upfront pricing based on your square footage and distance. No hidden fees, no surprise surcharges — handled by certified moving crews and professional cleaning specialists.
            </p>

            {/* Quick Service Selection Tabs */}
            <div className="p-2 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl max-w-xl mx-auto lg:mx-0">
              <div className="text-xs text-blue-200 font-semibold px-2 py-1 mb-1 flex items-center justify-between">
                <span>Select Your Service for Instant Pricing:</span>
                <span className="text-[11px] text-purple-300 font-bold">Save 15% on Combo</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    onSelectService('combo');
                    onScrollToCalculator();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all shadow-md active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>Move + Clean</span>
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-normal">Popular</span>
                </button>

                <button
                  onClick={() => {
                    onSelectService('moving');
                    onScrollToCalculator();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <Truck className="w-4 h-4 text-blue-300" />
                  <span>Moving Only</span>
                  <span className="text-[9px] text-blue-200">Truck & Crew</span>
                </button>

                <button
                  onClick={() => {
                    onSelectService('cleaning');
                    onScrollToCalculator();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Cleaning Only</span>
                  <span className="text-[9px] text-blue-200">Deep & Sanitize</span>
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onScrollToCalculator}
                className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-purple-900/40 transition-all hover:scale-105 active:scale-95"
              >
                <Calculator className="w-5 h-5 text-purple-200" />
                <span>Calculate My Estimate</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBooking}
                className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
              >
                <CalendarCheck className="w-5 h-5 text-blue-200 inline mr-2" />
                <span>Direct Booking</span>
              </button>
            </div>

            {/* Trust bullet row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs text-blue-100/80">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Insured & Bonded</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Background-Checked Crew</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start col-span-2 sm:col-span-1">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Eco-Friendly Supplies</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic / Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 text-slate-900 shadow-2xl border-4 border-white/20">
              {/* Top Card Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-900 text-white rounded-xl p-1.5 flex items-center justify-center shadow">
                    <img src="/logo.svg" alt="Shammah Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="font-extrabold text-blue-900 text-sm block">SHAMMAH</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Movers & Cleaners</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-full border border-amber-200 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>4.9 / 5.0</span>
                </div>
              </div>

              {/* Logo Presentation Frame */}
              <div className="bg-gradient-to-b from-slate-50 to-blue-50/50 rounded-2xl p-5 border border-blue-100/60 mb-5 flex flex-col items-center text-center">
                <div className="w-56 h-36 flex items-center justify-center">
                  <img src="/logo.svg" alt="Shammah Brand Graphic" className="w-full h-full object-contain drop-shadow-sm" />
                </div>
                <p className="text-xs text-blue-950 font-semibold mt-1">
                  Commercial & Residential Relocation Specialists
                </p>
              </div>

              {/* Instant Tier Previews */}
              <div className="space-y-2.5 mb-5 text-xs">
                <div className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span className="font-semibold text-slate-700">Essential Package</span>
                  </div>
                  <span className="font-bold text-blue-900">From Ksh. 14,000</span>
                </div>

                <div className="p-2.5 bg-purple-50 rounded-xl border-2 border-purple-400 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    <div>
                      <span className="font-bold text-purple-900">Pro Premium Package</span>
                      <span className="block text-[10px] text-purple-700">Assembly + Deep Clean</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-purple-900 text-sm">Best Value</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-900"></span>
                    <span className="font-semibold text-slate-700">White-Glove VIP</span>
                  </div>
                  <span className="font-bold text-blue-900">Full Packing & Staging</span>
                </div>
              </div>

              {/* Call to calculate button */}
              <button
                onClick={onScrollToCalculator}
                className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Interactive Calculator</span>
                <ArrowRight className="w-4 h-4 text-purple-300" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
