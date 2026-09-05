import React, { useState } from 'react';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  Calendar, 
  User, 
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { BookingDetails } from '../types';
import { SAMPLE_BOOKINGS } from '../data/mockData';
import { formatCurrency } from '../utils/pricing';

interface BookingTrackerProps {
  userBookings: BookingDetails[];
  initialSearchId?: string;
  onOpenBooking: () => void;
}

export function BookingTracker({ userBookings, initialSearchId = '', onOpenBooking }: BookingTrackerProps) {
  const [searchInput, setSearchInput] = useState<string>(initialSearchId);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(() => {
    if (initialSearchId) {
      const all = [...userBookings, ...SAMPLE_BOOKINGS];
      return all.find((b) => b.id.toLowerCase() === initialSearchId.toLowerCase()) || null;
    }
    return userBookings.length > 0 ? userBookings[0] : SAMPLE_BOOKINGS[0];
  });
  const [searchError, setSearchError] = useState<string>('');

  const allBookings = [...userBookings, ...SAMPLE_BOOKINGS];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const query = searchInput.trim().toLowerCase();
    if (!query) {
      setSearchError('Please enter a booking reference or phone number');
      return;
    }

    const found = allBookings.find(
      (b) =>
        b.id.toLowerCase() === query ||
        b.customerPhone.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
        b.customerEmail.toLowerCase().includes(query)
    );

    if (found) {
      setSelectedBooking(found);
    } else {
      setSearchError(`No booking found matching "${searchInput}". Check your reference or try demo ID "SHM-7824".`);
    }
  };

  const getStatusStep = (status: BookingDetails['status']) => {
    switch (status) {
      case 'confirmed': return 1;
      case 'crew_assigned': return 2;
      case 'in_transit': return 3;
      case 'completed': return 4;
      default: return 1;
    }
  };

  const currentStep = selectedBooking ? getStatusStep(selectedBooking.status) : 1;

  return (
    <section id="track" className="py-12 lg:py-16 bg-slate-50 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Search className="w-3.5 h-3.5" />
            <span>Live Dispatch Tracker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Track Your Moving & Cleaning Order
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
            Enter your 8-digit reservation code (e.g. <span className="font-mono font-bold text-blue-900">#SHM-7824</span>) or phone number to view real-time crew assignment and status.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Reference (e.g. SHM-7824) or Phone"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>Track</span>
            </button>
          </form>

          {searchError && (
            <div className="mt-2.5 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Quick sample chips */}
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 justify-center">
            <span>Quick Demo Codes:</span>
            {['SHM-7824', 'SHM-6190'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setSearchInput(code);
                  const found = allBookings.find((b) => b.id === code);
                  if (found) setSelectedBooking(found);
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 rounded-lg font-mono font-bold text-blue-900 border border-slate-200 shadow-2xs"
              >
                #{code}
              </button>
            ))}
          </div>
        </div>

        {/* Tracker Result Display */}
        {selectedBooking ? (
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
            
            {/* Top Bar with Status Tag */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Order #{selectedBooking.id}
                  </span>
                  <span className="bg-purple-500/30 text-purple-200 border border-purple-400/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    {selectedBooking.serviceType.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-blue-200">
                  Booked for: <strong className="text-white">{selectedBooking.customerName}</strong> • {selectedBooking.tierName}
                </p>
              </div>

              <div className="text-right bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
                <span className="text-[10px] text-blue-200 uppercase font-bold block">Service Date</span>
                <span className="text-base font-extrabold text-white">
                  {selectedBooking.moveDate} ({selectedBooking.timeSlot})
                </span>
              </div>
            </div>

            {/* Stepper Status Timeline */}
            <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                {[
                  { step: 1, title: '1. Confirmed', desc: 'Order placed & scheduled' },
                  { step: 2, title: '2. Crew Assigned', desc: 'Truck & lead ready' },
                  { step: 3, title: '3. In Progress', desc: 'Packing & Transit' },
                  { step: 4, title: '4. Completed', desc: 'Signed off & clean' },
                ].map((s) => {
                  const isDone = currentStep >= s.step;
                  const isCurrent = currentStep === s.step;
                  return (
                    <div key={s.step} className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xs transition-all ${
                          isDone
                            ? 'bg-blue-900 text-white shadow-sm'
                            : 'bg-slate-200 text-slate-500'
                        } ${isCurrent ? 'ring-4 ring-purple-200' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5 text-purple-300" /> : s.step}
                      </div>
                      <div>
                        <span
                          className={`font-bold text-xs sm:text-sm block ${
                            isDone ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {s.title}
                        </span>
                        <span className="text-[11px] text-slate-500 leading-tight block">
                          {s.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Parameters Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Assigned Crew Card */}
              {selectedBooking.assignedCrew && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Truck className="w-6 h-6 text-purple-300" />
                    </div>
                    <div>
                      <span className="font-extrabold text-blue-950 text-sm block">
                        {selectedBooking.assignedCrew.truckNumber}
                      </span>
                      <span className="text-xs text-blue-800">
                        Crew Lead: <strong>{selectedBooking.assignedCrew.leadName}</strong> • {selectedBooking.assignedCrew.crewCount} Certified Movers
                      </span>
                    </div>
                  </div>

                  <a
                    href="tel:+18005557426"
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Crew Lead</span>
                  </a>
                </div>
              )}

              {/* Addresses and Inventory Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-900" />
                    <span>Locations & Route</span>
                  </span>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Origin</span>
                    <p className="font-semibold text-slate-800">{selectedBooking.pickupAddress}</p>
                    <span className="text-slate-500">Access: {selectedBooking.pickupAccess}</span>
                  </div>
                  {selectedBooking.dropoffAddress && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Destination</span>
                      <p className="font-semibold text-slate-800">{selectedBooking.dropoffAddress}</p>
                      <span className="text-slate-500">Access: {selectedBooking.dropoffAccess}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Package Specs & Pricing</span>
                  </span>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Size:</span>
                      <strong className="text-slate-800">{selectedBooking.calculatorState.sqft} sq ft</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Distance:</span>
                      <strong className="text-slate-800">{selectedBooking.calculatorState.distanceMiles} miles</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment:</span>
                      <strong className="text-slate-800 capitalize">{selectedBooking.paymentMethod.replace(/_/g, ' ')}</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-extrabold">
                      <span className="text-slate-900">Total Price:</span>
                      <span className="text-blue-900">{formatCurrency(selectedBooking.pricing.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No Active Booking Selected</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Enter a reference code above or create a new booking reservation.
            </p>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl"
            >
              Book New Service
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
