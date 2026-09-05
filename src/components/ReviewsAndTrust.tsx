import React from 'react';
import { Star, ShieldCheck, Award, HeartHandshake, CheckCircle2, ThumbsUp } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';

export function ReviewsAndTrust() {
  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 pb-12 border-b border-slate-100">
          <div className="p-4 bg-slate-50 rounded-2xl text-center flex flex-col items-center">
            <div className="w-10 h-10 bg-blue-100 text-blue-900 rounded-xl flex items-center justify-center mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xs text-slate-900">100% Insured & Bonded</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Comprehensive cargo protection</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-center flex flex-col items-center">
            <div className="w-10 h-10 bg-purple-100 text-purple-900 rounded-xl flex items-center justify-center mb-2">
              <Award className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xs text-slate-900">Certified Specialists</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Background-checked crews</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-center flex flex-col items-center">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-900 rounded-xl flex items-center justify-center mb-2">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xs text-slate-900">Guaranteed Pricing</span>
            <p className="text-[11px] text-slate-500 mt-0.5">No hidden day-of surprises</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-center flex flex-col items-center">
            <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center mb-2">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xs text-slate-900">Eco-Friendly Cleaning</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Non-toxic botanical solutions</p>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Customer Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Over 5,000+ Happy Families & Businesses
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            See why clients rate Shammah Movers and Cleaners 4.9 out of 5 stars across residential and commercial relocations.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-3xl p-6 sm:p-7 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                {/* Stars & Service tag */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                    {t.service}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900">{t.name}</span>
                    {t.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block">{t.role}</span>
                </div>
                <span className="text-[10px] text-slate-400">{t.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
