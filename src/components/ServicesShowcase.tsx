import React from 'react';
import { Truck, Sparkles, Building2, Package, Wrench, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { ServiceType } from '../types';

interface ServicesShowcaseProps {
  onSelectService: (service: ServiceType) => void;
  onOpenCalculator: () => void;
}

export function ServicesShowcase({ onSelectService, onOpenCalculator }: ServicesShowcaseProps) {
  const services = [
    {
      id: 'residential',
      type: 'moving' as ServiceType,
      title: 'Residential Moving',
      badge: 'Popular',
      desc: 'Seamless home and apartment relocation with heavy padding, floor runners, and courteous moving crews.',
      icon: Truck,
      features: ['Apartments & single family homes', 'Disassembly & reassembly', 'Blanket wrap protection', 'Clean, ramp-equipped trucks'],
    },
    {
      id: 'cleaning',
      type: 'cleaning' as ServiceType,
      title: 'Move-In / Move-Out Deep Clean',
      badge: 'Deposit Back Guarantee',
      desc: 'Deep sanitization of kitchens, ovens, bathrooms, baseboards, and floors so your old and new homes are spotless.',
      icon: Sparkles,
      features: ['Inside oven & fridge cleaning', 'Grout scrub & baseboard detail', 'Eco-friendly non-toxic agents', 'Landlord inspection ready'],
    },
    {
      id: 'commercial',
      type: 'moving' as ServiceType,
      title: 'Commercial & Office Moves',
      badge: 'Zero Downtime',
      desc: 'Relocating workstations, servers, meeting rooms, and files over weekends or evenings to prevent business disruption.',
      icon: Building2,
      features: ['Office desks & cubicles', 'IT & monitor protective crates', 'Weekend & overnight slots', 'COI (Certificate of Insurance)'],
    },
    {
      id: 'packing',
      type: 'moving' as ServiceType,
      title: 'Full Packing & Supplies',
      badge: 'White-Glove',
      desc: 'Our specialists pack all glassware, china, wardrobes, and electronics using commercial grade boxes and wraps.',
      icon: Package,
      features: ['Wardrobe boxes & dish barrels', 'Custom bubble wrapping', 'Color-coded room labeling', 'Unpacking & debris haul away'],
    },
    {
      id: 'assembly',
      type: 'moving' as ServiceType,
      title: 'Assembly & Handyman Care',
      badge: 'Precision Gear',
      desc: 'Skilled disassembly and assembly of IKEA, Wayfair, bunk beds, modular desks, and wall mounting brackets.',
      icon: Wrench,
      features: ['Bed frames & dining sets', 'Wall bracket dismounting', 'Fitness rigs & elliptical machines', 'Hardware bagging & tagging'],
    },
    {
      id: 'combo',
      type: 'combo' as ServiceType,
      title: 'All-In-One Move + Clean Combo',
      badge: 'Save 15% Bundle',
      desc: 'The ultimate zero-stress experience. One coordinator handles your moving truck, crew, and deep cleaners simultaneously.',
      icon: ShieldCheck,
      features: ['Synchronized crew arrival', '15% automatic package discount', 'Single point of contact', 'Full deposit return confidence'],
    },
  ];

  return (
    <section id="services" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Comprehensive Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Moving & Cleaning Services
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Professional excellence backed by trained, background-checked personnel, modern fleet trucks, and eco-friendly products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => {
            const Icon = srv.icon;
            const isCombo = srv.id === 'combo';
            return (
              <div
                key={srv.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border ${
                  isCombo
                    ? 'bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white border-purple-500 shadow-xl'
                    : 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-white hover:shadow-lg'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
                        isCombo ? 'bg-purple-600 text-white' : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                        isCombo
                          ? 'bg-emerald-500 text-white'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {srv.badge}
                    </span>
                  </div>

                  <h3
                    className={`text-xl font-bold mb-2 ${
                      isCombo ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {srv.title}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed mb-5 ${
                      isCombo ? 'text-blue-200' : 'text-slate-600'
                    }`}
                  >
                    {srv.desc}
                  </p>

                  <div className="space-y-2 mb-6">
                    {srv.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isCombo ? 'text-purple-300' : 'text-blue-700'
                          }`}
                        />
                        <span className={isCombo ? 'text-slate-200' : 'text-slate-700'}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectService(srv.type);
                    onOpenCalculator();
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    isCombo
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                      : 'bg-white hover:bg-blue-900 hover:text-white text-slate-800 border border-slate-300 shadow-2xs'
                  }`}
                >
                  <span>Get Instant Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
