export type ServiceType = 'moving' | 'cleaning' | 'combo';

export interface ServiceDetail {
  id: string;
  title: string;
  tagline: string;
  description: string;
  basePrice: number;
  priceUnit: string;
  icon: string;
  features: string[];
  popularFor: string;
}

export type PackageTierId = 'essential' | 'pro' | 'white_glove';

export interface PackageTier {
  id: PackageTierId;
  name: string;
  badge?: string;
  tagline: string;
  movingCrew: string;
  truckSize: string;
  cleaningScope: string;
  features: string[];
  baseMultiplier: number;
  popular?: boolean;
}

export interface AddOnItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'moving' | 'cleaning' | 'both';
  icon: string;
}

export interface PropertyPreset {
  id: string;
  label: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  iconName: string;
}

export interface CalculatorState {
  serviceType: ServiceType;
  selectedTier: PackageTierId;
  sqft: number;
  distanceMiles: number;
  propertyPresetId: string;
  bedrooms: number;
  bathrooms: number;
  hasElevator: boolean;
  flightsOfStairs: number;
  cleaningIntensity: 'standard' | 'deep' | 'move_in_out' | 'post_construction';
  selectedAddOns: string[];
}

export interface CalculatedPricing {
  basePrice: number;
  sqftCost: number;
  distanceCost: number;
  stairsSurcharge: number;
  addOnsCost: number;
  comboDiscount: number;
  subtotal: number;
  totalPrice: number;
  estimatedHours: string;
  recommendedTruck: string;
  recommendedCrew: string;
}

export interface BookingDetails {
  id: string;
  createdAt?: string;
  serviceType?: ServiceType;
  tier?: PackageTierId | string;
  tierName?: string;
  tier_name?: string;
  pricing?: CalculatedPricing;
  calculatorState?: CalculatorState;
  
  // Schedule & Location
  moveDate?: string;
  timeSlot?: 'morning' | 'afternoon' | 'all_day' | string;
  pickupAddress?: string;
  dropoffAddress?: string;
  pickupAccess?: string;
  dropoffAccess?: string;

  // Inventory / Specifics
  selectedInventory?: string[];
  specialInstructions?: string;

  // Customer info
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  contactViaWhatsApp?: boolean;
  paymentMethod?: 'card_deposit' | 'cash_on_delivery' | 'bank_transfer' | 'mobile_money' | string;
  payment_method?: string;

  // Status for Tracker and CRM
  status: 'confirmed' | 'crew_assigned' | 'in_transit' | 'completed' | 'cancelled' | 'CONFIRMED' | 'COMPLETED' | 'Confirmed' | 'Completed' | string;
  assignedCrew?: {
    leadName: string;
    leadPhone: string;
    truckNumber: string;
    crewCount: number;
  };

  // Aliases for admin calendar & dashboard
  move_date?: string;
  service_type?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  pickup_address?: string;
  dropoff_address?: string;
  time_slot?: string;
  total_price?: number;
  total_amount?: number;
  booking_number?: string;
  team_assigned?: string;
  vehicle_assigned?: string;
  preferred_time?: string;
  phone?: string;
  details_json?: string;
}

export interface ChecklistItem {
  id: string;
  week: string;
  title: string;
  description: string;
  completed: boolean;
}

// ==========================================
// CRM & BUSINESS MANAGEMENT SYSTEM TYPES
// ==========================================

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUOTED' | 'NEGOTIATING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Lead {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  service_type: string;
  moving_from: string;
  moving_to: string;
  move_date: string;
  preferred_time?: string;
  property_type: string;
  house_size: string;
  floor?: string;
  has_lift?: boolean;
  parking_available?: boolean;
  packing_required?: boolean;
  unpacking_required?: boolean;
  cleaning_required?: boolean;
  fumigation_required?: boolean;
  furniture_assembly?: boolean;
  decluttering?: boolean;
  estimated_volume?: string;
  estimated_amount?: number;
  message?: string;
  attachments?: string[];
  status: LeadStatus;
  assigned_staff?: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  previous_bookings?: number;
  previous_quotes?: number;
  total_bookings?: number;
  total_spent?: number;
  last_service?: string;
  notes?: string;
  created_at: string;
}

export type StaffRole = 'Driver' | 'Mover' | 'Team Leader' | 'Cleaner' | 'Supervisor' | 'Administrator' | 'MOVER';

