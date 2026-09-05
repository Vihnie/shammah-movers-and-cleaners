import React, { useState } from 'react';
import { CreditCard, Plus, Search, DollarSign, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Payment } from '../../types';

export function AdminPayments() {
  const { payments, addPayment } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState<number>(15000);
  const [method, setMethod] = useState<Payment['method']>('MPESA');
  const [reference, setReference] = useState('');

  const totalCollectedKsh = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const filteredPayments = payments.filter((p) =>
    p.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !amount) return;

    addPayment({
      customer_name: customerName,
      amount: Number(amount),
      method,
      reference: reference || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'COMPLETED',
    });

    setIsAddModalOpen(false);
    setCustomerName('');
    setReference('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Metric */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Payments & M-Pesa Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time reconciliation of deposits, balances, and completed bank transfers.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Record Received Payment</span>
        </button>
      </div>

      {/* KPI Card */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
            Total Revenue Collected
          </span>
          <div className="text-3xl font-black mt-1">
            Ksh. {totalCollectedKsh.toLocaleString('en-KE')}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Verified across {payments.length} customer transactions
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference code, client name, method..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Payment ID / Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Method</th>
                <th className="p-4">Amount (Ksh)</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-black text-slate-900">
                    <div>{p.reference}</div>
                    <span className="text-[10px] text-slate-400 font-normal">ID #{p.id}</span>
                  </td>

                  <td className="p-4 font-extrabold text-slate-900">
                    {p.customer_name}
                  </td>

                  <td className="p-4 text-slate-600">
                    {p.date}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.method === 'MPESA'
                          ? 'bg-emerald-100 text-emerald-900'
                          : p.method === 'BANK_TRANSFER'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {p.method}
                    </span>
                  </td>

                  <td className="p-4 font-black text-emerald-700">
                    Ksh. {p.amount.toLocaleString('en-KE')}
                  </td>

                  <td className="p-4">
                    <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs p-4 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-4">
              Record Customer Payment
            </h3>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                  placeholder="e.g. Lucy Wanjiku"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount (Ksh) *</label>
                  <input
                    type="number"
                    required
                    step="500"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as Payment['method'])}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white"
                  >
                    <option value="MPESA">M-Pesa Paybill / Till</option>
                    <option value="BANK_TRANSFER">Bank Transfer (EFT/RTGS)</option>
                    <option value="CASH">Cash on Site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  M-Pesa Code / Bank Reference
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs uppercase font-mono"
                  placeholder="e.g. QKH718290X"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Save Payment Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
