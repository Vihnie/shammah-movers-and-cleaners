import React, { useState } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, Plus, ShieldCheck, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Review } from '../../types';

export function AdminReviews() {
  const { reviews, approveReview, deleteReview, addReview } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [service, setService] = useState('Residential Moving');
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    addReview({
      customer_name: customerName,
      rating,
      service,
      location: location || 'Nairobi, Kenya',
      comment,
      verified: true,
      approved: true,
    });

    setIsAddModalOpen(false);
    setCustomerName('');
    setComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Reviews Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Approve public testimonials, verify authentic moves, and showcase feedback.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Verified Review</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`bg-white rounded-2xl p-6 border shadow-xs flex flex-col justify-between transition-all ${
              rev.approved ? 'border-slate-200' : 'border-amber-300 bg-amber-50/20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rev.approved
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {rev.approved ? 'PUBLISHED' : 'PENDING APPROVAL'}
                </span>
              </div>

              <p className="text-slate-700 text-xs italic my-3 leading-relaxed">
                "{rev.comment}"
              </p>

              <div className="text-xs">
                <h4 className="font-extrabold text-slate-900">{rev.customer_name}</h4>
                <span className="text-slate-500 block text-[11px]">
                  {rev.service} • {rev.location}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => approveReview(rev.id, !rev.approved)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  rev.approved
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                {rev.approved ? 'Unpublish' : 'Approve & Publish'}
              </button>

              <button
                onClick={() => deleteReview(rev.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Delete Review"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
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
              Add Verified Review
            </h3>

            <form onSubmit={handleAddReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                  placeholder="e.g. Dennis Macharia"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Service Type</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white"
                  >
                    <option value="Residential Moving">Residential Moving</option>
                    <option value="Deep Cleaning">Deep Cleaning</option>
                    <option value="Commercial Moving">Commercial Moving</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                  placeholder="e.g. Kilimani, Nairobi"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Review Feedback *</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2.5 rounded-xl border text-xs"
                  placeholder="Customer remarks..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Publish Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
