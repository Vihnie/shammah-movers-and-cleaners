import React, { useState } from 'react';
import { Sparkles, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { INITIAL_BEFORE_AFTER } from '../data/initialData';

export function BeforeAfterSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState(INITIAL_BEFORE_AFTER[0]);
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100

  const categories = ['All', 'Home cleaning', 'Sofa cleaning', 'Carpet cleaning', 'Move-out cleaning'];

  const filteredItems = activeCategory === 'All'
    ? INITIAL_BEFORE_AFTER
    : INITIAL_BEFORE_AFTER.filter((item) => item.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Visible Craftsmanship
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Before & After Cleaning Results
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Drag the interactive slider below to see how our industrial steam extractors and sanitization methods transform living spaces.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                const firstMatch = cat === 'All'
                  ? INITIAL_BEFORE_AFTER[0]
                  : INITIAL_BEFORE_AFTER.find((i) => i.category.toLowerCase().includes(cat.toLowerCase()));
                if (firstMatch) setActiveItem(firstMatch);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Split Comparison Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                {activeItem.category}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                {activeItem.title}
              </h3>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              {activeItem.description}
            </p>
          </div>

          {/* Interactive Split-View Canvas */}
          <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden select-none cursor-ew-resize group bg-slate-900">
            {/* After Image (Full background) */}
            <img
              src={activeItem.after_url}
              alt="After Cleaning"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 z-10 bg-emerald-600/90 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-extrabold tracking-wider uppercase shadow-md flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              AFTER CLEANING
            </div>

            {/* Before Image (Clipped overlay) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={activeItem.before_url}
                alt="Before Cleaning"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-extrabold tracking-wider uppercase shadow-md">
                BEFORE TREATMENT
              </div>
            </div>

            {/* Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-white text-blue-900 flex items-center justify-center shadow-lg border-2 border-blue-900">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
            </div>

            {/* Hidden native range input covering canvas for smooth dragging */}
            <input
              type="range"
              min={0}
              max={100}
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label="Drag to compare before and after cleaning"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>

          {/* Quick Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  activeItem.id === item.id
                    ? 'border-blue-900 bg-blue-50/70 ring-2 ring-blue-900/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="block text-[11px] font-bold text-slate-500 uppercase">
                  {item.category}
                </span>
                <span className="block text-xs font-extrabold text-slate-800 line-clamp-1">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
