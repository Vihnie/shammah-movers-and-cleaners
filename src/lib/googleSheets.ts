/**
 * Google Sheets API v4 Client Integration
 * Uses the OAuth access token acquired through Firebase Google Auth.
 */

export interface SheetRowData {
  range: string;
  values: (string | number | boolean)[][];
}

export interface SpreadsheetInfo {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

/**
 * Creates a dedicated "Shammah Movers & Cleaners Operations" spreadsheet
 * with pre-configured sheets for Leads, Bookings, and Quotes.
 */
export async function createOperationsSpreadsheet(
  accessToken: string,
  title = `Shammah Movers CRM Sync - ${new Date().toLocaleDateString('en-GB')}`
): Promise<SpreadsheetInfo> {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: 'Bookings',
            gridProperties: { rowCount: 200, columnCount: 15 },
          },
        },
        {
          properties: {
            title: 'Leads',
            gridProperties: { rowCount: 200, columnCount: 15 },
          },
        },
        {
          properties: {
            title: 'Quotes',
            gridProperties: { rowCount: 200, columnCount: 15 },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to create Google Spreadsheet');
  }

  const data = await response.json();
  return {
    spreadsheetId: data.spreadsheetId,
    spreadsheetUrl: data.spreadsheetUrl,
    title: data.properties.title,
  };
}

/**
 * Appends header rows and initial data to the spreadsheet
 */
export async function syncAllDataToSheet(
  accessToken: string,
  spreadsheetId: string,
  data: {
    bookings: any[];
    leads: any[];
    quotes: any[];
  }
) {
  // 1. Format Bookings tab
  const bookingsHeaders = [
    'Booking ID',
    'Customer Name',
    'Phone',
    'Email',
    'Service',
    'Tier',
    'Move Date',
    'Time Slot',
    'Pickup Address',
    'Dropoff Address',
    'Total Price (KES)',
    'Payment Method',
    'Status',
    'Created At',
  ];

  const bookingRows = data.bookings.map((b) => [
    b.id || '',
    b.customerName || b.customer_name || '',
    b.customerPhone || b.customer_phone || '',
    b.customerEmail || b.customer_email || '',
    b.serviceType || b.service_type || '',
    b.tierName || b.tier || '',
    b.moveDate || b.move_date || '',
    b.timeSlot || b.preferred_time || '',
    b.pickupAddress || b.moving_from || '',
    b.dropoffAddress || b.moving_to || '',
    b.totalPrice || b.pricing?.totalPrice || 0,
    b.paymentMethod || '',
    b.status || 'confirmed',
    b.createdAt || b.created_at || new Date().toISOString(),
  ]);

  // 2. Format Leads tab
  const leadsHeaders = [
    'Lead ID',
    'Customer Name',
    'Phone',
    'Email',
    'Service Type',
    'Moving From',
    'Moving To',
    'Move Date',
    'House Size',
    'Estimated Amount (KES)',
    'Status',
    'Created At',
  ];

  const leadRows = data.leads.map((l) => [
    l.id || '',
    l.customer_name || l.customerName || '',
    l.phone || '',
    l.email || '',
    l.service_type || l.serviceType || '',
    l.moving_from || l.movingFrom || '',
    l.moving_to || l.movingTo || '',
    l.move_date || l.moveDate || '',
    l.house_size || l.houseSize || '',
    l.estimated_amount || l.estimatedAmount || 0,
    l.status || 'NEW',
    l.created_at || l.createdAt || new Date().toISOString(),
  ]);

  // 3. Format Quotes tab
  const quotesHeaders = [
    'Quote ID',
    'Quote Number',
    'Customer Name',
    'Phone',
    'Email',
    'Service Type',
    'Moving From',
    'Moving To',
    'Total Amount (KES)',
    'Status',
    'Valid Until',
    'Created At',
  ];

  const quoteRows = data.quotes.map((q) => [
    q.id || '',
    q.quoteNumber || q.quote_number || '',
    q.customerName || q.customer_name || '',
    q.customerPhone || q.customer_phone || '',
    q.customerEmail || q.customer_email || '',
    q.serviceType || q.service_type || '',
    q.movingFrom || q.moving_from || '',
    q.movingTo || q.moving_to || '',
    q.totalAmount || q.total_amount || 0,
    q.status || 'SENT',
    q.validUntil || q.valid_until || '',
    q.createdAt || q.created_at || new Date().toISOString(),
  ]);

  // Batch update values
  const payload = {
    valueInputOption: 'USER_ENTERED',
    data: [
      {
        range: 'Bookings!A1:N',
        values: [bookingsHeaders, ...bookingRows],
      },
      {
        range: 'Leads!A1:L',
        values: [leadsHeaders, ...leadRows],
      },
      {
        range: 'Quotes!A1:L',
        values: [quotesHeaders, ...quoteRows],
      },
    ],
  };

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to populate Google Sheets data');
  }

  return await response.json();
}
