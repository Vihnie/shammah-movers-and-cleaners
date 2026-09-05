import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  Printer,
  CheckCircle2,
  DollarSign,
  X,
  CreditCard,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceItem } from '../../types';

export function AdminInvoices() {
  const { invoices, updateInvoice, addInvoice, addPayment, settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentRef, setPaymentRef] = useState('');

  const filteredInvoices = invoices.filter((inv) =>
    inv.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkPaid = (invoice: Invoice) => {
    updateInvoice(invoice.id, {
      status: 'PAID',
      paid_amount: invoice.total,
      balance_due: 0,
    });
    // Log payment record in payments table
    addPayment({
      invoice_id: invoice.id,
      customer_name: invoice.customer_name,
      amount: invoice.balance_due || invoice.total,
      method: 'MPESA',
      reference: `MP-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'COMPLETED',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Invoicing & Billings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official Kenyan invoice documentation with M-Pesa Paybill / Till settlement verification.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice number, client, status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Invoice #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Issued Date</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Total (Ksh)</th>
                <th className="p-4">Balance Due</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-black text-blue-900">
                    {inv.invoice_number}
                  </td>

                  <td className="p-4 font-extrabold text-slate-900">
                    {inv.customer_name}
                  </td>

                  <td className="p-4 text-slate-600">
                    {inv.issue_date}
                  </td>

                  <td className="p-4 text-slate-600">
                    {inv.due_date}
                  </td>

                  <td className="p-4 font-black text-slate-900">
                    Ksh. {inv.total.toLocaleString('en-KE')}
                  </td>

                  <td className="p-4 font-bold text-rose-700">
                    Ksh. {inv.balance_due.toLocaleString('en-KE')}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : inv.status === 'PARTIALLY_PAID'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                      title="View & Print Invoice"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {inv.status !== 'PAID' && (
                      <button
                        onClick={() => handleMarkPaid(inv)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px]"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs p-4 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 sm:p-10 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInvoice(null)}
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
                  {settings.email} • {settings.email2 || settings.support_email}
                </p>
                <p className="text-xs font-bold text-blue-900 mt-1">
                  M-Pesa Till Number: {settings.mpesa_till}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xl font-black text-blue-900 block">TAX INVOICE</span>
                <span className="text-xs font-bold text-slate-700">{selectedInvoice.invoice_number}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Issued: {selectedInvoice.issue_date}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Due: {selectedInvoice.due_date}
                </span>
              </div>
            </div>

            {/* Bill To */}
            <div className="py-4 text-xs">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Billed To:</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">{selectedInvoice.customer_name}</p>
              <p className="text-slate-600">Nairobi, Kenya</p>
            </div>

            {/* Itemized Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden my-4 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price (Ksh)</th>
                    <th className="p-3 text-right">Total (Ksh)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.items.map((item, idx) => (
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

            {/* Balance & Totals */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-1.5 pt-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">Ksh. {selectedInvoice.subtotal.toLocaleString('en-KE')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Paid to Date:</span>
                  <span className="font-semibold text-emerald-700">Ksh. {selectedInvoice.paid_amount.toLocaleString('en-KE')}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Balance Due:</span>
                  <span className="text-rose-700">Ksh. {selectedInvoice.balance_due.toLocaleString('en-KE')}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>

              {selectedInvoice.status !== 'PAID' && (
                <button
                  onClick={() => {
                    handleMarkPaid(selectedInvoice);
                    setSelectedInvoice(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Record Full M-Pesa Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
