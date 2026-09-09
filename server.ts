import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { requireAuth, optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  getOrCreateUser,
  getAllLeads,
  insertLead,
  updateLeadStatus,
  getAllQuotes,
  insertQuote,
  getAllBookings,
  insertBooking,
  updateBookingStatus,
  insertClickEvent,
  getRecentClickEvents,
  recordSheetsSync,
  getLatestSheetsSync,
} from './src/db/queries.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Shammah Movers Backend', time: new Date().toISOString() });
  });

  // User Sync
  app.post('/api/auth/sync-user', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user || !req.user.uid || !req.user.email) {
        return res.status(400).json({ error: 'Missing authenticated user information' });
      }
      const user = await getOrCreateUser(req.user.uid, req.user.email, req.body.displayName);
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Failed to sync user:', error);
      res.status(500).json({ error: error.message || 'User synchronization failed' });
    }
  });

  // Leads
  app.get('/api/leads', async (req, res) => {
    try {
      const leads = await getAllLeads();
      res.json(leads);
    } catch (error: any) {
      console.error('Failed to get leads:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch leads' });
    }
  });

  app.post('/api/leads', async (req, res) => {
    try {
      const newLead = await insertLead(req.body);
      res.json({ success: true, lead: newLead });
    } catch (error: any) {
      console.error('Failed to save lead:', error);
      res.status(500).json({ error: error.message || 'Failed to save lead' });
    }
  });

  app.patch('/api/leads/:id/status', async (req, res) => {
    try {
      const updated = await updateLeadStatus(req.params.id, req.body.status);
      res.json({ success: true, lead: updated });
    } catch (error: any) {
      console.error('Failed to update lead status:', error);
      res.status(500).json({ error: error.message || 'Failed to update lead status' });
    }
  });

  // Quotes
  app.get('/api/quotes', async (req, res) => {
    try {
      const quotes = await getAllQuotes();
      res.json(quotes);
    } catch (error: any) {
      console.error('Failed to get quotes:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch quotes' });
    }
  });

  app.post('/api/quotes', async (req, res) => {
    try {
      const quote = await insertQuote(req.body);
      res.json({ success: true, quote });
    } catch (error: any) {
      console.error('Failed to save quote:', error);
      res.status(500).json({ error: error.message || 'Failed to save quote' });
    }
  });

  // Bookings
  app.get('/api/bookings', async (req, res) => {
    try {
      const bookings = await getAllBookings();
      res.json(bookings);
    } catch (error: any) {
      console.error('Failed to get bookings:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch bookings' });
    }
  });

  app.post('/api/bookings', async (req, res) => {
    try {
      const booking = await insertBooking(req.body);
      res.json({ success: true, booking });
    } catch (error: any) {
      console.error('Failed to save booking:', error);
      res.status(500).json({ error: error.message || 'Failed to save booking' });
    }
  });

  app.patch('/api/bookings/:id/status', async (req, res) => {
    try {
      const updated = await updateBookingStatus(req.params.id, req.body.status);
      res.json({ success: true, booking: updated });
    } catch (error: any) {
      console.error('Failed to update booking status:', error);
      res.status(500).json({ error: error.message || 'Failed to update booking' });
    }
  });

  // Click Telemetry
  app.post('/api/analytics/click', async (req, res) => {
    try {
      const { label, category, path: clickPath } = req.body;
      const event = await insertClickEvent(label, category, clickPath);
      res.json({ success: true, event });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to record click' });
    }
  });

  app.get('/api/analytics/clicks', async (req, res) => {
    try {
      const events = await getRecentClickEvents();
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to get clicks' });
    }
  });

  // Google Sheets Sync Records
  app.get('/api/sheets/latest', async (req, res) => {
    try {
      const sync = await getLatestSheetsSync();
      res.json(sync);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch sheets sync record' });
    }
  });

  app.post('/api/sheets/sync-record', async (req, res) => {
    try {
      const { spreadsheetId, spreadsheetUrl, sheetTitle, syncedBy } = req.body;
      const record = await recordSheetsSync(spreadsheetId, spreadsheetUrl, sheetTitle, syncedBy);
      res.json({ success: true, record });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to save sheets sync record' });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
