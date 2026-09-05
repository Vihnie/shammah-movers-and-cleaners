import React, { useState } from 'react';
import {
  CalendarCheck,
  Search,
  Truck,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  DollarSign,
  Receipt,
  MessageCircle,
  X,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';

export function AdminBookings() {
  const { bookings, updateBooking, staff, teams, vehicles, createInvoiceFromBooking, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesSearch =
      b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.booking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.pickup_address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    updateBooking(bookingId, { status: newStatus });
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bookings & Field Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track confirmed jobs, assign dedicated crews and box trucks, and oversee job completions.
          </p>
        </div>

        <button
          onClick={() => navigateTo('/admin/calendar')}
          className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all self-start"
        >
          <Calendar className="w-4 h-4" />
          <span>View Dispatch Calendar</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search booking #, client, route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Booking #</th>
                <th className="p-4">Customer & Service</th>
                <th className="p-4">Route & Schedule</th>
                <th className="p-4">Assigned Crew / Vehicle</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-black text-blue-900">
                    <div>{booking.booking_number}</div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Ksh. {booking.total_amount.toLocaleString('en-KE')}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="font-extrabold text-slate-900">{booking.customer_name}</div>
                    <span className="text-[11px] text-slate-500 block">{booking.phone}</span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                      {booking.service_type}
                    </span>
                  </td>

                  <td className="p-4 text-slate-700">
                    <div className="font-medium text-slate-900 line-clamp-1">
                      {booking.pickup_address} → {booking.dropoff_address}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-blue-900" />
                        {booking.move_date}
                      </span>
                      <span>•</span>
                      <span>{booking.preferred_time}</span>
                    </div>
                  </td>

                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                      <select
                        value={booking.team_assigned || ''}
                        onChange={(e) => updateBooking(booking.id, { team_assigned: e.target.value })}
                        className="text-[11px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5"
                      >
                        <option value="">No Team</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                      <select
                        value={booking.vehicle_assigned || ''}
                        onChange={(e) => updateBooking(booking.id, { vehicle_assigned: e.target.value })}
                        className="text-[11px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5"
                      >
                        <option value="">No Truck</option>
                        {vehicles.map((v) => (
                          <option key={v.id} value={v.plate_number}>
                            {v.plate_number} ({v.model})
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  <td className="p-4">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value as Booking['status'])}
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border focus:outline-none ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : booking.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : booking.status === 'COMPLETED'
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                          : booking.status === 'CANCELLED'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>

                  <td className="p-4 text-right space-x-1.5">
                    <a
                      href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(booking.customer_name)}%2C%20this%20is%20Shammah%20Movers%20regarding%20your%20scheduled%20move%20${booking.booking_number}%20on%20${booking.move_date}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                      title="WhatsApp Customer"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => {
                        createInvoiceFromBooking(booking.id);
                        navigateTo('/admin/invoices');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-[11px]"
                      title="Generate Official Invoice"
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
