import { pgTable, serial, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

// Users table authenticated via Firebase Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').default('admin').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Leads table for inquiries and quote requests
export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  serviceType: text('service_type').notNull(),
  movingFrom: text('moving_from').notNull(),
  movingTo: text('moving_to').notNull(),
  moveDate: text('move_date').notNull(),
  propertyType: text('property_type'),
  houseSize: text('house_size'),
  estimatedAmount: integer('estimated_amount').default(0),
  status: text('status').default('NEW').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Quotes generated for customers
export const quotes = pgTable('quotes', {
  id: text('id').primaryKey(),
  quoteNumber: text('quote_number').notNull(),
  leadId: text('lead_id'),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  serviceType: text('service_type').notNull(),
  movingFrom: text('moving_from'),
  movingTo: text('moving_to'),
  itemsJson: text('items_json').default('[]').notNull(),
  totalAmount: integer('total_amount').notNull(),
  status: text('status').default('SENT').notNull(),
  validUntil: text('valid_until'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Bookings confirmed by customers
export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  serviceType: text('service_type').notNull(),
  tier: text('tier').notNull(),
  tierName: text('tier_name'),
  moveDate: text('move_date').notNull(),
  timeSlot: text('time_slot'),
  pickupAddress: text('pickup_address').notNull(),
  dropoffAddress: text('dropoff_address').notNull(),
  totalPrice: integer('total_price').notNull(),
  paymentMethod: text('payment_method'),
  status: text('status').default('confirmed').notNull(),
  detailsJson: text('details_json').default('{}').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Telemetry & user click events
export const clickEvents = pgTable('click_events', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  category: text('category').notNull(),
  path: text('path').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Google Sheets sync tracking
export const sheetsSync = pgTable('sheets_sync', {
  id: serial('id').primaryKey(),
  spreadsheetId: text('spreadsheet_id').notNull(),
  spreadsheetUrl: text('spreadsheet_url').notNull(),
  sheetTitle: text('sheet_title').notNull(),
  lastSyncedAt: timestamp('last_synced_at').defaultNow().notNull(),
  syncedBy: text('synced_by'),
});
