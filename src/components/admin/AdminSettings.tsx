import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Building, Phone, Mail, MapPin, DollarSign, Globe, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AdminSettings() {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Company & Business Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global business parameters, official M-Pesa Till configuration, and corporate identity.
          </p>
        </div>

        {isSaved && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Core Company Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-blue-900" />
            <h3 className="font-extrabold text-sm text-slate-900">Corporate Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Phone (Primary)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-xs"
                placeholder="0181460645"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Alternative Phone (Secondary)</label>
              <input
                type="text"
                value={formData.phone2 || ''}
                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-xs"
                placeholder="0118894810"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Business Line</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-xs font-mono"
                placeholder="254181460645"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Business Email (Official)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-xs"
                placeholder="business.shammah@gmail.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Customer Support Email</label>
              <input
                type="email"
                value={formData.email2 || formData.support_email || ''}
                onChange={(e) => setFormData({ ...formData, email2: e.target.value, support_email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-xs"
                placeholder="support.shammah@gmail.com"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Physical Headquarters Address</label>
              <input
                type="text"
                value={formData.physical_address}
                onChange={(e) => setFormData({ ...formData, physical_address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-xs"
                placeholder="Juja, Sanne Square along JKUAT Main gate"
              />
            </div>
          </div>
        </div>

        {/* Kenyan M-Pesa Integration Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <DollarSign className="w-4 h-4 text-emerald-700" />
            <h3 className="font-extrabold text-sm text-slate-900">M-Pesa & Financial Settlement</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                M-Pesa Buy Goods Till Number
              </label>
              <input
                type="text"
                value={formData.mpesa_till}
                onChange={(e) => setFormData({ ...formData, mpesa_till: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-xs font-mono font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Displayed automatically on customer invoices and instant quote documents.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                M-Pesa Paybill / Account (Optional)
              </label>
              <input
                type="text"
                value={formData.mpesa_paybill || ''}
                onChange={(e) => setFormData({ ...formData, mpesa_paybill: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-xs font-mono"
                placeholder="e.g. Paybill: 247247 / Acc: SHAMMAH"
              />
            </div>
          </div>
        </div>

        {/* Operational Working Hours */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">
            Dispatch Operating Hours
          </h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Weekly Operational Schedule</label>
            <input
              type="text"
              value={typeof formData.working_hours === 'string' ? formData.working_hours : 'Monday – Sunday: 6:30 AM – 8:00 PM'}
              onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              placeholder="Monday – Sunday: 6:30 AM – 8:00 PM"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Displayed on customer contact sections, website footer, and moving dispatch notifications.
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
