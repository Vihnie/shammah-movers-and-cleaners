import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Local storage key for runtime Supabase credentials configuration in Admin UI
const STORAGE_KEY_URL = 'shammah_supabase_url';
const STORAGE_KEY_ANON = 'shammah_supabase_anon_key';

export function getStoredSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  // Check env vars first
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  // Check localStorage runtime override (for in-browser setup)
  let localUrl = '';
  let localKey = '';
  if (typeof window !== 'undefined' && window.localStorage) {
    localUrl = localStorage.getItem(STORAGE_KEY_URL) || '';
    localKey = localStorage.getItem(STORAGE_KEY_ANON) || '';
  }

  const url = (localUrl || envUrl || '').trim();
  const anonKey = (localKey || envKey || '').trim();

  const isValidUrl = url.startsWith('http://') || url.startsWith('https://');
  const isConfigured = isValidUrl && anonKey.length > 10;

  return {
    url,
    anonKey,
    isConfigured,
  };
}

export function saveStoredSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (url.trim()) {
      localStorage.setItem(STORAGE_KEY_URL, url.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_URL);
    }

    if (anonKey.trim()) {
      localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_ANON);
    }

    // Refresh client
    reinitializeSupabase();
  }
}

export function clearStoredSupabaseConfig() {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_ANON);
    reinitializeSupabase();
  }
}

// Fallback dummy client when Supabase is not configured to avoid runtime crashes
function createFallbackClient(): SupabaseClient {
  const dummyQuery = {
    select: () => dummyQuery,
    insert: () => dummyQuery,
    update: () => dummyQuery,
    delete: () => dummyQuery,
    upsert: () => dummyQuery,
    eq: () => dummyQuery,
    order: () => dummyQuery,
    limit: () => dummyQuery,
    single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    then: (resolve: any) => resolve({ data: [], error: new Error('Supabase credentials not configured yet.') }),
  };

  const dummyStorageBucket = {
    upload: async () => ({ data: null, error: new Error('Supabase not configured') }),
    download: async () => ({ data: null, error: new Error('Supabase not configured') }),
    list: async () => ({ data: [], error: new Error('Supabase not configured') }),
    getPublicUrl: (path: string) => ({ data: { publicUrl: path } }),
    remove: async () => ({ data: null, error: null }),
  };

  const fallback = {
    from: () => dummyQuery,
    storage: {
      from: () => dummyStorageBucket,
      listBuckets: async () => ({ data: [], error: new Error('Supabase not configured') }),
      getBucket: async () => ({ data: null, error: new Error('Supabase not configured') }),
    },
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  } as unknown as SupabaseClient;

  return fallback;
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const { url, anonKey, isConfigured } = getStoredSupabaseConfig();

  if (!isConfigured) {
    cachedClient = createFallbackClient();
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    cachedClient = createFallbackClient();
    return cachedClient;
  }
}

export function reinitializeSupabase(): SupabaseClient {
  cachedClient = null;
  return getSupabaseClient();
}

export const supabase = getSupabaseClient();

/**
 * Checks whether Supabase is fully configured with valid project URL and key
 */
export function isSupabaseConfigured(): boolean {
  return getStoredSupabaseConfig().isConfigured;
}

/**
 * Test Supabase database and storage connection
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  database: boolean;
  storage: boolean;
  message: string;
  buckets?: string[];
  latencyMs?: number;
}> {
  const { isConfigured, url } = getStoredSupabaseConfig();
  if (!isConfigured) {
    return {
      connected: false,
      database: false,
      storage: false,
      message: 'Supabase URL or Anon Key is missing. Configure them in Admin Settings or .env',
    };
  }

  const startTime = Date.now();
  const client = getSupabaseClient();

  let dbOk = false;
  let storageOk = false;
  let bucketsList: string[] = [];
  let errorMsg = '';

  // 1. Test database via a simple health select or table check
  try {
    const { error: dbError } = await client.from('services').select('id').limit(1);
    if (!dbError) {
      dbOk = true;
    } else if (dbError.message.includes('relation') || dbError.message.includes('table') || dbError.code === '42P01') {
      // Table doesn't exist yet, but connection to Postgres succeeded!
      dbOk = true;
      errorMsg = 'Connected to Supabase PostgreSQL! Database schema needs to be applied.';
    } else {
      errorMsg = `Database: ${dbError.message}`;
    }
  } catch (e: any) {
    errorMsg = `Database check failed: ${e.message}`;
  }

  // 2. Test storage service
  try {
    const { data: buckets, error: storageError } = await client.storage.listBuckets();
    if (!storageError && buckets) {
      storageOk = true;
      bucketsList = buckets.map((b) => b.name);
    } else if (storageError) {
      console.warn('Supabase storage check warning:', storageError);
      // Even if listBuckets fails due to RLS, if URL is valid, storage service exists
      storageOk = !storageError.message.includes('fetch');
    }
  } catch (e: any) {
    console.warn('Storage check exception:', e);
  }

  const latency = Date.now() - startTime;
  const connected = dbOk || storageOk;

  return {
    connected,
    database: dbOk,
    storage: storageOk,
    buckets: bucketsList,
    latencyMs: latency,
    message: connected
      ? `Successfully connected to Supabase (${url}) in ${latency}ms!`
      : errorMsg || 'Unable to connect to Supabase. Check your Project URL and Anon Key.',
  };
}
