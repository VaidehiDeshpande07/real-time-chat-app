import React from 'react';
import { useAppContext } from '../../context/AppContext';

export default function LandingPage() {
  const { setCurrentView } = useAppContext();

  return (
    <div className="min-h-full overflow-y-auto bg-slate-950">

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-16">

        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl w-full mx-auto text-center">

          {/* Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black text-3xl shadow-xl shadow-indigo-600/30 mb-6">
            N
          </div>

          <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Modern Messaging
          </p>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            Connect.
            <br />
            Chat.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              Stay in Sync.
            </span>
          </h1>

          <p className="mt-6 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            NexTalk makes it simple to connect with people, manage
            conversations, and stay connected through a clean and modern
            messaging experience.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">

            <button
              onClick={() => setCurrentView('register')}
              className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              Create Account
            </button>

            <button
              onClick={() => setCurrentView('login')}
              className="px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold border border-slate-700 transition-all"
            >
              Sign In
            </button>

          </div>

          {/* Small trust text */}
          <p className="mt-5 text-xs text-slate-500">
            Simple • Secure • Connected
          </p>

        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-900 px-6 py-16">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Everything you need to stay connected
            </h2>

            <p className="mt-3 text-slate-400 text-sm">
              A simple and intuitive messaging experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">

            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/30 transition-all">

              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center text-xl mb-4">
                💬
              </div>

              <h3 className="text-white font-semibold mb-2">
                Easy Conversations
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">
                Start conversations and keep your messages organized in one
                simple interface.
              </p>

            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/30 transition-all">

              <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center text-xl mb-4">
                👥
              </div>

              <h3 className="text-white font-semibold mb-2">
                Stay Connected
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">
                Find contacts easily and keep track of your conversations.
              </p>

            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/30 transition-all">

              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xl mb-4">
                🔒
              </div>

              <h3 className="text-white font-semibold mb-2">
                Secure Access
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">
                Your account is protected using secure authentication.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center">
        <p className="text-xs text-slate-500">
          © 2026 NexTalk. Modern messaging experience.
        </p>
      </footer>

    </div>
  );
}