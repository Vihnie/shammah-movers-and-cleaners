import React from 'react';
import { CASE_STUDIES } from '../data/initialData';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BeforeAfterSection: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200" id="showcase">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Proven Track Record
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Real Relocations Executed With Flawless Precision
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Take a closer look at recent residential and corporate logistics managed by our senior dispatch team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {CASE_STUDIES.map((cs) => (
            <div
              key={cs.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col"
            >
              <div className="h-56 overflow-hidden relative">
                <img
                  src={cs.image}
                  alt={cs.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-slate-700">
                  {cs.route}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{cs.title}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Property</span>
                      <span className="font-semibold text-slate-800">{cs.property}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Volume / Fleet</span>
                      <span className="font-semibold text-slate-800">{cs.volume}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-emerald-800 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{cs.outcome}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Turnaround: {cs.duration}</span>
                  <button
                    onClick={() => setCurrentView('booking')}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Request Similar Move</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
