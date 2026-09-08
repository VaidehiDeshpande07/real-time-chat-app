import React from 'react';

export default function ExperimentInfo({ onReturnToChat }) {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-600/30 text-indigo-300 font-mono text-xs font-bold uppercase">
                Experiment 1 Lab Manual
              </span>
              <span className="text-xs text-slate-400">CS Full-Stack Practical</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">
              Responsive & Interactive UIs using Tailwind CSS
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
            To build a modern, interactive, and fully responsive user interface for a real-time chat application using React, Vite, and the utility-first CSS framework Tailwind CSS.
          </p>
        </section>

        {/* Section 2: Theory & Core Concepts */}
        <section className="mt-6 space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">2. Key Concepts & Tailwind Techniques Used</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <strong className="text-slate-100 block mb-1">Utility-First Architecture:</strong>
              Composed UI directly in markup using classes like <code className="text-indigo-300 font-mono">flex</code>, <code className="text-indigo-300 font-mono">grid</code>, <code className="text-indigo-300 font-mono">p-4</code>, <code className="text-indigo-300 font-mono">rounded-2xl</code> without writing custom CSS files for each element.
            </div>
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <strong className="text-slate-100 block mb-1">Responsive Breakpoints:</strong>
              Used <code className="text-indigo-300 font-mono">md:flex</code>, <code className="text-indigo-300 font-mono">hidden</code>, and <code className="text-indigo-300 font-mono">max-w-[85%] sm:max-w-[70%]</code> to ensure a seamless experience on mobile, tablet, and desktop screens.
            </div>
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <strong className="text-slate-100 block mb-1">Dynamic State Indicators:</strong>
              Created presence indicators (online/offline) with ping animations (<code className="text-indigo-300 font-mono">animate-ping</code>) and animated typing dots (<code className="text-indigo-300 font-mono">animate-bounce</code>).
            </div>
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <strong className="text-slate-100 block mb-1">Interactive Micro-interactions:</strong>
              Added transitions (<code className="text-indigo-300 font-mono">transition-all duration-150</code>), hover states, active states, and custom focus rings (<code className="text-indigo-300 font-mono">focus:ring-2</code>).
            </div>
          </div>
        </section>

        {/* Section 3: UI Features Implemented */}
        <section className="mt-6 space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">3. Features Implemented in Exp 1</h2>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
            <li><strong className="text-white">Auth Screens:</strong> Responsive Login and Registration cards with role selection (User vs Admin).</li>
            <li><strong className="text-white">Sidebar:</strong> Current user profile badge, user search filter, online/all tabs, and contact cards.</li>
            <li><strong className="text-white">Active Chat Window:</strong> Header with status/typing indicator, audio/video mock actions, and mobile back button.</li>
            <li><strong className="text-white">Message Bubbles:</strong> Asymmetrical chat bubbles (distinct styling for sent vs received), timestamps, and delivery ticks.</li>
            <li><strong className="text-white">Message Input:</strong> Attachment, emoji, and interactive send message form with auto-scroll feed.</li>
          </ul>
        </section>

        {/* Section 4: What is Deferred */}
        <section className="mt-6 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs">
          <strong>Strict College Experiment Scope:</strong> As per Experiment 1 guidelines, all data is currently mock/static. Backend APIs, Express server, MongoDB models, JWT authentication, and WebSockets/Socket.IO will be added step-by-step in future experiments.
        </section>
      </div>
    </div>
  );
}
