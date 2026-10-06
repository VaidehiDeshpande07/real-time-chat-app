import React, { useState } from 'react';
import { ShieldIcon } from '../common/Icons';
import { registerUser } from '../../services/api';

export default function RegisterForm({ onNavigateToLogin, onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    console.log(`[Frontend Auth] Sending registration request for: ${email}`);

    try {
      const data = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role
      });

      console.log('[Frontend Auth] Registration successful:', data);
      setSuccess('Account created successfully! Redirecting to Sign In...');
      
      // Clear form
      setName('');
      setEmail('');
      setPassword('');

      // Redirect to login after brief confirmation
      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess();
        } else if (onNavigateToLogin) {
          onNavigateToLogin();
        }
      }, 1200);
    } catch (err) {
      console.error('[Frontend Auth] Registration failed:', err.message);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              <label 
                onClick={() => setRole('USER')}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  role === 'USER' 
                    ? 'border-indigo-500/50 bg-indigo-950/30 ring-1 ring-indigo-500/30' 
                    : 'border-slate-800 bg-slate-950/40 hover:bg-slate-900/40'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="USER"
                  checked={role === 'USER'}
                  onChange={() => setRole('USER')}
                  className="w-4 h-4 text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                />
                <div>
                  <div className="text-sm font-medium text-slate-200">Standard User</div>
                  <div className="text-[11px] text-slate-400">Regular messaging</div>
                </div>
              </label>

              <label 
                onClick={() => setRole('ADMIN')}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  role === 'ADMIN' 
                    ? 'border-indigo-500/50 bg-indigo-950/30 ring-1 ring-indigo-500/30' 
                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={role === 'ADMIN'}
                  onChange={() => setRole('ADMIN')}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min. 6 characters)"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
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
