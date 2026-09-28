import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactSection: React.FC = () => {
  const { createLead } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createLead({
      customer_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service_type: formData.subject,
      notes: formData.message,
      status: 'New'
    });
    setSubmitted(true);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Contact Dispatch &amp; Customer Support
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Have a question about an upcoming move, parking suspension, or bespoke crating? We are here 7 days a week.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 text-xs">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
                Central Operations &amp; Dispatch Hub
              </h3>

              <div className="flex items-start gap-3 text-slate-700">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-900">SwiftMove Logistics Centre</span>
                  <span>Unit 4, Highpoint Logistics Park, Kensington, London W14 8DJ</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-700">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-900">Telephone Lines</span>
                  <a href="tel:+442079460912" className="text-amber-600 hover:underline font-bold">
                    020 7946 0912 (Main Dispatch)
                  </a>
                  <div className="text-[11px] text-slate-500">Freephone UK: 0800 123 4567</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-700">
                <Mail className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-900">Electronic Mail</span>
                  <a href="mailto:dispatch@swiftmove.co.uk" className="text-slate-700 hover:underline">
                    dispatch@swiftmove.co.uk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-700">
                <Clock className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-900">Hours of Service</span>
                  <div>Mon - Sat: 7:00 AM – 8:00 PM</div>
                  <div>Sunday: 8:00 AM – 6:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
              {submitted ? (
                <div className="text-center py-10 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">Message Delivered</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you, {formData.name}. Our dispatch coordinator will reply via email or telephone within 30 minutes during operating hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Send an Online Inquiry</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Inquiry Topic</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      >
                        <option value="General Inquiry">General Moving Inquiry</option>
                        <option value="Commercial Relocation">Commercial &amp; Office Move</option>
                        <option value="Storage Facility">Secure Storage Unit</option>
                        <option value="Specialist Antique/Piano">Piano or Fine Art</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Message or Query *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your requirements or questions..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Send Message to Dispatch</span>
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
