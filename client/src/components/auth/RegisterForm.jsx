import React from 'react';
import { ShieldIcon } from '../common/Icons';

export default function RegisterForm({ onNavigateToLogin, onDemoRegister }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black text-2xl mb-4 shadow-lg shadow-indigo-600/30">
            N
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Create Account</h2>
          <p className="text-sm text-slate-400 mt-2">Join NexTalk for real-time messaging</p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); onDemoRegister(); }} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="Sarah Connor"
              placeholder="e.g. Sarah Connor"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="sarah.connor@nextalk.app"
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Account Role */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-indigo-500/50 bg-indigo-950/20 cursor-pointer hover:bg-indigo-950/30 transition-all">
                <input
                  type="radio"
                  name="role"
                  value="USER"
                  defaultChecked
                  className="w-4 h-4 text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                />
                <div>
                  <div className="text-sm font-medium text-slate-200">Standard User</div>
                  <div className="text-[11px] text-slate-400">Regular messaging</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/40 cursor-pointer hover:border-slate-700 hover:bg-slate-900/40 transition-all">
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  className="w-4 h-4 text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                />
                <div>
                  <div className="text-sm font-medium text-slate-200 flex items-center gap-1">
                    Administrator <ShieldIcon className="w-3 h-3 text-indigo-400" />
                  </div>
                  <div className="text-[11px] text-slate-400">Admin privileges</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              defaultValue="password123"
              placeholder="Create a password"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 group"
          >
            <span>Create Account</span>
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

        {/* Footer switcher */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            Already registered?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
