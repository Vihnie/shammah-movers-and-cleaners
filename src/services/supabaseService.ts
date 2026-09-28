import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import {
  Lead,
  Quote,
  BookingDetails,
  Customer,
  Staff,
  Team,
  Vehicle,
  ServiceItem,
  Invoice,
  Payment,
  Review,
  GalleryItem,
  FAQItem,
  BusinessSettings,
  ClickEvent,
} from '../types';

export const supabaseService = {
  // ===================== LEADS =====================
  async getLeads(): Promise<Lead[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await getSupabaseClient()
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as Lead[]) || [];
    } catch (e) {
      console.warn('Supabase getLeads error:', e);
      return [];
    }
  },

  async insertLead(lead: Lead): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('leads').upsert(lead);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase insertLead error:', e);
      return false;
    }
  },

  async updateLeadStatus(id: string, status: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient()
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase updateLeadStatus error:', e);
      return false;
    }
  },

  async deleteLead(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('leads').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteLead error:', e);
      return false;
    }
  },

  // ===================== QUOTES =====================
  async getQuotes(): Promise<Quote[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await getSupabaseClient()
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as Quote[]) || [];
    } catch (e) {
      console.warn('Supabase getQuotes error:', e);
      return [];
    }
  },

  async insertQuote(quote: Quote): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('quotes').upsert(quote);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase insertQuote error:', e);
      return false;
    }
  },

  async updateQuote(id: string, updates: Partial<Quote>): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('quotes').update(updates).eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase updateQuote error:', e);
      return false;
    }
  },

  // ===================== BOOKINGS =====================
  async getBookings(): Promise<BookingDetails[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await getSupabaseClient()
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as BookingDetails[]) || [];
    } catch (e) {
      console.warn('Supabase getBookings error:', e);
      return [];
    }
  },

  async insertBooking(booking: BookingDetails): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('bookings').upsert(booking);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase insertBooking error:', e);
      return false;
    }
  },

  async updateBooking(id: string, updates: Partial<BookingDetails>): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('bookings').update(updates).eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase updateBooking error:', e);
      return false;
    }
  },

  // ===================== CUSTOMERS =====================
  async getCustomers(): Promise<Customer[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await getSupabaseClient().from('customers').select('*');
      if (error) throw error;
      return (data as Customer[]) || [];
    } catch (e) {
      console.warn('Supabase getCustomers error:', e);
      return [];
    }
  },

  async upsertCustomer(customer: Customer): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('customers').upsert(customer);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertCustomer error:', e);
      return false;
    }
  },

  // ===================== STAFF & TEAMS =====================
  async getStaff(): Promise<Staff[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await getSupabaseClient().from('staff').select('*');
      if (error) throw error;
      return (data as Staff[]) || [];
    } catch (e) {
      console.warn('Supabase getStaff error:', e);
      return [];
    }
  },

  async upsertStaff(staff: Staff): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('staff').upsert(staff);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertStaff error:', e);
      return false;
    }
  },

  async deleteStaff(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('staff').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteStaff error:', e);
      return false;
    }
  },

  async getTeams(): Promise<Team[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await getSupabaseClient().from('teams').select('*');
      if (error) throw error;
      return (data as Team[]) || [];
    } catch (e) {
      console.warn('Supabase getTeams error:', e);
      return [];
    }
  },

  async upsertTeam(team: Team): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('teams').upsert(team);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertTeam error:', e);
      return false;
    }
  },

  // ===================== VEHICLES =====================
  async getVehicles(): Promise<Vehicle[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await getSupabaseClient().from('vehicles').select('*');
      if (error) throw error;
      return (data as Vehicle[]) || [];
    } catch (e) {
      console.warn('Supabase getVehicles error:', e);
      return [];
    }
  },

  async upsertVehicle(vehicle: Vehicle): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('vehicles').upsert(vehicle);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertVehicle error:', e);
      return false;
    }
  },

  async deleteVehicle(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('vehicles').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteVehicle error:', e);
      return false;
    }
  },

  // ===================== SERVICES =====================
  async getServices(): Promise<ServiceItem[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await getSupabaseClient()
        .from('services')
        .select('*')
        .order('order', { ascending: true });
      if (error) throw error;
      return (data as ServiceItem[]) || [];
    } catch (e) {
      console.warn('Supabase getServices error:', e);
      return [];
    }
  },

  async upsertService(service: ServiceItem): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('services').upsert(service);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertService error:', e);
      return false;
    }
  },

  // ===================== INVOICES & PAYMENTS =====================
  async getInvoices(): Promise<Invoice[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await getSupabaseClient()
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as Invoice[]) || [];
    } catch (e) {
      console.warn('Supabase getInvoices error:', e);
      return [];
    }
  },

  async upsertInvoice(invoice: Invoice): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('invoices').upsert(invoice);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertInvoice error:', e);
      return false;
    }
  },

  async getPayments(): Promise<Payment[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await getSupabaseClient().from('payments').select('*');
      if (error) throw error;
      return (data as Payment[]) || [];
    } catch (e) {
      console.warn('Supabase getPayments error:', e);
      return [];
    }
  },

  async insertPayment(payment: Payment): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('payments').upsert(payment);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase insertPayment error:', e);
      return false;
    }
  },

  // ===================== REVIEWS =====================
  async getReviews(): Promise<Review[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await getSupabaseClient().from('reviews').select('*');
      if (error) throw error;
      return (data as Review[]) || [];
    } catch (e) {
      console.warn('Supabase getReviews error:', e);
      return [];
    }
  },

  async upsertReview(review: Review): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('reviews').upsert(review);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertReview error:', e);
      return false;
    }
  },

  async deleteReview(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('reviews').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteReview error:', e);
      return false;
    }
  },

  // ===================== GALLERY =====================
  async getGallery(): Promise<GalleryItem[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await getSupabaseClient().from('gallery').select('*');
      if (error) throw error;
      return (data as GalleryItem[]) || [];
    } catch (e) {
      console.warn('Supabase getGallery error:', e);
      return [];
    }
  },

  async insertGalleryItem(item: GalleryItem): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('gallery').upsert(item);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase insertGalleryItem error:', e);
      return false;
    }
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('gallery').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteGalleryItem error:', e);
      return false;
    }
  },

  // ===================== FAQS =====================
  async getFAQs(): Promise<FAQItem[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await getSupabaseClient()
        .from('faqs')
        .select('*')
        .order('order', { ascending: true });
      if (error) throw error;
      return (data as FAQItem[]) || [];
    } catch (e) {
      console.warn('Supabase getFAQs error:', e);
      return [];
    }
  },

  async upsertFAQ(faq: FAQItem): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('faqs').upsert(faq);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertFAQ error:', e);
      return false;
    }
  },

  async deleteFAQ(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('faqs').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteFAQ error:', e);
      return false;
    }
  },

  // ===================== SETTINGS =====================
  async getSettings(): Promise<BusinessSettings | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await getSupabaseClient()
        .from('business_settings')
        .select('*')
        .limit(1)
        .single();
      if (error) throw error;
      return data as BusinessSettings;
    } catch (e) {
      console.warn('Supabase getSettings error:', e);
      return null;
    }
  },

  async updateSettings(settings: BusinessSettings): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient()
        .from('business_settings')
        .upsert({ id: 'primary', ...settings });
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase updateSettings error:', e);
      return false;
    }
  },

  // ===================== CLICK EVENTS =====================
  async trackClick(click: ClickEvent): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await getSupabaseClient().from('click_events').insert({
        id: click.id,
        label: click.label,
        category: click.category,
        path: click.path,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      return true;
    } catch (e) {
      return false;
    }
  },

  // ===================== TABLE COUNTS & HEALTH =====================
  async getTableCounts(): Promise<Record<string, number>> {
    if (!isSupabaseConfigured()) return {};
    const tables = [
      'leads',
      'quotes',
      'bookings',
      'customers',
      'staff',
      'vehicles',
      'services',
      'invoices',
      'payments',
      'reviews',
      'gallery',
      'faqs',
    ];

    const counts: Record<string, number> = {};
    const client = getSupabaseClient();

    await Promise.all(
      tables.map(async (table) => {
        try {
          const { count, error } = await client.from(table).select('*', { count: 'exact', head: true });
          if (!error && typeof count === 'number') {
            counts[table] = count;
          } else {
            counts[table] = 0;
          }
        } catch {
          counts[table] = 0;
        }
      })
    );

    return counts;
  },

  // ===================== SEED / SYNC ALL =====================
  async syncAllToSupabase(data: {
    leads: Lead[];
    quotes: Quote[];
    bookings: BookingDetails[];
    customers: Customer[];
    staff: Staff[];
    teams: Team[];
    vehicles: Vehicle[];
    services: ServiceItem[];
    invoices: Invoice[];
    payments: Payment[];
    reviews: Review[];
    gallery: GalleryItem[];
    faqs: FAQItem[];
    settings: BusinessSettings;
  }): Promise<{ success: boolean; synced: string[]; errors: string[] }> {
    if (!isSupabaseConfigured()) {
      return { success: false, synced: [], errors: ['Supabase not configured'] };
    }

    const client = getSupabaseClient();
    const synced: string[] = [];
    const errors: string[] = [];

    const tablesToSync: { table: string; items: any[] }[] = [
      { table: 'services', items: data.services },
      { table: 'leads', items: data.leads },
      { table: 'quotes', items: data.quotes },
      { table: 'bookings', items: data.bookings },
      { table: 'customers', items: data.customers },
      { table: 'staff', items: data.staff },
      { table: 'teams', items: data.teams },
      { table: 'vehicles', items: data.vehicles },
      { table: 'invoices', items: data.invoices },
      { table: 'payments', items: data.payments },
      { table: 'reviews', items: data.reviews },
      { table: 'gallery', items: data.gallery },
      { table: 'faqs', items: data.faqs },
    ];

    for (const { table, items } of tablesToSync) {
      if (items && items.length > 0) {
        try {
          const { error } = await client.from(table).upsert(items);
          if (error) {
            errors.push(`${table}: ${error.message}`);
          } else {
            synced.push(`${table} (${items.length})`);
          }
        } catch (e: any) {
          errors.push(`${table}: ${e.message}`);
        }
      }
    }

    // Settings
    try {
      const { error } = await client
        .from('business_settings')
        .upsert({ id: 'primary', ...data.settings });
      if (!error) synced.push('settings (1)');
    } catch (e: any) {
      errors.push(`settings: ${e.message}`);
    }

    return {
      success: errors.length === 0,
      synced,
      errors,
    };
  },
};
