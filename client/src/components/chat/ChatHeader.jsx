import React from 'react';
import { ArrowLeftIcon, PhoneIcon, VideoIcon, MoreVerticalIcon, ShieldIcon } from '../common/Icons';

export default function ChatHeader({ selectedUser, onBackToSidebar }) {
  const isOnline = selectedUser.status === 'online';

  return (
    <header className="h-16 px-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Back Button */}
        <button
          onClick={onBackToSidebar}
          className="md:hidden p-2 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Back to contacts"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        {/* User Avatar + Status */}
        <div className="relative">
          <img
            src={selectedUser.avatar}
            alt={selectedUser.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800"
          />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-slate-900 ${
              isOnline ? 'bg-emerald-500' : 'bg-slate-500'
            }`}
          ></span>
        </div>

        {/* User Name & Status / Typing indicator */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">{selectedUser.name}</h3>
            {selectedUser.role === 'ADMIN' && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <ShieldIcon className="w-2.5 h-2.5" /> ADMIN
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {selectedUser.isTyping ? (
              <span className="text-xs text-indigo-400 font-medium flex items-center gap-1">
                <span>typing</span>
                <span className="inline-flex gap-0.5 items-center">
                  <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce"></span>
                  <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                {isOnline ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active now
                  </span>
                ) : (
                  selectedUser.lastSeen
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        <button
          title="Audio Call (Mock)"
          className="p-2 text-slate-400 hover:text-indigo-400 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <PhoneIcon className="w-5 h-5" />
        </button>
        <button
          title="Video Call (Mock)"
          className="p-2 text-slate-400 hover:text-indigo-400 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <VideoIcon className="w-5 h-5" />
        </button>
        <button
          title="Conversation Options"
          className="p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <MoreVerticalIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
