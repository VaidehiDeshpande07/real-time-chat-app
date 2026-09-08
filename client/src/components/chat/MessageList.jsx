import React from 'react';
import { CheckCheckIcon } from '../common/Icons';

export default function MessageList({ messages, selectedUser }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-slate-950 to-slate-900/60">
      {/* Date Separator */}
      <div className="flex items-center justify-center my-2">
        <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 text-slate-400 border border-slate-700/50 shadow-sm">
          Today, September 9, 2026
        </span>
      </div>

      {/* Message Bubbles */}
      {messages.map((msg) => {
        const isFromMe = msg.fromMe;

        return (
          <div
            key={msg.id}
            className={`flex items-end gap-2.5 ${isFromMe ? 'justify-end' : 'justify-start'}`}
          >
            {/* Sender Avatar for received messages */}
            {!isFromMe && (
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1"
              />
            )}

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[70%] md:max-w-[60%] px-4 py-2.5 shadow-md ${
                isFromMe
                  ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none'
                  : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-2xl rounded-tl-none'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
              
              <div
                className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                  isFromMe ? 'text-indigo-200' : 'text-slate-400'
                }`}
              >
                <span>{msg.timestamp}</span>
                {isFromMe && (
                  <CheckCheckIcon
                    className={`w-3.5 h-3.5 ${
                      msg.status === 'read' ? 'text-sky-300' : 'text-indigo-300'
                    }`}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Live Typing Indicator Preview Bubble */}
      {selectedUser.isTyping && (
        <div className="flex items-end gap-2.5 justify-start">
          <img
            src={selectedUser.avatar}
            alt={selectedUser.name}
            className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1"
          />
          <div className="px-4 py-3 bg-slate-800 border border-slate-700/60 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </div>
      )}
    </div>
  );
}
