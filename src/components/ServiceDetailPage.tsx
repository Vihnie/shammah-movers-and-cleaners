import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Phone,
  MessageCircle,
  Home,
  Building2,
  Truck,
  PackageCheck,
  Sparkles,
  Brush,
  Layers,
  ShieldAlert,
  Archive,
  Wrench,
  ArrowLeft,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceItem } from '../types';

interface ServiceDetailPageProps {
  slug?: string;
}

export function ServiceDetailPage({ slug }: ServiceDetailPageProps) {
  const { services, navigateTo, settings } = useApp();
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home': return Home;
      case 'Building2': return Building2;
      case 'Truck': return Truck;
      case 'PackageCheck': return PackageCheck;
      case 'Sparkles': return Sparkles;
      case 'Brush': return Brush;
      case 'Layers': return Layers;
      case 'ShieldAlert': return ShieldAlert;
      case 'Archive': return Archive;
      case 'Wrench': return Wrench;
      default: return ShieldCheck;
    }
  };

  // If no slug is specified or slug === 'all', render the complete 10-Service Catalog
  if (!slug || slug === 'all') {
    const categories = ['ALL', 'MOVING', 'CLEANING', 'SPECIALTY'];
    const filtered = services.filter((s) => {
      const matchCat = filterCategory === 'ALL' || s.category.toUpperCase() === filterCategory;
      const matchSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.short_desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    return (
      <div className="py-12 lg:py-16 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Full Service Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Our Professional Moving & Cleaning Services
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Transparent, itemized pricing in Kenyan Shillings (Ksh). Certified crews, dedicated closed-body trucks, and state-of-the-art cleaning equipment across Nairobi and Kenya.
            </p>
          </div>

          {/* Filter & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full">
                        {service.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-blue-900 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {service.short_desc}
                    </p>

                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                      {service.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        {service.pricing_model === 'FIXED' ? 'Flat Rate' : 'Starting From'}
                      </span>
                      <span className="text-base font-black text-blue-950">
                        Ksh. {service.starting_price.toLocaleString('en-KE')}
                      </span>
                    </div>

                    <button
                      onClick={() => navigateTo(`/services/${service.slug}`)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-blue-900 hover:text-white text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Specific Service Detail View
  const service = services.find((s) => s.slug === slug) || services[0];
  const Icon = getServiceIcon(service.icon);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <button
          onClick={() => navigateTo('/services')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-900 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Services</span>
        </button>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-lg relative overflow-hidden mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                  {service.category.toUpperCase()}
                </span>
                {service.badge && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {service.badge}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {service.title}
              </h1>
              <p className="mt-2 text-base text-slate-600 max-w-2xl leading-relaxed">
                {service.short_desc}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center shrink-0 min-w-56">
              <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">
                {service.pricing_model === 'FIXED' ? 'Standard Price' : 'Starting From'}
              </span>
              <div className="text-2xl font-black text-blue-950 mt-1">
                Ksh. {service.starting_price.toLocaleString('en-KE')}
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Transparent Kenyan Rates
              </span>

              <button
                onClick={() => navigateTo('/quote')}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Calculate Exact Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Content & Features */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <h3 className="text-xl font-extrabold text-slate-900 mb-4">
                Overview & Professional Scope
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {service.full_desc}
              </p>

              <h4 className="text-base font-extrabold text-slate-900 mt-8 mb-4">
                What's Included in Every Service:
              </h4>
              <div className="space-y-3">
                {service.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why choose Shammah for this service */}
            <div className="bg-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-xl font-extrabold mb-3">
                Why Clients Trust Shammah for {service.title}
              </h3>
              <p className="text-sm text-blue-200 leading-relaxed mb-6">
                Our operations combine equipped closed trucks, specialized equipment, background-checked personnel, and comprehensive cargo care. You are never left dealing with casual, untrained handlers.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=Hello%20Shammah%2C%20I%20would%20like%20to%20inquire%20about%20${encodeURIComponent(service.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire on WhatsApp</span>
                </a>
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-purple-300" />
                  <span>Call Dispatch Desk</span>
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar with other services */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider mb-4">
                Other Services
              </h4>
              <div className="space-y-1.5">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => navigateTo(`/services/${s.slug}`)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                      s.slug === slug
                        ? 'bg-blue-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{s.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
