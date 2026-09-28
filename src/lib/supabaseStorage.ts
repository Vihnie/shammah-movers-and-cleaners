import { getSupabaseClient, isSupabaseConfigured } from './supabase';

export interface StorageUploadResult {
  success: boolean;
  publicUrl: string;
  path?: string;
  error?: string;
}

export interface StorageFileItem {
  name: string;
  id?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  last_accessed_at?: string | null;
  metadata?: Record<string, any> | null;
  publicUrl: string;
}

export const SUPABASE_BUCKETS = {
  GALLERY: 'gallery',
  ATTACHMENTS: 'attachments',
  DOCUMENTS: 'documents',
  RECEIPTS: 'receipts',
} as const;

/**
 * Uploads a File or Blob directly to a Supabase Storage bucket.
 * Automatically generates a unique filename or uses provided path.
 */
export async function uploadToSupabaseStorage(
  bucket: string,
  file: File | Blob,
  customPath?: string
): Promise<StorageUploadResult> {
  const client = getSupabaseClient();
  const configured = isSupabaseConfigured();

  // If not configured, convert to local data URL so the user can still test in preview
  if (!configured) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          success: true,
          publicUrl: reader.result as string,
          path: customPath || `local_${Date.now()}`,
          error: 'Saved locally (configure Supabase in Admin to store in cloud bucket).',
        });
      };
      reader.onerror = () => {
        resolve({
          success: false,
          publicUrl: '',
          error: 'Failed to read file locally.',
        });
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    // Generate clean path with timestamp to prevent cache collision
    const fileExtension = file instanceof File ? file.name.split('.').pop() || 'jpg' : 'jpg';
    const cleanFileName = file instanceof File
      ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      : `upload_${Date.now()}.${fileExtension}`;
    const filePath = customPath || `${Date.now()}_${cleanFileName}`;

    const { data, error } = await client.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn(`Supabase Storage upload to [${bucket}] failed:`, error);
      // If bucket doesn't exist yet, return helpful error
      return {
        success: false,
        publicUrl: '',
        error: `Supabase Storage error: ${error.message}. Ensure bucket '${bucket}' exists and is set to public.`,
      };
    }

    // Get public URL
    const { data: urlData } = client.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      publicUrl: urlData.publicUrl,
      path: data.path,
    };
  } catch (err: any) {
    console.error('Unexpected error during Supabase storage upload:', err);
    return {
      success: false,
      publicUrl: '',
      error: err.message || 'Failed to upload to Supabase storage',
    };
  }
}

/**
 * Lists all files in a specific Supabase storage bucket
 */
export async function listSupabaseStorageFiles(
  bucket: string,
  folder = ''
): Promise<{ files: StorageFileItem[]; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { files: [] };
  }

  const client = getSupabaseClient();
  try {
    const { data, error } = await client.storage.from(bucket).list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      return { files: [], error: error.message };
    }

    const filesWithUrls: StorageFileItem[] = (data || [])
      .filter((item) => item.name !== '.emptyFolderPlaceholder')
      .map((item) => {
        const fullPath = folder ? `${folder}/${item.name}` : item.name;
        const { data: urlData } = client.storage.from(bucket).getPublicUrl(fullPath);
        return {
          ...item,
          publicUrl: urlData.publicUrl,
        };
      });

    return { files: filesWithUrls };
  } catch (err: any) {
    return { files: [], error: err.message };
  }
}

/**
 * Removes a file from a Supabase storage bucket
 */
export async function deleteFromSupabaseStorage(
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const client = getSupabaseClient();
  try {
    const { error } = await client.storage.from(bucket).remove([path]);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
