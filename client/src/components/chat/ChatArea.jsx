import React, { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useAppContext } from "../../context/AppContext";

export default function ChatArea() {
  // Consuming shared context state — Experiment 3: conversations/sendMessage from reducer
  const { selectedUser, conversations, sendMessage, backToSidebar, showChatOnMobile } = useAppContext();

  // Local UI-only state: typing simulation (Experiment 2 preserved)
  const [isTypingSimulated, setIsTypingSimulated] = React.useState(selectedUser?.isTyping || false);

  // Active conversation from centralized reducer state
  const currentMessages = selectedUser ? (conversations[selectedUser.id] || []) : [];

  // useEffect: typing timer with cleanup (Experiment 2 preserved)
  React.useEffect(() => {
    setIsTypingSimulated(Boolean(selectedUser?.isTyping));
    let timerId = null;
    if (selectedUser?.isTyping) {
      timerId = setTimeout(() => { setIsTypingSimulated(false); }, 2500);
    }
    return () => { if (timerId) clearTimeout(timerId); };
  }, [selectedUser?.id, selectedUser?.isTyping]);

  const handleSendMessage = (text) => { sendMessage(text); };

  if (!selectedUser) {
    const cls = `flex-1 flex-col items-center justify-center bg-slate-950 text-slate-400 p-8 ${showChatOnMobile ? "flex" : "hidden md:flex"}`;
    return (
      <div className={cls}>
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-200">No Conversation Selected</h3>
        <p className="text-xs text-slate-500 mt-1 text-center max-w-sm">Select a contact from the sidebar to view the message thread.</p>
      </div>
    );
  }

  const activeUserWithDynamicTyping = { ...selectedUser, isTyping: isTypingSimulated };
  const mainCls = `flex-1 flex-col h-full bg-slate-950 ${showChatOnMobile ? "flex" : "hidden md:flex"}`;

  return (
    <main className={mainCls}>
      <ChatHeader selectedUser={activeUserWithDynamicTyping} onBackToSidebar={backToSidebar} />
      <MessageList messages={currentMessages} selectedUser={activeUserWithDynamicTyping} />
      <MessageInput onSendMessage={handleSendMessage} />
    </main>
  );
}
