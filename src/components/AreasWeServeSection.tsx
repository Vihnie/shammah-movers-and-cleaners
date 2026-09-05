import React from 'react';
import { MapPin, Navigation, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_AREAS } from '../data/initialData';

export function AreasWeServeSection() {
  const { navigateTo } = useApp();

  return (
    <section id="areas-we-serve" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Navigation className="w-3.5 h-3.5" />
            Extensive Kenyan Coverage
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Areas We Serve
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Our modern fleet covers metropolitan Nairobi, the Thika Superhighway corridor, satellite commuter towns, and cross-county long-distance routes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_AREAS.map((region, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {region.name}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {region.areas.map((area, aIdx) => (
                    <span
                      key={aIdx}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-blue-50 hover:text-blue-900 transition-colors"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Daily Fleet Dispatches
                </span>
                <button
                  onClick={() => navigateTo('/get-a-quote')}
                  className="font-bold text-blue-900 hover:text-blue-700 flex items-center gap-0.5"
                >
                  <span>Book Area</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
