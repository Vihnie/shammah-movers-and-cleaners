import React from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';

interface PoliciesModalsProps {
  policyType: string | null;
  onClose: () => void;
}

export const PoliciesModals: React.FC<PoliciesModalsProps> = ({ policyType, onClose }) => {
  if (!policyType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {policyType === 'insurance' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>£100,000 Comprehensive Goods in Transit Coverage</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Marine &amp; Transit Insurance Policy</h3>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                All relocations contracted with SwiftMove Relocations &amp; Storage are protected by our standard £100,000 Goods in Transit policy underwritten by Royal &amp; Sun Alliance.
              </p>
              <h4 className="font-bold text-slate-800 text-xs uppercase">Key Coverage Inclusions:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Accidental damage during loading, transit, and unloading.</li>
                <li>Total loss, road collision, overturning, and vehicle fire.</li>
                <li>Water or rain ingress during transit.</li>
                <li>Theft or forced entry while vehicles are in transit.</li>
              </ul>
              <h4 className="font-bold text-slate-800 text-xs uppercase">High-Value Items:</h4>
              <p>
                Individual antiques, fine art, or jewelry items valued in excess of £5,000 must be declared at least 48 hours prior to moving day to ensure appropriate crating and supplemental insurance declaration.
              </p>
            </div>
          </div>
        )}

        {policyType === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <FileText className="w-5 h-5" />
              <span>Standard Terms of Business</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Contract &amp; Relocation Terms</h3>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                1. <strong>Quotations:</strong> Our written quotes are fixed and binding for 30 days from generation date, provided access details and inventories remain identical.
              </p>
              <p>
                2. <strong>Arrival Windows:</strong> We operate standard morning (08:00–10:00) and afternoon (12:00–14:00) slots. In the event of unforeseen motorway delays, our dispatch desk maintains active contact with the lead client.
              </p>
              <p>
                3. <strong>Parking &amp; Access:</strong> The client is responsible for reserving parking suspensions or bay permits at pickup and dropoff locations unless previously booked via SwiftMove dispatch.
              </p>
              <p>
                4. <strong>Payment Terms:</strong> Full payment balance is settled via card on delivery or bank transfer upon completion of unloading.
              </p>
            </div>
          </div>
        )}

        {policyType === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <Lock className="w-5 h-5" />
              <span>Data Protection &amp; GDPR</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Privacy &amp; Telemetry Notice</h3>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                SwiftMove is committed to protecting your privacy. Your personal information (names, telephone numbers, and addresses) is strictly utilized for the performance of the relocation contract and dispatch logistics.
              </p>
              <p>
                We never sell, rent, or distribute client contact details to third-party marketing companies. Data is encrypted in transit and securely stored in compliance with the UK Data Protection Act 2018 and UK GDPR.
              </p>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 text-slate-800 space-y-6">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
          <Lock className="w-5 h-5" />
          <span>Privacy & Data Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Privacy Policy</h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Last updated: September 2026. This Privacy Notice describes how Shammah Movers and Cleaners collects, uses, and safeguards your personal data when you request quotes, book moving or cleaning services, or interact with our platform.
        </p>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            We collect personal information directly from you when you submit a quote request, communicate via phone or WhatsApp, or finalize a service booking. This includes your name, phone number, email address, pickup and dropoff physical addresses, moving dates, inventory lists, and service preferences.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">2. How We Use Your Information</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your data is strictly utilized to:
          </p>
          <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
            <li>Generate accurate distance, crew, and vehicle moving estimates.</li>
            <li>Dispatch trucks, moving personnel, and cleaning teams to your specified locations.</li>
            <li>Send booking confirmations, status updates, receipts, and invoices.</li>
            <li>Coordinate arrival windows and communicate logistical updates in real time.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">3. Data Security and Confidentiality</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            We never sell, rent, or trade your personal details to third parties for marketing. All communications and stored information are protected with industry-standard cryptographic protocols and restricted solely to authorized operational dispatch staff.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">4. Contact & Inquiries</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            For questions about this policy or to request data deletion, contact us at <strong>it.shammah@gmail.com</strong> or call <strong>0181460645</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 text-slate-800 space-y-6">
        <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
          <FileText className="w-5 h-5" />
          <span>Terms & Conditions of Service</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Terms of Business</h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          These terms govern all relocation, packing, commercial moving, deep cleaning, and fumigation services provided by Shammah Movers and Cleaners.
        </p>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">1. Quotations & Pricing</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Quotations provided via our automated calculator or through our dispatch desk are valid for 30 calendar days. Quotes are calculated based on declared inventory, access conditions (stairs/elevators), distance, and chosen package tiers. Any undeclared major heavy items or unforeseen access impediments may incur supplementary handling fees.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">2. Customer Responsibilities</h2>
          <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
            <li>Ensure parking clearance, gate passes, and estate approvals for our trucks at both origin and destination.</li>
            <li>Securely store high-value personal jewelry, cash, and sensitive identification documents prior to moving day.</li>
            <li>Confirm presence or assign an authorized representative during loading and offloading.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">3. Transit Insurance & Claims</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard bookings include Comprehensive Goods in Transit coverage. Any damage or loss claims must be inspected and documented in the presence of the team leader prior to final job sign-off.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">4. Payment Terms</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Payment may be settled via M-Pesa, card, or direct bank transfer. For residential moves, final balance is settled upon completion of unloading and placement.
          </p>
        </section>
      </div>
    </div>
  );
};
