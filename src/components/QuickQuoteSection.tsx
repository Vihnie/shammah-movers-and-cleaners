import React, { useState } from 'react';
import { Send, CheckCircle2, Phone, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickQuoteSection: React.FC = () => {
  const { createLead } = useApp();

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    service_type: 'Residential Home Moves',
    moving_from: '',
    moving_to: '',
    house_size: '2 Bed',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createLead({
      ...formData,
      status: 'New',
      estimated_amount: formData.house_size.includes('4') ? 850 : 450
    });
    setIsSubmitting(false);
    if (res) {
      setIsSubmitted(true);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white" id="quick-quote">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Need a Custom Assessment?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Request a Fast Callback &amp; Fixed Written Quote
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Have complex access requirements, an oversized piano, or commercial server racks? Our senior surveyor will contact you with a bespoke logistics plan within 15 minutes.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero sales pressure or cold calls</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Complimentary video survey available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Written quote guaranteed for 30 calendar days</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Direct Line to Senior Surveyors</span>
                <a href="tel:+442079460912" className="text-base font-bold text-white hover:text-amber-400">
                  020 7946 0912
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl">
              {isSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Request Received!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Thank you, {formData.customer_name}. One of our senior moving surveyors will call you shortly on{' '}
                    <span className="text-amber-400 font-semibold">{formData.phone}</span>.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-white border-b border-slate-700 pb-2">
                    Quick Survey Inquiry Form
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Smith"
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+44 7700 900000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">Property Size</label>
                      <select
                        value={formData.house_size}
                        onChange={(e) => setFormData({ ...formData, house_size: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="1 Bed Flat">1 Bed Flat</option>
                        <option value="2 Bed House">2 Bed House</option>
                        <option value="3 Bed House">3 Bed House</option>
                        <option value="4+ Bed House">4+ Bed House</option>
                        <option value="Office / Commercial">Office / Commercial</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">Moving From</label>
                      <input
                        type="text"
                        placeholder="Town or Postcode"
                        value={formData.moving_from}
                        onChange={(e) => setFormData({ ...formData, moving_from: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">Moving To</label>
                      <input
                        type="text"
                        placeholder="Town or Postcode"
                        value={formData.moving_to}
                        onChange={(e) => setFormData({ ...formData, moving_to: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Any Special Notes</label>
                    <textarea
                      rows={2}
                      placeholder="e.g., Narrow access road, piano, short-term storage required..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending Request...' : 'Send Fast Callback Request'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
