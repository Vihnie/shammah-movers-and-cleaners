import { eq, desc } from 'drizzle-orm';
import { db } from './index.ts';
import { users, leads, quotes, bookings, clickEvents, sheetsSync } from './schema.ts';

// User Helpers
export async function getOrCreateUser(uid: string, email: string, displayName?: string) {
  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (existing.length > 0) {
      return existing[0];
    }
    const inserted = await db.insert(users).values({
      uid,
      email,
      displayName: displayName || email.split('@')[0],
      role: 'admin',
    }).returning();
    return inserted[0];
  } catch (error) {
    console.error('Database query getOrCreateUser failed:', error);
    throw new Error('Database user sync failed', { cause: error });
  }
}

// Leads Helpers
export async function getAllLeads() {
  try {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  } catch (error) {
    console.error('Database query getAllLeads failed:', error);
    throw new Error('Failed to retrieve leads', { cause: error });
  }
}

export async function insertLead(data: {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  serviceType: string;
  movingFrom: string;
  movingTo: string;
  moveDate: string;
  propertyType?: string;
  houseSize?: string;
  estimatedAmount?: number;
  status?: string;
  notes?: string;
}) {
  try {
    const res = await db.insert(leads).values({
      id: data.id,
      customerName: data.customerName,
      phone: data.phone,
      email: data.email || '',
      serviceType: data.serviceType,
      movingFrom: data.movingFrom,
      movingTo: data.movingTo,
      moveDate: data.moveDate,
      propertyType: data.propertyType || '',
      houseSize: data.houseSize || '',
      estimatedAmount: data.estimatedAmount || 0,
      status: data.status || 'NEW',
      notes: data.notes || '',
    }).returning();
    return res[0];
  } catch (error) {
    console.error('Database query insertLead failed:', error);
    throw new Error('Failed to insert lead', { cause: error });
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    const res = await db.update(leads)
      .set({ status })
      .where(eq(leads.id, id))
      .returning();
    return res[0];
  } catch (error) {
    console.error('Database query updateLeadStatus failed:', error);
    throw new Error('Failed to update lead status', { cause: error });
  }
}

// Quotes Helpers
export async function getAllQuotes() {
  try {
    return await db.select().from(quotes).orderBy(desc(quotes.createdAt));
  } catch (error) {
    console.error('Database query getAllQuotes failed:', error);
    throw new Error('Failed to retrieve quotes', { cause: error });
  }
}

export async function insertQuote(data: {
  id: string;
  quoteNumber: string;
  leadId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceType: string;
  movingFrom?: string;
  movingTo?: string;
  itemsJson?: string;
  totalAmount: number;
  status?: string;
  validUntil?: string;
}) {
  try {
    const res = await db.insert(quotes).values({
      id: data.id,
      quoteNumber: data.quoteNumber,
      leadId: data.leadId || null,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || '',
      serviceType: data.serviceType,
      movingFrom: data.movingFrom || '',
      movingTo: data.movingTo || '',
      itemsJson: data.itemsJson || '[]',
      totalAmount: data.totalAmount,
      status: data.status || 'SENT',
      validUntil: data.validUntil || '',
    }).returning();
    return res[0];
  } catch (error) {
    console.error('Database query insertQuote failed:', error);
    throw new Error('Failed to insert quote', { cause: error });
  }
}

// Bookings Helpers
export async function getAllBookings() {
  try {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  } catch (error) {
    console.error('Database query getAllBookings failed:', error);
    throw new Error('Failed to retrieve bookings', { cause: error });
  }
}

export async function insertBooking(data: {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceType: string;
  tier: string;
  tierName?: string;
  moveDate: string;
  timeSlot?: string;
  pickupAddress: string;
  dropoffAddress: string;
  totalPrice: number;
  paymentMethod?: string;
  status?: string;
  detailsJson?: string;
}) {
  try {
    const res = await db.insert(bookings).values({
      id: data.id,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || '',
      serviceType: data.serviceType,
      tier: data.tier,
      tierName: data.tierName || '',
      moveDate: data.moveDate,
      timeSlot: data.timeSlot || '',
      pickupAddress: data.pickupAddress,
      dropoffAddress: data.dropoffAddress,
      totalPrice: data.totalPrice,
      paymentMethod: data.paymentMethod || '',
      status: data.status || 'confirmed',
      detailsJson: data.detailsJson || '{}',
    }).returning();
    return res[0];
  } catch (error) {
    console.error('Database query insertBooking failed:', error);
    throw new Error('Failed to insert booking', { cause: error });
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    const res = await db.update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return res[0];
  } catch (error) {
    console.error('Database query updateBookingStatus failed:', error);
    throw new Error('Failed to update booking status', { cause: error });
  }
}

// Click Telemetry
export async function insertClickEvent(label: string, category: string, path: string) {
  try {
    const id = `click_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const res = await db.insert(clickEvents).values({
      id,
      label,
      category,
      path,
    }).returning();
    return res[0];
  } catch (error) {
    console.error('Database query insertClickEvent failed:', error);
    // Non-critical, return null rather than hard crashing
    return null;
  }
}

export async function getRecentClickEvents(limit = 100) {
  try {
    return await db.select().from(clickEvents).orderBy(desc(clickEvents.createdAt)).limit(limit);
  } catch (error) {
    console.error('Database query getRecentClickEvents failed:', error);
    return [];
  }
}

// Sheets Sync Tracking
export async function recordSheetsSync(spreadsheetId: string, spreadsheetUrl: string, sheetTitle: string, syncedBy?: string) {
  try {
    const res = await db.insert(sheetsSync).values({
      spreadsheetId,
      spreadsheetUrl,
      sheetTitle,
      syncedBy: syncedBy || 'Admin',
    }).returning();
    return res[0];
  } catch (error) {
    console.error('Database query recordSheetsSync failed:', error);
    throw new Error('Failed to save sheets sync record', { cause: error });
  }
}

export async function getLatestSheetsSync() {
  try {
    const res = await db.select().from(sheetsSync).orderBy(desc(sheetsSync.lastSyncedAt)).limit(1);
    return res[0] || null;
  } catch (error) {
    console.error('Database query getLatestSheetsSync failed:', error);
    return null;
  }
}
