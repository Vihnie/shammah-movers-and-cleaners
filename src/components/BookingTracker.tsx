import React, { useState, useEffect } from 'react';
import { Search, Truck, MapPin, Calendar, Clock, CheckCircle2, Phone, AlertCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking, BookingDetails } from '../types';

interface BookingTrackerProps {
  userBookings?: BookingDetails[];
  initialSearchId?: string;
  onOpenBooking?: () => void;
}

export const BookingTracker: React.FC<BookingTrackerProps> = ({ userBookings, initialSearchId, onOpenBooking }) => {
  const { selectedBookingId, setSelectedBookingId } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchId || selectedBookingId || 'SM-98214');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookingStatus = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      // First check local userBookings if provided
      if (userBookings && userBookings.length > 0) {
        const local = userBookings.find(
          (b) => b.id.toLowerCase() === query.trim().toLowerCase() ||
                 (b.booking_number && b.booking_number.toLowerCase() === query.trim().toLowerCase())
        );
        if (local) {
          setBooking(local);
          setSelectedBookingId(local.id);
          setIsLoading(false);
          return;
        }
      }

      const res = await fetch(`/api/bookings/track/${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data);
        setSelectedBookingId(data.id);
      } else {
        setError('No active booking found matching that reference or email address.');
        setBooking(null);
      }
    } catch (err) {
      setError('Unable to reach dispatch tracking service. Please verify your reference.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const target = initialSearchId || selectedBookingId;
    if (target) {
      setSearchQuery(target);
      fetchBookingStatus(target);
    } else {
      fetchBookingStatus('SM-98214');
    }
  }, [selectedBookingId, initialSearchId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookingStatus(searchQuery);
  };

  const getStepIndex = (status?: string) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'In Progress':
        return 2;
      case 'Completed':
        return 3;
      default:
        return 1;
    }
  };

  const currentStep = getStepIndex(booking?.status);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[75vh]" id="tracker">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5" />
            Live Dispatch Telemetry
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Track Your Move &amp; Assigned Crew
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Enter your booking reference (e.g., <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">SM-98214</code>) or registered email address.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Enter Booking Ref (SM-XXXXX) or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 shadow-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Locate Move'}
          </button>
        </form>

        {error && (
          <div className="max-w-xl mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {booking && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-8">
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-900">
                    Booking #{booking.id}
                  </h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      booking.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : booking.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lead Contact: <span className="font-semibold text-slate-700">{booking.customer_name}</span> ({booking.customer_phone})
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-400 block">Total Agreed Price</span>
                <span className="text-xl font-extrabold text-amber-600">£{booking.total_price}</span>
                <span className="text-[10px] text-slate-500 block">{booking.payment_method}</span>
              </div>
            </div>

            {/* Stepper Progression */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Milestone Progress
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { title: '1. Reserved', desc: 'Date & slot locked in system' },
                  { title: '2. Crew Assigned', desc: 'Fleet vehicle & team allocated' },
                  { title: '3. In Transit', desc: 'Goods secured and moving' },
                  { title: '4. Delivered', desc: 'Unloaded & signed off' }
                ].map((st, i) => (
                  <div
                    key={st.title}
                    className={`p-4 rounded-xl border transition-all ${
                      i <= currentStep
                        ? 'bg-emerald-50/60 border-emerald-300 text-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          i <= currentStep ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                        }`}
                      >
                        {i <= currentStep ? '✓' : i + 1}
                      </div>
                      <span className="font-bold text-xs">{st.title}</span>
                    </div>
                    <p className="text-[11px] leading-tight">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Move Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs">
              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>Route Itinerary</span>
                </h5>
                <div className="pl-6 border-l-2 border-amber-300 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup Location</span>
                    <span className="font-semibold text-slate-800">{booking.pickup_address}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Destination</span>
                    <span className="font-semibold text-slate-800">{booking.dropoff_address}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>Scheduling &amp; Dispatch</span>
                </h5>
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheduled Date:</span>
                    <span className="font-semibold">{booking.move_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Arrival Window:</span>
                    <span className="font-semibold">{booking.time_slot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service Plan:</span>
                    <span className="font-semibold">{booking.tier_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transit Insurance:</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Active (£100k)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver & Support Contact */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm">
                  SM
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Dedicated Move Coordinator: Marcus Vance</div>
                  <div className="text-[11px] text-slate-400">Assigned Vehicle: Mercedes Sprinter 315 Luton (SW23 MVE)</div>
                </div>
              </div>
              <a
                href="tel:+442079460912"
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Dispatch Desk</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
