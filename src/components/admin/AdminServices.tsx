import React, { useState } from 'react';
import { Layers, Search, CheckCircle2, XCircle, Edit3, DollarSign, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';

export function AdminServices() {
  const { services, updateService, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    updateService(editingService.id, editingService);
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Services & Pricing Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage the 10 core offerings, base prices in Kenyan Shillings, and online presentation.
          </p>
        </div>

        <button
          onClick={() => navigateTo('/services')}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors self-start"
        >
          <span>Preview Public Services</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Service</th>
                <th className="p-4">Category</th>
                <th className="p-4">Starting Price (Ksh)</th>
                <th className="p-4">Pricing Model</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-extrabold text-slate-900">{srv.title}</div>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{srv.short_desc}</span>
                  </td>

                  <td className="p-4">
                    <span className="bg-blue-50 text-blue-900 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                      {srv.category}
                    </span>
                  </td>

                  <td className="p-4 font-black text-slate-900">
                    Ksh. {srv.starting_price.toLocaleString('en-KE')}
                  </td>

                  <td className="p-4 text-slate-600 font-medium">
                    {srv.pricing_model}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => updateService(srv.id, { active: !srv.active })}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        srv.active
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {srv.active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{srv.active ? 'ACTIVE' : 'HIDDEN'}</span>
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setEditingService(srv)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center gap-1 text-xs font-bold"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Price</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs p-4 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <h3 className="text-xl font-extrabold text-slate-900 mb-4">
              Edit Service: {editingService.title}
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Title</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Starting Price (Ksh)</label>
                  <input
                    type="number"
                    step="500"
                    value={editingService.starting_price}
                    onChange={(e) => setEditingService({ ...editingService, starting_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pricing Model</label>
                  <select
                    value={editingService.pricing_model}
                    onChange={(e) => setEditingService({ ...editingService, pricing_model: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white"
                  >
                    <option value="STARTING_FROM">STARTING FROM</option>
                    <option value="FIXED">FIXED RATE</option>
                    <option value="VARIABLE">VARIABLE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingService.short_desc}
                  onChange={(e) => setEditingService({ ...editingService, short_desc: e.target.value })}
                  className="w-full p-2.5 rounded-xl border text-xs"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow"
                >
                  Save Service Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
