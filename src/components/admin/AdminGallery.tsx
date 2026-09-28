import React, { useState } from 'react';
import { Image, Plus, Trash2, X, Sparkles, Upload, CheckCircle2, HardDrive } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GalleryItem } from '../../types';
import { uploadToSupabaseStorage, SUPABASE_BUCKETS } from '../../lib/supabaseStorage';
import { isSupabaseConfigured } from '../../lib/supabase';

export function AdminGallery() {
  const { gallery, addGalleryItem, deleteGalleryItem, addNotification } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('MOVING');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus('Uploading to Supabase Storage...');

    try {
      const result = await uploadToSupabaseStorage(SUPABASE_BUCKETS.GALLERY, file);
      if (result.success && result.publicUrl) {
        setImageUrl(result.publicUrl);
        setUploadStatus('Photo uploaded to Supabase Storage!');
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
        }
      } else {
        setUploadStatus(result.error || 'Upload failed');
      }
    } catch (err: any) {
      setUploadStatus(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    addGalleryItem({
      title,
      category,
      image_url: imageUrl,
      caption,
    });

    addNotification(`Added "${title}" to gallery`);
    setIsAddModalOpen(false);
    setTitle('');
    setImageUrl('');
    setCaption('');
    setUploadStatus('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gallery & Photo Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showcase real moving operations, wrapped furniture, and industrial cleaning achievements.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo to Gallery</span>
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="aspect-4/3 w-full overflow-hidden bg-slate-900 relative">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-blue-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {item.category}
                </span>
              </div>

              <div className="p-4">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">ID #{item.id}</span>
              <button
                onClick={() => deleteGalleryItem(item.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                title="Remove photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Photo Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs p-4 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-4">
              Add Photo to Operations Gallery
            </h3>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                  placeholder="e.g. Living Room Protective Packing"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white"
                >
                  <option value="MOVING">MOVING</option>
                  <option value="PACKING">PACKING</option>
                  <option value="CLEANING">CLEANING</option>
                  <option value="FUMIGATION">FUMIGATION</option>
                  <option value="OFFICE MOVES">OFFICE MOVES</option>
                </select>
              </div>

              {/* Supabase Storage File Upload */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload to Supabase Storage</span>
                  </label>
                  <span className="text-[10px] text-blue-700 font-bold bg-blue-100/60 px-1.5 py-0.5 rounded">
                    bucket: gallery
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-900 file:text-white hover:file:bg-blue-800 cursor-pointer"
                  />
                </div>
                {uploadStatus && (
                  <p className={`text-[11px] mt-1.5 font-medium ${uploadStatus.includes('failed') || uploadStatus.includes('error') ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {uploadStatus}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-mono"
                  placeholder="https://... or uploaded via Supabase above"
                />
              </div>

              {imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-32 flex items-center justify-center">
                  <img src={imageUrl} alt="Preview" className="h-32 object-contain" />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full p-2 rounded-xl border text-xs"
                  placeholder="Brief note about the equipment or crew work..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Add to Showcase
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
