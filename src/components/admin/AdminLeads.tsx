import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  MessageCircle,
  Phone,
  Calendar,
  MapPin,
  Home,
  CheckCircle2,
  X,
  ArrowRight,
  Eye,
  FileText,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Lead } from '../../types';

export function AdminLeads() {
  const { leads, updateLead, addLead, staff, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Lead Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newService, setNewService] = useState('Moving');
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newProperty, setNewProperty] = useState('Apartment');
  const [newHouseSize, setNewHouseSize] = useState('2 Bedroom');

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    const matchesSearch =
      lead.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.moving_from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.service_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    updateLead(leadId, { status: newStatus });
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim() || !newFrom.trim()) return;

    addLead({
      customer_name: newName,
      phone: newPhone,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '')}@lead.ke`,
      service_type: newService,
      moving_from: newFrom,
      moving_to: newTo,
      move_date: newDate || new Date().toISOString().split('T')[0],
      property_type: newProperty,
      house_size: newHouseSize,
      status: 'NEW',
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewFrom('');
    setNewTo('');
  };

  return (
    <div className="space-y-6">
      {/* Header & New Lead Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Leads & Inquiries CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Capture, qualify, assign and convert incoming move inquiries into active bookings.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Manual Add Lead</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, phone, route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['ALL', 'NEW', 'CONTACTED', 'QUOTED', 'CONFIRMED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Customer</th>
                <th className="p-4">Service & Property</th>
                <th className="p-4">Route & Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned Crew</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-semibold text-slate-900">
                    <div>{lead.customer_name}</div>
                    <span className="text-[11px] text-slate-500 font-normal">{lead.phone}</span>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-slate-800">{lead.service_type}</div>
                    <span className="text-[11px] text-slate-500">
                      {lead.property_type} ({lead.house_size})
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="text-slate-800 font-medium">
                      {lead.moving_from} → {lead.moving_to || 'Local'}
                    </div>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-blue-900" />
                      {lead.move_date || 'TBD'}
                    </span>
                  </td>

                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border focus:outline-none ${
                        lead.status === 'NEW'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : lead.status === 'CONTACTED'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : lead.status === 'QUOTED'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : lead.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="QUOTED">QUOTED</option>
                      <option value="NEGOTIATING">NEGOTIATING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>

                  <td className="p-4">
                    <select
                      value={lead.assigned_to || ''}
                      onChange={(e) => updateLead(lead.id, { assigned_to: e.target.value })}
                      className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
                    >
                      <option value="">Unassigned</option>
                      {staff.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.role})
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-4 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                      title="View Full Lead Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.customer_name)}%2C%20this%20is%20Shammah%20Movers%20following%20up%20on%20your%20quote%20request%20for%20a%20move%20from%20${encodeURIComponent(lead.moving_from)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                      title="WhatsApp Follow-up"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>

                    <a
                      href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900"
                      title="Direct Phone Call"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs p-4 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-1 rounded-full">
                Lead ID #{selectedLead.id.slice(-6)}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Created: {selectedLead.created_at.split('T')[0]}
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              {selectedLead.customer_name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1 mb-6 pb-4 border-b border-slate-100">
              <span className="font-semibold text-slate-900">Phone: {selectedLead.phone}</span>
              <span>Email: {selectedLead.email}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 text-xs bg-slate-50 p-4 rounded-2xl">
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Service</span>
                <span className="font-extrabold text-slate-900">{selectedLead.service_type}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Move Date</span>
                <span className="font-extrabold text-slate-900">{selectedLead.move_date || 'TBD'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Property Type</span>
                <span className="font-extrabold text-slate-900">{selectedLead.property_type}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">House Size</span>
                <span className="font-extrabold text-slate-900">{selectedLead.house_size}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Floor / Lift</span>
                <span className="font-extrabold text-slate-900">
                  {selectedLead.floor || 'Ground'} {selectedLead.has_lift ? '(Lift Yes)' : '(No Lift)'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Parking</span>
                <span className="font-extrabold text-slate-900">
                  {selectedLead.parking_available ? 'Available' : 'Restricted'}
                </span>
              </div>
            </div>

            {/* Notes & Extra Requirements */}
            <div className="mb-6 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Message / Special Requirements:
                </label>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                  {selectedLead.message || 'No additional message provided.'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Operations Notes:
                </label>
                <textarea
                  rows={2}
                  value={selectedLead.notes || ''}
                  onChange={(e) => {
                    const updated = { ...selectedLead, notes: e.target.value };
                    setSelectedLead(updated);
                    updateLead(selectedLead.id, { notes: e.target.value });
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  placeholder="Add internal notes for driver, packing crew, or gate security..."
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedLead.customer_name)}%2C%20this%20is%20Shammah%20Movers.%20We%20received%20your%20quote%20request%20for%20${encodeURIComponent(selectedLead.service_type)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>

                <button
                  onClick={() => {
                    updateLead(selectedLead.id, { status: 'CONFIRMED' });
                    setSelectedLead(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Confirmed</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setSelectedLead(null);
                  navigateTo('/admin/quotes');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-purple-700" />
                <span>Create Official Quote</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs p-4 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-4">
              Add New Inbound Lead
            </h3>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                    placeholder="e.g. John Kamau"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                    placeholder="+254 7..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Moving From *</label>
                  <input
                    type="text"
                    required
                    value={newFrom}
                    onChange={(e) => setNewFrom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                    placeholder="Origin location"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Moving To</label>
                  <input
                    type="text"
                    value={newTo}
                    onChange={(e) => setNewTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                    placeholder="Destination"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service</label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white"
                  >
                    <option value="Moving">Residential Moving</option>
                    <option value="Cleaning">Deep Cleaning</option>
                    <option value="Commercial Moving">Commercial Move</option>
                    <option value="Move + Clean Combo">Move + Clean Combo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Save Inbound Lead to Pipeline
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
