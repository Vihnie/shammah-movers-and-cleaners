import React from 'react';
import { ShieldCheck, Heart, Award, Clock, Users, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function AboutPage() {
  const { cms, navigateTo } = useApp();

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            Our Story & Values
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            About Shammah Movers & Cleaners
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            A professional, reliable and customer-focused moving and cleaning company that makes relocation and property cleaning simple and stress-free.
          </p>
        </div>

        {/* Mission & Story Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
                Our Mission
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {cms.about_mission}
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Certified Crew & Transit Protection</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
                Our Story
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {cms.about_story}
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-purple-900">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>7 Days a Week Operations Across Kenya</span>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="bg-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl mb-12">
          <h3 className="text-2xl font-extrabold mb-4 text-center">
            The Shammah Standard
          </h3>
          <p className="text-center text-blue-200 text-sm max-w-2xl mx-auto mb-10">
            We avoid shortcuts, unverified promises, or reckless handling. Every move follows strict checklist protocols.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h4 className="font-extrabold text-base mb-2">1. Dedicated Vehicles</h4>
              <p className="text-xs text-blue-200 leading-relaxed">
                Closed, weather-proof box trucks equipped with hydraulic tail lifts, padded interior blankets, and tie-down rails.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h4 className="font-extrabold text-base mb-2">2. In-House Artisans</h4>
              <p className="text-xs text-blue-200 leading-relaxed">
                Skilled carpenters and steam extraction specialists who know how to dismantle complex fixtures and sanitize surfaces.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h4 className="font-extrabold text-base mb-2">3. Zero Hidden Fees</h4>
              <p className="text-xs text-blue-200 leading-relaxed">
                Clear quotes in Kenyan Shillings. The price on your confirmed estimate is the price you pay on completion.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => navigateTo('/get-a-quote')}
              className="px-8 py-3.5 rounded-xl bg-white text-blue-950 font-extrabold text-xs shadow-lg transition-all hover:scale-105"
            >
              Get a Free Quote with Shammah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
