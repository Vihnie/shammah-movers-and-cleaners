import React from 'react';
import { 
  CheckCircle, 
  Printer, 
  Download, 
  Calendar, 
  MessageSquare, 
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  X, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { BookingDetails } from '../types';
import { formatCurrency } from '../utils/pricing';

interface BookingReceiptModalProps {
  booking: BookingDetails;
  onClose: () => void;
  onTrackBooking: (bookingId: string) => void;
}

export function BookingReceiptModal({ booking, onClose, onTrackBooking }: BookingReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCalendarICS = () => {
    const startDate = booking.moveDate.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Shammah Movers and Cleaners//Booking Event//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Shammah Movers & Cleaners Booking (${booking.id})`,
      `DESCRIPTION:Package: ${booking.tierName}\\nPickup: ${booking.pickupAddress}\\nDropoff: ${booking.dropoffAddress}\\nEstimated Price: ${formatCurrency(booking.pricing.totalPrice)}`,
      `LOCATION:${booking.pickupAddress}`,
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${startDate}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Shammah_Booking_${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const whatsAppMessage = encodeURIComponent(
    `Hello Shammah Movers & Cleaners! I have confirmed booking #${booking.id} for ${booking.moveDate} (${booking.tierName}). Customer: ${booking.customerName}`
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-8 animate-fade-in print:m-0 print:border-none print:shadow-none">
        
        {/* Close Button (hidden when printing) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-20 print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="w-14 h-14 bg-white rounded-2xl p-2 mx-auto mb-3 shadow-lg flex items-center justify-center">
            <img src="/logo.svg" alt="Shammah Logo" className="w-full h-full object-contain" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Booking Confirmed & Locked In</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Order Reference: {booking.id}
          </h2>
          <p className="text-xs text-blue-200 mt-1 max-w-md mx-auto">
            A confirmation receipt and crew dispatch link have been sent to <strong className="text-white">{booking.customerEmail}</strong>.
          </p>
        </div>

        {/* Printable Ticket Receipt Content */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-xs sm:text-sm">
          
          {/* Top key parameters grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-500 text-[11px] block">Service Date</span>
              <strong className="text-slate-900 text-sm">{booking.moveDate}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Time Window</span>
              <strong className="text-slate-900 text-sm capitalize">{booking.timeSlot}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Package Tier</span>
              <strong className="text-purple-700 text-sm">{booking.tierName}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Total Estimate</span>
              <strong className="text-blue-900 text-sm font-black">
                {formatCurrency(booking.pricing.totalPrice)}
              </strong>
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-3 p-4 bg-white rounded-2xl border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                A
              </div>
              <div className="min-w-0">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  Origin / Pickup Address
                </span>
                <p className="font-semibold text-slate-800 text-xs sm:text-sm">
                  {booking.pickupAddress}
                </p>
                <span className="text-[11px] text-slate-500">Access: {booking.pickupAccess}</span>
              </div>
            </div>

            {booking.serviceType !== 'cleaning' && (
              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  B
                </div>
                <div className="min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                    Destination Address
                  </span>
                  <p className="font-semibold text-slate-800 text-xs sm:text-sm">
                    {booking.dropoffAddress}
                  </p>
                  <span className="text-[11px] text-slate-500">Access: {booking.dropoffAccess}</span>
                </div>
              </div>
            )}
          </div>

          {/* Assigned Crew preview */}
          {booking.assignedCrew && (
            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-blue-950 font-bold text-xs block">
                    {booking.assignedCrew.truckNumber} • {booking.assignedCrew.crewCount} Certified Movers
                  </span>
                  <span className="text-[11px] text-blue-700">
                    Lead: {booking.assignedCrew.leadName} ({booking.assignedCrew.leadPhone})
                  </span>
                </div>
              </div>
              <span className="bg-blue-200/80 text-blue-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                Assigned
              </span>
            </div>
          )}

          {/* Financial Itemization */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Square Footage ({booking.calculatorState.sqft} sqft)</span>
              <span>{formatCurrency(booking.pricing.sqftCost)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Transit Distance ({booking.calculatorState.distanceMiles} miles)</span>
              <span>{formatCurrency(booking.pricing.distanceCost)}</span>
            </div>
            {booking.pricing.comboDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>15% Move + Clean Combo Savings</span>
                <span>-{formatCurrency(booking.pricing.comboDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
              <span>Total Guaranteed Price</span>
              <span className="text-blue-900">{formatCurrency(booking.pricing.totalPrice)}</span>
            </div>
          </div>

          {/* Action Row (Print, Calendar, WhatsApp, Track) */}
          <div className="pt-4 border-t border-slate-200 space-y-3 print:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={handlePrint}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-800 text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>

              <button
                onClick={handleDownloadCalendarICS}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-800 text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-900" />
                <span>Add to Calendar</span>
              </button>

              <a
                href={`https://wa.me/15553829014?text=${whatsAppMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Support</span>
              </a>
            </div>

            <button
              onClick={() => {
                onTrackBooking(booking.id);
                onClose();
              }}
              className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>Track Live Status for #{booking.id}</span>
              <ArrowRight className="w-4 h-4 text-purple-300" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
