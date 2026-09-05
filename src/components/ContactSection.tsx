import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, CheckCircle2, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ContactSection() {
  const { settings, addLead, trackClick, navigateTo } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    // Register inquiry as a lead in CRM
    addLead({
      customer_name: name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@contact.ke`,
      service_type: subject,
      moving_from: 'Contact Inquiry',
      moving_to: '',
      move_date: new Date().toISOString().split('T')[0],
      property_type: 'Inquiry',
      house_size: 'N/A',
      message: message,
      status: 'NEW',
      notes: `Contact Form Message: ${message}`,
    });

    trackClick('Contact Form Submitted', 'contact', '/#contact');
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Phone className="w-3.5 h-3.5" />
            Direct Communication
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact Shammah Movers & Cleaners
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Reach our dispatch center via phone, WhatsApp, email, or send us a direct message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Information & Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6">
              {/* Phone Numbers */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Direct Phone Lines
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <a
                      href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-base font-black text-slate-900 hover:text-blue-900 transition-colors"
                    >
                      {settings.phone}
                    </a>
                    {settings.phone2 && (
                      <>
                        <span className="hidden sm:inline text-slate-300 font-bold">•</span>
                        <a
                          href={`tel:${settings.phone2.replace(/[^0-9+]/g, '')}`}
                          className="text-base font-black text-slate-900 hover:text-blue-900 transition-colors"
                        >
                          {settings.phone2}
                        </a>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 block">
                    Fast response dispatch & field crew operations
                  </span>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    WhatsApp Chat
                  </span>
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=Hello%20Shammah%20Movers%2C%20I%20would%20like%20to%20make%20an%20inquiry`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-extrabold text-emerald-700 hover:underline transition-colors"
                  >
                    Chat Directly on WhatsApp (+{settings.whatsapp})
                  </a>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Send room photos & furniture lists for quick quotation
                  </span>
                </div>
              </div>

              {/* Email Addresses */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Official Email Addresses
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Business & Sales</span>
                    </div>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-sm font-extrabold text-slate-900 hover:text-purple-900 transition-colors block mt-0.5"
                    >
                      {settings.email}
                    </a>
                  </div>
                  {(settings.email2 || settings.support_email) && (
                    <div className="pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Client Support</span>
                      </div>
                      <a
                        href={`mailto:${settings.email2 || settings.support_email}`}
                        className="text-sm font-extrabold text-slate-900 hover:text-blue-900 transition-colors block mt-0.5"
                      >
                        {settings.email2 || settings.support_email}
                      </a>
                    </div>
                  )}
                  <span className="text-xs text-slate-500 block pt-0.5">
                    For corporate relocations, residential inquiries & customer support
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Physical Office & Depot
                  </span>
                  <p className="text-sm font-extrabold text-slate-900">
                    {settings.physical_address}
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Working Hours
                  </span>
                  <p className="text-sm font-extrabold text-slate-900">
                    {settings.working_hours}
                  </p>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Weekend & public holiday moves available
                  </span>
                </div>
              </div>
            </div>

            {/* Google Map Mock Location Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-lg border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    Juja HQ & Central Depot
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  Fleet Ready
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Operating directly from our headquarters at Sanne Square along JKUAT Main Gate, Juja, with express dispatch serving Nairobi, Kiambu, Thika Superhighway corridor, and nationwide routes.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">GPS Coordinates Verified</span>
                <button
                  onClick={() => navigateTo('/get-a-quote')}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Book Pickup Route
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80">
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Send a Direct Message
            </h3>
            <p className="text-xs text-slate-600 mb-6">
              Have a special inquiry or want an in-person site survey? Leave your message below.
            </p>

            {sent ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-emerald-200 shadow-sm animate-fade-in">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  Message Dispatched!
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Thank you for reaching out. We have logged your message into our communication desk and will reply via call or WhatsApp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Christine Wangari"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +254 712 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. christine@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Inquiry Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 text-xs bg-white"
                    >
                      <option value="Residential Move Inquiry">Residential Move Inquiry</option>
                      <option value="Corporate Office Relocation">Corporate Office Relocation</option>
                      <option value="Deep Cleaning Service">Deep Cleaning Service</option>
                      <option value="Long-Distance Move">Long-Distance Move</option>
                      <option value="Fumigation & Pest Control">Fumigation & Pest Control</option>
                      <option value="Other / Partnership">Other / Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your moving date, locations, or specific cleaning requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 text-xs bg-white"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Operations</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
