import React from 'react';
import { Users, FileText, ShieldCheck, Sliders, Clock, Headset } from 'lucide-react';

export function WhyChooseUs() {
  const cards = [
    {
      icon: Users,
      title: 'Professional Team',
      description: 'Trained, background-checked personnel who handle your belongings with diligence and courtesy.',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      icon: FileText,
      title: 'Transparent Quotes',
      description: 'Clear, upfront pricing with zero hidden surcharges so you understand the exact cost before booking.',
      color: 'from-indigo-600 to-purple-700',
    },
    {
      icon: ShieldCheck,
      title: 'Careful Handling',
      description: 'Furniture and delicate items are wrapped in thick blankets, boxed securely, and strapped with care.',
      color: 'from-purple-600 to-pink-700',
    },
    {
      icon: Sliders,
      title: 'Flexible Services',
      description: 'Choose only what you need: full hands-free moving, simple transport, or standalone deep cleaning.',
      color: 'from-blue-600 to-cyan-700',
    },
    {
      icon: Clock,
      title: 'Reliable Scheduling',
      description: 'We respect your schedule with confirmed arrival windows and prompt weekend and after-hours execution.',
      color: 'from-emerald-600 to-teal-700',
    },
    {
      icon: Headset,
      title: 'End-to-End Support',
      description: 'Continuous support from packing through transportation, unloading, assembly, and sanitization.',
      color: 'from-blue-700 to-purple-800',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
            Built on Trust & Precision
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Choose Shammah?
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Relocation and property cleaning designed to be stress-free, accountable, and customer-focused.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
