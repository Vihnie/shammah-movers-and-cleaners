import React from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, Truck, Clock, Award, Star } from 'lucide-react';
import { PackageTierId, CalculatorState } from '../types';
import { PACKAGE_TIERS } from '../data/mockData';
import { calculatePrice, formatCurrency } from '../utils/pricing';

interface PackageTiersProps {
  calcState: CalculatorState;
  onSelectTier: (tierId: PackageTierId) => void;
}

export function PackageTiers({ calcState, onSelectTier }: PackageTiersProps) {
  return (
    <section id="packages" className="py-16 bg-white relative border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tailored Relocation & Cleaning Packages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparent Package Tiers
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Choose the level of service that fits your moving timeline, delicate items, and budget.
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PACKAGE_TIERS.map((tier) => {
            const isPopular = tier.popular;
            const price = calculatePrice({ ...calcState, selectedTier: tier.id });

            return (
              <div
                key={tier.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isPopular
                    ? 'bg-gradient-to-b from-blue-950 via-slate-900 to-indigo-950 text-white shadow-2xl border-2 border-purple-500 scale-102 lg:-translate-y-2'
                    : 'bg-slate-50 text-slate-900 border border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Popular Badge */}
                {tier.badge && (
                  <div
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase shadow-md ${
                      isPopular
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                        : 'bg-blue-900 text-white'
                    }`}
                  >
                    {tier.badge}
                  </div>
                )}

                <div>
                  {/* Tier Title */}
                  <div className="mb-4">
                    <h3
                      className={`text-2xl font-black ${
                        isPopular ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {tier.name}
                    </h3>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        isPopular ? 'text-blue-200' : 'text-slate-500'
                      }`}
                    >
                      {tier.tagline}
                    </p>
                  </div>

                  {/* Price display based on current sqft */}
                  <div
                    className={`p-4 rounded-2xl mb-6 ${
                      isPopular ? 'bg-white/10 border border-white/10' : 'bg-white border border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-3xl sm:text-4xl font-black ${
                          isPopular ? 'text-white' : 'text-blue-900'
                        }`}
                      >
                        {formatCurrency(price.totalPrice)}
                      </span>
                      <span
                        className={`text-xs ${
                          isPopular ? 'text-blue-200' : 'text-slate-500'
                        }`}
                      >
                        / est. for {calcState.sqft} sqft
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-current/10 flex items-center justify-between text-xs font-medium">
                      <span className={isPopular ? 'text-blue-200' : 'text-slate-600'}>
                        Crew: <strong className={isPopular ? 'text-white' : 'text-slate-900'}>{tier.movingCrew}</strong>
                      </span>
                      <span className={isPopular ? 'text-purple-300' : 'text-purple-700'}>
                        {tier.truckSize}
                      </span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <div
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isPopular ? 'text-purple-300' : 'text-slate-400'
                      }`}
                    >
                      What's Included:
                    </div>
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isPopular
                              ? 'bg-purple-500 text-white'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span
                          className={
                            isPopular ? 'text-blue-100' : 'text-slate-700'
                          }
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => onSelectTier(tier.id)}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                    isPopular
                      ? 'bg-purple-500 hover:bg-purple-400 text-white shadow-lg shadow-purple-900/50 hover:scale-102'
                      : 'bg-blue-900 hover:bg-blue-800 text-white shadow-sm hover:scale-102'
                  }`}
                >
                  <span>Select {tier.name.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
