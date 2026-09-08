import React, { useState } from 'react';
import { SendIcon, PaperclipIcon, SmileIcon } from '../common/Icons';

export default function MessageInput({ onSendMessage }) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <footer className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur flex-shrink-0">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-5xl mx-auto">
        {/* Attachment & Emoji actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Attach file (Mock)"
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <PaperclipIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            title="Emoji picker (Mock)"
            className="hidden sm:inline-flex p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <SmileIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Text Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="w-full py-2.5 px-4 text-sm rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim()}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
            inputText.trim()
              ? 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
          title="Send message"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </footer>
  );
}
