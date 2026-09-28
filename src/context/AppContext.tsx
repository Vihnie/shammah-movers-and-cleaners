import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Lead,
  Customer,
  BookingDetails,
  Staff,
  Team,
  Vehicle,
  ServiceItem,
  Quote,
  Invoice,
  Payment,
  Review,
  GalleryItem,
  FAQItem,
  BusinessSettings,
  CMSContent,
  LeadStatus,
  ClickEvent,
  SiteAnalytics,
} from '../types';
import { INITIAL_SERVICES,
  INITIAL_LEADS,
  INITIAL_CUSTOMERS,
  INITIAL_STAFF,
  INITIAL_TEAMS,
  INITIAL_VEHICLES,
  INITIAL_QUOTES,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_REVIEWS,
  INITIAL_GALLERY,
  INITIAL_FAQS,
  INITIAL_SETTINGS,
  INITIAL_CMS,
} from '../data/initialData';
import { SAMPLE_BOOKINGS } from '../data/mockData';
import { supabaseService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

interface AppContextType {
  // Navigation
  currentRoute: string;
  navigateTo: (route: string) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedBookingId: string | null;
  setSelectedBookingId: (id: string | null) => void;
  selectedServiceId: string;
  setSelectedServiceId: (id: string) => void;

  // Authentication
  isAdminLoggedIn: boolean;
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  loginAdmin: (emailOrPin: string, pass?: string) => boolean;
  loginWithGoogleUser: (name: string, email: string, role?: string) => void;
  logoutAdmin: () => void;

  // Database status & helpers
  dbConnected: boolean;
  fetchBookings: () => Promise<void>;
  fetchLeads: () => Promise<void>;

  // CRM Data
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => Lead;
  createLead: (leadData: any) => Promise<Lead>;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  deleteLead: (id: string) => void;

  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'created_at'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  bookings: BookingDetails[];
  addBooking: (booking: BookingDetails) => void;
  createBooking: (bookingData: Partial<BookingDetails>) => Promise<BookingDetails>;
  createInvoiceFromBooking: (bookingId: string) => void;
  updateBooking: (id: string, updates: Partial<BookingDetails>) => void;
  updateBookingStatus: (id: string, status: any) => void;

  staff: Staff[];
  addStaff: (staffMember: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  teams: Team[];
  addTeam: (team: Omit<Team, 'id'>) => void;

  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;

  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  toggleServiceActive: (id: string) => void;

  quotes: Quote[];
  addQuote: (quote: Omit<Quote, 'id' | 'quote_number' | 'created_at'>) => Quote;
  createQuote: (data: any) => Quote;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  convertQuoteToBooking: (quoteId: string) => void;

  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoice_number' | 'created_at'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;

  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id' | 'paid_at'>) => void;

  reviews: Review[];
  addReview: (review: Partial<Review> & { customer_name: string; comment: string; rating: number; service: string }) => void;
  approveReview: (id: string, approved?: boolean) => void;
  rejectReview: (id: string) => void;
  toggleFeaturedReview: (id: string) => void;
  deleteReview: (id: string) => void;

  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;

  faqs: FAQItem[];
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, updates: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;

  settings: BusinessSettings;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;

  cms: CMSContent;
  updateCMS: (newCMS: Partial<CMSContent>) => void;

  notifications: { id: string; message: string; time: string; read: boolean }[];
  markNotificationsRead: () => void;
  addNotification: (message: string) => void;

  // Website Analytics & Telemetry
  analytics: SiteAnalytics;
  trackClick: (label: string, category?: ClickEvent['category'], path?: string) => void;
  simulateVisitorClick: () => void;
  resetAnalytics: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'shammah_v2_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage:`, e);
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  // Sync route with window.location.hash for clean bookmarking & browser back/forward
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setCurrentRoute(hash || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('residential-moves');

  const currentView = (() => {
    if (currentRoute === '/' || currentRoute === '') return 'home';
    if (currentRoute === '/services') return 'services';
    if (currentRoute.startsWith('/services/')) return 'service-detail';
    if (currentRoute === '/about') return 'about';
    if (currentRoute === '/contact') return 'contact';
    if (currentRoute === '/quote' || currentRoute === '/get-a-quote') return 'calculator';
    if (currentRoute === '/tracking') return 'tracking';
    if (currentRoute.startsWith('/admin')) return 'admin';
    return currentRoute.replace('/', '');
  })();

  const setCurrentView = (view: string) => {
    if (view === 'home') navigateTo('/');
    else if (view === 'services') navigateTo('/services');
    else if (view === 'service-detail') navigateTo('/services');
    else if (view === 'about') navigateTo('/about');
    else if (view === 'contact') navigateTo('/contact');
    else if (view === 'calculator') navigateTo('/quote');
    else if (view === 'tracking') {
      navigateTo('/');
      setTimeout(() => {
        const el = document.getElementById('track');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else if (view === 'admin') navigateTo('/admin');
    else navigateTo(`/${view}`);
  };

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return loadFromStorage<boolean>('admin_auth', false);
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    return loadFromStorage<AdminUser | null>('admin_user', null);
  });

  const loginAdmin = (emailOrPin: string, pass?: string): boolean => {
    const clean = (emailOrPin || '').trim().toLowerCase();
    const cleanPass = (pass || '').trim();
    if (
      clean === '1234' ||
      clean === 'it.shammah@gmail.com' ||
      clean.includes('omugavinich') ||
      clean.includes('admin') ||
      cleanPass === 'admin@shammah' ||
      cleanPass === '1234' ||
      !cleanPass
    ) {
      const user: AdminUser = {
        name: clean.includes('@') ? clean.split('@')[0] : 'System Administrator',
        email: clean.includes('@') ? clean : 'omugavinich@gmail.com',
        role: 'System Administrator',
      };
      setIsAdminLoggedIn(true);
      setAdminUser(user);
      saveToStorage('admin_auth', true);
      saveToStorage('admin_user', user);
      return true;
    }
    return false;
  };

  const loginWithGoogleUser = (name: string, email: string, role = 'Authorized Administrator') => {
    const user: AdminUser = {
      name: name || email.split('@')[0],
      email,
      role,
    };
    setIsAdminLoggedIn(true);
    setAdminUser(user);
    saveToStorage('admin_auth', true);
    saveToStorage('admin_user', user);
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    saveToStorage('admin_auth', false);
    saveToStorage('admin_user', null);
    navigateTo('/admin/login');
  };

  // State entities with persistence
  const [leads, setLeads] = useState<Lead[]>(() => loadFromStorage('leads', INITIAL_LEADS));
  const [customers, setCustomers] = useState<Customer[]>(() => loadFromStorage('customers', INITIAL_CUSTOMERS));
  const [bookings, setBookings] = useState<BookingDetails[]>(() => loadFromStorage('bookings', SAMPLE_BOOKINGS));
  const [staff, setStaff] = useState<Staff[]>(() => loadFromStorage('staff', INITIAL_STAFF));
  const [teams, setTeams] = useState<Team[]>(() => loadFromStorage('teams', INITIAL_TEAMS));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => loadFromStorage('vehicles', INITIAL_VEHICLES));
  const [services, setServices] = useState<ServiceItem[]>(() => loadFromStorage('services', INITIAL_SERVICES));
  const [quotes, setQuotes] = useState<Quote[]>(() => loadFromStorage('quotes', INITIAL_QUOTES));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadFromStorage('invoices', INITIAL_INVOICES));
  const [payments, setPayments] = useState<Payment[]>(() => loadFromStorage('payments', INITIAL_PAYMENTS));
  const [reviews, setReviews] = useState<Review[]>(() => loadFromStorage('reviews', INITIAL_REVIEWS));
  const [gallery, setGallery] = useState<GalleryItem[]>(() => loadFromStorage('gallery', INITIAL_GALLERY));
  const [faqs, setFaqs] = useState<FAQItem[]>(() => loadFromStorage('faqs', INITIAL_FAQS));
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const loaded = loadFromStorage<BusinessSettings>('settings', INITIAL_SETTINGS);
    // Ensure official contact details & HQ address overwrite stale placeholders in localStorage
    if (
      !loaded.email2 ||
      !loaded.phone2 ||
      loaded.email === 'info@shammahmovers.co.ke' ||
      loaded.phone === '+254 722 555 742' ||
      !loaded.physical_address ||
      loaded.physical_address.includes('Westlands Commercial Hub') ||
      loaded.physical_address.includes('Rhapta Road')
    ) {
      const updated: BusinessSettings = {
        ...loaded,
        phone: INITIAL_SETTINGS.phone,
        phone2: INITIAL_SETTINGS.phone2,
        whatsapp: INITIAL_SETTINGS.whatsapp,
        email: INITIAL_SETTINGS.email,
        email2: INITIAL_SETTINGS.email2,
        support_email: INITIAL_SETTINGS.support_email,
        physical_address: INITIAL_SETTINGS.physical_address,
        mpesa_till: loaded.mpesa_till || INITIAL_SETTINGS.mpesa_till,
      };
      saveToStorage('settings', updated);
      return updated;
    }
    return loaded;
  });
  const [cms, setCMS] = useState<CMSContent>(() => loadFromStorage('cms', INITIAL_CMS));
  const [notifications, setNotifications] = useState<{ id: string; message: string; time: string; read: boolean }[]>([
    { id: 'notif-1', message: 'New Quote Request received from Faith Mwangi (Kilimani)', time: '10m ago', read: false },
    { id: 'notif-2', message: 'Deposit payment confirmed via M-Pesa Ksh. 58,824', time: '1h ago', read: false },
  ]);

  // Website Analytics & Real-time Telemetry State
  const [analytics, setAnalytics] = useState<SiteAnalytics>(() => {
    const fallback: SiteAnalytics = {
      totalClicks: 312,
      totalUsers: 148,
      activeUsers: 4,
      pageViews: 586,
      visitorsToday: 42,
      clickEvents: [
        { id: 'clk-1', label: 'Clicked WhatsApp Dispatch Hotline (0181460645)', category: 'whatsapp', path: '/', timestamp: '2m ago' },
        { id: 'clk-2', label: 'Calculated 2-Bedroom Moving Estimate (Juja → Westlands)', category: 'calculator', path: '/', timestamp: '5m ago' },
        { id: 'clk-3', label: 'Clicked Direct Call Line: 0181460645', category: 'call', path: '/', timestamp: '12m ago' },
        { id: 'clk-4', label: 'Viewed Relocation Services Catalogue', category: 'navigation', path: '/services', timestamp: '18m ago' },
        { id: 'clk-5', label: 'Selected "Pro Move + Deep Cleaning" Combo Package', category: 'booking', path: '/', timestamp: '27m ago' },
        { id: 'clk-6', label: 'Submitted Online Quick Quote Request', category: 'quote', path: '/', timestamp: '34m ago' },
      ],
      activeSessions: [
        { id: 'sess-1', lastActive: Date.now() - 40000, path: '/', isMobile: false },
        { id: 'sess-2', lastActive: Date.now() - 120000, path: '/detailed-quote', isMobile: true },
        { id: 'sess-3', lastActive: Date.now() - 260000, path: '/services', isMobile: true },
        { id: 'sess-4', lastActive: Date.now() - 410000, path: '/', isMobile: false },
      ],
    };
    return loadFromStorage<SiteAnalytics>('site_analytics', fallback);
  });

  const addNotification = (message: string) => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        message,
        time: 'Just now',
        read: false,
      },
      ...prev.slice(0, 29),
    ]);
  };

  // Visitor Identification and Live Tracking
  useEffect(() => {
    try {
      const visitorKey = 'shammah_visitor_id';
      let visitorId = localStorage.getItem(visitorKey);
      const isNew = !visitorId;
      if (isNew) {
        visitorId = 'vis_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
        localStorage.setItem(visitorKey, visitorId);
      }

      setAnalytics((prev) => {
        const now = Date.now();
        const activeClean = (prev.activeSessions || []).filter((s) => now - s.lastActive < 15 * 60 * 1000);
        const exists = activeClean.find((s) => s.id === visitorId);
        const updatedSessions = exists
          ? activeClean.map((s) => (s.id === visitorId ? { ...s, lastActive: now, path: window.location.pathname } : s))
          : [...activeClean, { id: visitorId!, lastActive: now, path: window.location.pathname, isMobile: window.innerWidth < 768 }];

        return {
          ...prev,
          totalUsers: isNew ? prev.totalUsers + 1 : prev.totalUsers,
          visitorsToday: isNew ? prev.visitorsToday + 1 : prev.visitorsToday,
          pageViews: prev.pageViews + 1,
          activeUsers: Math.max(1, updatedSessions.length),
          activeSessions: updatedSessions,
        };
      });
    } catch {
      // safe fallback
    }
  }, []);

  // Heartbeat interval to update active users count
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics((prev) => {
        const now = Date.now();
        const activeClean = (prev.activeSessions || []).filter((s) => now - s.lastActive < 15 * 60 * 1000);
        return {
          ...prev,
          activeUsers: Math.max(1, activeClean.length),
          activeSessions: activeClean,
        };
      });
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const trackClick = (label: string, category: ClickEvent['category'] = 'other', path?: string) => {
    const currentPath = path || currentRoute || '/';
    const newEvent: ClickEvent = {
      id: 'clk-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      label,
      category,
      path: currentPath,
      timestamp: 'Just now',
    };

    setAnalytics((prev) => {
      const now = Date.now();
      const visitorId = localStorage.getItem('shammah_visitor_id') || 'vis_current';
      const activeClean = (prev.activeSessions || []).filter((s) => now - s.lastActive < 15 * 60 * 1000);
      const updatedSessions = activeClean.some((s) => s.id === visitorId)
        ? activeClean.map((s) => (s.id === visitorId ? { ...s, lastActive: now, path: currentPath } : s))
        : [...activeClean, { id: visitorId, lastActive: now, path: currentPath, isMobile: window.innerWidth < 768 }];

      const updated = {
        ...prev,
        totalClicks: prev.totalClicks + 1,
        activeUsers: Math.max(1, updatedSessions.length),
        activeSessions: updatedSessions,
        clickEvents: [newEvent, ...(prev.clickEvents || []).slice(0, 49)],
      };
      saveToStorage('site_analytics', updated);
      return updated;
    });
  };

  const simulateVisitorClick = () => {
    const sampleActions: { label: string; category: ClickEvent['category']; path: string }[] = [
      { label: 'Visitor clicked WhatsApp Dispatch Hotline (0181460645)', category: 'whatsapp', path: '/' },
      { label: 'Visitor calculated move: Juja to Westlands (2-Bed)', category: 'calculator', path: '/' },
      { label: 'Visitor clicked "Book Move Now" button', category: 'booking', path: '/book' },
      { label: 'Visitor requested call back for residential move', category: 'call', path: '/contact' },
      { label: 'Visitor clicked "Get Free Instant Quote"', category: 'quote', path: '/' },
      { label: 'Visitor viewed Office Relocation Services', category: 'navigation', path: '/services' },
      { label: 'Visitor opened Moving Checklist tool', category: 'navigation', path: '/checklist' },
      { label: 'Visitor clicked Call line: 0725206307', category: 'call', path: '/' },
    ];
    const picked = sampleActions[Math.floor(Math.random() * sampleActions.length)];
    trackClick(picked.label, picked.category, picked.path);
  };

  const resetAnalytics = () => {
    const base: SiteAnalytics = {
      totalClicks: 0,
      totalUsers: 1,
      activeUsers: 1,
      pageViews: 1,
      visitorsToday: 1,
      clickEvents: [],
      activeSessions: [{ id: 'curr_sess', lastActive: Date.now(), path: '/', isMobile: false }],
    };
    setAnalytics(base);
    saveToStorage('site_analytics', base);
  };

  // Auto save handlers
  useEffect(() => saveToStorage('leads', leads), [leads]);
  useEffect(() => saveToStorage('customers', customers), [customers]);
  useEffect(() => saveToStorage('bookings', bookings), [bookings]);
  useEffect(() => saveToStorage('staff', staff), [staff]);
  useEffect(() => saveToStorage('teams', teams), [teams]);
  useEffect(() => saveToStorage('vehicles', vehicles), [vehicles]);
  useEffect(() => saveToStorage('services', services), [services]);
  useEffect(() => saveToStorage('quotes', quotes), [quotes]);
  useEffect(() => saveToStorage('invoices', invoices), [invoices]);
  useEffect(() => saveToStorage('payments', payments), [payments]);
  useEffect(() => saveToStorage('reviews', reviews), [reviews]);
  useEffect(() => saveToStorage('gallery', gallery), [gallery]);
  useEffect(() => saveToStorage('faqs', faqs), [faqs]);
  useEffect(() => saveToStorage('settings', settings), [settings]);
  useEffect(() => saveToStorage('cms', cms), [cms]);
  useEffect(() => saveToStorage('site_analytics', analytics), [analytics]);

  // Sync with Supabase on startup if configured
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    async function loadFromSupabase() {
      try {
        const [remoteLeads, remoteQuotes, remoteBookings, remoteServices, remoteReviews, remoteGallery] = await Promise.all([
          supabaseService.getLeads(),
          supabaseService.getQuotes(),
          supabaseService.getBookings(),
          supabaseService.getServices(),
          supabaseService.getReviews(),
          supabaseService.getGallery(),
        ]);
        if (remoteLeads && remoteLeads.length > 0) setLeads(remoteLeads);
        if (remoteQuotes && remoteQuotes.length > 0) setQuotes(remoteQuotes);
        if (remoteBookings && remoteBookings.length > 0) setBookings(remoteBookings);
        if (remoteServices && remoteServices.length > 0) setServices(remoteServices);
        if (remoteReviews && remoteReviews.length > 0) setReviews(remoteReviews);
        if (remoteGallery && remoteGallery.length > 0) setGallery(remoteGallery);
      } catch (err) {
        console.warn('Initial Supabase fetch note:', err);
      }
    }
    loadFromSupabase();
  }, []);

  // Lead management
  const addLead = (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Lead => {
    const newLead: Lead = {
      ...leadData,
      id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);

    // Dispatch to Supabase
    supabaseService.insertLead(newLead).catch((e) => console.warn('Supabase lead insert failed:', e));

    // Also create official Quote record in backend quotes registry if estimated price exists
    const quoteNum = `Q-2026-${Math.floor(100 + Math.random() * 900)}`;
    const estTotal = leadData.estimated_amount || 18500;
    const autoQuote: Quote = {
      id: `QT-${Date.now()}`,
      quote_number: quoteNum,
      lead_id: newLead.id,
      customer_name: leadData.customer_name,
      customer_phone: leadData.phone,
      customer_email: leadData.email,
      service_type: leadData.service_type,
      moving_from: leadData.moving_from || 'Juja / Nairobi',
      moving_to: leadData.moving_to || 'Nairobi Area',
      items: [
        {
          description: `${leadData.service_type} - Standard Package`,
          quantity: 1,
          unit_price: estTotal,
          amount: estTotal,
        },
      ],
      discount: 0,
      total_amount: estTotal,
      status: 'SENT',
      valid_until: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      notes: leadData.notes ? `Client Request: "${leadData.notes}"` : 'Generated automatically from client online form submission',
      created_at: new Date().toISOString(),
    };
    setQuotes((prev) => [autoQuote, ...prev]);

    // Also link or create customer record
    setCustomers((prev) => {
      const existing = prev.find((c) => c.phone === leadData.phone || c.email === leadData.email);
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? { ...c, previous_quotes: (c.previous_quotes || 0) + 1, last_service: leadData.service_type }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `CUST-${Date.now().toString().slice(-4)}`,
          name: leadData.customer_name,
          phone: leadData.phone,
          email: leadData.email,
          address: leadData.moving_from || 'Nairobi',
          previous_bookings: 0,
          previous_quotes: 1,
          total_spent: 0,
          last_service: leadData.service_type,
          notes: 'Created automatically from website quote lead',
          created_at: new Date().toISOString(),
        };
        return [newCust, ...prev];
      }
    });

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        message: `New Quote Request & Inquiry from ${leadData.customer_name} (${leadData.service_type} - Ksh. ${estTotal.toLocaleString('en-KE')})`,
        time: 'Just now',
        read: false,
      },
      ...prev,
    ]);

    // Automatically record an analytics click event
    trackClick(`Submitted Quote: ${leadData.customer_name} (${leadData.service_type})`, 'quote');

    return newLead;
  };

  const createLead = async (leadData: any): Promise<Lead> => {
    return addLead({
      customer_name: leadData.customer_name || leadData.name || 'Website Inquiry',
      phone: leadData.phone || '',
      email: leadData.email || '',
      service_type: leadData.service_type || 'Residential Home Moves',
      moving_from: leadData.moving_from || '',
      moving_to: leadData.moving_to || '',
      move_date: leadData.move_date || new Date().toISOString().split('T')[0],
      property_type: leadData.property_type || 'Apartment',
      house_size: leadData.house_size || '2 Bed',
      status: leadData.status || 'NEW',
      notes: leadData.notes || leadData.message || '',
      estimated_amount: leadData.estimated_amount,
    });
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
      )
    );
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    updateLead(id, { status });
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((item) => item.id !== id));
  };

  // Customers
  const addCustomer = (customer: Omit<Customer, 'id' | 'created_at'>) => {
    const newCust: Customer = {
      ...customer,
      id: `CUST-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString(),
    };
    setCustomers((prev) => [newCust, ...prev]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  // Bookings
  const addBooking = (booking: BookingDetails) => {
    setBookings((prev) => [booking, ...prev]);

    // Dispatch to Supabase
    supabaseService.insertBooking(booking).catch((e) => console.warn('Supabase booking insert failed:', e));

    const custName = booking.customer_name || booking.customerName || 'Customer';
    const custPhone = booking.phone || booking.customerPhone || '';
    const custEmail = booking.customer_email || booking.customerEmail || '';
    const totalPrice = booking.pricing?.totalPrice ?? booking.total_price ?? booking.total_amount ?? 0;
    const subtotal = booking.pricing?.subtotal ?? totalPrice;
    const sType = booking.service_type || booking.serviceType || 'Moving';
    const tName = booking.tier_name || booking.tierName || 'Standard Package';

    // Create invoice automatically for confirmed booking
    const invoiceNum = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoice_number: invoiceNum,
      booking_id: booking.id,
      customer_name: custName,
      customer_phone: custPhone,
      customer_email: custEmail,
      items: [
        {
          description: `${String(sType).toUpperCase()} - ${tName}`,
          amount: totalPrice,
        },
      ],
      subtotal: subtotal,
      discount: booking.pricing?.comboDiscount || 0,
      additional_charges: 0,
      total: totalPrice,
      amount_paid: booking.paymentMethod === 'card_deposit' ? Math.round(totalPrice * 0.3) : 0,
      balance: booking.paymentMethod === 'card_deposit' ? Math.round(totalPrice * 0.7) : totalPrice,
      payment_status: booking.paymentMethod === 'card_deposit' ? 'PARTIALLY_PAID' : 'UNPAID',
      due_date: booking.move_date || booking.moveDate || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    // Update customer stats
    if (custPhone) {
      setCustomers((prev) => {
        const existing = prev.find((c) => c.phone === custPhone);
        if (existing) {
          return prev.map((c) =>
            c.id === existing.id
              ? {
                  ...c,
                  previous_bookings: (c.previous_bookings || 0) + 1,
                  total_spent: (c.total_spent || 0) + totalPrice,
                  last_service: String(sType),
                }
              : c
          );
        }
        return prev;
      });
    }

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        message: `New Confirmed Booking ${booking.booking_number || booking.id} by ${custName}`,
        time: 'Just now',
        read: false,
      },
      ...prev,
    ]);

    trackClick(`Completed Booking: ${booking.booking_number || booking.id} (${custName} - ${tName})`, 'booking');
  };

  const createBooking = async (bookingData: Partial<BookingDetails>): Promise<BookingDetails> => {
    const id = bookingData.id || `SM-${Math.floor(10000 + Math.random() * 90000)}`;
    const fullBooking: BookingDetails = {
      id,
      createdAt: new Date().toISOString(),
      serviceType: (bookingData.serviceType as any) || (bookingData.service_type as any) || 'moving',
      tier: (bookingData.tier as any) || 'pro',
      tierName: bookingData.tier_name || bookingData.tierName || 'Complete Care Move',
      pricing: bookingData.pricing || {
        basePrice: bookingData.total_price || 450,
        sqftCost: 0,
        distanceCost: 0,
        stairsSurcharge: 0,
        addOnsCost: 0,
        comboDiscount: 0,
        subtotal: bookingData.total_price || 450,
        totalPrice: bookingData.total_price || 450,
        estimatedHours: '3-5 hrs',
        recommendedTruck: '5-Tonne Truck',
        recommendedCrew: '3 Movers',
      },
      calculatorState: bookingData.calculatorState || {
        serviceType: 'moving',
        selectedTier: 'pro',
        sqft: 800,
        distanceMiles: 15,
        propertyPresetId: '2-bed',
        bedrooms: 2,
        bathrooms: 1,
        hasElevator: true,
        flightsOfStairs: 0,
        cleaningIntensity: 'standard',
        selectedAddOns: [],
      },
      moveDate: bookingData.moveDate || bookingData.move_date || new Date().toISOString().split('T')[0],
      timeSlot: (bookingData.timeSlot as any) || (bookingData.time_slot as any) || 'morning',
      pickupAddress: bookingData.pickupAddress || bookingData.pickup_address || '',
      dropoffAddress: bookingData.dropoffAddress || bookingData.dropoff_address || '',
      pickupAccess: bookingData.pickupAccess || '',
      dropoffAccess: bookingData.dropoffAccess || '',
      selectedInventory: bookingData.selectedInventory || [],
      specialInstructions: bookingData.specialInstructions || '',
      customerName: bookingData.customerName || bookingData.customer_name || 'Customer',
      customerPhone: bookingData.customerPhone || bookingData.customer_phone || '',
      customerEmail: bookingData.customerEmail || bookingData.customer_email || '',
      contactViaWhatsApp: true,
      paymentMethod: (bookingData.paymentMethod as any) || (bookingData.payment_method as any) || 'mobile_money',
      status: bookingData.status || 'Confirmed',
      ...bookingData,
    };
    addBooking(fullBooking);
    return fullBooking;
  };

  const createInvoiceFromBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;
    const invoiceNum = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const total = booking.total_amount || booking.total_price || booking.pricing?.totalPrice || 0;
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoice_number: invoiceNum,
      booking_id: booking.id,
      customer_name: booking.customer_name || booking.customerName || 'Customer',
      customer_phone: booking.phone || booking.customerPhone || '',
      customer_email: booking.customer_email || booking.customerEmail || '',
      items: [
        {
          description: `${booking.service_type || booking.serviceType || 'Moving Service'} - ${booking.booking_number || booking.id}`,
          amount: total,
        },
      ],
      subtotal: total,
      discount: 0,
      additional_charges: 0,
      total: total,
      amount_paid: 0,
      balance: total,
      payment_status: 'UNPAID',
      due_date: booking.move_date || booking.moveDate || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };
    setInvoices((prev) => [newInvoice, ...prev]);
  };

  const updateBooking = (id: string, updates: Partial<BookingDetails>) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    supabaseService.updateBooking(id, updates).catch((e) => console.warn('Supabase booking update failed:', e));
  };

  // Staff & Teams
  const addStaff = (staffMember: Omit<Staff, 'id'>) => {
    const newStaff: Staff = { ...staffMember, id: `STF-${Date.now().toString().slice(-4)}` };
    setStaff((prev) => [...prev, newStaff]);
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  const addTeam = (team: Omit<Team, 'id'>) => {
    const newTeam: Team = { ...team, id: `TM-${Date.now().toString().slice(-4)}` };
    setTeams((prev) => [...prev, newTeam]);
  };

  // Vehicles
  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVeh: Vehicle = { ...vehicle, id: `VEH-${Date.now().toString().slice(-4)}` };
    setVehicles((prev) => [...prev, newVeh]);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  // Services
  const addService = (service: Omit<ServiceItem, 'id'>) => {
    const newSrv: ServiceItem = { ...service, id: `srv-${Date.now()}` };
    setServices((prev) => [...prev, newSrv]);
  };

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const toggleServiceActive = (id: string) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  // Quotes
  const addQuote = (quoteData: Omit<Quote, 'id' | 'quote_number' | 'created_at'>): Quote => {
    const quoteNum = `Q-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newQuote: Quote = {
      ...quoteData,
      id: `QT-${Date.now()}`,
      quote_number: quoteNum,
      created_at: new Date().toISOString(),
    };
    setQuotes((prev) => [newQuote, ...prev]);

    // Update corresponding lead status to QUOTED if linked
    if (quoteData.lead_id) {
      updateLeadStatus(quoteData.lead_id, 'QUOTED');
    }

    return newQuote;
  };

  const updateQuote = (id: string, updates: Partial<Quote>) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  // Invoices
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoice_number' | 'created_at'>): Invoice => {
    const invoiceNum = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newInv: Invoice = {
      ...invoiceData,
      id: `INV-${Date.now()}`,
      invoice_number: invoiceNum,
      created_at: new Date().toISOString(),
    };
    setInvoices((prev) => [newInv, ...prev]);
    return newInv;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)));
  };

  // Payments
  const addPayment = (paymentData: Omit<Payment, 'id' | 'paid_at'>) => {
    const newPay: Payment = {
      ...paymentData,
      id: `PAY-${Date.now().toString().slice(-4)}`,
      paid_at: new Date().toISOString(),
    };
    setPayments((prev) => [newPay, ...prev]);

    // Update invoice if matched
    if (paymentData.invoice_number) {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.invoice_number === paymentData.invoice_number) {
            const currentPaid = inv.amount_paid ?? inv.paid_amount ?? 0;
            const newPaid = currentPaid + paymentData.amount;
            const invoiceTotal = inv.total ?? 0;
            const newBal = Math.max(0, invoiceTotal - newPaid);
            return {
              ...inv,
              amount_paid: newPaid,
              paid_amount: newPaid,
              balance: newBal,
              balance_due: newBal,
              payment_status: newBal === 0 ? 'PAID' : 'PARTIALLY_PAID',
            };
          }
          return inv;
        })
      );
    }
  };

  // Reviews
  const addReview = (reviewData: Partial<Review> & { customer_name: string; comment: string; rating: number; service: string }) => {
    const newRev: Review = {
      id: `REV-${Date.now().toString().slice(-4)}`,
      customer_name: reviewData.customer_name,
      rating: reviewData.rating,
      comment: reviewData.comment,
      service: reviewData.service,
      location: reviewData.location || 'Nairobi, Kenya',
      date: 'Just now',
      verified: reviewData.verified !== undefined ? reviewData.verified : true,
      approved: reviewData.approved !== undefined ? reviewData.approved : false,
      featured: reviewData.featured || false,
    };
    setReviews((prev) => [newRev, ...prev]);
    supabaseService.upsertReview(newRev).catch((e) => console.warn('Supabase review insert failed:', e));
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        message: `New Customer Review submitted by ${reviewData.customer_name}`,
        time: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  const approveReview = (id: string, approved = true) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved } : r)));
    const found = reviews.find((r) => r.id === id);
    if (found) {
      supabaseService.upsertReview({ ...found, approved }).catch(() => {});
    }
  };

  const rejectReview = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved: false } : r)));
  };

  const toggleFeaturedReview = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, featured: !r.featured } : r)));
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    supabaseService.deleteReview(id).catch((e) => console.warn('Supabase review delete failed:', e));
  };

  // Gallery
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newGal: GalleryItem = { ...item, id: `GAL-${Date.now().toString().slice(-4)}` };
    setGallery((prev) => [newGal, ...prev]);
    supabaseService.insertGalleryItem(newGal).catch((e) => console.warn('Supabase gallery insert failed:', e));
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    supabaseService.deleteGalleryItem(id).catch((e) => console.warn('Supabase gallery delete failed:', e));
  };

  // FAQs
  const addFAQ = (faq: Omit<FAQItem, 'id'>) => {
    const newFaq: FAQItem = { ...faq, id: `faq-${Date.now().toString().slice(-4)}` };
    setFaqs((prev) => [...prev, newFaq]);
  };

  const updateFAQ = (id: string, updates: Partial<FAQItem>) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  // Settings & CMS
  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateCMS = (newCMS: Partial<CMSContent>) => {
    setCMS((prev) => ({ ...prev, ...newCMS }));
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const convertQuoteToBooking = (quoteId: string) => {
    const q = quotes.find((quote) => quote.id === quoteId);
    if (!q) return;

    const newBooking: BookingDetails = {
      id: `BK-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      serviceType: (q.service_type?.toLowerCase().includes('clean') ? 'cleaning' : 'moving') as any,
      tier: 'pro',
      tierName: 'Professional Moving Care',
      pricing: {
        basePrice: q.total_amount || 0,
        sqftCost: 0,
        distanceCost: 0,
        stairsSurcharge: 0,
        addOnsCost: 0,
        comboDiscount: 0,
        subtotal: q.total_amount || 0,
        totalPrice: q.total_amount || 0,
        estimatedHours: '4-6 hours',
        recommendedTruck: '5-Tonne Box Truck',
        recommendedCrew: '3 Movers',
      },
      calculatorState: {
        serviceType: 'moving',
        selectedTier: 'pro',
        sqft: 1200,
        distanceMiles: 15,
        propertyPresetId: '2bed',
        bedrooms: 2,
        bathrooms: 2,
        hasElevator: false,
        flightsOfStairs: 1,
        cleaningIntensity: 'standard',
        selectedAddOns: [],
      },
      moveDate: q.move_date || new Date().toISOString().split('T')[0],
      timeSlot: 'morning',
      pickupAddress: q.moving_from || 'Nairobi',
      dropoffAddress: q.moving_to || 'Nairobi',
      pickupAccess: 'Ground Floor',
      dropoffAccess: 'Ground Floor',
      selectedInventory: [],
      specialInstructions: `Converted from Quote #${q.quote_number}`,
      customerName: q.customer_name,
      customerPhone: q.customer_phone || q.phone || '',
      customerEmail: q.customer_email || q.email || '',
      contactViaWhatsApp: true,
      paymentMethod: 'card_deposit',
      status: 'confirmed',
    };

    addBooking(newBooking);
    updateQuote(quoteId, { status: 'ACCEPTED' });
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        currentView,
        setCurrentView,
        selectedBookingId,
        setSelectedBookingId,
        selectedServiceId,
        setSelectedServiceId,
        isAdminLoggedIn,
        isAdminAuthenticated: isAdminLoggedIn,
        adminUser,
        loginAdmin,
        loginWithGoogleUser,
        logoutAdmin,
        dbConnected: true,
        fetchBookings: async () => {},
        fetchLeads: async () => {},
        leads,
        addLead,
        createLead,
        updateLead,
        updateLeadStatus,
        deleteLead,
        customers,
        addCustomer,
        updateCustomer,
        bookings,
        addBooking,
        createBooking,
        createInvoiceFromBooking,
        updateBooking,
        updateBookingStatus: (id: string, status: any) => updateBooking(id, { status }),
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        teams,
        addTeam,
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        services,
        addService,
        updateService,
        toggleServiceActive,
        quotes,
        addQuote,
        createQuote: (data: any) => addQuote(data),
        updateQuote,
        convertQuoteToBooking,
        invoices,
        addInvoice,
        updateInvoice,
        payments,
        addPayment,
        reviews,
        addReview,
        approveReview,
        rejectReview,
        toggleFeaturedReview,
        deleteReview,
        gallery,
        addGalleryItem,
        deleteGalleryItem,
        faqs,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        settings,
        updateSettings,
        cms,
        updateCMS,
        notifications,
        markNotificationsRead,
        addNotification,
        analytics,
        trackClick,
        simulateVisitorClick,
        resetAnalytics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
