import React, { useState, useEffect } from 'react';
import {
  Database,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Upload,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Trash2,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import {
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  clearStoredSupabaseConfig,
  testSupabaseConnection,
} from '../../lib/supabase';
import {
  uploadToSupabaseStorage,
  listSupabaseStorageFiles,
  SUPABASE_BUCKETS,
  StorageFileItem,
} from '../../lib/supabaseStorage';
import { supabaseService } from '../../services/supabaseService';
import { useApp } from '../../context/AppContext';

export function AdminSupabase() {
  const {
    leads,
    quotes,
    bookings,
    customers,
    staff,
    teams,
    vehicles,
    services,
    invoices,
    payments,
    reviews,
    gallery,
    faqs,
    settings,
    addNotification,
  } = useApp();

  const [config, setConfig] = useState(() => getStoredSupabaseConfig());
  const [urlInput, setUrlInput] = useState(config.url);
  const [keyInput, setKeyInput] = useState(config.anonKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    connected: boolean;
    database: boolean;
    storage: boolean;
    message: string;
    latencyMs?: number;
  }>({
    tested: false,
    connected: config.isConfigured,
    database: false,
    storage: false,
    message: config.isConfigured ? 'Configured with environment or stored keys' : 'Supabase credentials not yet set',
  });

  const [tableCounts, setTableCounts] = useState<Record<string, number>>({});
  const [countsLoading, setCountsLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; synced: string[]; errors: string[] } | null>(null);

  // Storage testing state
  const [selectedBucket, setSelectedBucket] = useState<string>(SUPABASE_BUCKETS.GALLERY);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccessUrl, setUploadSuccessUrl] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [bucketFiles, setBucketFiles] = useState<StorageFileItem[]>([]);
  const [copiedSql, setCopiedSql] = useState(false);

  // Run test on load if configured
  useEffect(() => {
    if (config.isConfigured) {
      handleTestConnection();
    }
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setUploadError('');
    try {
      const res = await testSupabaseConnection();
      setTestResult({
        tested: true,
        connected: res.connected,
        database: res.database,
        storage: res.storage,
        message: res.message,
        latencyMs: res.latencyMs,
      });

      if (res.database) {
        loadTableCounts();
      }
      if (res.storage) {
        loadBucketFiles(selectedBucket);
      }
    } catch (e: any) {
      setTestResult({
        tested: true,
        connected: false,
        database: false,
        storage: false,
        message: e.message || 'Connection test failed',
      });
    } finally {
      setTesting(false);
    }
  };

  const loadTableCounts = async () => {
    setCountsLoading(true);
    try {
      const counts = await supabaseService.getTableCounts();
      setTableCounts(counts);
    } finally {
      setCountsLoading(false);
    }
  };

  const loadBucketFiles = async (bucket: string) => {
    const { files } = await listSupabaseStorageFiles(bucket);
    setBucketFiles(files);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSupabaseConfig(urlInput, keyInput);
    const updated = getStoredSupabaseConfig();
    setConfig(updated);
    addNotification('Supabase settings updated');
    handleTestConnection();
  };

  const handleResetConfig = () => {
    clearStoredSupabaseConfig();
    const updated = getStoredSupabaseConfig();
    setConfig(updated);
    setUrlInput('');
    setKeyInput('');
    setTestResult({
      tested: false,
      connected: false,
      database: false,
      storage: false,
      message: 'Supabase configuration cleared.',
    });
    setTableCounts({});
    setBucketFiles([]);
    addNotification('Supabase settings reset to default');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    setUploadSuccessUrl('');

    try {
      const res = await uploadToSupabaseStorage(selectedBucket, file);
      if (res.success && res.publicUrl) {
        setUploadSuccessUrl(res.publicUrl);
        addNotification(`Uploaded to Supabase bucket '${selectedBucket}'`);
        loadBucketFiles(selectedBucket);
      } else {
        setUploadError(res.error || 'Upload failed');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload exception');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await supabaseService.syncAllToSupabase({
        leads,
        quotes,
        bookings,
        customers,
        staff,
        teams,
        vehicles,
        services,
        invoices,
        payments,
        reviews,
        gallery,
        faqs,
        settings,
      });
      setSyncResult(res);
      if (res.success) {
        addNotification(`Synced ${res.synced.length} tables to Supabase!`);
        loadTableCounts();
      }
    } catch (e: any) {
      setSyncResult({ success: false, synced: [], errors: [e.message] });
    } finally {
      setSyncing(false);
    }
  };

  const copySqlSchema = () => {
    const sql = `-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, category TEXT NOT NULL,
  short_desc TEXT, full_desc TEXT, starting_price NUMERIC DEFAULT 0, pricing_model TEXT,
  badge TEXT, icon TEXT, features JSONB DEFAULT '[]'::jsonb, active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false, "order" INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY, customer_name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT,
  service_type TEXT NOT NULL, moving_from TEXT NOT NULL, moving_to TEXT NOT NULL,
  move_date TEXT NOT NULL, property_type TEXT, house_size TEXT, estimated_amount NUMERIC,
  status TEXT DEFAULT 'NEW', notes TEXT, created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.quotes (
  id TEXT PRIMARY KEY, quote_number TEXT NOT NULL, lead_id TEXT, customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL, customer_email TEXT, service_type TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb, total_amount NUMERIC NOT NULL, status TEXT DEFAULT 'SENT',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY, customer_name TEXT NOT NULL, customer_phone TEXT NOT NULL,
  customer_email TEXT, service_type TEXT NOT NULL, tier TEXT NOT NULL, tier_name TEXT,
  move_date TEXT NOT NULL, pickup_address TEXT NOT NULL, dropoff_address TEXT NOT NULL,
  pricing JSONB, status TEXT DEFAULT 'confirmed', created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, image_url TEXT NOT NULL,
  caption TEXT, created_at TIMESTAMPTZ DEFAULT now()
);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true), ('attachments', 'attachments', true), ('documents', 'documents', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Public Read Gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Public Insert Gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery');
`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            Supabase Backend & Storage
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Supabase Backend Integration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Connect your Supabase PostgreSQL database and object storage buckets (gallery, attachments, documents).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Testing...' : 'Test Connection'}</span>
          </button>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Connection Status Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                testResult.connected
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {testResult.connected ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900">
                  {testResult.connected ? 'Supabase Connected' : 'Supabase Setup Required'}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    testResult.connected
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {testResult.connected ? 'ACTIVE' : 'READY TO CONFIGURE'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{testResult.message}</p>
            </div>
          </div>

          {testResult.latencyMs && (
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-center">
                <span className="text-[10px] text-slate-400 block font-bold">LATENCY</span>
                <span className="font-bold text-slate-900">{testResult.latencyMs} ms</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-center">
                <span className="text-[10px] text-slate-400 block font-bold">DATABASE</span>
                <span className={`font-bold ${testResult.database ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {testResult.database ? 'Ready' : 'Pending'}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-center">
                <span className="text-[10px] text-slate-400 block font-bold">STORAGE</span>
                <span className={`font-bold ${testResult.storage ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {testResult.storage ? 'Ready' : 'Check'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSaveConfig} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Supabase Project URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://your-project-id.supabase.co"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Found in your Supabase Project Settings &gt; API &gt; Project URL.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Supabase Anon (Public) Key <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Found in Supabase Project Settings &gt; API &gt; Project API keys (anon public).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Save Supabase Credentials
              </button>
              {(urlInput || keyInput) && (
                <button
                  type="button"
                  onClick={handleResetConfig}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <span className="text-[11px] text-slate-400">
              Credentials are securely stored in your browser environment.
            </span>
          </div>
        </form>
      </div>

      {/* Two Column Layout: Storage & Database */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supabase Storage Panel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Supabase Storage Buckets</h3>
            </div>
            <span className="text-[11px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded-full">
              Object & File Storage
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Store high-resolution moving photos, before-and-after work, customer inventory attachments, and PDF quotes in Supabase cloud buckets.
          </p>

          {/* Bucket Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            {Object.values(SUPABASE_BUCKETS).map((bucket) => (
              <button
                key={bucket}
                onClick={() => {
                  setSelectedBucket(bucket);
                  loadBucketFiles(bucket);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedBucket === bucket
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {bucket}
              </button>
            ))}
          </div>

          {/* File Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors relative">
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center pointer-events-none">
              <Upload className={`w-8 h-8 text-blue-600 mb-2 ${uploading ? 'animate-bounce' : ''}`} />
              <span className="font-bold text-xs text-slate-800">
                {uploading ? 'Uploading to Supabase Storage...' : `Upload test file to '${selectedBucket}' bucket`}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Click or drag & drop JPG, PNG, WEBP, or PDF
              </span>
            </div>
          </div>

          {/* Upload Feedback */}
          {uploadSuccessUrl && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Uploaded successfully to Supabase!</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  readOnly
                  value={uploadSuccessUrl}
                  className="w-full bg-white px-2 py-1 rounded text-[11px] border font-mono text-slate-700"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(uploadSuccessUrl);
                    addNotification('Public URL copied to clipboard');
                  }}
                  className="px-2.5 py-1 bg-emerald-700 text-white rounded font-bold text-[11px] shrink-0"
                >
                  Copy URL
                </button>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Files in bucket */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Files in '{selectedBucket}' ({bucketFiles.length})</span>
              <button
                onClick={() => loadBucketFiles(selectedBucket)}
                className="text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>

            {bucketFiles.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-100">
                No files uploaded yet in this bucket.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {bucketFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate font-mono text-[11px]">{file.name}</span>
                    </div>
                    <a
                      href={file.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center gap-1 shrink-0 ml-2"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Supabase Database Panel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Supabase Relational Database</h3>
            </div>
            <button
              onClick={handleSyncAll}
              disabled={syncing || !config.isConfigured}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Local Data to Supabase'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-500">
            PostgreSQL tables for leads, bookings, quotes, staff, fleet, and invoices with Row Level Security (RLS).
          </p>

          {/* Sync Result Feedback */}
          {syncResult && (
            <div
              className={`p-3 rounded-xl text-xs space-y-1 ${
                syncResult.success ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-amber-50 border border-amber-200 text-amber-900'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {syncResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <span>
                  {syncResult.success
                    ? 'All tables synchronized to Supabase PostgreSQL!'
                    : 'Partial sync with some warnings:'}
                </span>
              </div>
              {syncResult.synced.length > 0 && (
                <p className="text-[11px] text-emerald-700">
                  Synced: {syncResult.synced.join(', ')}
                </p>
              )}
              {syncResult.errors.length > 0 && (
                <p className="text-[11px] text-amber-700">
                  Errors: {syncResult.errors.join('; ')}
                </p>
              )}
            </div>
          )}

          {/* Database Table Counts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {[
              { name: 'leads', label: 'Leads', local: leads.length },
              { name: 'quotes', label: 'Quotes', local: quotes.length },
              { name: 'bookings', label: 'Bookings', local: bookings.length },
              { name: 'customers', label: 'Customers', local: customers.length },
              { name: 'staff', label: 'Staff', local: staff.length },
              { name: 'vehicles', label: 'Vehicles', local: vehicles.length },
              { name: 'services', label: 'Services', local: services.length },
              { name: 'invoices', label: 'Invoices', local: invoices.length },
              { name: 'reviews', label: 'Reviews', local: reviews.length },
              { name: 'gallery', label: 'Gallery', local: gallery.length },
              { name: 'faqs', label: 'FAQs', local: faqs.length },
              { name: 'payments', label: 'Payments', local: payments.length },
            ].map((tbl) => (
              <div
                key={tbl.name}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between font-bold text-slate-700 text-[11px]">
                  <span>{tbl.label}</span>
                  <span className="text-[10px] text-slate-400">Local: {tbl.local}</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-slate-900 font-extrabold text-sm">
                  <span>Supabase:</span>
                  <span className="text-emerald-700">
                    {countsLoading ? '...' : tableCounts[tbl.name] !== undefined ? tableCounts[tbl.name] : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* SQL Setup Helper */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="block font-bold text-xs text-slate-800">
                Setup Schema in Supabase
              </span>
              <span className="text-[11px] text-slate-400">
                Copy the DDL script to create tables and storage buckets in 1 click.
              </span>
            </div>

            <button
              onClick={copySqlSchema}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step by Step Guide */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-extrabold text-base mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>How to Connect Your Supabase Project (3 Easy Steps)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mb-2">
              1
            </span>
            <h4 className="font-bold text-white mb-1">Create Supabase Project</h4>
            <p className="text-slate-400 text-[11px]">
              Head to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">supabase.com</a>, create a free project, and open the SQL Editor.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mb-2">
              2
            </span>
            <h4 className="font-bold text-white mb-1">Run SQL Schema</h4>
            <p className="text-slate-400 text-[11px]">
              Click "Copy SQL Schema" above and paste it into the Supabase SQL Editor. It will create all tables, RLS policies, and storage buckets.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mb-2">
              3
            </span>
            <h4 className="font-bold text-white mb-1">Paste URL & Anon Key</h4>
            <p className="text-slate-400 text-[11px]">
              Copy your Project URL and Anon Key into the form above or into `.env`. The app immediately switches to Supabase for storage and data!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
