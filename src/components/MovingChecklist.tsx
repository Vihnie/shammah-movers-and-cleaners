import React, { useState } from 'react';
import { CalendarCheck, CheckSquare, Square, Plus, Trash2, Sparkles, Printer, CheckCircle } from 'lucide-react';
import { ChecklistItem } from '../types';
import { INITIAL_CHECKLIST } from '../data/mockData';

export function MovingChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [newTitle, setNewTitle] = useState('');
  const [newWeek, setNewWeek] = useState('2 Weeks Before');

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      week: newWeek,
      title: newTitle.trim(),
      description: 'Custom added relocation task',
      completed: false,
    };
    setItems((prev) => [...prev, newItem]);
    setNewTitle('');
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPct = Math.round((completedCount / items.length) * 100);

  // Group by timeline
  const weeks = ['4 Weeks Before', '2 Weeks Before', '1 Week Before', 'Moving Day'];

  return (
    <section id="checklist" className="py-14 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Interactive Moving Planner</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Stress-Free Moving Checklist
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
            Stay organized week-by-week. Check off tasks as you prepare for your relocation.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="font-bold text-slate-800">
              Move Preparation Readiness
            </span>
            <span className="font-extrabold text-purple-700">
              {completedCount} of {items.length} Tasks Completed ({progressPct}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-900 via-indigo-600 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-2 mb-8">
          <input
            type="text"
            placeholder="Add your own custom moving task (e.g. Call gym membership, pack medicine)..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <select
            value={newWeek}
            onChange={(e) => setNewWeek(e.target.value)}
            className="px-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 font-semibold"
          >
            {weeks.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </form>

        {/* Grouped Checklist */}
        <div className="space-y-6">
          {weeks.map((week) => {
            const weekItems = items.filter((i) => i.week === week);
            if (weekItems.length === 0) return null;

            return (
              <div key={week} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                <h3 className="text-xs font-extrabold text-blue-950 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  <span>{week}</span>
                </h3>

                <div className="space-y-2">
                  {weekItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                        item.completed
                          ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-blue-50/30'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="flex items-start gap-3 text-left flex-1"
                      >
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                            item.completed
                              ? 'bg-emerald-600 text-white'
                              : 'border-2 border-slate-300 bg-white'
                          }`}
                        >
                          {item.completed && <CheckCircle className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div
                            className={`text-xs font-bold ${
                              item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {item.title}
                          </div>
                          {item.description && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
