import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Send,
  Printer,
  CheckCircle2,
  CalendarCheck,
  Search,
  MessageCircle,
  X,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Quote, QuoteItem } from '../../types';

export function AdminQuotes() {
  const { quotes, addQuote, updateQuote, convertQuoteToBooking, leads, settings, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Quote Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [movingFrom, setMovingFrom] = useState('');
  const [movingTo, setMovingTo] = useState('');
  const [moveDate, setMoveDate] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  const [items, setItems] = useState<QuoteItem[]>([
    { description: 'Residential Relocation (Closed Box Truck + 3 Movers)', quantity: 1, unit_price: 18000, total: 18000 },
    { description: 'Professional Packing Material & Blanket Wrapping', quantity: 1, unit_price: 4000, total: 4000 },
  ]);

  const filteredQuotes = quotes.filter((q) => {
    const name = (q.customer_name || '').toLowerCase();
    const num = (q.quote_number || '').toLowerCase();
    const phone = (q.customer_phone || (q as any).phone || '').toLowerCase();
    const search = searchQuery.toLowerCase();
    return name.includes(search) || num.includes(search) || phone.includes(search);
  });

  const addItemRow = () => {
    setItems([...items, { description: 'New Service Item', quantity: 1, unit_price: 2500, total: 2500 }]);
  };

  const updateItemRow = (index: number, field: keyof QuoteItem, val: any) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: val };
    if (field === 'quantity' || field === 'unit_price') {
      current.total = Number(current.quantity) * Number(current.unit_price);
    }
    updated[index] = current;
    setItems(updated);
  };

  const removeItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const total = Math.max(0, subtotal - discount);

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) return;

    addQuote({
      customer_name: customerName,
      phone,
      email: email || `${customerName.toLowerCase().replace(/\s+/g, '')}@quote.ke`,
      moving_from: movingFrom || 'Nairobi',
      moving_to: movingTo || 'Nairobi',
      move_date: moveDate || new Date().toISOString().split('T')[0],
      items,
      subtotal,
      discount,
      total,
      status: 'SENT',
      valid_until: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Terms: 50% deposit upon booking confirmation, balance upon final offloading.',
    });

    setIsCreateModalOpen(false);
    setCustomerName('');
    setPhone('');
    setItems([
      { description: 'Residential Relocation (Closed Box Truck + 3 Movers)', quantity: 1, unit_price: 18000, total: 18000 },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header & Create Quote Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quotation Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate itemized estimates in Kenyan Shillings with instant WhatsApp delivery & booking conversion.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Quote</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quote number, client name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Quote #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Route & Date</th>
                <th className="p-4">Total (Ksh)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotes.map((quote) => {
                const phone = quote.customer_phone || (quote as any).phone || '';
                const total = quote.total_amount ?? (quote as any).total ?? 0;
                return (
                  <tr key={quote.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-black text-blue-900">
                      {quote.quote_number}
                    </td>

                    <td className="p-4 font-semibold text-slate-900">
                      <div>{quote.customer_name}</div>
                      <span className="text-[11px] text-slate-500 font-normal">{phone}</span>
                    </td>

                    <td className="p-4 text-slate-600">
                      <div>{quote.moving_from} → {quote.moving_to}</div>
                      <span className="text-[11px] text-slate-400">{quote.move_date}</span>
                    </td>

                    <td className="p-4 font-extrabold text-slate-900">
                      Ksh. {total.toLocaleString('en-KE')}
                    </td>

                    <td className="p-4">
                      <select
                        value={quote.status}
                        onChange={(e) => updateQuote(quote.id, { status: e.target.value as Quote['status'] })}
                        className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border focus:outline-none ${
                          quote.status === 'ACCEPTED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : quote.status === 'SENT'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : quote.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="SENT">SENT</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="EXPIRED">EXPIRED</option>
                      </select>
                    </td>

                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedQuote(quote)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        title="View & Print Quote"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <a
                        href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(quote.customer_name)}%2C%20here%20is%20your%20official%20quotation%20from%20Shammah%20Movers%3A%0A%0AQuote%20Ref%3A%20${quote.quote_number}%0ARoute%3A%20${encodeURIComponent(quote.moving_from)}%20to%20${encodeURIComponent(quote.moving_to)}%0ATarget%20Date%3A%20${quote.move_date}%0ATotal%20Amount%3A%20Ksh%20${total.toLocaleString('en-KE')}%0A%0APlease%20reply%20here%20to%20confirm%20your%20booking.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                        title="Send Quote via WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      {quote.status !== 'ACCEPTED' && (
                        <button
                          onClick={() => {
                            convertQuoteToBooking(quote.id);
                            navigateTo('/admin/bookings');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-[11px] cursor-pointer"
                        >
                          Convert to Booking
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable / Preview Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs p-4 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 sm:p-10 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedQuote(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Document Header */}
            <div className="flex items-start justify-between pb-6 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {settings.company_name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {settings.physical_address} • Tel: {settings.phone}{settings.phone2 ? ` / ${settings.phone2}` : ''}
                </p>
                <p className="text-xs text-slate-500">
                  {settings.email} • Support: {settings.email2 || settings.support_email || settings.email} • Till: {settings.mpesa_till}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xl font-black text-blue-900 block">QUOTATION</span>
                <span className="text-xs font-bold text-slate-700">{selectedQuote.quote_number}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Date: {selectedQuote.created_at.split('T')[0]}
                </span>
              </div>
            </div>

            {/* Customer & Route info */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px]">Prepared For:</span>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{selectedQuote.customer_name}</p>
                <p className="text-slate-600">{selectedQuote.phone}</p>
                <p className="text-slate-600">{selectedQuote.email}</p>
              </div>

              <div className="text-right">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Move Logistics:</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  From: <span className="font-normal">{selectedQuote.moving_from}</span>
                </p>
                <p className="font-bold text-slate-900">
                  To: <span className="font-normal">{selectedQuote.moving_to}</span>
                </p>
                <p className="text-slate-600">Target Date: {selectedQuote.move_date}</p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden my-4 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price (Ksh)</th>
                    <th className="p-3 text-right">Total (Ksh)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedQuote.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium text-slate-800">{item.description}</td>
                      <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                      <td className="p-3 text-right text-slate-600">{item.unit_price.toLocaleString('en-KE')}</td>
                      <td className="p-3 text-right font-bold text-slate-900">{item.total.toLocaleString('en-KE')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Calculation */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-1.5 pt-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">Ksh. {selectedQuote.subtotal.toLocaleString('en-KE')}</span>
                </div>
                {selectedQuote.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Loyalty Discount:</span>
                    <span>- Ksh. {selectedQuote.discount.toLocaleString('en-KE')}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount:</span>
                  <span className="text-blue-900">Ksh. {selectedQuote.total.toLocaleString('en-KE')}</span>
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
              <span className="font-bold text-slate-700 block mb-1">Terms & Validity:</span>
              <p>{selectedQuote.notes}</p>
              <p className="mt-1">Valid until: {selectedQuote.valid_until}. Prices inclusive of labor and transit handling.</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>

              <button
                onClick={() => {
                  convertQuoteToBooking(selectedQuote.id);
                  setSelectedQuote(null);
                  navigateTo('/admin/bookings');
                }}
                className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Confirm & Create Booking</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Quote Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs p-4 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-4">
              Create New Custom Quote
            </h3>

            <form onSubmit={handleCreateQuote} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                    placeholder="e.g. Dr. Peter Otieno"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                    placeholder="+254 7..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Moving From</label>
                  <input
                    type="text"
                    value={movingFrom}
                    onChange={(e) => setMovingFrom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                    placeholder="Origin"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Moving To</label>
                  <input
                    type="text"
                    value={movingTo}
                    onChange={(e) => setMovingTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                    placeholder="Destination"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Move Date</label>
                  <input
                    type="date"
                    value={moveDate}
                    onChange={(e) => setMoveDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">Quote Line Items:</span>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="text-blue-900 font-bold hover:underline"
                  >
                    + Add Line Item
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItemRow(idx, 'description', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border text-xs"
                        placeholder="Item Description"
                      />
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItemRow(idx, 'quantity', Number(e.target.value))}
                        className="w-14 px-2 py-1.5 rounded-lg border text-xs text-center"
                      />
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={item.unit_price}
                        onChange={(e) => updateItemRow(idx, 'unit_price', Number(e.target.value))}
                        className="w-24 px-2 py-1.5 rounded-lg border text-xs text-right"
                      />
                      <span className="w-20 font-bold text-slate-800 text-right">
                        Ksh. {item.total.toLocaleString('en-KE')}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount & Summary */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-700">Special Discount (Ksh):</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-24 px-2 py-1 rounded-lg border text-xs"
                  />
                </div>

                <div className="text-right">
                  <span className="text-slate-500 block text-[11px]">Total Calculated:</span>
                  <span className="text-lg font-black text-blue-900">
                    Ksh. {total.toLocaleString('en-KE')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Save & Issue Quotation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
