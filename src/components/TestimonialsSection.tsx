import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { REVIEWS_DATA } from '../data/initialData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200" id="testimonials">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Client Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Trusted by Hundreds of Families &amp; Businesses
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3 text-amber-500">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-800">4.9 / 5.0 Average Satisfaction Score</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS_DATA.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{rev.author}</span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">{rev.location}</span>
                <span className="text-[10px] text-amber-600 font-medium block mt-0.5">{rev.service}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
