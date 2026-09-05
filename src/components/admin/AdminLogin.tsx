import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Home, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AdminLogin() {
  const { loginAdmin, navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = loginAdmin(email, password);
      if (success) {
        navigateTo('/admin/dashboard');
      } else {
        setError('Invalid email/password');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-purple-800 text-white flex items-center justify-center font-black text-xl mx-auto shadow-lg mb-4">
            SM
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Staff & Operations Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Shammah Movers & Cleaners Business Management System
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-blue-900" />
              Admin Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-xs bg-slate-50 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-purple-700" />
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-xs bg-slate-50 text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="mt-6 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-blue-900" />
              Quick Fill Credentials
            </span>
            <button
              type="button"
              onClick={() => {
                setEmail('it.shammah@gmail.com');
                setPassword('admin@shammah');
              }}
              className="text-[10px] font-extrabold text-blue-900 hover:text-blue-700 underline cursor-pointer"
            >
              Autofill Login
            </button>
          </div>
          <div className="space-y-1 text-[11px] font-mono text-slate-600 bg-white p-2 rounded-xl border border-slate-200/80">
            <div><span className="text-slate-400 font-sans font-medium">Email:</span> it.shammah@gmail.com</div>
            <div><span className="text-slate-400 font-sans font-medium">Pass:</span> admin@shammah</div>
          </div>
        </div>

        {/* Back to Website */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center">
          <button
            onClick={() => navigateTo('/')}
            className="flex items-center gap-1.5 text-slate-600 hover:text-blue-900 text-xs font-semibold"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
}
