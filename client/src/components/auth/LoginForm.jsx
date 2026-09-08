import React from 'react';
import { ShieldIcon } from '../common/Icons';

export default function LoginForm({ onNavigateToRegister, onDemoLogin }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black text-2xl mb-4 shadow-lg shadow-indigo-600/30">
            N
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-2">Sign in to your NexTalk account</p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); onDemoLogin(); }} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="alex.johnson@nextalk.app"
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              defaultValue="••••••••••••"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              Remember this device
            </label>

            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <ShieldIcon className="w-3.5 h-3.5 text-emerald-400" /> Secure Login
            </span>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 group"
          >
            <span>Sign In to NexTalk</span>
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

        {/* Footer switcher */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onNavigateToRegister}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
