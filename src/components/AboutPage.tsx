import React from 'react';
import { ShieldCheck, Award, Users, Truck, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[80vh]">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            About SwiftMove
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Setting the Benchmark for UK Relocations
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Founded with a commitment to eliminate the stress and uncertainty traditionally associated with moving, SwiftMove has grown into one of the UK’s most respected residential and commercial relocation specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Uncompromising Protection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every single move is backed by £100,000 comprehensive goods in transit insurance and performed with premium protective blankets and padded covers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Permanent Trained Staff</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never use casual day-laborers. Our uniformed team members undergo rigorous training in heavy item handling, antique care, and customer etiquette.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Modern Low-Emission Fleet</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              From compact urban Sprinters to 18t pantechnicons, our vehicles are Euro-6 compliant, clean, and fully fitted with hydraulic lifts and air suspension.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Ready to plan your next relocation?</h2>
            <p className="text-xs text-slate-400 mt-1">Get an instant calculation or speak directly with our senior dispatch coordinator.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentView('booking')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Book Online Now
            </button>
            <button
              onClick={() => setCurrentView('calculator')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              Instant Calculator
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
