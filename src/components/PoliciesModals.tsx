import React from 'react';
import { ShieldCheck, ArrowLeft, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function PrivacyPolicyPage() {
  const { navigateTo, settings } = useApp();

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-6 h-6 text-blue-900" />
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Legal & Transparency
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
            <p>
              At <strong>{settings.company_name}</strong>, we respect your personal privacy. This Privacy Policy details how we collect, store, and utilize information provided when requesting moving or cleaning estimates, booking services, or communicating with our dispatch team.
            </p>

            <h3 className="text-lg font-bold text-slate-900">1. Information We Collect</h3>
            <p>
              We collect your full name, phone number, email address, physical pickup/dropoff locations, and inventory specifications solely to prepare accurate quotations, dispatch moving crews, and execute requested cleaning services.
            </p>

            <h3 className="text-lg font-bold text-slate-900">2. Usage of Your Data</h3>
            <p>
              Your contact details are used exclusively for service-related communications (quotes, arrival updates, receipts, and invoices). We do NOT sell, lease, or distribute customer details to third-party advertisers.
            </p>

            <h3 className="text-lg font-bold text-slate-900">3. Payment & Transaction Security</h3>
            <p>
              Payments processed via M-Pesa or bank transfer are verified directly against official transaction reference codes. We do not store credit card credentials or sensitive banking PINs.
            </p>

            <h3 className="text-lg font-bold text-slate-900">4. Contact Us</h3>
            <p>
              If you have any questions regarding your stored records or wish to update your customer profile, please contact our administrative desk at <strong>{settings.email}</strong> or <strong>{settings.email2 || 'support.shammah@gmail.com'}</strong>, or call <strong>{settings.phone}</strong> / <strong>{settings.phone2 || '0118894810'}</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TermsPage() {
  const { navigateTo, settings } = useApp();

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-6 h-6 text-blue-900" />
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Service Agreement
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
            Terms & Conditions
          </h1>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
            <p>
              These Terms & Conditions govern moving, transportation, packing, and cleaning services provided by <strong>{settings.company_name}</strong> across Kenya.
            </p>

            <h3 className="text-lg font-bold text-slate-900">1. Quotations & Pricing</h3>
            <p>
              Quotations are prepared based on the information provided regarding home size, inventory volume, distance, and floor level. Substantial discrepancies (such as undisclosed heavy safes, additional rooms, or extended walking distances) may require adjustments agreed upon before loading begins.
            </p>

            <h3 className="text-lg font-bold text-slate-900">2. Customer Responsibilities</h3>
            <p>
              Customers must personally safeguard valuable personal items including cash, jewelry, passport credentials, title deeds, and personal laptops. These must not be placed inside standard moving cartons.
            </p>

            <h3 className="text-lg font-bold text-slate-900">3. Transit Cargo Protection & Claims</h3>
            <p>
              Shammah provides careful blanket wrapping and tie-downs for all transported furniture. In the unlikely event of property damage resulting from crew handling negligence, notice must be given within 24 hours of job completion for inspection and resolution.
            </p>

            <h3 className="text-lg font-bold text-slate-900">4. Payment Terms</h3>
            <p>
              Services are billed in Kenyan Shillings (Ksh). Confirmed bookings may require a commitment deposit, with the balance due upon completion of unloading or deep cleaning handover.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
