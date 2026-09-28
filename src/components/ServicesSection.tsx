import React from 'react';
import { Home, Building2, Package, ShieldCheck, Truck, Sparkles, ArrowRight, Check } from 'lucide-react';
import { SERVICES_DATA } from '../data/initialData';
import { useApp } from '../context/AppContext';

export const ServicesSection: React.FC = () => {
  const { setSelectedServiceId, setCurrentView } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-5 h-5 text-amber-500" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-amber-500" />;
      case 'Package':
        return <Package className="w-5 h-5 text-amber-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-amber-500" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-amber-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      default:
        return <Truck className="w-5 h-5 text-amber-500" />;
    }
  };

  const handleSelectService = (id: string) => {
    setSelectedServiceId(id);
    setCurrentView('service-detail');
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Comprehensive Moving Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Tailored Services for Every Move
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Whether you are moving down the road or relocating your business across the UK, our specialists ensure an effortless transition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((srv) => (
            <div
              key={srv.id}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    {getIcon(srv.icon)}
                  </div>
                  <span className="text-xs font-black text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-full">
                    {srv.priceUnit}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{srv.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{srv.description}</p>

                <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                  {srv.features.slice(0, 3).map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleSelectService(srv.id)}
                  className="w-full bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-semibold py-2.5 px-4 rounded-xl border border-slate-300 text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Explore Service &amp; Rates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
