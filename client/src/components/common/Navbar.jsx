import React from 'react';

export default function Navbar({ currentView, setCurrentView }) {
  const views = [
    { id: 'chat', label: '💬 Chat Dashboard' },
    { id: 'login', label: '🔐 Login View' },
    { id: 'register', label: '📝 Register View' },
    { id: 'about', label: '📋 Exp 1 Overview' },
  ];

  return (
    <nav className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-20 flex-shrink-0">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20">
          P
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
              PulseChat
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
              Experiment 1
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-slate-400">
            Tailwind CSS Responsive & Interactive UI
          </p>
        </div>
      </div>

      {/* Screen View Switcher Buttons for Exam / Evaluation */}
      <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
        {views.map((v) => (
          <button
            key={v.id}
            onClick={() => setCurrentView(v.id)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === v.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
