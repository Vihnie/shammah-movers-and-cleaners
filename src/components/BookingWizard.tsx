import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard,
  FileText,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { Booking, CalculatorState, PackageTierId, BookingDetails } from '../types';

export interface BookingWizardProps {
  calcState?: CalculatorState;
  setCalcState?: React.Dispatch<React.SetStateAction<CalculatorState>>;
  onBookingSuccess?: (newBooking: BookingDetails) => void;
  onClose?: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({ calcState, setCalcState, onBookingSuccess, onClose }) => {
  const { createBooking, setCurrentView, setSelectedBookingId } = useApp();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    service_type: 'Residential Home Moves',
    tier: 'complete-care',
    tier_name: 'Complete Care Move',
    move_date: '',
    time_slot: '08:00 - 10:00 (Morning Slot)',
    pickup_address: '',
    dropoff_address: '',
    total_price: 580,
    payment_method: 'Card on Completion',
    notes: '',
    propertyType: '2-Bed House / Flat',
    packingService: 'Fragile Packing'
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNextStep = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!formData.pickup_address.trim() || !formData.dropoff_address.trim()) {
        setErrorMessage('Please enter both pickup and destination addresses.');
        return;
      }
      if (!formData.move_date) {
        setErrorMessage('Please select your target move date.');
        return;
      }
    }
    if (step === 2) {
      // Step 2 service & tiers
    }
    if (step === 3) {
      if (!formData.customer_name.trim() || !formData.customer_phone.trim() || !formData.customer_email.trim()) {
        setErrorMessage('Please fill in your full name, phone number, and email.');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePreviousStep = () => {
    setErrorMessage(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const bookingId = `SM-${Math.floor(10000 + Math.random() * 90000)}`;

    const bookingPayload: Partial<Booking> = {
      id: bookingId,
      customer_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      customer_email: formData.customer_email,
      service_type: formData.service_type,
      tier: formData.tier as PackageTierId,
      tier_name: formData.tier_name,
      move_date: formData.move_date,
      time_slot: formData.time_slot,
      pickup_address: formData.pickup_address,
      dropoff_address: formData.dropoff_address,
      total_price: formData.total_price,
      payment_method: formData.payment_method,
      status: 'Confirmed',
      details_json: JSON.stringify({
        propertyType: formData.propertyType,
        packingService: formData.packingService,
        notes: formData.notes
      })
    };

    const res = await createBooking(bookingPayload);
    setIsSubmitting(false);

    if (res) {
      setCreatedBooking(res);
      if (onBookingSuccess) {
        onBookingSuccess(res);
      }
      setSelectedBookingId(res.id);
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Confetti non-fatal
      }
    } else {
      setErrorMessage('Failed to submit booking. Please try again or call dispatch directly.');
    }
  };

  if (createdBooking) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[70vh] flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Booking Reserved &amp; Scheduled
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">Thank You, {createdBooking.customer_name}!</h2>
            <p className="text-sm text-slate-600">
              Your move has been confirmed in our dispatch system. We have dispatched a confirmation email and SMS.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left space-y-3 text-xs">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Booking Reference</span>
              <span className="font-extrabold text-base text-slate-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                {createdBooking.id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Service Plan</span>
              <span className="font-semibold text-slate-900">{createdBooking.tier_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Scheduled Date</span>
              <span className="font-semibold text-slate-900">{createdBooking.move_date} ({createdBooking.time_slot})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Pickup</span>
              <span className="font-semibold text-slate-900 truncate max-w-[280px]">{createdBooking.pickup_address}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Destination</span>
              <span className="font-semibold text-slate-900 truncate max-w-[280px]">{createdBooking.dropoff_address}</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-2 text-sm">
              <span className="font-bold text-slate-900">Total Price</span>
              <span className="font-extrabold text-amber-600">£{createdBooking.total_price} ({createdBooking.payment_method})</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedBookingId(createdBooking.id);
                setCurrentView('tracking');
              }}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track This Move Live</span>
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Back to Homepage
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50" id="booking-wizard">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Official Booking Dispatch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Book Your Move in 4 Simple Steps
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Complete the form below to lock in your date, crew, and insurance coverage.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-slate-200 -z-0" />
          {[
            { num: 1, label: 'Addresses & Date' },
            { num: 2, label: 'Plan & Options' },
            { num: 3, label: 'Your Details' },
            { num: 4, label: 'Confirmation' }
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === s.num
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 font-extrabold'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-slate-500 border border-slate-300'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className="text-[11px] font-medium text-slate-600 mt-1.5 hidden sm:block">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200">
          {/* STEP 1: Addresses and Date */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 1: Where and When Are You Moving?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Pickup Address &amp; Postcode *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 14 Kensington High St, London W8 4SG"
                      value={formData.pickup_address}
                      onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Destination Address &amp; Postcode *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 22 Highfield Rd, Winchester SO21 2NT"
                      value={formData.dropoff_address}
                      onChange={(e) => setFormData({ ...formData, dropoff_address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Target Moving Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={formData.move_date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, move_date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Preferred Time Slot
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <select
                      value={formData.time_slot}
                      onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="08:00 - 10:00 (Morning Slot)">08:00 - 10:00 (Morning Slot - Recommended)</option>
                      <option value="12:00 - 14:00 (Afternoon Slot)">12:00 - 14:00 (Afternoon Slot)</option>
                      <option value="16:00 - 18:00 (Evening Slot)">16:00 - 18:00 (Evening Slot)</option>
                      <option value="Flexible / All-Day Window">Flexible / All-Day Window</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Property Size / Scope
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="Studio / Single Room">Studio / Single Room</option>
                  <option value="1-Bed Apartment">1-Bed Apartment</option>
                  <option value="2-Bed House / Flat">2-Bed House / Flat</option>
                  <option value="3-Bed Family House">3-Bed Family House</option>
                  <option value="4+ Bed Detached Estate">4+ Bed Detached Estate</option>
                  <option value="Office / Commercial Space">Office / Commercial Space</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Plan and Service Options */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 2: Choose Service Tier &amp; Packing Option
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'standard',
                    name: 'Standard Move',
                    price: 380,
                    crew: '2 Movers + Luton Van',
                    desc: 'Safe loading, transport, unloading, protective straps.'
                  },
                  {
                    id: 'complete-care',
                    name: 'Complete Care Move',
                    price: 580,
                    crew: '3 Movers + Luton / 7.5t',
                    desc: 'Dismantling/assembly, sofa covers, floor protection, priority care.'
                  },
                  {
                    id: 'white-glove',
                    name: 'White-Glove VIP',
                    price: 890,
                    crew: '4 Movers + Full Packing',
                    desc: 'Complete packing of all boxes, wardrobe boxes, unpack to surfaces.'
                  }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        tier: t.id,
                        tier_name: t.name,
                        total_price: t.price
                      })
                    }
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.tier === t.id
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900">{t.name}</div>
                    <div className="text-lg font-black text-amber-600 mt-1">£{t.price}</div>
                    <div className="text-[11px] font-semibold text-slate-700 mt-1">{t.crew}</div>
                    <p className="text-[11px] text-slate-500 mt-2">{t.desc}</p>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Packing Service Preference
                </label>
                <select
                  value={formData.packingService}
                  onChange={(e) => setFormData({ ...formData, packingService: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="Self-Pack (You pack all boxes)">Self-Pack (You pack all boxes)</option>
                  <option value="Fragile Packing (Kitchen china, mirrors, fine art)">Fragile Packing (Kitchen china, mirrors, fine art)</option>
                  <option value="Full Professional Packing (Everything boxed for you)">Full Professional Packing (Everything boxed for you)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Special Instructions or Access Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Narrow driveway, narrow stairs, parking suspension booked, piano on site..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Contact Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 3: Contact Information &amp; Dispatch Point
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Lead Customer Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Mobile Phone (for Driver SMS updates) *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +44 7700 900123"
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Email Address (for Booking Voucher) *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. sarah.j@example.com"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Preferred Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'Card on Completion', label: 'Card on Completion', icon: CreditCard },
                      { id: 'Bank Transfer (BACS)', label: 'Bank Transfer (BACS)', icon: FileText },
                      { id: 'Corporate Invoice', label: 'Company 30-Day Net', icon: Truck }
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, payment_method: p.id })}
                        className={`p-3 rounded-lg border text-left text-xs cursor-pointer flex items-center gap-2 ${
                          formData.payment_method === p.id
                            ? 'border-amber-500 bg-amber-50 font-bold text-slate-900'
                            : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        <p.icon className="w-4 h-4 text-amber-500" />
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 4: Review &amp; Confirm Your Reservation
              </h3>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Primary Contact</span>
                    <span className="font-bold text-slate-900">{formData.customer_name}</span>
                    <div className="text-slate-600">{formData.customer_phone} • {formData.customer_email}</div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Scheduled Date &amp; Window</span>
                    <span className="font-bold text-slate-900">{formData.move_date}</span>
                    <div className="text-slate-600">{formData.time_slot}</div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Pickup Location</span>
                    <span className="font-semibold text-slate-900">{formData.pickup_address}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Dropoff Location</span>
                    <span className="font-semibold text-slate-900">{formData.dropoff_address}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-bold text-slate-900">{formData.tier_name}</span>
                    <span className="text-slate-500 text-xs block">{formData.packingService}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-600">£{formData.total_price}</span>
                    <span className="text-[10px] text-slate-400 block">inc. VAT &amp; £100k insurance</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>By confirming, your slot is instantly reserved. No upfront payment is required today.</span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitBooking}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-lg text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Reserving Move...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm &amp; Lock In Booking</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
