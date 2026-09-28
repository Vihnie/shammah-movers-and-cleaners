import React, { useState } from 'react';
import { Lock, ShieldCheck, Truck, ArrowRight, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setCurrentView } = useApp();
  const [pin, setPin] = useState<string>('1234');
  const [email, setEmail] = useState<string>('omugavinich@gmail.com');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const success = await loginAdmin(pin || email);
    setIsSubmitting(false);
    if (!success) {
      setError('Invalid PIN or admin email. (Default PIN: 1234)');
    }
  };

  const handleQuickAdmin = async () => {
    setIsSubmitting(true);
    await loginAdmin('omugavinich@gmail.com');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Dispatcher &amp; Admin Portal
          </h2>
          <p className="text-xs text-slate-400">
            Access fleet schedules, active customer bookings &amp; Cloud SQL records.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        {/* Quick Admin Auth Button for Registered Account */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Authorized Account:</span>
            <span className="font-bold text-amber-400">omugavinich@gmail.com</span>
          </div>
          <button
            type="button"
            onClick={handleQuickAdmin}
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4" />
            <span>Login as Vinich (Admin)</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-700 w-full" />
          <span className="bg-slate-800 px-3 text-[11px] text-slate-500 uppercase font-medium">Or enter PIN</span>
          <div className="border-t border-slate-700 w-full" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Dispatcher Access PIN
            </label>
            <input
              type="password"
              placeholder="e.g. 1234"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white text-center tracking-widest focus:outline-none focus:border-amber-400"
            />
            <span className="text-[10px] text-slate-500 block text-center mt-1">Hint: Default dispatcher PIN is 1234</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => setCurrentView('home')}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
