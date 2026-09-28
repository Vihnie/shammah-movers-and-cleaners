import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Database,
  Filter,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FLEET_DATA } from '../../data/initialData';
import { Booking } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    bookings,
    leads,
    quotes,
    updateBookingStatus,
    fetchBookings,
    fetchLeads,
    createQuote,
    dbConnected
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'leads' | 'quotes' | 'fleet' | 'database'>('bookings');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchBookings(), fetchLeads()]);
    setIsRefreshing(false);
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
  const activeMoves = bookings.filter((b) => b.status === 'In Progress' || b.status === 'Confirmed').length;
  const completedMoves = bookings.filter((b) => b.status === 'Completed').length;

  const handleConvertLead = async (leadId: string, leadName: string) => {
    const quoteNum = `Q-2026-${Math.floor(100 + Math.random() * 900)}`;
    await createQuote({
      quote_number: quoteNum,
      lead_id: leadId,
      customer_name: leadName,
      customer_email: 'client@example.com',
      customer_phone: '+44 7700 900000',
      service_type: 'Residential Home Moves',
      moving_from: 'London',
      moving_to: 'Surrey',
      total_amount: 580,
      status: 'Sent',
      valid_until: '2026-10-01'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Operations Dispatch Console</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cloud SQL Synchronized • Real-time booking telemetry and fleet allocation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-600 font-medium">Cloud SQL:</span>
            <span className="font-bold text-emerald-700">
              {dbConnected ? 'Online (Postgres)' : 'Memory Fallback'}
            </span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Pipeline</span>
          <div className="text-2xl font-black text-slate-900">£{totalRevenue.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">{bookings.length} jobs booked</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400">Active / In Transit</span>
          <div className="text-2xl font-black text-blue-600">{activeMoves}</div>
          <span className="text-[10px] text-slate-500">Scheduled for execution</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400">Successfully Completed</span>
          <div className="text-2xl font-black text-emerald-600">{completedMoves}</div>
          <span className="text-[10px] text-slate-500">100% sign-off rate</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400">Pending Inquiries</span>
          <div className="text-2xl font-black text-amber-600">{leads.length}</div>
          <span className="text-[10px] text-slate-500">Awaiting callback/quote</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        {[
          { id: 'bookings', label: `Live Bookings (${bookings.length})` },
          { id: 'leads', label: `Inquiries & Leads (${leads.length})` },
          { id: 'quotes', label: `Formal Quotes (${quotes.length})` },
          { id: 'fleet', label: `Vehicles Fleet (${FLEET_DATA.length})` },
          { id: 'database', label: 'Database & SQL' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 px-3 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === t.id
                ? 'border-b-2 border-amber-500 text-slate-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Live Bookings */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-bold text-sm text-slate-900">Manage Customer Bookings</h3>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Ref ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Date &amp; Slot</th>
                  <th className="py-3 px-3">Route (Pickup → Dropoff)</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No bookings matching this filter.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{b.id}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{b.customer_name}</div>
                        <div className="text-[10px] text-slate-400">{b.customer_phone}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{b.move_date}</div>
                        <div className="text-[10px] text-slate-500">{b.time_slot}</div>
                      </td>
                      <td className="py-3 px-3 max-w-xs truncate">
                        <div className="truncate text-slate-700 font-medium">From: {b.pickup_address}</div>
                        <div className="truncate text-slate-500 text-[10px]">To: {b.dropoff_address}</div>
                      </td>
                      <td className="py-3 px-3 font-extrabold text-amber-600">
                        £{b.total_price}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : b.status === 'Confirmed'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value as any)}
                          className="bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-semibold text-slate-800 focus:outline-none cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Leads & Inquiries */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Online Quote Requests &amp; Leads</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Service &amp; Size</th>
                  <th className="py-3 px-3">Route</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold">{l.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{l.customer_name}</div>
                      <div className="text-[10px] text-slate-400">{l.phone} • {l.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div>{l.service_type}</div>
                      <div className="text-[10px] text-slate-400">{l.house_size}</div>
                    </td>
                    <td className="py-3 px-3">
                      {l.moving_from} → {l.moving_to}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleConvertLead(l.id, l.customer_name)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded text-[11px] cursor-pointer"
                      >
                        Generate Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Formal Quotes */}
      {activeTab === 'quotes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Generated Binding Quotations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Quote #</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Valid Until</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{q.quote_number}</td>
                    <td className="py-3 px-3">{q.customer_name}</td>
                    <td className="py-3 px-3">{q.service_type}</td>
                    <td className="py-3 px-3 font-bold text-amber-600">£{q.total_amount}</td>
                    <td className="py-3 px-3 text-slate-500">{q.valid_until}</td>
                    <td className="py-3 px-3">
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Vehicles Fleet */}
      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FLEET_DATA.map((veh) => (
            <div key={veh.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">{veh.id}</span>
                  <h4 className="font-bold text-sm text-slate-900">{veh.model}</h4>
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {veh.regNumber}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    veh.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : veh.status === 'On Route'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {veh.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 text-[10px] block">Capacity</span>
                  <span className="font-semibold text-slate-800">{veh.capacityCuFt} cu ft</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Assigned Driver</span>
                  <span className="font-semibold text-slate-800">{veh.driverName}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Last Location: <strong>{veh.currentLocation}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: Database & Cloud SQL info */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900">Cloud SQL PostgreSQL Configuration</h3>
          <p className="text-slate-600">
            This instance is connected via Cloud SQL Proxy at <code className="bg-slate-100 px-1.5 py-0.5 rounded">/app/cloudsql/friendly-style-gxctm:europe-west2:ai-studio-649da72c</code>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">Database Parameters:</span>
              <div className="space-y-1 text-slate-600">
                <div>Host: <code className="text-slate-800">UNIX socket</code></div>
                <div>Database: <code className="text-slate-800">cloud_sql_development_database</code></div>
                <div>User: <code className="text-slate-800">ai_studio_app_user</code></div>
                <div>Admin: <code className="text-slate-800">omugavinich@gmail.com (Vinich)</code></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">PostgreSQL Tables Managed:</span>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><code>bookings</code> ({bookings.length} rows)</li>
                <li><code>leads</code> ({leads.length} rows)</li>
                <li><code>quotes</code> ({quotes.length} rows)</li>
                <li><code>click_events</code> (analytics)</li>
                <li><code>users</code> (admin access)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
