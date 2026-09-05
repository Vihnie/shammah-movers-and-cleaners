import React, { useState } from 'react';
import { Image, X, ZoomIn, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GalleryItem } from '../types';

export function GallerySection() {
  const { gallery } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filters = ['ALL', 'MOVING', 'PACKING', 'CLEANING', 'FUMIGATION', 'OFFICE MOVES'];

  const filteredList = activeFilter === 'ALL'
    ? gallery
    : gallery.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Image className="w-3.5 h-3.5" />
            Field Operations
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Work in Action
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            See how our dedicated teams handle high-value furniture, heavy packaging, office setups, and deep steam extraction.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === filter
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative bg-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer border border-slate-200"
            >
              <div className="aspect-4/3 w-full overflow-hidden bg-slate-900">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Hover overlay with caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] font-extrabold tracking-wider bg-blue-600/90 w-fit px-2 py-0.5 rounded uppercase mb-1">
                  {item.category}
                </span>
                <h4 className="font-extrabold text-base leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {item.caption}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-blue-300 font-semibold">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Click to view larger</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 flex items-center justify-center animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition-colors"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] flex items-center justify-center bg-black">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="p-6 bg-slate-900 text-white border-t border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  {selectedImage.category}
                </span>
                <h3 className="text-xl font-extrabold mt-1">
                  {selectedImage.title}
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  {selectedImage.caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
