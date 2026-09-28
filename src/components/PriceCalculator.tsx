import React, { useState } from 'react';
import { Calculator, Check, ArrowRight, ShieldCheck, Sparkles, HelpCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CalculatorState, PackageTierId } from '../types';

interface CalculatorProps {
  onSelectPlan?: (tier: string, price: number, details: any) => void;
  calcState?: CalculatorState;
  setCalcState?: React.Dispatch<React.SetStateAction<CalculatorState>>;
  onProceedToBooking?: (tierId?: PackageTierId) => void;
}

export const PriceCalculator: React.FC<CalculatorProps> = ({ onSelectPlan, calcState, setCalcState, onProceedToBooking }) => {
  const { setCurrentView } = useApp();

  const [propertySize, setPropertySize] = useState<string>('2-bed');
  const [distanceMiles, setDistanceMiles] = useState<number>(25);
  const [floorLevel, setFloorLevel] = useState<string>('ground');
  const [hasLift, setHasLift] = useState<boolean>(true);
  const [packingOption, setPackingOption] = useState<string>('fragile');
  const [extras, setExtras] = useState<{
    piano: boolean;
    storage: boolean;
    dismantling: boolean;
    boxesKit: boolean;
  }>({
    piano: false,
    storage: false,
    dismantling: true,
    boxesKit: false
  });

  // Calculation Logic
  const baseRates: Record<string, number> = {
    'studio': 220,
    '1-bed': 290,
    '2-bed': 420,
    '3-bed': 580,
    '4-bed': 790,
    'office': 650
  };

  const basePrice = baseRates[propertySize] || 420;
  const mileageCost = Math.max(0, distanceMiles - 5) * 2.2; // First 5 miles included
  
  let packingCost = 0;
  if (packingOption === 'fragile') packingCost = 95;
  if (packingOption === 'full') packingCost = 210;

  let accessCost = 0;
  if (floorLevel !== 'ground' && !hasLift) {
    accessCost = 50;
  }

  const extrasCost =
    (extras.piano ? 130 : 0) +
    (extras.storage ? 70 : 0) +
    (extras.dismantling ? 65 : 0) +
    (extras.boxesKit ? 45 : 0);

  const subtotal = Math.round(basePrice + mileageCost + packingCost + accessCost + extrasCost);

  const handleBookTier = (tierName: string, multiplier: number) => {
    const finalTierPrice = Math.round(subtotal * multiplier);
    const details = {
      propertySize,
      distanceMiles,
      packingOption,
      extras,
      floorLevel,
      hasLift
    };
    if (onSelectPlan) {
      onSelectPlan(tierName, finalTierPrice, details);
    }
    setCurrentView('booking');
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-y border-slate-200" id="calculator">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            Transparent Pricing Engine
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Instant Move Price Calculator
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            No guessing, no surprises on moving day. Customize your move parameters below to receive an instant, binding quotation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            {/* Property Size */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                1. Property Type &amp; Size
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'studio', label: 'Studio / Room', sub: 'Up to 300 sq ft' },
                  { id: '1-bed', label: '1 Bed Flat', sub: '400 - 600 sq ft' },
                  { id: '2-bed', label: '2 Bed Home', sub: '700 - 900 sq ft' },
                  { id: '3-bed', label: '3 Bed House', sub: '1,000 - 1,400 sq ft' },
                  { id: '4-bed', label: '4+ Bed Estate', sub: '1,500+ sq ft' },
                  { id: 'office', label: 'Office / Commercial', sub: '10-30 Desks' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPropertySize(item.id)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                      propertySize === item.id
                        ? 'border-amber-500 bg-amber-50/50 text-slate-950 font-semibold ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{item.label}</div>
                    <div className="text-[11px] text-slate-500">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Distance Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-900">
                  2. Travel Distance (Miles between locations)
                </label>
                <span className="text-sm font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {distanceMiles} miles
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="250"
                value={distanceMiles}
                onChange={(e) => setDistanceMiles(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Local (1 - 10 mi)</span>
                <span>Regional (11 - 60 mi)</span>
                <span>Nationwide (61 - 250+ mi)</span>
              </div>
            </div>

            {/* Packing Service */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                3. Packing &amp; Materials Service
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'self',
                    title: 'Self-Pack',
                    price: 'Included',
                    desc: 'You pack your own boxes prior to moving day'
                  },
                  {
                    id: 'fragile',
                    title: 'Fragile Packing',
                    price: '+£95',
                    desc: 'We pack china, glass, art & delicate kitchenware'
                  },
                  {
                    id: 'full',
                    title: 'Full Packing Service',
                    price: '+£210',
                    desc: 'Complete white-glove packing with all materials'
                  }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPackingOption(p.id)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                      packingOption === p.id
                        ? 'border-amber-500 bg-amber-50/50 text-slate-950 font-semibold ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900">{p.title}</span>
                      <span className="text-[11px] font-semibold text-amber-600">{p.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Access & Floors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Floor Level (Pickup or Dropoff)
                </label>
                <select
                  value={floorLevel}
                  onChange={(e) => setFloorLevel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="ground">Ground Floor / House</option>
                  <option value="1st">1st Floor</option>
                  <option value="2nd">2nd Floor</option>
                  <option value="3rd+">3rd Floor or Higher</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Is There a Working Passenger/Service Lift?
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setHasLift(true)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border cursor-pointer ${
                      hasLift
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    Yes, Lift Available
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasLift(false)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border cursor-pointer ${
                      !hasLift
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    No Lift (Stairs Only)
                  </button>
                </div>
              </div>
            </div>

            {/* Optional Add-ons */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                4. Optional Add-ons &amp; Equipment
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={extras.dismantling}
                    onChange={(e) => setExtras({ ...extras, dismantling: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-slate-900">Bed &amp; Wardrobe Dismantling (+£65)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={extras.piano}
                    onChange={(e) => setExtras({ ...extras, piano: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-slate-900">Piano / Heavy Safe Transit (+£130)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={extras.storage}
                    onChange={(e) => setExtras({ ...extras, storage: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-slate-900">2 Weeks Secure Storage (+£70)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={extras.boxesKit}
                    onChange={(e) => setExtras({ ...extras, boxesKit: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-slate-900">Packing Materials Starter Kit (+£45)</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Pricing Tiers Summary Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-5">
                <div>
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Calculated Estimate</span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                    £{subtotal}
                    <span className="text-xs text-slate-400 font-normal ml-1">inc. VAT</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Based on:</div>
                  <div className="text-xs font-semibold text-slate-200 capitalize">{propertySize.replace('-', ' ')} • {distanceMiles} mi</div>
                </div>
              </div>

              {/* Service Tiers Comparison */}
              <div className="space-y-3 mb-6">
                {/* Standard Plan */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-400/50 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-white">Standard Relocation</span>
                    <span className="text-sm font-extrabold text-amber-400">£{Math.round(subtotal * 0.9)}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mb-2">Luton Box Van + 2 Professional Movers. Loading, transit &amp; unloading.</p>
                  <button
                    onClick={() => handleBookTier('Standard Relocation', 0.9)}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Select Standard Plan
                  </button>
                </div>

                {/* Complete Care - Recommended */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-2 border-amber-500 relative">
                  <div className="absolute -top-2.5 right-3 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full">
                    Most Popular
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-white">Complete Care Move</span>
                    <span className="text-base font-extrabold text-amber-400">£{subtotal}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mb-2">
                    Luton Van / 7.5t + 3 Movers. Furniture dismantling, sofa/mattress covers, floor runners &amp; £100k insurance.
                  </p>
                  <button
                    onClick={() => handleBookTier('Complete Care Move', 1.0)}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-3 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Book Complete Care</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* White-Glove VIP */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-400/50 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-white">White-Glove VIP</span>
                    <span className="text-sm font-extrabold text-amber-400">£{Math.round(subtotal * 1.35)}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mb-2">
                    Full packing service with all boxes, wardrobe boxes, unpack to surfaces, priority dispatch manager.
                  </p>
                  <button
                    onClick={() => handleBookTier('White-Glove VIP', 1.35)}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Select White-Glove VIP
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>£100,000 Goods in Transit policy included automatically</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Guaranteed fixed rate — no overtime penalty on traffic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
