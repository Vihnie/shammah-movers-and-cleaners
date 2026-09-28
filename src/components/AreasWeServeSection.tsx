import React, { useState } from 'react';
import { MapPin, Search, CheckCircle2 } from 'lucide-react';
import { AREAS_SERVED } from '../data/initialData';

export const AreasWeServeSection: React.FC = () => {
  const [postcodeCheck, setPostcodeCheck] = useState<string>('');
  const [checkResult, setCheckResult] = useState<string | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcodeCheck.trim()) return;
    const clean = postcodeCheck.trim().toUpperCase();
    setCheckResult(`✅ Full SwiftMove daily dispatch available in ${clean} with no additional out-of-zone fees.`);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200" id="areas-we-serve">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Nationwide Reach • Local Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Areas We Serve Across the UK
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Operating daily fleets across London, Home Counties, and long-distance intercity UK corridors.
          </p>
        </div>

        {/* Postcode Quick Checker */}
        <div className="max-w-lg mx-auto mb-12 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <form onSubmit={handleCheck} className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Check your postcode (e.g. SW1, W8, RG1, B1)..."
                value={postcodeCheck}
                onChange={(e) => setPostcodeCheck(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Check
            </button>
          </form>
          {checkResult && (
            <div className="mt-3 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 font-medium">
              {checkResult}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {AREAS_SERVED.map((area) => (
            <div
              key={area.name}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400/80 transition-all space-y-2"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <h3 className="font-bold text-sm text-slate-900">{area.name}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">{area.coverage}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