export interface Staff {
  id: string;
  name: string;
  phone: string;
  role: StaffRole;
  team?: string;
  status: 'AVAILABLE' | 'ON_JOB' | 'OFF_DUTY';
  national_id?: string;
  rating?: number;
  active?: boolean;
  notes?: string;
}

export interface Team {
  id: string;
  name: string;
  type?: 'moving' | 'cleaning' | 'combo';
  lead_name?: string;
  members_count?: number;
  assigned_truck?: string;
  leader?: string;
  members?: string[];
}

export type VehicleStatus = 'AVAILABLE' | 'ON JOB' | 'ON_JOB' | 'MAINTENANCE' | 'INACTIVE';

export interface Vehicle {
  id: string;
  registration?: string;
  plate_number?: string;
  model?: string;
  type?: string;
  capacity?: string;
  capacityCuFt?: number;
  status: VehicleStatus;
  current_assignment?: string;
  mileage?: number;
  insurance_expiry?: string;
  service_due?: string;
  active?: boolean;
  notes?: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: 'moving' | 'cleaning' | 'specialized';
  short_desc: string;
  full_desc: string;
  starting_price: number;
  pricing_model: 'FIXED' | 'STARTING_FROM' | 'CUSTOM_QUOTE';
  badge?: string;
  icon: string;
  features: string[];
  active: boolean;
  featured: boolean;
  order: number;
}

export type Booking = BookingDetails;

export interface QuoteItem {
  description: string;
  amount?: number;
  quantity?: number;
  unit_price?: number;
  total?: number;
}

export interface InvoiceItem {
  description: string;
  amount: number;
  quantity?: number;
  unit_price?: number;
  total?: number;
}

export interface Quote {
  id: string;
  quote_number: string;
  lead_id?: string;
  customer_name: string;
  customer_phone?: string;
  phone?: string;
  customer_email?: string;
  email?: string;
  service_type?: string;
  moving_from?: string;
  moving_to?: string;
  move_date?: string;
  items: QuoteItem[];
  distance_surcharge?: number;
  discount?: number;
  subtotal?: number;
  total?: number;
  total_amount?: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'EXPIRED' | 'REJECTED';
  notes?: string;
  terms?: string;
  valid_until?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  booking_id?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount?: number;
  additional_charges?: number;
  total: number;
  amount_paid?: number;
  paid_amount?: number;
  balance?: number;
  balance_due?: number;
  status?: 'DRAFT' | 'SENT' | 'PAID' | 'PARTIAL' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED';
  payment_status?: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';
  issue_date?: string;
  due_date: string;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id?: string;
  invoice_id?: string;
  invoice_number?: string;
  customer_name: string;
  amount: number;
  payment_method?: 'M-Pesa' | 'Bank' | 'Cash' | 'Other';
  method?: 'MPESA' | 'BANK_TRANSFER' | 'CASH' | string;
  transaction_reference?: string;
  reference?: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  paid_at?: string;
  date?: string;
}

export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  service: string;
  location?: string;
  date: string;
  verified: boolean;
  approved: boolean;
  featured: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'MOVING' | 'PACKING' | 'CLEANING' | 'FUMIGATION' | 'OFFICE MOVES';
  image_url: string;
  caption: string;
  is_before_after?: boolean;
  before_url?: string;
  after_url?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface BusinessSettings {
  company_name: string;
  tagline: string;
  phone: string;
  phone2?: string;
  whatsapp: string;
  email: string;
  email2?: string;
  support_email?: string;
  physical_address: string;
  working_hours: string;
  service_areas: string[];
  currency: string;
  mpesa_till: string;
  mpesa_paybill: string;
  mpesa_account_name: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  linkedin_url: string;
  announcement_text: string;
  announcement_active: boolean;
}

export interface CMSContent {
  hero_headline: string;
  hero_supporting_text: string;
  about_mission: string;
  about_story: string;
}

export interface ClickEvent {
  id: string;
  label: string;
  category: 'quote' | 'call' | 'whatsapp' | 'navigation' | 'booking' | 'calculator' | 'contact' | 'review' | 'other';
  path: string;
  timestamp: string;
}

export interface SiteAnalytics {
  totalClicks: number;
  totalUsers: number;
  activeUsers: number;
  clickEvents: ClickEvent[];
  pageViews: number;
  visitorsToday: number;
  activeSessions: {
    id: string;
    lastActive: number;
    path: string;
    isMobile: boolean;
  }[];
}

