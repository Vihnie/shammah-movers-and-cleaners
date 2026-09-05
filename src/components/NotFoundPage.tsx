import React from 'react';
import { Truck, Home, Calculator } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function NotFoundPage() {
  const { navigateTo } = useApp();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="text-center max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
        <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Truck className="w-8 h-8" />
        </div>
        <span className="text-4xl font-black text-blue-950 block">404</span>
        <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
          Looks like this move took a wrong turn.
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          The page you are looking for might have been relocated or doesn't exist.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigateTo('/')}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            <span>BACK HOME</span>
          </button>
          <button
            onClick={() => navigateTo('/get-a-quote')}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Calculator className="w-4 h-4 text-purple-700" />
            <span>GET A QUOTE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
