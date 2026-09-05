import React, { useState } from 'react';
import { MapPin, Calendar, Home, Layers, CheckCircle2, ArrowRight, Phone, MessageCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function QuickQuoteSection() {
  const { addLead, addQuote, trackClick, settings } = useApp();
  const [movingFrom, setMovingFrom] = useState('');
  const [movingTo, setMovingTo] = useState('');
  const [moveDate, setMoveDate] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [houseSize, setHouseSize] = useState('2 Bedroom');
  const [serviceRequired, setServiceRequired] = useState('Moving');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movingFrom.trim() || !customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please enter your name, phone number, and pickup location.');
      return;
    }

    setErrorMsg('');
    const emailToUse = customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '')}@shammah-lead.ke`;

    // 1. Register Lead
    const newLead = addLead({
      customer_name: customerName,
      phone: customerPhone,
      email: emailToUse,
      service_type: serviceRequired,
      moving_from: movingFrom,
      moving_to: movingTo || 'Local Move',
      move_date: moveDate || new Date().toISOString().split('T')[0],
      property_type: propertyType,
      house_size: houseSize,
      status: 'NEW',
      notes: `Quick quote submitted from homepage. Property: ${propertyType} (${houseSize})`,
    });

    // 2. Generate and store Quote in backend
    const estimatedAmount = houseSize.includes('Bedsitter')
      ? 9500
      : houseSize.includes('1 Bedroom')
      ? 14500
      : houseSize.includes('2 Bedroom')
      ? 22500
      : houseSize.includes('3 Bedroom')
      ? 34500
      : 48000;

    addQuote({
      lead_id: newLead.id,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: emailToUse,
      service_type: serviceRequired,
      moving_from: movingFrom,
      moving_to: movingTo || 'Local Move',
      items: [
        {
          description: `${serviceRequired.toUpperCase()} - ${propertyType} (${houseSize}) from ${movingFrom} to ${movingTo || 'Local Move'}`,
          amount: estimatedAmount,
        },
      ],
      total_amount: estimatedAmount,
      status: 'SENT',
      valid_until: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      notes: `Submitted via Homepage Quick Quote. Planned move date: ${moveDate || 'Flexible'}.`,
    });

    trackClick('Quick Quote Form Submitted', 'quote', '/');
    setSubmitted(true);
  };

  return (
    <section id="quick-quote" className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/10 border border-slate-200/80 p-6 sm:p-8 lg:p-10 transition-all">
        {!submitted ? (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Instant Response
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Planning a Move? <span className="text-blue-900">Get Your Free Quote</span>
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Fill in your details below for a transparent, no-obligation moving or cleaning estimate.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-900" />
                  <span>Call Us Now</span>
                </a>
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=Hello%20Shammah%20Movers%2C%20I%20would%20like%20a%20quote`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Moving From */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-900" />
                    Moving From (Origin)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Westlands, Nairobi"
                    value={movingFrom}
                    onChange={(e) => setMovingFrom(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-sm bg-slate-50 text-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Moving To */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-700" />
                    Moving To (Destination)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ruiru or Karen"
                    value={movingTo}
                    onChange={(e) => setMovingTo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-sm bg-slate-50 text-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Move Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-900" />
                    Moving Date
                  </label>
                  <input
                    type="date"
                    value={moveDate}
                    onChange={(e) => setMoveDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-sm bg-slate-50 text-slate-900 transition-all"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-blue-900" />
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-sm bg-slate-50 text-slate-900 transition-all"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House / Villa">House / Villa</option>
                    <option value="Office / Commercial">Office / Commercial</option>
                    <option value="Townhouse / Maisonette">Townhouse / Maisonette</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* House Size */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-blue-900" />
                    House / Office Size
                  </label>
                  <select
                    value={houseSize}
                    onChange={(e) => setHouseSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-sm bg-slate-50 text-slate-900 transition-all"
                  >
                    <option value="Bedsitter / Studio">Bedsitter / Studio</option>
                    <option value="1 Bedroom">1 Bedroom</option>
                    <option value="2 Bedroom">2 Bedroom</option>
                    <option value="3 Bedroom">3 Bedroom</option>
                    <option value="4+ Bedroom Villa">4+ Bedroom Villa</option>
                    <option value="Commercial Space">Commercial Space</option>
                  </select>
                </div>

                {/* Service Required */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                    Service Required
                  </label>
                  <select
                    value={serviceRequired}
                    onChange={(e) => setServiceRequired(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-sm bg-slate-50 text-slate-900 transition-all font-medium"
                  >
                    <option value="Moving">Moving Only</option>
                    <option value="Cleaning">Deep Cleaning Only</option>
                    <option value="Move + Clean Combo">Move + Deep Clean Combo (Save 15%)</option>
                    <option value="Packing">Full Packing & Supplies</option>
                    <option value="Sofa & Carpet Cleaning">Sofa & Carpet Steam Wash</option>
                    <option value="Fumigation">Fumigation & Pest Eradication</option>
                  </select>
                </div>
              </div>

              {/* Contact Information row */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Kimani"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-sm bg-slate-50 text-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +254 712 345 678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-sm bg-slate-50 text-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. samuel@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-sm bg-slate-50 text-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No spam. Instant quote sent straight to your phone & saved in our dispatch queue.</span>
                </p>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-800 hover:from-blue-800 hover:to-purple-700 text-white font-extrabold text-sm shadow-lg shadow-blue-950/20 flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <span>GET MY QUOTE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 px-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Request Received!
            </h3>
            <p className="max-w-xl mx-auto text-slate-600 text-sm mt-2 leading-relaxed">
              Thank you for choosing Shammah Movers & Cleaners. We have registered your inquiry in our dispatch queue. A representative will contact you shortly with an itemized quote.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://wa.me/${settings.whatsapp}?text=Hello%20Shammah%20Movers%2C%20I%20just%20submitted%20a%20quote%20request%20for%20a%20${encodeURIComponent(propertyType)}%20move%20from%20${encodeURIComponent(movingFrom)}%20to%20${encodeURIComponent(movingTo || 'Local')}.%20My%20name%20is%20${encodeURIComponent(customerName)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>CHAT ON WHATSAPP DIRECTLY</span>
              </a>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setMovingFrom('');
                  setMovingTo('');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
