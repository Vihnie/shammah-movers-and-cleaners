import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  CalendarCheck,
  Calendar,
  UserCheck,
  Truck,
  Briefcase,
  Layers,
  CreditCard,
  Receipt,
  Star,
  Image,
  HelpCircle,
  Edit3,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Bell,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeModule?: string;
}

export function AdminLayout({ children, activeModule }: AdminLayoutProps) {
  const { adminUser, logoutAdmin, navigateTo, notifications, markNotificationsRead, currentRoute, analytics } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const currentMod = activeModule || currentRoute.replace('/admin/', '').replace('/admin', '') || 'dashboard';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/admin/dashboard' },
    { id: 'leads', label: 'Leads & CRM', icon: Users, route: '/admin/leads' },
    { id: 'quotes', label: 'Quotes', icon: FileText, route: '/admin/quotes' },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, route: '/admin/bookings' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, route: '/admin/calendar' },
    { id: 'customers', label: 'Customers', icon: UserCheck, route: '/admin/customers' },
    { id: 'staff', label: 'Staff & Teams', icon: Briefcase, route: '/admin/staff' },
    { id: 'vehicles', label: 'Vehicles & Fleet', icon: Truck, route: '/admin/vehicles' },
    { id: 'services', label: 'Services', icon: Layers, route: '/admin/services' },
    { id: 'invoices', label: 'Invoices', icon: Receipt, route: '/admin/invoices' },
    { id: 'payments', label: 'Payments (M-Pesa)', icon: CreditCard, route: '/admin/payments' },
    { id: 'reviews', label: 'Customer Reviews', icon: Star, route: '/admin/reviews' },
    { id: 'gallery', label: 'Gallery & Photos', icon: Image, route: '/admin/gallery' },
    { id: 'faq', label: 'FAQ Manager', icon: HelpCircle, route: '/admin/faq' },
    { id: 'content', label: 'Website Content', icon: Edit3, route: '/admin/content' },
    { id: 'sheets', label: 'Google Sheets Sync', icon: FileSpreadsheet, route: '/admin/sheets' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, route: '/admin/reports' },
    { id: 'settings', label: 'Business Settings', icon: Settings, route: '/admin/settings' },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 selection:bg-blue-900 selection:text-white">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-blue-950 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-blue-900 text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-black text-sm tracking-tight">SHAMMAH CRM</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('/')}
            className="px-2.5 py-1 bg-white/10 rounded-lg text-xs font-bold flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Site</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Brand */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow">
              SM
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight block leading-tight">
                SHAMMAH
              </span>
              <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold">
                Operations CRM
              </span>
            </div>
          </div>
          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
            LIVE
          </span>
        </div>

        {/* User Profile Mini Banner */}
        <div className="px-5 py-3.5 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-white block">{adminUser?.name || 'Administrator'}</span>
            <span className="text-[11px] text-slate-400">{adminUser?.role || 'Admin'}</span>
          </div>
          <button
            onClick={() => navigateTo('/')}
            title="View Public Website"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Nav Items Scrollable */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentMod === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigateTo(item.route);
                  setSidebarOpen(false);
                }}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate flex-1 text-left">{item.label}</span>
                {item.id === 'reports' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/30">
                    {analytics.totalClicks}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Logout Button in Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40">
          <button
            onClick={logoutAdmin}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Desktop Bar */}
        <div className="hidden md:flex bg-white border-b border-slate-200 px-8 py-3.5 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              Management Portal
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-blue-900 capitalize">
              {activeModule}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications drop trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) markNotificationsRead();
                }}
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown popup */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-extrabold text-slate-900">Notifications</span>
                    <span className="text-[10px] text-slate-400">Recent events</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="font-semibold text-slate-800">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigateTo('/')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-900" />
              <span>View Public Website</span>
            </button>
          </div>
        </div>

        {/* Render Inner Module */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
