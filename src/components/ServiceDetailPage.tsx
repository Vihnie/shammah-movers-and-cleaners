import React from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Clock, Truck, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SERVICES_DATA } from '../data/initialData';

interface ServiceDetailPageProps {
  slug?: string;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug }) => {
  const { selectedServiceId, setCurrentView } = useApp();

  const targetId = slug && slug !== 'all' ? slug : selectedServiceId;
  const service =
    SERVICES_DATA.find((s) => s.id === targetId) || SERVICES_DATA[0];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[80vh]">
      <div className="max-w-5xl mx-auto space-y-8">
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Services</span>
        </button>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {service.popularFor}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                {service.title}
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">{service.tagline}</p>
            </div>

            <div className="text-left md:text-right bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-400 block">Pricing Starts From</span>
              <span className="text-2xl font-black text-amber-600">{service.priceUnit}</span>
              <span className="text-[10px] text-slate-500 block">inc. goods in transit cover</span>
            </div>
          </div>

          <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <h2 className="text-lg font-bold text-slate-900">Comprehensive Scope of Work</h2>
            <p>{service.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Standard Inclusions With Every Job</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>£100k Insured</span>
              </div>
              <p className="text-slate-600 text-[11px]">All items protected under comprehensive transit policy.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Punctual Arrival</span>
              </div>
              <p className="text-slate-600 text-[11px]">Strict 2-hour morning arrival windows guaranteed.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Modern Clean Fleet</span>
              </div>
              <p className="text-slate-600 text-[11px]">Equipped with hydraulic tail-lifts, straps &amp; padded blankets.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={() => setCurrentView('booking')}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Book This Service Online</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('calculator')}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3.5 px-6 rounded-xl text-xs transition-colors cursor-pointer text-center"
            >
              Calculate Estimated Cost First
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
