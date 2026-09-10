import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ShieldIcon, LogoutIcon } from './Icons';

export default function Navbar() {
  // Consuming shared state directly from AppContext via useContext
  const { currentView, setCurrentView, currentUser, logout, backToSidebar } = useAppContext();

  if (currentView === 'landing') {
  return (
    <nav className="h-16 bg-slate-950 px-6 flex items-center justify-between">
      <div
        onClick={() => setCurrentView('landing')}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20">
          N
        </div>

        <span className="font-extrabold text-lg tracking-tight text-white">
          NexTalk
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentView('login')}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all"
        >
          Sign In
        </button>

        <button
          onClick={() => setCurrentView('register')}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}
  return (
    <nav className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-20 flex-shrink-0">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => setCurrentView('chat')}
          className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20 cursor-pointer select-none"
        >
          N
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              onClick={() => setCurrentView('chat')}
              className="font-extrabold text-base sm:text-lg tracking-tight text-white cursor-pointer"
            >
              NexTalk
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Online
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-slate-400">
            Real-time direct messaging
          </p>
        </div>
      </div>

      {/* Realistic User-Facing Navigation */}
      {currentView === 'chat' ? (
        <div className="flex items-center gap-2 sm:gap-4">
          {/* View Toggles: Messages vs Contacts */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentView('chat')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-sm transition-all"
            >
              💬 Messages
            </button>
            <button
              onClick={() => {
                backToSidebar();
                setCurrentView('chat');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all"
            >
              👥 Contacts
            </button>
          </div>

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-slate-800">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  {currentUser.role === 'ADMIN' && (
                    <span className="inline-flex items-center text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                      <ShieldIcon className="w-2.5 h-2.5" /> ADMIN
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{currentUser.email}</div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogoutIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      ) : (
        /* Auth Screen Header Actions */
        <div className="flex items-center gap-2">
          {currentView === 'login' ? (
            <button
              onClick={() => setCurrentView('register')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 transition-all"
            >
              Create Account
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('login')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
