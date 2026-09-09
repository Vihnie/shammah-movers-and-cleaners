import React, { useState } from 'react';
import {
  Users,
  FileText,
  CalendarCheck,
  CheckCircle2,
  DollarSign,
  Truck,
  ArrowUpRight,
  Plus,
  MessageCircle,
  Calendar,
  Clock,
  ArrowRight,
  MousePointerClick,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Star,
  ChevronRight,
  Trash2,
  ShieldCheck,
  Inbox,
  Send,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AdminDashboard() {
  const {
    leads,
    quotes,
    bookings,
    payments,
    vehicles,
    staff,
    reviews,
    analytics,
    simulateVisitorClick,
    resetAnalytics,
    navigateTo,
  } = useApp();

  const [activeSubmissionsTab, setActiveSubmissionsTab] = useState<'all' | 'quotes' | 'bookings' | 'messages' | 'reviews'>('all');
  const [showLiveStream, setShowLiveStream] = useState(false);

  // Core KPIs
  const newLeadsCount = leads.filter((l) => l.status === 'NEW').length;
  const pendingQuotesCount = quotes.filter((q) => q.status === 'PENDING' || q.status === 'SENT').length;
  const confirmedMovesCount = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS').length;
  const completedJobsCount = bookings.filter((b) => b.status === 'COMPLETED').length;

  const totalRevenueKsh = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const availableVehiclesCount = vehicles.filter((v) => v.status === 'AVAILABLE').length;
  const recentLeads = [...leads].reverse().slice(0, 5);
  const upcomingBookings = bookings.filter((b) => b.status !== 'CANCELLED').slice(0, 4);

  // Compile all client submissions from frontend chronologically
  const formattedQuotes = quotes.map((q) => ({
    id: q.id,
    type: 'quote' as const,
    title: `Quote Request #${q.quote_number}`,
    customerName: q.customer_name,
    customerPhone: q.customer_phone || (q as any).phone || '',
    customerEmail: q.customer_email || (q as any).email || '',
    route: `${q.moving_from} → ${q.moving_to}`,
    serviceType: q.service_type,
    amount: q.total_amount ?? (q as any).total ?? 0,
    status: q.status,
    date: q.created_at || q.valid_until || 'Recently',
    notes: q.notes,
    items: q.items,
  }));

  const formattedBookings = bookings.map((b) => ({
    id: b.id,
    type: 'booking' as const,
    title: `Booking #${b.id}`,
    customerName: b.customerName || (b as any).customer_name || 'Customer',
    customerPhone: b.customerPhone || (b as any).phone || '',
    customerEmail: b.customerEmail || (b as any).email || '',
    route: `${b.pickupAddress || (b as any).pickup_address || 'Pickup'} → ${b.dropoffAddress || (b as any).dropoff_address || 'Dropoff'}`,
    serviceType: b.serviceType || (b as any).service_type || 'Relocation',
    amount: b.pricing?.totalPrice ?? (b as any).total_amount ?? 0,
    status: b.status,
    date: b.moveDate || (b as any).move_date || 'Upcoming',
    notes: b.specialInstructions || (b as any).notes || `Tier: ${b.tier}`,
    items: [],
  }));

  const formattedContactMessages = leads
    .filter((l) => l.notes?.includes('Contact Form Message') || l.message)
    .map((l) => ({
      id: l.id,
      type: 'message' as const,
      title: `Contact Inquiry #${l.id}`,
      customerName: l.customer_name,
      customerPhone: l.phone,
      customerEmail: l.email,
      route: l.moving_from !== 'Contact Inquiry' ? `${l.moving_from} → ${l.moving_to || 'Local'}` : 'Direct Web Inquiry',
      serviceType: l.service_type,
      amount: 0,
      status: l.status,
      date: l.created_at || l.move_date,
      notes: l.message || l.notes?.replace('Contact Form Message: ', ''),
      items: [],
    }));

  const formattedReviews = reviews.map((r) => ({
    id: r.id,
    type: 'review' as const,
    title: `Customer Review (${r.rating}★)`,
    customerName: r.author_name,
    customerPhone: '',
    customerEmail: '',
    route: r.location || 'Nairobi Area',
    serviceType: r.service_rendered || 'Moving Service',
    amount: 0,
    status: r.verified ? 'VERIFIED' : 'PENDING',
    date: r.date,
    notes: `"${r.comment}"`,
    items: [],
  }));

  // Combine and sort submissions by date
  const allSubmissions = [
    ...formattedQuotes,
    ...formattedBookings,
    ...formattedContactMessages,
    ...formattedReviews,
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const displayedSubmissions = allSubmissions.filter((item) => {
    if (activeSubmissionsTab === 'quotes') return item.type === 'quote';
    if (activeSubmissionsTab === 'bookings') return item.type === 'booking';
    if (activeSubmissionsTab === 'messages') return item.type === 'message';
    if (activeSubmissionsTab === 'reviews') return item.type === 'review';
    return true;
  });

  const mobileSessions = analytics?.activeSessions?.filter((s) => s.isMobile).length || 0;
  const desktopSessions = (analytics?.activeSessions?.length || 0) - mobileSessions;

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Operations & Analytics Portal
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time pipeline, website traffic telemetry, and inbound customer submissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigateTo('/admin/quotes')}
            className="px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Quote</span>
          </button>
          <button
            onClick={() => navigateTo('/admin/leads')}
            className="px-3.5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Inbound Leads ({newLeadsCount})</span>
          </button>
          <button
            onClick={() => navigateTo('/admin/sheets')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Google Sheets Sync</span>
          </button>
          <button
            onClick={() => navigateTo('/admin/payments')}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* 1. WEBSITE TRAFFIC & USER TELEMETRY (Requested by user) */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black tracking-tight text-white">
                Live Website Traffic & Visitor Telemetry
              </h2>
            </div>
            <p className="text-xs text-blue-200/80 mt-1">
              Active visitors, total click telemetry, and public interaction tracking
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => simulateVisitorClick()}
              className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30 text-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Test telemetry counter incrementing in real-time"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Simulate Visitor Click</span>
            </button>

            <button
              onClick={() => setShowLiveStream(!showLiveStream)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showLiveStream
                  ? 'bg-purple-600 text-white border-purple-400'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/20'
              }`}
            >
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>{showLiveStream ? 'Hide Click Stream' : 'View Click Stream'}</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all website telemetry counts?')) {
                  resetAnalytics();
                }
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
              title="Reset Analytics"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Main Website Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Total Website Clicks */}
          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                  <MousePointerClick className="w-4 h-4 text-blue-400" />
                  Total Website Clicks
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-extrabold">
                  Telemetry
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {(analytics?.totalClicks || 0).toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Recorded interactions across buttons, CTAs, hotlines & forms
              </p>
            </div>

            {/* Click Breakdown Chips */}
            <div className="pt-4 mt-4 border-t border-white/10 flex flex-wrap gap-1.5">
              <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-md font-medium">
                Quotes: {analytics?.clicksByCategory?.quote || 0}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-medium">
                WhatsApp: {analytics?.clicksByCategory?.whatsapp || 0}
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md font-medium">
                Calls: {analytics?.clicksByCategory?.call || 0}
              </span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md font-medium">
                Bookings: {analytics?.clicksByCategory?.booking || 0}
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-medium">
                Calc: {analytics?.clicksByCategory?.calculator || 0}
              </span>
            </div>
          </div>

          {/* 2. Total Users & Visitors */}
          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-purple-400" />
                  Total Unique Users
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-extrabold">
                  All-Time
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {(analytics?.totalUsers || 0).toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Unique client browser footprints visiting the platform
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Today: <strong className="text-white">{analytics?.visitorsToday || 0}</strong>
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                Page Views: <strong className="text-white">{analytics?.pageViews || 0}</strong>
              </span>
            </div>
          </div>

          {/* 3. Active Users (Real-Time Live) */}
          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-5 border border-white/10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  Active Users Right Now
                </span>
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Now
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                {(analytics?.activeUsers || 1).toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Users actively browsing pages within the last 60 seconds
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                Mobile: <strong className="text-white">{mobileSessions}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                Desktop: <strong className="text-white">{Math.max(1, desktopSessions)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Expandable Live Click Stream Feed */}
        {showLiveStream && (
          <div className="mt-6 pt-5 border-t border-white/10 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                <MousePointerClick className="w-3.5 h-3.5" />
                Recent Visitor Click Events Stream (Last 15)
              </h4>
              <span className="text-[11px] text-slate-400">
                Auto-refreshes on every interaction
              </span>
            </div>

            <div className="bg-black/30 rounded-xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto max-h-60">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-white/10 bg-white/5">
                      <th className="py-2 px-3 font-semibold">Time</th>
                      <th className="py-2 px-3 font-semibold">Element / Action</th>
                      <th className="py-2 px-3 font-semibold">Category</th>
                      <th className="py-2 px-3 font-semibold">Page Route</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(analytics?.clickEvents || []).slice(0, 15).map((evt) => (
                      <tr key={evt.id} className="hover:bg-white/5 transition-colors font-mono text-[11px]">
                        <td className="py-2 px-3 text-slate-400 whitespace-nowrap">
                          {new Date(evt.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-2 px-3 text-white font-medium">
                          {evt.element}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              evt.category === 'quote'
                                ? 'bg-blue-500/20 text-blue-300'
                                : evt.category === 'whatsapp'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : evt.category === 'call'
                                ? 'bg-amber-500/20 text-amber-300'
                                : evt.category === 'booking'
                                ? 'bg-purple-500/20 text-purple-300'
                                : evt.category === 'calculator'
                                ? 'bg-indigo-500/20 text-indigo-300'
                                : 'bg-slate-500/20 text-slate-300'
                            }`}
                          >
                            {evt.category}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-400">
                          {evt.route}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. OPERATIONAL KPI TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* New Leads */}
        <div
          onClick={() => navigateTo('/admin/leads')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              New Leads
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{newLeadsCount}</div>
          <span className="text-[11px] text-blue-700 font-bold mt-1 inline-flex items-center gap-0.5">
            Require follow-up <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>

        {/* Pending Quotes */}
        <div
          onClick={() => navigateTo('/admin/quotes')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Open Quotes
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{pendingQuotesCount}</div>
          <span className="text-[11px] text-amber-700 font-bold mt-1 block">
            Awaiting client review
          </span>
        </div>

        {/* Confirmed Moves */}
        <div
          onClick={() => navigateTo('/admin/bookings')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Moves
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{confirmedMovesCount}</div>
          <span className="text-[11px] text-indigo-700 font-bold mt-1 block">
            Confirmed & in progress
          </span>
        </div>

        {/* Completed Jobs */}
        <div
          onClick={() => navigateTo('/admin/bookings')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{completedJobsCount}</div>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
            Successfully moved
          </span>
        </div>

        {/* Total Revenue */}
        <div
          onClick={() => navigateTo('/admin/payments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Paid Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">
            Ksh. {totalRevenueKsh.toLocaleString('en-KE')}
          </div>
          <span className="text-[11px] text-purple-700 font-bold mt-1 block">
            M-Pesa & Bank deposits
          </span>
        </div>
      </div>

      {/* 3. CLIENT INBOUND SUBMISSIONS & QUOTES FEED (User explicit request) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Inbound Client Submissions & Frontend Quotes
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live repository receiving quotes, online bookings, and messages sent by clients from the public website
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setActiveSubmissionsTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeSubmissionsTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Submissions ({allSubmissions.length})
            </button>
            <button
              onClick={() => setActiveSubmissionsTab('quotes')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeSubmissionsTab === 'quotes'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-blue-900'
              }`}
            >
              Quotes ({formattedQuotes.length})
            </button>
            <button
              onClick={() => setActiveSubmissionsTab('bookings')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeSubmissionsTab === 'bookings'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-indigo-900'
              }`}
            >
              Bookings ({formattedBookings.length})
            </button>
            <button
              onClick={() => setActiveSubmissionsTab('messages')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeSubmissionsTab === 'messages'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-emerald-900'
              }`}
            >
              Contact Messages ({formattedContactMessages.length})
            </button>
            <button
              onClick={() => setActiveSubmissionsTab('reviews')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeSubmissionsTab === 'reviews'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-amber-900'
              }`}
            >
              Reviews ({formattedReviews.length})
            </button>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-3">
          {displayedSubmissions.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No submissions found in this category</p>
              <p className="text-xs text-slate-400 mt-1">Client submissions from the website will appear here in real time.</p>
            </div>
          ) : (
            displayedSubmissions.slice(0, 8).map((sub) => (
              <div
                key={`${sub.type}-${sub.id}`}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        sub.type === 'quote'
                          ? 'bg-blue-100 text-blue-900'
                          : sub.type === 'booking'
                          ? 'bg-indigo-100 text-indigo-900'
                          : sub.type === 'message'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {sub.type === 'quote'
                        ? 'Frontend Quote Request'
                        : sub.type === 'booking'
                        ? 'Client Move Booking'
                        : sub.type === 'message'
                        ? 'Contact Us Message'
                        : 'Customer Review'}
                    </span>

                    <span className="text-xs font-extrabold text-slate-900">
                      {sub.customerName}
                    </span>

                    {sub.customerPhone && (
                      <span className="text-xs text-slate-500 font-medium">
                        • {sub.customerPhone}
                      </span>
                    )}

                    <span className="text-[11px] text-slate-400 ml-auto md:ml-0">
                      {sub.date}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">
                      {sub.serviceType}
                    </span>
                    {sub.route && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3 h-3 text-blue-900" />
                        {sub.route}
                      </span>
                    )}
                    {sub.amount > 0 && (
                      <span className="font-extrabold text-blue-900">
                        Ksh. {sub.amount.toLocaleString('en-KE')}
                      </span>
                    )}
                  </div>

                  {sub.notes && (
                    <p className="text-xs text-slate-500 line-clamp-1 italic bg-white/70 px-2.5 py-1 rounded-lg border border-slate-200/50">
                      {sub.notes}
                    </p>
                  )}
                </div>

                {/* Instant Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                  {sub.customerPhone && (
                    <>
                      <a
                        href={`https://wa.me/${sub.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(sub.customerName)}%2C%20thank%20you%20for%20contacting%20Shammah%20Movers%20regarding%20your%20${encodeURIComponent(sub.serviceType)}%20request.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
                        title="Direct WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${sub.customerPhone.replace(/[^0-9+]/g, '')}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                        title="Direct Call"
                      >
                        <Phone className="w-3.5 h-3.5 text-blue-900" />
                        <span>Call</span>
                      </a>
                    </>
                  )}

                  <button
                    onClick={() => {
                      if (sub.type === 'quote') navigateTo('/admin/quotes');
                      else if (sub.type === 'booking') navigateTo('/admin/bookings');
                      else if (sub.type === 'message') navigateTo('/admin/leads');
                      else navigateTo('/admin/reviews');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. FLEET READINESS & STAFF SCHEDULE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm">Vehicle Fleet Readiness</h4>
              <p className="text-xs text-slate-400">
                {availableVehiclesCount} of {vehicles.length} trucks available for dispatch today
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('/admin/vehicles')}
            className="text-xs text-blue-300 hover:text-white font-bold underline cursor-pointer"
          >
            Manage Fleet
          </button>
        </div>

        <div className="bg-blue-950 text-white rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-purple-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm">Staff & Crew Teams</h4>
              <p className="text-xs text-blue-200">
                {staff.filter((s) => s.status === 'AVAILABLE').length} of {staff.length} team members ready
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('/admin/staff')}
            className="text-xs text-purple-300 hover:text-white font-bold underline cursor-pointer"
          >
            Manage Teams
          </button>
        </div>
      </div>

      {/* 5. RECENT INBOUND LEADS & UPCOMING BOOKINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inbound Leads */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Recent Inbound Leads
              </h3>
              <p className="text-xs text-slate-500">
                New quote inquiries requiring phone/WhatsApp confirmation
              </p>
            </div>
            <button
              onClick={() => navigateTo('/admin/leads')}
              className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({leads.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-2.5 font-bold">Customer</th>
                  <th className="pb-2.5 font-bold">Service & Route</th>
                  <th className="pb-2.5 font-bold">Status</th>
                  <th className="pb-2.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">
                      <div>{lead.customer_name}</div>
                      <span className="text-[11px] text-slate-400 font-normal">{lead.phone}</span>
                    </td>
                    <td className="py-3 text-slate-600">
                      <div className="font-medium text-slate-800">{lead.service_type}</div>
                      <span className="text-[11px] text-slate-400">
                        {lead.moving_from} → {lead.moving_to || 'Local'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          lead.status === 'NEW'
                            ? 'bg-blue-100 text-blue-800'
                            : lead.status === 'CONTACTED'
                            ? 'bg-amber-100 text-amber-800'
                            : lead.status === 'QUOTED'
                            ? 'bg-purple-100 text-purple-800'
                            : lead.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.customer_name)}%2C%20this%20is%20Shammah%20Movers%20regarding%20your%20quote%20request.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                        title="Quick WhatsApp Follow-up"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Upcoming Dispatch Schedule
              </h3>
              <p className="text-xs text-slate-500">
                Scheduled moves & cleaning teams
              </p>
            </div>
            <button
              onClick={() => navigateTo('/admin/calendar')}
              className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingBookings.map((b) => {
              const customerName = b.customerName || (b as any).customer_name || 'Valued Client';
              const serviceType = b.serviceType || (b as any).service_type || 'Move & Clean';
              const pickup = b.pickupAddress || (b as any).pickup_address || 'Pickup';
              const dropoff = b.dropoffAddress || (b as any).dropoff_address || 'Destination';
              const moveDate = b.moveDate || (b as any).move_date || 'Upcoming';
              const timeSlot = b.timeSlot || (b as any).preferred_time || 'Morning Window';
              const totalAmount = b.pricing?.totalPrice ?? (b as any).total_amount ?? 0;

              return (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/80 transition-colors flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-extrabold text-slate-900 text-xs">
                        {customerName}
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-1.5 py-0.2 rounded">
                        {serviceType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {pickup} → {dropoff}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-2 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-blue-900" />
                        {moveDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-700" />
                        {timeSlot}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-xs text-slate-900 block">
                      Ksh. {totalAmount.toLocaleString('en-KE')}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        b.status === 'CONFIRMED'
                          ? 'text-emerald-700'
                          : b.status === 'IN_PROGRESS'
                          ? 'text-blue-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
