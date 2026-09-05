import React from 'react';
import { Send, FileCheck, CalendarCheck, Truck, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function HowItWorks() {
  const { navigateTo } = useApp();

  const steps = [
    {
      num: '01',
      title: 'REQUEST A QUOTE',
      desc: 'Tell us where you are moving from, your destination, home size, and services needed.',
      icon: Send,
    },
    {
      num: '02',
      title: 'GET YOUR ESTIMATE',
      desc: 'Our dispatch team reviews your requirements and provides an instant, transparent quote in Ksh.',
      icon: FileCheck,
    },
    {
      num: '03',
      title: 'BOOK YOUR MOVE',
      desc: 'Choose your preferred date, time slot, and confirm your dedicated crew and vehicle.',
      icon: CalendarCheck,
    },
    {
      num: '04',
      title: 'WE MOVE YOU',
      desc: 'Our uniformed team arrives with padded blankets, straps, and trucks to safely transport everything.',
      icon: Truck,
    },
    {
      num: '05',
      title: 'SETTLE IN',
      desc: 'Enjoy room placement, furniture assembly, and deep sanitization so your new home is ready immediately.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-3">
            Simple 5-Step Journey
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            From your first click to the moment you step into a spotless new space, here is our organized process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between hover:bg-blue-50/40 hover:border-blue-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-blue-950/20 group-hover:text-blue-900/40 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigateTo('/get-a-quote')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold shadow-md transition-all hover:scale-102"
          >
            <span>Start Step 01 — Request a Free Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
