import React from 'react';
import { useAppContext } from '../../context/AppContext';

export default function ExperimentInfo({ onReturnToChat }) {
  const { currentView, selectedUser, currentUser } = useAppContext();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-600/30 text-indigo-300 font-mono text-xs font-bold uppercase">
                Experiment 2 Lab Manual
              </span>
              <span className="text-xs text-slate-400">CS Full-Stack Practical</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">
              React Hooks: useState, useEffect, useContext & Custom Hook
            </h1>
          </div>
          <button
            onClick={onReturnToChat}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
          >
            Open Live Chat Demo →
          </button>
        </div>

        {/* Section 1: Objective */}
        <section className="mt-6 space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">1. Objective</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            To implement and demonstrate core React Hooks (<code className="text-indigo-300 font-mono">useState</code>, <code className="text-indigo-300 font-mono">useEffect</code>, <code className="text-indigo-300 font-mono">useContext</code>) and a custom hook (<code className="text-indigo-300 font-mono">useLocalStorage</code>) to manage component-level and application-wide state in the PulseChat real-time messaging application.
          </p>
        </section>

        {/* Section 2: React Hooks Breakdown in PulseChat */}
        <section className="mt-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
            2. React Hooks Demonstration in PulseChat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-slate-100 text-sm">1. useState</strong>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px]">Local State</span>
              </div>
              <p className="text-slate-400">
                Manages component-scoped interactive values that re-render the view upon modification:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[11px]">
                <li><span className="text-indigo-300">Sidebar.jsx</span>: <code className="text-slate-200">searchTerm</code> & <code className="text-slate-200">filterMode</code></li>
                <li><span className="text-indigo-300">MessageInput.jsx</span>: <code className="text-slate-200">inputText</code></li>
                <li><span className="text-indigo-300">ChatArea.jsx</span>: <code className="text-slate-200">messages</code> array</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-slate-100 text-sm">2. useEffect</strong>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">Side Effects</span>
              </div>
              <p className="text-slate-400">
                Executes side effects and cleans up subscriptions/timers to avoid memory leaks:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[11px]">
                <li><span className="text-indigo-300">App.jsx</span>: Dynamically updates <code className="text-slate-200">document.title</code> based on active chat</li>
                <li><span className="text-indigo-300">ChatArea.jsx</span>: Simulates typing timer with <code className="text-slate-200">clearTimeout</code> cleanup</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-slate-100 text-sm">3. useContext</strong>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px]">Global State</span>
              </div>
              <p className="text-slate-400">
                Eliminates "prop-drilling" across nested hierarchies via <code className="text-indigo-300">AppContext.jsx</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[11px]">
                <li>Provides <code className="text-slate-200">currentUser</code>, <code className="text-slate-200">selectedUser</code>, and <code className="text-slate-200">currentView</code></li>
                <li>Exposes custom consumer hook: <code className="text-slate-200">useAppContext()</code></li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-slate-100 text-sm">4. useLocalStorage</strong>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">Custom Hook</span>
              </div>
              <p className="text-slate-400">
                Extracts reusable storage persistence logic in <code className="text-indigo-300">useLocalStorage.js</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[11px]">
                <li>Safely reads/writes JSON to <code className="text-slate-200">window.localStorage</code></li>
                <li>Persists active view tab across page reloads</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Live Hook State Inspector */}
        <section className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live React Context & Hook State Inspector
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">React 19 Hooks</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800/80">
              <span className="text-slate-500 block text-[10px]">AppContext: currentUser</span>
              <span className="text-white font-semibold">{currentUser.name}</span>
              <span className="text-indigo-400 text-[10px] block">Role: {currentUser.role}</span>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800/80">
              <span className="text-slate-500 block text-[10px]">AppContext: selectedUser</span>
              <span className="text-white font-semibold">{selectedUser ? selectedUser.name : 'None'}</span>
              <span className="text-emerald-400 text-[10px] block">Status: {selectedUser?.status}</span>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800/80">
              <span className="text-slate-500 block text-[10px]">useLocalStorage: "pulsechat-view"</span>
              <span className="text-indigo-300 font-mono font-semibold">{currentView}</span>
              <span className="text-slate-500 text-[10px] block">Persisted in browser</span>
            </div>
          </div>
        </section>

        {/* Section 4: Preserving Scope */}
        <section className="mt-4 p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-indigo-300 text-xs">
          <strong>Experiment 2 Scope Note:</strong> Only React Hooks are introduced. REST APIs, Express server, MongoDB, and WebSockets/Socket.IO will be integrated in subsequent experiments according to the college roadmap.
        </section>
      </div>
    </div>
  );
}
