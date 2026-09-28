import React from 'react';
import { Calculator, ClipboardCheck, Truck, Home } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Calculator,
      title: 'Instant Online Estimation',
      desc: 'Enter your pickup, destination, and property size to receive an instant, accurate moving quote with no hidden extras.'
    },
    {
      num: '02',
      icon: ClipboardCheck,
      title: 'Tailored Move Plan & Kits',
      desc: 'We allocate your dedicated crew, schedule arrival windows, and dispatch heavy-duty packing boxes straight to your door.'
    },
    {
      num: '03',
      icon: Truck,
      title: 'Careful Loading & Safe Transit',
      desc: 'Our uniformed crew arrives on time, protects floors, wraps furniture in padded blankets, and drives directly via insured routes.'
    },
    {
      num: '04',
      icon: Home,
      title: 'Unloading & Reassembly',
      desc: 'We place every box in its designated room, reassemble bed frames and wardrobes, and leave your new home ready to live in.'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Simple 4-Step Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            How SwiftMove Works
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            We have engineered every detail of the relocation process to eliminate moving day stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-amber-400/60 hover:shadow-md transition-all space-y-4 relative"
            >
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
                  <st.icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-slate-200">{st.num}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{st.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
