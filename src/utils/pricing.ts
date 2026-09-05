import { CalculatorState, CalculatedPricing, PackageTierId, ServiceType } from '../types';

export function calculatePrice(state: CalculatorState): CalculatedPricing {
  const {
    serviceType,
    selectedTier,
    sqft,
    distanceMiles,
    hasElevator,
    flightsOfStairs,
    cleaningIntensity,
    selectedAddOns,
  } = state;

  // 1. Base prices in Ksh by service type
  let basePrice = 0;
  let sqftRate = 0;

  if (serviceType === 'moving') {
    basePrice = 14000;
    sqftRate = 16; // e.g. 1,000 sq ft = 16,000 Ksh
  } else if (serviceType === 'cleaning') {
    basePrice = 8000;
    // intensity multiplier for cleaning
    let intensityFactor = 1.0;
    if (cleaningIntensity === 'deep') intensityFactor = 1.25;
    if (cleaningIntensity === 'move_in_out') intensityFactor = 1.4;
    if (cleaningIntensity === 'post_construction') intensityFactor = 1.6;
    sqftRate = 10 * intensityFactor;
  } else {
    // combo
    basePrice = 18500;
    let intensityFactor = cleaningIntensity === 'deep' ? 1.2 : cleaningIntensity === 'move_in_out' ? 1.35 : 1.0;
    sqftRate = 22 * intensityFactor;
  }

  // 2. Square footage cost
  const sqftCost = Math.round(sqft * sqftRate);

  // 3. Distance cost in Ksh (first 5 miles included free)
  let distanceCost = 0;
  if (serviceType === 'moving' || serviceType === 'combo') {
    const billableMiles = Math.max(0, distanceMiles - 5);
    distanceCost = Math.round(billableMiles * 220);
  } else {
    // cleaning travel
    const billableMiles = Math.max(0, distanceMiles - 10);
    distanceCost = Math.round(billableMiles * 120);
  }

  // 4. Stairs surcharge in Ksh
  let stairsSurcharge = 0;
  if (!hasElevator && flightsOfStairs > 0 && serviceType !== 'cleaning') {
    stairsSurcharge = flightsOfStairs * 1500;
  }

  // 5. Tier Multiplier
  let tierMultiplier = 1.0;
  if (selectedTier === 'pro') {
    tierMultiplier = 1.35;
  } else if (selectedTier === 'white_glove') {
    tierMultiplier = 1.85;
  }

  // 6. Base Subtotal before add-ons
  const coreRaw = (basePrice + sqftCost + distanceCost + stairsSurcharge) * tierMultiplier;

  // 7. Add-ons pricing in Ksh
  const addOnPrices: Record<string, number> = {
    packing_materials: 6500,
    disassembly_assembly: 4000,
    heavy_piano_safe: 9500,
    mattress_bags: 2500,
    carpet_steam_wash: 6000,
    oven_fridge_deep_clean: 4500,
    interior_windows: 3500,
    eco_sanitization: 3500,
    wardrobe_boxes: 2800,
  };

  let addOnsCost = 0;
  selectedAddOns.forEach((addonId) => {
    if (addOnPrices[addonId]) {
      addOnsCost += addOnPrices[addonId];
    }
  });

  // 8. Combo Discount (15% off core if combo selected)
  let comboDiscount = 0;
  if (serviceType === 'combo') {
    comboDiscount = Math.round(coreRaw * 0.15);
  }

  const subtotal = Math.round(coreRaw + addOnsCost);
  const totalPrice = Math.max(8000, subtotal - comboDiscount);

  // 9. Duration & Logistics Estimates based on sqft
  let estimatedHours = '2 - 3 Hours';
  let recommendedTruck = '16ft Moving Van';
  let recommendedCrew = '2 Movers';

  if (sqft <= 600) {
    estimatedHours = serviceType === 'combo' ? '3 - 4.5 Hours' : '2 - 3 Hours';
    recommendedTruck = '16ft Standard Truck';
    recommendedCrew = selectedTier === 'white_glove' ? '3 Specialists' : '2 Pros';
  } else if (sqft <= 1200) {
    estimatedHours = serviceType === 'combo' ? '4.5 - 6 Hours' : '3.5 - 5 Hours';
    recommendedTruck = '20ft Large Truck';
    recommendedCrew = selectedTier === 'essential' ? '2 Movers' : '3 Pros';
  } else if (sqft <= 2200) {
    estimatedHours = serviceType === 'combo' ? '6 - 8 Hours' : '5 - 7 Hours';
    recommendedTruck = '26ft Heavy-Duty Truck';
    recommendedCrew = selectedTier === 'white_glove' ? '4 - 5 Specialists' : '3 - 4 Pros';
  } else {
    estimatedHours = serviceType === 'combo' ? '8 - 10+ Hours (Full Day)' : '7 - 9 Hours';
    recommendedTruck = '26ft Truck + Auxiliary Van';
    recommendedCrew = selectedTier === 'white_glove' ? '5 - 6 Specialists' : '4 - 5 Pros';
  }

  return {
    basePrice,
    sqftCost,
    distanceCost,
    stairsSurcharge,
    addOnsCost,
    comboDiscount,
    subtotal,
    totalPrice,
    estimatedHours,
    recommendedTruck,
    recommendedCrew,
  };
}

export function formatCurrency(amount: number): string {
  return `Ksh. ${Math.round(amount).toLocaleString('en-KE')}`;
}
