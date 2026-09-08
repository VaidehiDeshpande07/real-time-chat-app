import React from 'react';
import { ShieldIcon } from '../common/Icons';

export default function UserItem({ user, isSelected, onSelect, unreadCount = 0 }) {
  const isOnline = user.status === 'online';

  return (
    <div
      onClick={() => onSelect(user)}
      className={`flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer transition-all duration-150 ${
        isSelected
          ? 'bg-indigo-600/20 border border-indigo-500/40 text-white shadow-sm'
          : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
      }`}
    >
      {/* Avatar with Status Dot */}
      <div className="relative flex-shrink-0">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-800"
        />
        <span
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-slate-900 ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-500'
          }`}
        >
          {isOnline && (
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
          )}
        </span>
      </div>

      {/* User Info & Last Message */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5 truncate">
            <h4 className="text-sm font-semibold text-slate-100 truncate">{user.name}</h4>
            {user.role === 'ADMIN' && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <ShieldIcon className="w-2.5 h-2.5" /> ADMIN
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 whitespace-nowrap">{user.time}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-slate-400 truncate">
            {user.isTyping ? (
              <span className="text-indigo-400 italic font-medium">typing...</span>
            ) : (
              user.lastMessage
            )}
          </p>
          {unreadCount > 0 && (
            <span className="flex-shrink-0 flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
