import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Package, 
  Sparkles, 
  Truck,
  CreditCard,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CalculatorState, PackageTierId, BookingDetails, ServiceType } from '../types';
import { PACKAGE_TIERS, INVENTORY_CATEGORIES } from '../data/mockData';
import { calculatePrice, formatCurrency } from '../utils/pricing';

interface BookingWizardProps {
  calcState: CalculatorState;
  setCalcState: React.Dispatch<React.SetStateAction<CalculatorState>>;
  onBookingSuccess: (booking: BookingDetails) => void;
  onClose: () => void;
}

export function BookingWizard({ calcState, setCalcState, onBookingSuccess, onClose }: BookingWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form State
  const [moveDate, setMoveDate] = useState<string>(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 4);
    return nextWeek.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<'morning' | 'afternoon' | 'all_day'>('morning');
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [dropoffAddress, setDropoffAddress] = useState<string>('');
  const [pickupAccess, setPickupAccess] = useState<string>('Ground floor / Elevator available');
  const [dropoffAccess, setDropoffAccess] = useState<string>('Ground floor');
  const [selectedInventory, setSelectedInventory] = useState<string[]>([
    '3-Seater Sofa / Sectional',
    'King / Queen Bed Frame + Mattress',
    'Dining Table + 4-6 Chairs',
    '10 - 20 Standard Moving Boxes'
  ]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [contactViaWhatsApp, setContactViaWhatsApp] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<BookingDetails['paymentMethod']>('card_deposit');

  const pricing = calculatePrice(calcState);
  const currentTierObj = PACKAGE_TIERS.find((t) => t.id === calcState.selectedTier) || PACKAGE_TIERS[1];

  const toggleInventoryItem = (item: string) => {
    setSelectedInventory((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    if (step === 2) {
      if (!pickupAddress.trim()) errors.pickupAddress = 'Pickup address is required';
      if (calcState.serviceType !== 'cleaning' && !dropoffAddress.trim()) {
        errors.dropoffAddress = 'Destination address is required for moving';
      }
      if (!moveDate) errors.moveDate = 'Please pick a preferred service date';
    } else if (step === 4) {
      if (!customerName.trim()) errors.customerName = 'Full name is required';
      if (!customerPhone.trim() || customerPhone.length < 7) {
        errors.customerPhone = 'Valid phone number is required for crew dispatch';
      }
      if (!customerEmail.trim() || !customerEmail.includes('@')) {
        errors.customerEmail = 'Valid email address is required for booking receipt';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(4, s + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    // Generate reference code
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `SHM-${randomCode}`;

    const newBooking: BookingDetails = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      serviceType: calcState.serviceType,
      tier: calcState.selectedTier,
      tierName: currentTierObj.name,
      pricing,
      calculatorState: calcState,
      moveDate,
      timeSlot,
      pickupAddress,
      dropoffAddress: calcState.serviceType === 'cleaning' ? pickupAddress : dropoffAddress,
      pickupAccess,
      dropoffAccess,
      selectedInventory,
      specialInstructions,
      customerName,
      customerPhone,
      customerEmail,
      contactViaWhatsApp,
      paymentMethod,
      status: 'confirmed',
      assignedCrew: {
        leadName: 'Davis Kiprono (Senior Lead)',
        leadPhone: '0181460645',
        truckNumber: 'Shammah Fleet Unit #04',
        crewCount: currentTierObj.id === 'white_glove' ? 5 : currentTierObj.id === 'pro' ? 4 : 2,
      },
    };

    // Confetti animation
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1E3A8A', '#8B5CF6', '#3B82F6', '#10B981'],
      });
    } catch {
      // ignore
    }

    onBookingSuccess(newBooking);
  };

  return (
    <section id="book" className="py-12 lg:py-16 bg-slate-100/80 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Wizard Container Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl p-1.5 shrink-0 shadow">
                <img src="/logo.svg" alt="Shammah Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-purple-300 text-xs font-bold uppercase tracking-wider">
                  Direct Service Reservation
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Book Shammah Movers & Cleaners
                </h2>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-right shrink-0 border border-white/10">
              <span className="text-[10px] text-blue-200 block uppercase font-bold">Estimated Total</span>
              <span className="text-xl font-black text-purple-200">
                {formatCurrency(pricing.totalPrice)}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <div className="grid grid-cols-4 gap-2">
              {[
                { step: 1, label: 'Service & Tier' },
                { step: 2, label: 'Schedule & Address' },
                { step: 3, label: 'Inventory / Items' },
                { step: 4, label: 'Contact Details' },
              ].map((item) => {
                const isCurrent = currentStep === item.step;
                const isPassed = currentStep > item.step;
                return (
                  <div
                    key={item.step}
                    className="flex flex-col items-center sm:items-start text-center sm:text-left"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                          isPassed
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-blue-900 text-white ring-4 ring-blue-100'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                      </div>
                      <div
                        className={`hidden sm:block text-xs font-bold ${
                          isCurrent ? 'text-blue-900' : isPassed ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {item.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wizard Body Content */}
          <div className="p-6 sm:p-8">
            
            {/* STEP 1: Service & Package Confirmation */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 1: Confirm Package & Property Details
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review or adjust your moving/cleaning tier based on your square footage.
                  </p>
                </div>

                {/* Service type selector */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'combo', label: 'Move + Clean (Save 15%)', icon: Sparkles },
                    { id: 'moving', label: 'Moving Only', icon: Truck },
                    { id: 'cleaning', label: 'Cleaning Only', icon: Sparkles },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCalcState((prev) => ({ ...prev, serviceType: s.id as ServiceType }))}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        calcState.serviceType === s.id
                          ? 'border-blue-900 bg-blue-50/70 text-blue-900 font-extrabold ring-2 ring-blue-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <s.icon className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                      <div className="text-xs">{s.label}</div>
                    </button>
                  ))}
                </div>

                {/* Selected Tier Card */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">
                    Choose Package Tier:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PACKAGE_TIERS.map((tier) => {
                      const isSelected = calcState.selectedTier === tier.id;
                      const tierPrice = calculatePrice({ ...calcState, selectedTier: tier.id });
                      return (
                        <div
                          key={tier.id}
                          onClick={() => setCalcState((p) => ({ ...p, selectedTier: tier.id }))}
                          className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                            isSelected
                              ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-600 text-slate-900'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-sm text-slate-900">{tier.name.split(' ')[0]}</span>
                            <span className="font-extrabold text-blue-900 text-sm">
                              {formatCurrency(tierPrice.totalPrice)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {tier.tagline}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick specs summary */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Property Size</span>
                    <strong className="text-slate-800">{calcState.sqft} sq ft</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Distance</span>
                    <strong className="text-slate-800">{calcState.distanceMiles} miles</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Crew Size</span>
                    <strong className="text-slate-800">{currentTierObj.movingCrew}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Truck Unit</span>
                    <strong className="text-slate-800">{currentTierObj.truckSize}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Schedule & Addresses */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 2: Schedule & Location Addresses
                  </h3>
                  <p className="text-xs text-slate-500">
                    Where and when should our Shammah crew arrive?
                  </p>
                </div>

                {/* Date and Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-900" />
                      <span>Preferred Service Date *</span>
                    </label>
                    <input
                      type="date"
                      value={moveDate}
                      onChange={(e) => setMoveDate(e.target.value)}
                      className={`w-full p-3 bg-slate-50 rounded-xl border text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                        formErrors.moveDate ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.moveDate && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.moveDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-900" />
                      <span>Preferred Arrival Window *</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'morning', label: 'Morning (8am - 11am)' },
                        { id: 'afternoon', label: 'Afternoon (1pm - 4pm)' },
                        { id: 'all_day', label: 'Flexible Window' },
                      ].map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setTimeSlot(slot.id as any)}
                          className={`p-2 rounded-xl text-xs font-bold border text-center transition-colors ${
                            timeSlot === slot.id
                              ? 'bg-blue-900 text-white border-blue-900'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pickup Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-900" />
                    <span>
                      {calcState.serviceType === 'cleaning'
                        ? 'Service / Residence Address *'
                        : 'Pickup / Origin Address *'}
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Juja, Sanne Square, Apt 4B or Kilimani, Nairobi"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className={`w-full p-3 bg-slate-50 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                      formErrors.pickupAddress ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.pickupAddress && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.pickupAddress}</p>
                  )}
                </div>

                {/* Dropoff Address (if moving or combo) */}
                {calcState.serviceType !== 'cleaning' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-purple-700" />
                      <span>Destination / Drop-off Address *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Karen, Mbagathi Ridge, Nairobi"
                      value={dropoffAddress}
                      onChange={(e) => setDropoffAddress(e.target.value)}
                      className={`w-full p-3 bg-slate-50 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                        formErrors.dropoffAddress ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.dropoffAddress && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.dropoffAddress}</p>
                    )}
                  </div>
                )}

                {/* Access Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Origin Access Details
                    </label>
                    <select
                      value={pickupAccess}
                      onChange={(e) => setPickupAccess(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 text-xs text-slate-800"
                    >
                      <option value="Ground floor / Driveway">Ground floor / Driveway</option>
                      <option value="Elevator Available">Elevator Available</option>
                      <option value="1 Flight of Stairs">1 Flight of Stairs</option>
                      <option value="2+ Flights of Stairs">2+ Flights of Stairs</option>
                      <option value="Narrow Street / Loading Dock">Narrow Street / Loading Dock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Destination Access Details
                    </label>
                    <select
                      value={dropoffAccess}
                      onChange={(e) => setDropoffAccess(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 text-xs text-slate-800"
                    >
                      <option value="Ground Floor Driveway">Ground Floor Driveway</option>
                      <option value="Elevator Available">Elevator Available</option>
                      <option value="1-2 Flights of Stairs">1-2 Flights of Stairs</option>
                      <option value="Gated Community / Security Access">Gated Community / Security Access</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Inventory Checklist & Special Requirements */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 3: Inventory Checklist & Special Notes
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tag the major items so our dispatch team assigns the perfect truck equipment.
                  </p>
                </div>

                <div className="space-y-4">
                  {INVENTORY_CATEGORIES.map((cat, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-extrabold text-blue-950 uppercase tracking-wider mb-2.5">
                        {cat.category}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cat.items.map((item) => {
                          const isSelected = selectedInventory.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => toggleInventoryItem(item)}
                              className={`p-2 rounded-xl text-left text-xs flex items-center justify-between border transition-all ${
                                isSelected
                                  ? 'bg-blue-900 text-white border-blue-900 font-semibold shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span className="truncate pr-2">{item}</span>
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-purple-500 text-white' : 'border border-slate-300'
                                }`}
                              >
                                {isSelected && <CheckCircle2 className="w-3 h-3" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Special Instructions / Gate Codes / Fragile Items
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Marble dining top needs special wrap; elevator key booked with building management from 9 AM; please call upon arrival at gate 4."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Contact Info & Final Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 4: Customer Details & Final Confirmation
                  </h3>
                  <p className="text-xs text-slate-500">
                    We will send your booking confirmation reference and live crew tracking to these contacts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-900" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Jenkins"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full p-3 bg-slate-50 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                        formErrors.customerName ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.customerName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-blue-900" />
                      <span>Phone Number *</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +254 712 345 678"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className={`w-full p-3 bg-slate-50 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                        formErrors.customerPhone ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.customerPhone && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.customerPhone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-900" />
                    <span>Email Address (for receipt & calendar invite) *</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. sarah.jenkins@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className={`w-full p-3 bg-slate-50 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                      formErrors.customerEmail ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.customerEmail && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.customerEmail}</p>
                  )}
                </div>

                {/* WhatsApp Notification Toggle */}
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-emerald-950 block">
                        Receive instant WhatsApp Booking Updates & Crew ETA
                      </span>
                      <span className="text-[10px] text-emerald-700">
                        Direct notifications when crew departs and reaches destination
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={contactViaWhatsApp}
                    onChange={(e) => setContactViaWhatsApp(e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                {/* Payment preference */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Payment Preference (Settled upon completion / inspection)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'card_deposit', label: 'Credit / Debit Card', icon: CreditCard },
                      { id: 'cash_on_delivery', label: 'Cash on Completion', icon: DollarSign },
                      { id: 'bank_transfer', label: 'Bank Wire / ACH', icon: ShieldCheck },
                      { id: 'mobile_money', label: 'Mobile Money / M-Pesa', icon: Phone },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                          paymentMethod === p.id
                            ? 'bg-blue-900 text-white border-blue-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <p.icon className="w-4 h-4 mx-auto mb-1 text-purple-300" />
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Final Order Review Summary Box */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between items-center font-bold pb-2 border-b border-white/10">
                    <span className="text-purple-300 uppercase tracking-wider text-[11px]">
                      {calcState.serviceType.toUpperCase()} • {currentTierObj.name}
                    </span>
                    <span className="text-base text-white font-black">
                      {formatCurrency(pricing.totalPrice)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>📅 Date: <strong className="text-white">{moveDate} ({timeSlot})</strong></div>
                    <div>📐 Size: <strong className="text-white">{calcState.sqft} sq ft</strong></div>
                    <div>📍 Pickup: <span className="text-white truncate block">{pickupAddress || 'Address specified'}</span></div>
                    <div>🚚 Distance: <strong className="text-white">{calcState.distanceMiles} miles</strong></div>
                  </div>
                </div>

              </div>
            )}

            {/* Form Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 font-bold text-xs sm:text-sm"
                >
                  Cancel
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all hover:scale-102"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitBooking}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-purple-950/30 transition-all hover:scale-105 active:scale-95"
                >
                  <CheckCircle2 className="w-5 h-5 text-purple-200" />
                  <span>Confirm & Lock In Booking</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
