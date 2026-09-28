import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';

// Public Components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuickQuoteSection } from './components/QuickQuoteSection';
import { PriceCalculator } from './components/PriceCalculator';
import { PackageTiers } from './components/PackageTiers';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ServicesShowcase } from './components/ServicesShowcase';
import { HowItWorks } from './components/HowItWorks';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { GallerySection } from './components/GallerySection';
import { AreasWeServeSection } from './components/AreasWeServeSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { MovingChecklist } from './components/MovingChecklist';
import { BookingTracker } from './components/BookingTracker';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { BookingReceiptModal } from './components/BookingReceiptModal';
import { BookingWizard } from './components/BookingWizard';
import { DetailedQuotePage } from './components/DetailedQuotePage';
import { ServiceDetailPage } from './components/ServiceDetailPage';
import { AboutPage } from './components/AboutPage';
import { PrivacyPolicyPage, TermsPage } from './components/PoliciesModals';
import { NotFoundPage } from './components/NotFoundPage';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLeads } from './components/admin/AdminLeads';
import { AdminQuotes } from './components/admin/AdminQuotes';
import { AdminBookings } from './components/admin/AdminBookings';
import { AdminCalendar } from './components/admin/AdminCalendar';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminStaff } from './components/admin/AdminStaff';
import { AdminVehicles } from './components/admin/AdminVehicles';
import { AdminServices } from './components/admin/AdminServices';
import { AdminInvoices } from './components/admin/AdminInvoices';
import { AdminPayments } from './components/admin/AdminPayments';
import { AdminReviews } from './components/admin/AdminReviews';
import { AdminGallery } from './components/admin/AdminGallery';
import { AdminFAQ } from './components/admin/AdminFAQ';
import { AdminReports } from './components/admin/AdminReports';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminGoogleSheets } from './components/admin/AdminGoogleSheets';
import { AdminSupabase } from './components/admin/AdminSupabase';

import { CalculatorState, PackageTierId, ServiceType, BookingDetails } from './types';
import { SAMPLE_BOOKINGS } from './data/mockData';
import { Phone, CalendarCheck, Calculator, MessageCircle } from 'lucide-react';

const STORAGE_KEY = 'shammah_user_bookings_v2';

