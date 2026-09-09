import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  Database, 
  Cloud, 
  ShieldCheck, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  signInWithGoogle, 
  getGoogleAccessToken, 
  logOut, 
  initAuthListener 
} from '../../lib/firebase';
import { 
  createOperationsSpreadsheet, 
  syncAllDataToSheet, 
  type SpreadsheetInfo 
} from '../../lib/googleSheets';

export function AdminGoogleSheets() {
  const { bookings, leads, quotes } = useApp();
  
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  
  // Active / Linked Spreadsheet
  const [activeSpreadsheet, setActiveSpreadsheet] = useState<SpreadsheetInfo | null>(() => {
    try {
      const saved = localStorage.getItem('shammah_active_spreadsheet');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return null;
  });

  const [customSheetId, setCustomSheetId] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem('shammah_last_sheet_sync');
  });

  useEffect(() => {
    // Listen for Firebase Auth state
    const unsubscribe = initAuthListener(
      (user) => {
        setGoogleUser(user);
        const token = getGoogleAccessToken();
        if (token) setAccessToken(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
      }
    );

    // Also fetch latest sync record from PostgreSQL backend
    fetch('/api/sheets/latest')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.spreadsheetId) {
          setActiveSpreadsheet({
            spreadsheetId: data.spreadsheetId,
            spreadsheetUrl: data.spreadsheetUrl,
            title: data.sheetTitle,
          });
          if (data.lastSyncedAt) {
            setLastSyncTime(new Date(data.lastSyncedAt).toLocaleString());
          }
        }
      })
      .catch((err) => console.warn('No previous sheet sync record in Cloud SQL:', err));

    return () => unsubscribe();
  }, []);

  const handleConnectGoogle = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const result = await signInWithGoogle();
      if (result) {
        setGoogleUser(result.user);
        setAccessToken(result.accessToken);
        setStatusMessage({
          type: 'success',
          text: `Connected successfully as ${result.user.email}. Google Sheets access granted.`,
        });

        // Sync with PostgreSQL users table
        try {
          await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${result.idToken}`,
            },
            body: JSON.stringify({ displayName: result.user.displayName || result.user.email }),
          });
        } catch (syncErr) {
          console.warn('Could not sync user to Cloud SQL:', syncErr);
        }
      }
    } catch (error: any) {
      console.error('Google Sheets auth failed:', error);
      setStatusMessage({
        type: 'error',
        text: error.message || 'Failed to authenticate with Google. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    await logOut();
    setGoogleUser(null);
    setAccessToken(null);
    setStatusMessage({
      type: 'info',
      text: 'Disconnected from Google account.',
    });
  };

  const triggerSyncConfirmation = () => {
    if (!accessToken) {
      setStatusMessage({
        type: 'error',
        text: 'Please connect your Google account first before syncing.',
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const executeSync = async () => {
    setShowConfirmModal(false);
    if (!accessToken) return;

    setSyncing(true);
    setStatusMessage(null);

    try {
      let sheetToUse = activeSpreadsheet;

      // 1. If no active sheet, create one
      if (!sheetToUse || !sheetToUse.spreadsheetId) {
        const created = await createOperationsSpreadsheet(
          accessToken,
          `Shammah Movers CRM Operations (${new Date().toLocaleDateString('en-GB')})`
        );
        sheetToUse = created;
        setActiveSpreadsheet(created);
        localStorage.setItem('shammah_active_spreadsheet', JSON.stringify(created));
      }

      // 2. Sync all bookings, leads, and quotes data
      await syncAllDataToSheet(accessToken, sheetToUse.spreadsheetId, {
        bookings,
        leads,
        quotes,
      });

      const nowStr = new Date().toLocaleString();
      setLastSyncTime(nowStr);
      localStorage.setItem('shammah_last_sheet_sync', nowStr);

      // 3. Persist sync record to Cloud SQL PostgreSQL
      try {
        await fetch('/api/sheets/sync-record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            spreadsheetId: sheetToUse.spreadsheetId,
            spreadsheetUrl: sheetToUse.spreadsheetUrl,
            sheetTitle: sheetToUse.title,
            syncedBy: googleUser?.email || 'Admin',
          }),
        });
      } catch (e) {
        console.warn('Could not save sync record to Cloud SQL:', e);
      }

      setStatusMessage({
        type: 'success',
        text: `Successfully synced ${bookings.length} Bookings, ${leads.length} Leads, and ${quotes.length} Quotes to Google Sheets!`,
      });
    } catch (error: any) {
      console.error('Sync failed:', error);
      setStatusMessage({
        type: 'error',
        text: error.message || 'Failed to sync data to Google Sheets. Check token permissions.',
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleLinkExistingSheet = () => {
    if (!customSheetId.trim()) return;
    const cleanId = customSheetId.trim();
    const info: SpreadsheetInfo = {
      spreadsheetId: cleanId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${cleanId}/edit`,
      title: 'Linked Google Spreadsheet',
    };
    setActiveSpreadsheet(info);
    localStorage.setItem('shammah_active_spreadsheet', JSON.stringify(info));
    setCustomSheetId('');
    setStatusMessage({
      type: 'success',
      text: `Linked to spreadsheet ID: ${cleanId}. Ready to sync.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Google Sheets Workspace Integration</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Live Google Sheets Synchronization
            </h1>
            <p className="text-emerald-100/80 text-xs md:text-sm max-w-xl">
              Export and synchronize all bookings, client leads, and instant quotes straight into your Google Drive spreadsheet with one click.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {googleUser ? (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs">
                  {googleUser.email?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white truncate max-w-[140px]">
                    {googleUser.displayName || googleUser.email}
                  </div>
                  <div className="text-[10px] text-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Connected to Sheets
                  </div>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="ml-2 text-[11px] text-rose-300 hover:text-white underline font-semibold cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectGoogle}
                disabled={loading}
                className="gsi-material-button inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white text-slate-800 font-bold text-xs shadow-lg hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
              >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span>{loading ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            )}

            <button
              onClick={triggerSyncConfirmation}
              disabled={syncing || !googleUser}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing to Sheets...' : 'Sync Data to Sheets'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-medium flex items-center justify-between gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Connected Spreadsheets & Ready Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Spreadsheet Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Linked Operations Spreadsheet</span>
            </h2>

            {activeSpreadsheet ? (
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Spreadsheet Title</div>
                    <div className="text-sm font-bold text-slate-900">{activeSpreadsheet.title}</div>
                    <div className="text-[11px] font-mono text-slate-500 truncate max-w-xs sm:max-w-md mt-0.5">
                      ID: {activeSpreadsheet.spreadsheetId}
                    </div>
                  </div>

                  <a
                    href={activeSpreadsheet.spreadsheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    <span>Open in Google Sheets</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-emerald-100 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bookings Tab</div>
                    <div className="text-sm font-black text-slate-900">{bookings.length} Rows</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Leads Tab</div>
                    <div className="text-sm font-black text-slate-900">{leads.length} Rows</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quotes Tab</div>
                    <div className="text-sm font-black text-slate-900">{quotes.length} Rows</div>
                  </div>
                </div>

                {lastSyncTime && (
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Last synchronized on {lastSyncTime}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 space-y-3">
                <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto" />
                <div className="text-sm font-bold text-slate-800">No Spreadsheet Linked Yet</div>
                <p className="text-xs max-w-md mx-auto text-slate-500">
                  Connect your Google account above and click &quot;Sync Data to Sheets&quot; to automatically create and populate a new dedicated operations sheet.
                </p>
              </div>
            )}

            {/* Link Existing Sheet By ID */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Link an Existing Google Sheet by ID</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  value={customSheetId}
                  onChange={(e) => setCustomSheetId(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleLinkExistingSheet}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Link Sheet
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Cloud SQL & Persistence Architecture Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Full-Stack Architecture</span>
            </h2>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-blue-600" />
                    Cloud SQL (PostgreSQL)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Connected
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Drizzle ORM managing tables: bookings, leads, quotes, click_events, users, and sheets_sync.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    Firebase Authentication
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Secures staff logins and exchanges OAuth access tokens for Google Sheets API v4.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    Google Sheets API v4
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                    Ready
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Automated batch-update sync for operational dispatching and offline reporting.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Workspace Data Operation (Mandatory per workspace-integration skill) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">
                Confirm Google Sheets Synchronization
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You are about to update your Google Spreadsheet with live data:
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <li className="flex items-center justify-between">
                  <span>• Bookings tab:</span>
                  <span className="font-bold">{bookings.length} records</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• Customer Leads tab:</span>
                  <span className="font-bold">{leads.length} records</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• Quotes tab:</span>
                  <span className="font-bold">{quotes.length} records</span>
                </li>
              </ul>
              <p className="text-[11px] text-slate-500 italic">
                Existing rows in the specified sheets will be updated with the latest entries.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeSync}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all cursor-pointer"
              >
                Confirm & Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
