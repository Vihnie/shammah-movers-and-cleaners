import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  MousePointerClick,
  Eye,
  Smartphone,
  Monitor,
  Calendar,
  Sparkles,
  RotateCcw,
  ArrowUpRight,
  PhoneCall,
  MessageSquare,
  FileCheck,
  CheckCircle,
  Clock,
  Activity,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AdminReports() {
  const { analytics, leads, quotes, bookings, payments, simulateVisitorClick, resetAnalytics } = useApp();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Revenue totals
  const totalRevenue = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  // Conversion calculations
  const totalInquiries = leads.length;
  const totalConfirmedMoves = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length;
  const conversionRate = totalInquiries > 0 ? Math.round((totalConfirmedMoves / totalInquiries) * 100) : 0;

  // Filter clicks
  const filteredClicks = activeCategoryFilter === 'all'
    ? (analytics.clickEvents || [])
    : (analytics.clickEvents || []).filter((c) => c.category === activeCategoryFilter);

  // Categorized counts
  const categoryCounts = (analytics.clickEvents || []).reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'whatsapp':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'call':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'quote':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'booking':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'calculator':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Website Analytics & Telemetry
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Monitoring
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time click tracking, visitor sessions, and lead funnel conversion telemetry.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={simulateVisitorClick}
            className="px-3.5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            title="Simulate visitor interaction on the website"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Visitor Activity</span>
          </button>

          <button
            onClick={resetAnalytics}
            className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
            title="Reset telemetry counters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Clicks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Recorded Clicks
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{analytics.totalClicks}</div>
          <span className="text-[11px] text-blue-700 font-bold mt-1 inline-flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Real-time user engagements
          </span>
        </div>

        {/* Active Live Visitors */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Visitors (15m)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <span>{analytics.activeUsers || 1}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 inline-flex items-center gap-1">
            Online currently on site
          </span>
        </div>

        {/* Total Page Views */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Page Impressions
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{analytics.pageViews}</div>
          <span className="text-[11px] text-purple-700 font-bold mt-1 block">
            {analytics.totalUsers} unique visitor fingerprints
          </span>
        </div>

        {/* Funnel Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Quote-to-Move Conversion
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{conversionRate}%</div>
          <span className="text-[11px] text-amber-700 font-bold mt-1 block">
            {totalConfirmedMoves} booked from {totalInquiries} leads
          </span>
        </div>
      </div>

      {/* Engagement Channels Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'whatsapp' ? 'all' : 'whatsapp')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeCategoryFilter === 'whatsapp'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-500'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold">WhatsApp</span>
          </div>
          <div className="text-xl font-black">{categoryCounts['whatsapp'] || 0}</div>
          <span className="text-[10px] opacity-70">Hotline clicks</span>
        </div>

        <div
          onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'call' ? 'all' : 'call')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeCategoryFilter === 'call'
              ? 'bg-blue-900 text-white border-blue-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-500'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <PhoneCall className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold">Phone Calls</span>
          </div>
          <div className="text-xl font-black">{categoryCounts['call'] || 0}</div>
          <span className="text-[10px] opacity-70">Direct dials</span>
        </div>

        <div
          onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'quote' ? 'all' : 'quote')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeCategoryFilter === 'quote'
              ? 'bg-purple-900 text-white border-purple-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-purple-500'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <FileCheck className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold">Quote Requests</span>
          </div>
          <div className="text-xl font-black">{categoryCounts['quote'] || 0}</div>
          <span className="text-[10px] opacity-70">Form inquiries</span>
        </div>

        <div
          onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'calculator' ? 'all' : 'calculator')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeCategoryFilter === 'calculator'
              ? 'bg-amber-900 text-white border-amber-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-amber-500'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold">Calculator</span>
          </div>
          <div className="text-xl font-black">{categoryCounts['calculator'] || 0}</div>
          <span className="text-[10px] opacity-70">Estimator uses</span>
        </div>

        <div
          onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'booking' ? 'all' : 'booking')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeCategoryFilter === 'booking'
              ? 'bg-indigo-900 text-white border-indigo-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-500'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold">Bookings</span>
          </div>
          <div className="text-xl font-black">{categoryCounts['booking'] || 0}</div>
          <span className="text-[10px] opacity-70">Confirmed moves</span>
        </div>

        <div
          onClick={() => setActiveCategoryFilter('all')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeCategoryFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold">All Events</span>
          </div>
          <div className="text-xl font-black">{analytics.clickEvents?.length || 0}</div>
          <span className="text-[10px] opacity-70">View all stream</span>
        </div>
      </div>

      {/* Real-Time Live Feed Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-900" />
              Live Visitor Click & Interaction Stream
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Every button, call link, calculator slide, and form submission clicked on the public website.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredClicks.length} events
            </span>
          </div>
        </div>

        {filteredClicks.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No events recorded yet under this filter. Click &quot;Simulate Visitor Activity&quot; above to see real-time events.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-3 font-bold">Time</th>
                  <th className="pb-3 font-bold">Action / Label</th>
                  <th className="pb-3 font-bold">Category</th>
                  <th className="pb-3 font-bold">Website Page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClicks.map((clk) => (
                  <tr key={clk.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 text-slate-500 flex items-center gap-1.5 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {clk.timestamp}
                    </td>
                    <td className="py-3 font-semibold text-slate-900 max-w-md">
                      {clk.label}
                    </td>
                    <td className="py-3 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getCategoryBadge(clk.category)}`}>
                        {clk.category.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {clk.path}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
