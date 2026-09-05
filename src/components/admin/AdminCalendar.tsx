import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Truck,
  DollarSign,
  X,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';

export function AdminCalendar() {
  const { bookings, teams, vehicles } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterType, setFilterType] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Calendar Grid generation
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const getServiceColor = (serviceType: string) => {
    if (serviceType.includes('Clean') && serviceType.includes('Move')) return 'bg-indigo-100 text-indigo-900 border-indigo-300';
    if (serviceType.includes('Clean')) return 'bg-purple-100 text-purple-900 border-purple-300';
    if (serviceType.includes('Commercial')) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    return 'bg-blue-100 text-blue-900 border-blue-300';
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterType === 'ALL') return true;
    return b.service_type.toLowerCase().includes(filterType.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dispatch Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visual schedule of fleet trucks, moving crews, and deep cleaning operations.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs self-start">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-xs sm:text-sm text-slate-900 min-w-32 text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-500 mr-1">Filter:</span>
          {['ALL', 'Moving', 'Cleaning', 'Commercial'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                filterType === f ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            Residential
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
            Cleaning
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            Commercial
          </span>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="grid grid-cols-7 text-center bg-slate-50 border-b border-slate-200 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-28 sm:h-32 bg-slate-50/40" />;
            }

            const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayBookings = filteredBookings.filter((b) => b.move_date === formattedDate);
            const isToday =
              new Date().toISOString().split('T')[0] === formattedDate;

            return (
              <div
                key={`day-${day}`}
                className={`h-28 sm:h-32 p-1.5 sm:p-2 overflow-y-auto transition-colors ${
                  isToday ? 'bg-blue-50/40' : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-extrabold ${
                      isToday
                        ? 'w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center'
                        : 'text-slate-700'
                    }`}
                  >
                    {day}
                  </span>
                  {dayBookings.length > 0 && (
                    <span className="text-[10px] text-slate-400 font-bold">
                      {dayBookings.length} job{dayBookings.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayBookings.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className={`w-full text-left p-1 rounded border text-[10px] leading-tight font-bold truncate block transition-transform hover:scale-102 ${getServiceColor(
                        b.service_type
                      )}`}
                    >
                      {b.customer_name} • {b.preferred_time}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Details Dialog */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs p-4 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-full">
                {selectedBooking.booking_number}
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                {selectedBooking.status}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              {selectedBooking.customer_name}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {selectedBooking.service_type}
            </p>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">ROUTE</span>
                  <span className="font-semibold text-slate-800">
                    {selectedBooking.pickup_address} → {selectedBooking.dropoff_address}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-700 shrink-0" />
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">SCHEDULE</span>
                  <span className="font-semibold text-slate-800">
                    {selectedBooking.move_date} at {selectedBooking.preferred_time}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">CREW TEAM</span>
                  <span className="font-bold text-slate-800">{selectedBooking.team_assigned || 'Unassigned'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">VEHICLE</span>
                  <span className="font-bold text-slate-800">{selectedBooking.vehicle_assigned || 'Unassigned'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Total Amount</span>
                <span className="text-lg font-black text-blue-950">
                  Ksh. {selectedBooking.total_amount.toLocaleString('en-KE')}
                </span>
              </div>

              <a
                href={`https://wa.me/${selectedBooking.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedBooking.customer_name)}%2C%20confirming%20our%20arrival%20time%20for%20your%20move%20on%20${selectedBooking.move_date}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                Send Arrival Update
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