export default function App() {
  const { currentRoute, navigateTo, isAdminAuthenticated, settings, trackClick, addBooking } = useApp();

  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [latestBooking, setLatestBooking] = useState<BookingDetails | null>(null);
  const [trackedBookingId, setTrackedBookingId] = useState<string>('');

  // Automatically capture public clicks for analytics
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Don't track admin clicks
      if (window.location.pathname.startsWith('/admin') || currentRoute.startsWith('/admin')) {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input[type="submit"], [role="button"]') as HTMLElement | null;
      if (interactive) {
        const text = (interactive.innerText || interactive.getAttribute('aria-label') || interactive.getAttribute('title') || interactive.tagName).trim();
        const href = interactive.getAttribute('href') || '';
        
        let category: 'quote' | 'call' | 'whatsapp' | 'navigation' | 'booking' | 'calculator' | 'contact' | 'review' | 'other' = 'other';
        if (href.startsWith('tel:') || text.includes('0181460645') || text.includes('0118894810') || text.toLowerCase().includes('call')) {
          category = 'call';
        } else if (href.includes('wa.me') || text.toLowerCase().includes('whatsapp')) {
          category = 'whatsapp';
        } else if (text.toLowerCase().includes('quote') || text.toLowerCase().includes('estimate')) {
          category = 'quote';
        } else if (text.toLowerCase().includes('book') || text.toLowerCase().includes('reserve')) {
          category = 'booking';
        } else if (text.toLowerCase().includes('calculate') || text.toLowerCase().includes('sq ft')) {
          category = 'calculator';
        } else if (text.toLowerCase().includes('contact') || text.toLowerCase().includes('message')) {
          category = 'contact';
        } else if (text.toLowerCase().includes('review') || text.toLowerCase().includes('rating')) {
          category = 'review';
        } else {
          category = 'navigation';
        }

        const label = text ? (text.length > 50 ? text.substring(0, 48) + '...' : text) : (href || 'Interactive Element');
        trackClick(label, category, currentRoute);
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => window.removeEventListener('click', handleGlobalClick, { capture: true });
  }, [currentRoute, trackClick]);

  // Local user bookings state
  const [userBookings, setUserBookings] = useState<BookingDetails[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading local bookings:', e);
    }
    return SAMPLE_BOOKINGS;
  });

  // Calculator State initialized with sensible Kenyan defaults
  const [calcState, setCalcState] = useState<CalculatorState>({
    serviceType: 'combo',
    selectedTier: 'pro',
    sqft: 1200,
    distanceMiles: 15,
    propertyPresetId: '2bed',
    bedrooms: 2,
    bathrooms: 2,
    hasElevator: true,
    flightsOfStairs: 0,
    cleaningIntensity: 'move_in_out',
    selectedAddOns: ['disassembly_assembly', 'carpet_steam_wash'],
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userBookings));
    } catch (e) {
      console.error('Error saving local bookings:', e);
    }
  }, [userBookings]);

  const handleSelectServiceFromHero = (service: ServiceType) => {
    setCalcState((prev) => ({ ...prev, serviceType: service }));
  };

  const handleScrollToCalculator = () => {
    setIsBookingOpen(false);
    if (currentRoute !== '/') {
      navigateTo('/quote');
      return;
    }
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProceedToBooking = (tierId?: PackageTierId) => {
    if (tierId) {
      setCalcState((prev) => ({ ...prev, selectedTier: tierId }));
    }
    setIsBookingOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSuccess = (newBooking: BookingDetails) => {
    addBooking(newBooking);
    setUserBookings((prev) => [newBooking, ...prev]);
    setLatestBooking(newBooking);
    setIsBookingOpen(false);
  };

  const handleTrackBooking = (bookingId: string) => {
    setTrackedBookingId(bookingId);
    setIsBookingOpen(false);
    if (currentRoute !== '/') {
      navigateTo('/');
    }
    setTimeout(() => {
      const el = document.getElementById('track');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // ================= ADMIN ROUTING =================
  if (currentRoute.startsWith('/admin')) {
    if (!isAdminAuthenticated) {
      return <AdminLogin />;
    }

    let adminChild = <AdminDashboard />;
    const cleanAdminRoute = currentRoute.replace('/admin', '') || '/';

    if (cleanAdminRoute === '/' || cleanAdminRoute === '/dashboard') {
      adminChild = <AdminDashboard />;
    } else if (cleanAdminRoute === '/leads') {
      adminChild = <AdminLeads />;
    } else if (cleanAdminRoute === '/quotes') {
      adminChild = <AdminQuotes />;
    } else if (cleanAdminRoute === '/bookings') {
      adminChild = <AdminBookings />;
    } else if (cleanAdminRoute === '/calendar') {
      adminChild = <AdminCalendar />;
    } else if (cleanAdminRoute === '/customers') {
      adminChild = <AdminCustomers />;
    } else if (cleanAdminRoute === '/staff') {
      adminChild = <AdminStaff />;
    } else if (cleanAdminRoute === '/vehicles') {
      adminChild = <AdminVehicles />;
    } else if (cleanAdminRoute === '/services') {
      adminChild = <AdminServices />;
    } else if (cleanAdminRoute === '/invoices') {
      adminChild = <AdminInvoices />;
    } else if (cleanAdminRoute === '/payments') {
      adminChild = <AdminPayments />;
    } else if (cleanAdminRoute === '/reviews') {
      adminChild = <AdminReviews />;
    } else if (cleanAdminRoute === '/gallery') {
      adminChild = <AdminGallery />;
    } else if (cleanAdminRoute === '/faq') {
      adminChild = <AdminFAQ />;
    } else if (cleanAdminRoute === '/reports') {
      adminChild = <AdminReports />;
    } else if (cleanAdminRoute === '/sheets' || cleanAdminRoute === '/google-sheets') {
      adminChild = <AdminGoogleSheets />;
    } else if (cleanAdminRoute === '/supabase') {
      adminChild = <AdminSupabase />;
    } else if (cleanAdminRoute === '/settings') {
      adminChild = <AdminSettings />;
    } else {
      adminChild = <AdminDashboard />;
    }

    return <AdminLayout>{adminChild}</AdminLayout>;
  }

  // ================= PUBLIC ROUTING =================
  let pageContent = null;

  if (isBookingOpen) {
    pageContent = (
      <BookingWizard
        calcState={calcState}
        setCalcState={setCalcState}
        onBookingSuccess={handleBookingSuccess}
        onClose={() => setIsBookingOpen(false)}
      />
    );
  } else if (currentRoute === '/' || currentRoute === '') {
    pageContent = (
      <>
        {/* Hero Section */}
        <Hero
          onSelectService={handleSelectServiceFromHero}
          onOpenBooking={() => handleProceedToBooking()}
          onScrollToCalculator={handleScrollToCalculator}
        />

        {/* Quick Quote Lead Capture */}
        <QuickQuoteSection />

        {/* Price Calculator Section */}
        <PriceCalculator
          calcState={calcState}
          setCalcState={setCalcState}
          onProceedToBooking={handleProceedToBooking}
        />

        {/* Package Tiers Section */}
        <PackageTiers
          calcState={calcState}
          onSelectTier={(tierId) => handleProceedToBooking(tierId)}
        />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Services Showcase */}
        <ServicesShowcase
          onSelectService={handleSelectServiceFromHero}
          onOpenCalculator={handleScrollToCalculator}
        />

        {/* How It Works */}
        <HowItWorks />

        {/* Before & After Cleaning Showcase */}
        <BeforeAfterSection />

        {/* Photo Gallery Showcase */}
        <GallerySection />

        {/* Areas We Serve in Kenya */}
        <AreasWeServeSection />

        {/* Live Booking Tracker */}
        <BookingTracker
          userBookings={userBookings}
          initialSearchId={trackedBookingId}
          onOpenBooking={() => handleProceedToBooking()}
        />

        {/* Moving Day Checklist */}
        <MovingChecklist />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Frequently Asked Questions */}
        <FAQSection />

        {/* Contact Form & Branches */}
        <ContactSection />
      </>
    );
  } else if (currentRoute === '/quote' || currentRoute === '/get-a-quote') {
    pageContent = <DetailedQuotePage />;
  } else if (currentRoute === '/services') {
    pageContent = <ServiceDetailPage slug="all" />;
  } else if (currentRoute.startsWith('/services/')) {
    const slug = currentRoute.replace('/services/', '');
    pageContent = <ServiceDetailPage slug={slug} />;
  } else if (currentRoute === '/about') {
    pageContent = <AboutPage />;
  } else if (currentRoute === '/gallery') {
    pageContent = (
      <div className="py-12 bg-slate-50 min-h-screen">
        <GallerySection />
      </div>
    );
  } else if (currentRoute === '/faq') {
    pageContent = (
      <div className="py-12 bg-slate-50 min-h-screen">
        <FAQSection />
      </div>
    );
  } else if (currentRoute === '/contact') {
    pageContent = (
      <div className="py-12 bg-slate-50 min-h-screen">
        <ContactSection />
      </div>
    );
  } else if (currentRoute === '/privacy') {
    pageContent = <PrivacyPolicyPage />;
  } else if (currentRoute === '/terms') {
    pageContent = <TermsPage />;
  } else {
    pageContent = <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Header Bar */}
      <Header
        onOpenBooking={() => handleProceedToBooking()}
        onOpenCalculator={handleScrollToCalculator}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16 sm:pb-0">{pageContent}</main>

      {/* Booking Confirmation / Receipt Modal */}
      {latestBooking && (
        <BookingReceiptModal
          booking={latestBooking}
          onClose={() => setLatestBooking(null)}
          onTrackBooking={handleTrackBooking}
        />
      )}

      {/* PWA Install Banner & iOS Modal */}
      <PWAInstallBanner />

      {/* Mobile Sticky Quick Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 flex items-center justify-between gap-2 shadow-2xl">
        <button
          onClick={handleScrollToCalculator}
          className="flex-1 py-2 px-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Calculator className="w-3.5 h-3.5 text-blue-900" />
          <span>Estimate (Ksh)</span>
        </button>

        <button
          onClick={() => handleProceedToBooking()}
          className="flex-1 py-2 px-2 rounded-xl bg-gradient-to-r from-blue-900 to-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
        >
          <CalendarCheck className="w-3.5 h-3.5 text-purple-200" />
          <span>Book Now</span>
        </button>

        <a
          href={`https://wa.me/${settings.whatsapp}?text=Hello%20Shammah%20Movers%2C%20I%20would%20like%20a%20quote.`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center cursor-pointer"
          aria-label="WhatsApp Dispatch"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
        </a>
      </div>

      {/* Footer */}
      <Footer
        onOpenCalculator={handleScrollToCalculator}
        onOpenBooking={() => handleProceedToBooking()}
      />
    </div>
  );
}
