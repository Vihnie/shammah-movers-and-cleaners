import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Home, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { signInWithGoogle } from '../../lib/firebase';

export function AdminLogin() {
  const { loginAdmin, loginWithGoogleUser, navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = loginAdmin(email, password);
      if (success) {
        navigateTo('/admin/dashboard');
      } else {
        setError('Invalid email or password. Please verify credentials or use Google Sign-In.');
      }
      setLoading(false);
    }, 400);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result) {
        loginWithGoogleUser(
          result.user.displayName || 'Authorized Admin',
          result.user.email || 'admin@shammahmovers.com',
          'Operations Administrator'
        );

        // Sync with Cloud SQL
        try {
          await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${result.idToken}`,
            },
            body: JSON.stringify({ displayName: result.user.displayName || result.user.email }),
          });
        } catch (e) {
          console.warn('User sync warning:', e);
        }

        navigateTo('/admin/dashboard');
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setError(err.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200">
        {/* Logo & Header */}
        <div className="text-center mb-6">
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
          <div className="mb-5 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Official Google Sign-In Option */}
        <div className="space-y-4 mb-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            <span>{googleLoading ? 'Connecting with Google...' : 'Sign in with Google'}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Or with Password
            </span>
          </div>
        </div>

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
