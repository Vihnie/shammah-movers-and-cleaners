import React from 'react';
import { 
  Calculator, 
  Truck, 
  Sparkles, 
  Layers, 
  MapPin, 
  Maximize2, 
  ArrowRight, 
  Check, 
  Info, 
  ShieldCheck, 
  Clock, 
  HelpCircle,
  Percent,
  Flame
} from 'lucide-react';
import { CalculatorState, PackageTierId, ServiceType } from '../types';
import { PACKAGE_TIERS, PROPERTY_PRESETS, ADD_ON_ITEMS } from '../data/mockData';
import { calculatePrice, formatCurrency } from '../utils/pricing';

interface PriceCalculatorProps {
  calcState: CalculatorState;
  setCalcState: React.Dispatch<React.SetStateAction<CalculatorState>>;
  onProceedToBooking: (tierId: PackageTierId) => void;
}

export function PriceCalculator({ calcState, setCalcState, onProceedToBooking }: PriceCalculatorProps) {
  const pricing = calculatePrice(calcState);

  const handleServiceChange = (serviceType: ServiceType) => {
    setCalcState((prev) => ({ ...prev, serviceType }));
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = PROPERTY_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setCalcState((prev) => ({
        ...prev,
        propertyPresetId: presetId,
        sqft: preset.sqft,
        bedrooms: preset.bedrooms,
        bathrooms: preset.bathrooms,
      }));
    }
  };

  const handleToggleAddon = (addonId: string) => {
    setCalcState((prev) => {
      const exists = prev.selectedAddOns.includes(addonId);
      return {
        ...prev,
        selectedAddOns: exists
          ? prev.selectedAddOns.filter((id) => id !== addonId)
          : [...prev.selectedAddOns, addonId],
      };
    });
  };

  // Filter add-ons matching current service type
  const visibleAddons = ADD_ON_ITEMS.filter((item) => {
    if (calcState.serviceType === 'combo') return true;
    if (calcState.serviceType === 'moving') return item.category === 'moving' || item.category === 'both';
    if (calcState.serviceType === 'cleaning') return item.category === 'cleaning' || item.category === 'both';
    return true;
  });

  return (
    <section id="calculator" className="py-12 lg:py-16 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Instant Estimator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Integrated Price Calculator
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Customize your square footage, distance, and service tier to see accurate real-time pricing without waiting for quotes.
          </p>
        </div>

        {/* 1. Service Type Selector Tabs */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-3 gap-1">
            <button
              onClick={() => handleServiceChange('combo')}
              className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                calcState.serviceType === 'combo'
                  ? 'bg-gradient-to-r from-blue-900 to-purple-800 text-white shadow-md'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>Move + Clean</span>
              <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                -15%
              </span>
            </button>

            <button
              onClick={() => handleServiceChange('moving')}
              className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                calcState.serviceType === 'moving'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
              }`}
            >
              <Truck className="w-4 h-4 text-blue-300" />
              <span>Moving Only</span>
            </button>

            <button
              onClick={() => handleServiceChange('cleaning')}
              className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                calcState.serviceType === 'cleaning'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Cleaning Only</span>
            </button>
          </div>
        </div>

        {/* 2. Main Calculator Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Inputs: Sqft, Distance, Access, Addons) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Square Footage Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-5 h-5 text-blue-900" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Property Size (Square Footage)
                  </h3>
                </div>
                <div className="bg-blue-50 text-blue-900 font-extrabold px-3 py-1 rounded-xl text-sm border border-blue-100">
                  {calcState.sqft.toLocaleString()} sq ft
                </div>
              </div>

              {/* Presets buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
                {PROPERTY_PRESETS.map((preset) => {
                  const isSelected = calcState.propertyPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset.id)}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        isSelected
                          ? 'border-blue-900 bg-blue-900 text-white shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="text-[11px] font-bold truncate">{preset.label}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                        ~{preset.sqft} sqft
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Slider for exact sq ft */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Studio (300 sqft)</span>
                  <span>Average (1,500 sqft)</span>
                  <span>Estate (4,000+ sqft)</span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="4500"
                  step="50"
                  value={calcState.sqft}
                  onChange={(e) =>
                    setCalcState((prev) => ({
                      ...prev,
                      sqft: Number(e.target.value),
                      propertyPresetId: 'custom',
                    }))
                  }
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
                />
              </div>
            </div>

            {/* Distance & Location Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-900" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Estimated Transit Distance
                  </h3>
                </div>
                <div className="bg-purple-50 text-purple-900 font-extrabold px-3 py-1 rounded-xl text-sm border border-purple-100">
                  {calcState.distanceMiles} Miles ({Math.round(calcState.distanceMiles * 1.609)} km)
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Local (1 - 10 mi)</span>
                  <span>Metro Area (25 mi)</span>
                  <span>Regional (100+ mi)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="120"
                  step="1"
                  value={calcState.distanceMiles}
                  onChange={(e) =>
                    setCalcState((prev) => ({
                      ...prev,
                      distanceMiles: Number(e.target.value),
                    }))
                  }
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-700"
                />
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>First 5 local miles are included free with every moving booking.</span>
              </p>
            </div>

            {/* Building Access & Cleaning Options */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-900" />
                <span>Access & Cleaning Preferences</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Elevator Toggle */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700 block mb-2">Building Access</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCalcState((p) => ({ ...p, hasElevator: true, flightsOfStairs: 0 }))}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        calcState.hasElevator
                          ? 'bg-blue-900 text-white'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      Elevator / Ground
                    </button>
                    <button
                      onClick={() => setCalcState((p) => ({ ...p, hasElevator: false, flightsOfStairs: Math.max(1, p.flightsOfStairs) }))}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        !calcState.hasElevator
                          ? 'bg-blue-900 text-white'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      Stairs Only
                    </button>
                  </div>

                  {!calcState.hasElevator && (
                    <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-600">Flights of stairs:</span>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map((flights) => (
                          <button
                            key={flights}
                            onClick={() => setCalcState((p) => ({ ...p, flightsOfStairs: flights }))}
                            className={`w-6 h-6 rounded text-xs font-bold ${
                              calcState.flightsOfStairs === flights
                                ? 'bg-purple-700 text-white'
                                : 'bg-white border text-slate-700'
                            }`}
                          >
                            {flights}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cleaning Intensity (if cleaning or combo) */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700 block mb-2">Cleaning Intensity</span>
                  <select
                    value={calcState.cleaningIntensity}
                    onChange={(e) =>
                      setCalcState((prev) => ({
                        ...prev,
                        cleaningIntensity: e.target.value as CalculatorState['cleaningIntensity'],
                      }))
                    }
                    className="w-full bg-white text-slate-800 text-xs font-semibold py-2 px-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  >
                    <option value="standard">Standard Refresh Clean</option>
                    <option value="deep">Deep Detailing Sanitize</option>
                    <option value="move_in_out">Move-In / Move-Out Deep Clean</option>
                    <option value="post_construction">Post-Construction & Renovation</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Add-ons Checklist */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>Optional Add-On Services</span>
                </h3>
                <span className="text-xs text-slate-500">Select any that apply</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {visibleAddons.map((addon) => {
                  const isChecked = calcState.selectedAddOns.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon.id)}
                      className={`p-3 rounded-xl text-left border flex items-start justify-between gap-2 transition-all ${
                        isChecked
                          ? 'border-purple-600 bg-purple-50/70 text-slate-900 ring-1 ring-purple-500'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-white ${
                              isChecked ? 'bg-purple-600' : 'border border-slate-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-bold text-xs truncate">{addon.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1 pl-5">
                          {addon.description}
                        </p>
                      </div>
                      <span className="text-xs font-extrabold text-blue-900 shrink-0">
                        +{formatCurrency(addon.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Live Calculated Breakdown & Package Tiers */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Pricing Summary Sticky Card */}
            <div className="bg-gradient-to-b from-blue-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-blue-800/40 relative overflow-hidden">
              
              {/* Header inside card */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs text-blue-200 font-bold uppercase tracking-wider block">
                    Calculated Estimate
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {calcState.serviceType === 'combo'
                      ? 'Move + Clean Bundle'
                      : calcState.serviceType === 'moving'
                      ? 'Moving Service'
                      : 'Deep Cleaning Service'}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-xl p-1.5 flex items-center justify-center">
                  <img src="/logo.svg" alt="Shammah Logo" className="w-full h-full object-contain" />
                </div>
              </div>

              {/* Total Price Display */}
              <div className="py-5 text-center bg-white/5 rounded-2xl my-4 border border-white/10">
                <span className="text-xs text-blue-200 uppercase font-semibold tracking-wider">
                  Estimated Total (Starting At)
                </span>
                <div className="text-4xl sm:text-5xl font-black text-white mt-1 tracking-tight">
                  {formatCurrency(pricing.totalPrice)}
                </div>

                {pricing.comboDiscount > 0 && (
                  <div className="inline-flex items-center gap-1 mt-2 bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold border border-emerald-500/30">
                    <Percent className="w-3 h-3" />
                    <span>Includes 15% Combo Discount (-{formatCurrency(pricing.comboDiscount)})</span>
                  </div>
                )}
              </div>

              {/* Logistics & Estimated Duration */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-blue-300 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est. Duration</span>
                  </div>
                  <div className="font-bold text-white text-sm mt-0.5">
                    {pricing.estimatedHours}
                  </div>
                </div>

                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-blue-300 flex items-center gap-1 font-semibold">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Recommended Rig</span>
                  </div>
                  <div className="font-bold text-white text-sm mt-0.5 truncate">
                    {pricing.recommendedTruck}
                  </div>
                </div>
              </div>

              {/* Itemized Line Items */}
              <div className="space-y-2 text-xs py-3 border-t border-white/10 text-blue-100">
                <div className="flex justify-between">
                  <span>Base Service Fee</span>
                  <span className="font-semibold text-white">{formatCurrency(pricing.basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Square Footage ({calcState.sqft} sqft)</span>
                  <span className="font-semibold text-white">{formatCurrency(pricing.sqftCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transit Distance ({calcState.distanceMiles} mi)</span>
                  <span className="font-semibold text-white">{formatCurrency(pricing.distanceCost)}</span>
                </div>
                {pricing.stairsSurcharge > 0 && (
                  <div className="flex justify-between text-amber-300">
                    <span>Stairs ({calcState.flightsOfStairs} flights)</span>
                    <span className="font-semibold">+{formatCurrency(pricing.stairsSurcharge)}</span>
                  </div>
                )}
                {pricing.addOnsCost > 0 && (
                  <div className="flex justify-between text-purple-300">
                    <span>Selected Add-ons ({calcState.selectedAddOns.length})</span>
                    <span className="font-semibold">+{formatCurrency(pricing.addOnsCost)}</span>
                  </div>
                )}
              </div>

              {/* Select Package Tier Pills inside the Card */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <label className="text-xs font-bold text-blue-200 block mb-2">
                  Select Package Tier:
                </label>
                <div className="space-y-2">
                  {PACKAGE_TIERS.map((tier) => {
                    const isSelected = calcState.selectedTier === tier.id;
                    // Calculate price for this specific tier
                    const tierPricing = calculatePrice({ ...calcState, selectedTier: tier.id });
                    
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setCalcState((p) => ({ ...p, selectedTier: tier.id }))}
                        className={`p-3 rounded-xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-purple-600/30 border-purple-400 ring-1 ring-purple-300'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-purple-300 bg-purple-500' : 'border-white/40'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                            </div>
                            <span className="font-bold text-xs sm:text-sm text-white">
                              {tier.name}
                            </span>
                          </div>
                          <span className="font-black text-sm text-purple-200">
                            {formatCurrency(tierPricing.totalPrice)}
                          </span>
                        </div>
                        <p className="text-[10px] text-blue-200/80 mt-1 pl-6">
                          {tier.movingCrew} • {tier.cleaningScope}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => onProceedToBooking(calcState.selectedTier)}
                className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white rounded-xl font-extrabold text-base shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98"
              >
                <span>Book This Package ({formatCurrency(pricing.totalPrice)})</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-[11px] text-center text-blue-300/70 mt-2">
                🔒 Free cancellation up to 48 hours prior • No card required upfront
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
