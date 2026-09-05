import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Phone,
  ShieldCheck,
  Users,
  Search,
  CheckCircle2,
  X,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Staff, Team } from '../../types';

export function AdminStaff() {
  const { staff, teams, addStaff, updateStaff, addTeam } = useApp();
  const [activeTab, setActiveTab] = useState<'staff' | 'teams'>('staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);

  // New Staff form
  const [name, setName] = useState('');
  const [role, setRole] = useState<Staff['role']>('MOVER');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');

  // New Team form
  const [teamName, setTeamName] = useState('');
  const [teamLeader, setTeamLeader] = useState('');

  const filteredStaff = staff.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.includes(searchQuery) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addStaff({
      name,
      role,
      phone,
      national_id: nationalId || 'ID-TBD',
      status: 'AVAILABLE',
      rating: 5.0,
      active: true,
    });

    setIsAddStaffOpen(false);
    setName('');
    setPhone('');
    setNationalId('');
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    addTeam({
      name: teamName,
      leader: teamLeader || 'Team Leader',
      members: [],
    });

    setIsAddTeamOpen(false);
    setTeamName('');
    setTeamLeader('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Staff & Crew Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage professional movers, qualified commercial drivers, team leaders, and cleaning specialists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddStaffOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
          <button
            onClick={() => setIsAddTeamOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Users className="w-4 h-4" />
            <span>Form Team</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('staff')}
          className={`pb-3 px-3 text-xs font-extrabold border-b-2 transition-all ${
            activeTab === 'staff'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Individual Personnel ({staff.length})
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`pb-3 px-3 text-xs font-extrabold border-b-2 transition-all ${
            activeTab === 'teams'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Organized Teams ({teams.length})
        </button>
      </div>

      {activeTab === 'staff' ? (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, role, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Staff Member</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">National ID</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-extrabold text-slate-900">
                        {s.name}
                      </td>

                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          {s.role}
                        </span>
                      </td>

                      <td className="p-4 text-slate-700">
                        <a href={`tel:${s.phone}`} className="hover:text-blue-900 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {s.phone}
                        </a>
                      </td>

                      <td className="p-4 text-slate-500">
                        {s.national_id}
                      </td>

                      <td className="p-4">
                        <select
                          value={s.status}
                          onChange={(e) => updateStaff(s.id, { status: e.target.value as Staff['status'] })}
                          className={`text-[11px] font-extrabold px-2 py-0.5 rounded border ${
                            s.status === 'AVAILABLE'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : s.status === 'ON_JOB'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="ON_JOB">ON JOB</option>
                          <option value="OFF_DUTY">OFF DUTY</option>
                        </select>
                      </td>

                      <td className="p-4 font-bold text-amber-600">
                        ★ {s.rating.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Field Unit
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                  {team.name}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Team Leader: <strong className="text-slate-800">{team.leader}</strong>
                </p>

                <div className="space-y-1 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Members:</span>
                  {team.members.map((m, mIdx) => (
                    <div key={mIdx} className="text-xs text-slate-700 flex items-center gap-1.5 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Standard Crew Capacity</span>
                <span className="text-emerald-700 font-bold">Ready</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs p-4 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsAddStaffOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-4">
              Register Staff Member
            </h3>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                  placeholder="e.g. Kelvin Mwangi"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Staff['role'])}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white"
                  >
                    <option value="DRIVER">DRIVER</option>
                    <option value="MOVER">MOVER</option>
                    <option value="TEAM_LEADER">TEAM LEADER</option>
                    <option value="CLEANER">CLEANER</option>
                    <option value="SUPERVISOR">SUPERVISOR</option>
                  </select>
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">National ID / Passport #</label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                  placeholder="e.g. 29481920"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Register Personnel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Team Modal */}
      {isAddTeamOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs p-4 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsAddTeamOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-4">
              Form New Operational Team
            </h3>

            <form onSubmit={handleCreateTeam} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Team Name *</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                  placeholder="e.g. Team Gamma (Westlands)"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Team Leader</label>
                <input
                  type="text"
                  value={teamLeader}
                  onChange={(e) => setTeamLeader(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                  placeholder="Leader name"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Create Team
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
