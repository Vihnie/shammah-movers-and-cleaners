import React from 'react';
import { ShieldCheck, Clock, BadgePoundSterling, Wrench, Leaf, Smartphone } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      icon: BadgePoundSterling,
      title: 'Fixed Price Guarantee',
      desc: 'The price you see is the price you pay. Never worry about traffic jams, key delays, or surprise fuel surcharges on your invoice.'
    },
    {
      icon: ShieldCheck,
      title: '£100,000 Transit Cover',
      desc: 'Comprehensive protection covers all furniture, electronics, and valuables underwritten by leading UK marine insurers.'
    },
    {
      icon: Clock,
      title: 'Guaranteed Arrival Window',
      desc: 'We value your time. If our team is delayed by more than 30 minutes due to exceptional traffic, we credit £50 immediately.'
    },
    {
      icon: Wrench,
      title: 'Expert Dismantling & Assembly',
      desc: 'Our movers carry full power tool kits to safely take down multi-door wardrobes, divans, and dining sets, reassembling them securely.'
    },
    {
      icon: Leaf,
      title: '100% Eco-Friendly Materials',
      desc: 'We only supply reusable heavy-duty crates, acid-free biodegradable wrap, and recyclable double-walled cardboard boxes.'
    },
    {
      icon: Smartphone,
      title: 'Live Tracking & Instant Updates',
      desc: 'Track your assigned vehicle in real-time and stay connected directly to your move coordinator through our dispatch portal.'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/60 border-t border-slate-200" id="why-choose-us">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            The SwiftMove Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Why Discerning Clients Choose Us
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Built on reliability, uncompromising care, and total transparency from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <p.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
