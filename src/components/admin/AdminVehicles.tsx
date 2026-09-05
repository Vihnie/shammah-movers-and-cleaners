import React, { useState } from 'react';
import { Truck, Plus, ShieldCheck, Wrench, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Vehicle } from '../../types';

export function AdminVehicles() {
  const { vehicles, addVehicle, updateVehicle } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [plateNumber, setPlateNumber] = useState('');
  const [model, setModel] = useState('');
  const [capacity, setCapacity] = useState('3 Ton Closed Box');
  const [mileage, setMileage] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [serviceDue, setServiceDue] = useState('');

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim() || !model.trim()) return;

    addVehicle({
      plate_number: plateNumber.toUpperCase(),
      model,
      capacity,
      mileage: mileage ? Number(mileage) : 45000,
      insurance_expiry: insuranceExpiry || '2026-12-31',
      service_due: serviceDue || '2026-06-30',
      status: 'AVAILABLE',
      active: true,
    });

    setIsAddModalOpen(false);
    setPlateNumber('');
    setModel('');
    setMileage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Vehicle Fleet & Trucks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track closed-box trucks, service maintenance intervals, and insurance compliance.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fleet Vehicle</span>
        </button>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                  <Truck className="w-6 h-6" />
                </div>
                <select
                  value={v.status}
                  onChange={(e) => updateVehicle(v.id, { status: e.target.value as Vehicle['status'] })}
                  className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${
                    v.status === 'AVAILABLE'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : v.status === 'ON_JOB'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="ON_JOB">ON JOB</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <span className="text-xl font-black text-slate-900 tracking-tight block">
                {v.plate_number}
              </span>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                {v.model}
              </p>
              <span className="inline-block mt-2 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Capacity: {v.capacity}
              </span>

              <div className="space-y-1.5 mt-5 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Odometer:</span>
                  <span className="font-semibold text-slate-800">{v.mileage.toLocaleString()} KM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Insurance Valid Until:</span>
                  <span className="font-semibold text-slate-800">{v.insurance_expiry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Next Scheduled Service:</span>
                  <span className="font-semibold text-slate-800">{v.service_due}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Transit Certified
              </span>
              <span className="text-slate-400">ID #{v.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
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
              Add New Fleet Vehicle
            </h3>

            <form onSubmit={handleCreateVehicle} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Registration Plate Number *</label>
                <input
                  type="text"
                  required
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs uppercase"
                  placeholder="e.g. KDH 123Z"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vehicle Make / Model *</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                    placeholder="e.g. Isuzu FRR Box"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacity</label>
                  <select
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white"
                  >
                    <option value="1.5 Ton Pickup">1.5 Ton Pickup</option>
                    <option value="3 Ton Closed Box">3 Ton Closed Box</option>
                    <option value="5 Ton Closed Box">5 Ton Closed Box</option>
                    <option value="7 Ton Closed Box">7 Ton Closed Box</option>
                    <option value="10 Ton Heavy Truck">10 Ton Heavy Truck</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Odometer (KM)</label>
                  <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                    placeholder="e.g. 52000"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Insurance Expiry</label>
                  <input
                    type="date"
                    value={insuranceExpiry}
                    onChange={(e) => setInsuranceExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Register Fleet Vehicle
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
