import React, { useState } from 'react';
import {
  Send,
  MapPin,
  Calendar,
  Clock,
  Home,
  CheckSquare,
  Square,
  Upload,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function DetailedQuotePage() {
  const { addLead, addQuote, trackClick, settings, navigateTo } = useApp();

  // Customer Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Move Info
  const [movingFrom, setMovingFrom] = useState('');
  const [movingTo, setMovingTo] = useState('');
  const [moveDate, setMoveDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('08:00 AM (Morning)');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [houseSize, setHouseSize] = useState('2 Bedroom');
  const [floorNumber, setFloorNumber] = useState('Ground Floor');
  const [hasLift, setHasLift] = useState(false);
  const [parkingAvailable, setParkingAvailable] = useState(true);

  // Services Checkboxes
  const [services, setServices] = useState<{ [key: string]: boolean }>({
    moving: true,
    packing: false,
    unpacking: false,
    cleaning: false,
    fumigation: false,
    furnitureAssembly: false,
    decluttering: false,
  });

  // Additional Information
  const [estimatedVolume, setEstimatedVolume] = useState('Standard household furniture');
  const [fragileItems, setFragileItems] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleService = (key: string) => {
    setServices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((f: File) => f.name);
      setUploadedFiles((prev) => [...prev, ...names]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !movingFrom.trim()) {
      setErrorMsg('Please enter your full name, phone number, and pickup address.');
      return;
    }

    const selectedServiceNames = Object.entries(services)
      .filter(([_, val]) => val)
      .map(([k]) => {
        switch (k) {
          case 'moving': return 'Moving';
          case 'packing': return 'Packing';
          case 'unpacking': return 'Unpacking';
          case 'cleaning': return 'Cleaning';
          case 'fumigation': return 'Fumigation';
          case 'furnitureAssembly': return 'Furniture Assembly';
          case 'decluttering': return 'Decluttering';
          default: return k;
        }
      })
      .join(' + ');

    const newLead = addLead({
      customer_name: fullName,
      phone,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '')}@lead.ke`,
      service_type: selectedServiceNames || 'Moving',
      moving_from: movingFrom,
      moving_to: movingTo || 'Local Move',
      move_date: moveDate || new Date().toISOString().split('T')[0],
      preferred_time: preferredTime,
      property_type: propertyType,
      house_size: houseSize,
      floor: floorNumber,
      has_lift: hasLift,
      parking_available: parkingAvailable,
      packing_required: services.packing,
      unpacking_required: services.unpacking,
      cleaning_required: services.cleaning,
      fumigation_required: services.fumigation,
      furniture_assembly: services.furnitureAssembly,
      decluttering: services.decluttering,
      estimated_volume: estimatedVolume,
      message: `Fragile: ${fragileItems || 'None'}. Special instructions: ${specialRequirements || 'None'}`,
      attachments: uploadedFiles,
      status: 'NEW',
      notes: 'Detailed quote submitted via web application form.',
    });

    // Generate formal Quote in backend
    const basePrice = houseSize.includes('Bedsitter')
      ? 12000
      : houseSize.includes('1 Bedroom')
      ? 18000
      : houseSize.includes('2 Bedroom')
      ? 26000
      : houseSize.includes('3 Bedroom')
      ? 38000
      : 52000;

    const extraServiceCost =
      (services.packing ? 4000 : 0) +
      (services.unpacking ? 2500 : 0) +
      (services.cleaning ? 6500 : 0) +
      (services.fumigation ? 4500 : 0) +
      (services.furnitureAssembly ? 3000 : 0);

    const quoteTotal = basePrice + extraServiceCost;

    addQuote({
      lead_id: newLead.id,
      customer_name: fullName,
      customer_phone: phone,
      customer_email: email || `${fullName.toLowerCase().replace(/\s+/g, '')}@lead.ke`,
      service_type: selectedServiceNames || 'Comprehensive Relocation',
      moving_from: movingFrom,
      moving_to: movingTo || 'Local Move',
      items: [
        {
          description: `Relocation: ${propertyType} (${houseSize}) - ${movingFrom} → ${movingTo || 'Local Move'}`,
          amount: basePrice,
        },
        ...(services.packing ? [{ description: 'Professional Packing & Protective Wrapping', amount: 4000 }] : []),
        ...(services.cleaning ? [{ description: 'Deep Move-in/Move-out Cleaning & Sanitization', amount: 6500 }] : []),
        ...(services.fumigation ? [{ description: 'Pest Control & Residual Fumigation', amount: 4500 }] : []),
        ...(services.furnitureAssembly ? [{ description: 'Furniture Disassembly & Precise Reassembly', amount: 3000 }] : []),
      ],
      total_amount: quoteTotal,
      status: 'SENT',
      valid_until: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      notes: `Submitted via Detailed Quote Form. Floor: ${floorNumber || 'Ground'}. Lift: ${hasLift ? 'Yes' : 'No'}. Fragile items: ${fragileItems || 'None'}. Special: ${specialRequirements || 'None'}.`,
    });

    trackClick('Detailed Quote Submitted', 'quote', '/quote');
    setSubmitted(true);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumb */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Comprehensive Quotation
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Request an Itemized Quote
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Tell us about your inventory, floor levels, and desired services. Our team prepares an exact, transparent quote in Ksh with zero surprises.
          </p>
        </div>

        {!submitted ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Customer Information */}
              <div>
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Customer Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Christine Wangari"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 text-xs bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +254 712 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 text-xs bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. christine@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 text-xs bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Move Information */}
              <div>
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Move & Property Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-900" />
                      Moving From (Pickup Location) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Juja, Sanne Square or Kilimani, Nairobi"
                      value={movingFrom}
                      onChange={(e) => setMovingFrom(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 text-xs bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-700" />
                      Moving To (Destination Location) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karen, Mbagathi Ridge, Nairobi"
                      value={movingTo}
                      onChange={(e) => setMovingTo(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 text-xs bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={moveDate}
                      onChange={(e) => setMoveDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Time Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
                    >
                      <option value="07:00 AM (Early Morning)">07:00 AM (Early Morning)</option>
                      <option value="08:00 AM (Morning)">08:00 AM (Morning)</option>
                      <option value="11:00 AM (Mid-day)">11:00 AM (Mid-day)</option>
                      <option value="02:00 PM (Afternoon)">02:00 PM (Afternoon)</option>
                      <option value="Flexible / Any Time">Flexible / Any Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Property Type
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="House / Villa">House / Villa</option>
                      <option value="Townhouse / Maisonette">Townhouse / Maisonette</option>
                      <option value="Commercial Office">Commercial Office</option>
                      <option value="Storage Unit">Storage Unit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      House / Office Size
                    </label>
                    <select
                      value={houseSize}
                      onChange={(e) => setHouseSize(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
                    >
                      <option value="Bedsitter / Studio">Bedsitter / Studio</option>
                      <option value="1 Bedroom">1 Bedroom</option>
                      <option value="2 Bedroom">2 Bedroom</option>
                      <option value="3 Bedroom">3 Bedroom</option>
                      <option value="4+ Bedroom Villa">4+ Bedroom Villa</option>
                      <option value="Commercial Space">Commercial Space</option>
                    </select>
                  </div>
                </div>

                {/* Floors, Elevator, Parking */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Floor Level (Pickup / Dropoff)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3rd Floor pickup, Ground dropoff"
                      value={floorNumber}
                      onChange={(e) => setFloorNumber(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={hasLift}
                        onChange={(e) => setHasLift(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-900"
                      />
                      <span>Lift / Elevator Available?</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={parkingAvailable}
                        onChange={(e) => setParkingAvailable(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-900"
                      />
                      <span>Truck Parking Close to Entrance?</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 3: Services Requested */}
              <div>
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Services Required (Select all that apply)
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: 'moving', label: 'Moving & Transport' },
                    { key: 'packing', label: 'Professional Packing' },
                    { key: 'unpacking', label: 'Unpacking & Staging' },
                    { key: 'cleaning', label: 'Move-In/Out Deep Clean' },
                    { key: 'fumigation', label: 'Fumigation & Pest Eradication' },
                    { key: 'furnitureAssembly', label: 'Furniture Assembly' },
                    { key: 'decluttering', label: 'Decluttering & Disposal' },
                  ].map((srv) => {
                    const active = services[srv.key];
                    return (
                      <button
                        type="button"
                        key={srv.key}
                        onClick={() => toggleService(srv.key)}
                        className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                          active
                            ? 'border-blue-900 bg-blue-50 text-blue-950 font-bold ring-1 ring-blue-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {active ? (
                          <CheckSquare className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <span className="text-xs">{srv.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Additional Information & Photo Attachment */}
              <div>
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Inventory Specifics & Photos
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Fragile or High-Value Items (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 65-inch Curved OLED TV, Upright Piano, Antique Glass Hutch"
                      value={fragileItems}
                      onChange={(e) => setFragileItems(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Special Requirements or Instructions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Any gate access codes, estate security clearances, or narrow stairways?"
                      value={specialRequirements}
                      onChange={(e) => setSpecialRequirements(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50"
                    ></textarea>
                  </div>

                  {/* Photo Upload Simulator */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Optional: Upload Photos of Your Rooms or Bulky Furniture
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-blue-900 transition-colors bg-slate-50 relative">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleSimulatedUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <span className="text-xs font-bold text-blue-900">
                        Click or drag images here
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        PNG, JPG, or WebP up to 10MB each
                      </p>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {uploadedFiles.map((file, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-blue-100 text-blue-900 px-2 py-1 rounded-md font-semibold"
                          >
                            ✓ {file}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your personal contact data is strictly confidential and protected.</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-800 hover:from-blue-800 hover:to-purple-700 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-blue-950/20 flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>REQUEST MY QUOTE</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center animate-fade-in">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900">
              Request Received!
            </h2>
            <p className="max-w-xl mx-auto text-slate-600 text-sm mt-3 leading-relaxed">
              Thank you for choosing Shammah Movers & Cleaners. We have received your detailed specifications and our team will review the inventory and reach out to <span className="font-bold text-slate-900">{phone}</span> shortly with an itemized quote.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`https://wa.me/${settings.whatsapp}?text=Hello%20Shammah%20Movers%2C%20I%20just%20submitted%20a%20detailed%20quote%20request%20for%20a%20move%20from%20${encodeURIComponent(movingFrom)}%20to%20${encodeURIComponent(movingTo)}.%20My%20name%20is%20${encodeURIComponent(fullName)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WHATSAPP US FOR PRIORITY DISPATCH</span>
              </a>

              <button
                onClick={() => navigateTo('/')}
                className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm transition-colors"
              >
                RETURN HOME
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
