import React, { useState } from 'react';
import { Image, Plus, Trash2, X, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GalleryItem } from '../../types';

export function AdminGallery() {
  const { gallery, addGalleryItem, deleteGalleryItem } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('MOVING');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    addGalleryItem({
      title,
      category,
      image_url: imageUrl,
      caption,
    });

    setIsAddModalOpen(false);
    setTitle('');
    setImageUrl('');
    setCaption('');
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

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
