import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { mockMessages } from '../../data/mockData';
import { useAppContext } from '../../context/AppContext';

export default function ChatArea() {
  // 1. Consuming shared context state via useContext (useAppContext)
  const { selectedUser, backToSidebar, showChatOnMobile } = useAppContext();

  // 2. Local interactive state using useState
  const [messages, setMessages] = useState(mockMessages);
  const [isTypingSimulated, setIsTypingSimulated] = useState(selectedUser?.isTyping || false);

  // 3. Meaningful useEffect: Synchronize messages and manage simulated typing with timer cleanup
  useEffect(() => {
    // Reset conversation feed to initial mock messages for the newly selected user
    setMessages(mockMessages);
    setIsTypingSimulated(Boolean(selectedUser?.isTyping));

    let timerId = null;
    if (selectedUser?.isTyping) {
      // Simulate the contact finishing typing after 2.5 seconds
      timerId = setTimeout(() => {
        setIsTypingSimulated(false);
      }, 2500);
    }

    // Effect cleanup: Always clear timers to prevent memory leaks when switching contacts rapidly
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [selectedUser?.id, selectedUser?.isTyping]);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: `m_${Date.now()}`,
      senderId: 'u1',
      receiverId: selectedUser.id,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fromMe: true,
      status: 'delivered',
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  if (!selectedUser) {
    return (
      <div
        className={`flex-1 flex-col items-center justify-center bg-slate-950 text-slate-400 p-8 ${
          showChatOnMobile ? 'flex' : 'hidden md:flex'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-200">No Conversation Selected</h3>
        <p className="text-xs text-slate-500 mt-1 text-center max-w-sm">
          Select a user from the sidebar contact list to inspect the message thread and test responsive layout.
        </p>
      </div>
    );
  }

  // Clone selectedUser with dynamic typing state for the UI
  const activeUserWithDynamicTyping = {
    ...selectedUser,
    isTyping: isTypingSimulated,
  };

  return (
    <main
      className={`flex-1 flex-col h-full bg-slate-950 ${
        showChatOnMobile ? 'flex' : 'hidden md:flex'
      }`}
    >
      <ChatHeader
        selectedUser={activeUserWithDynamicTyping}
        onBackToSidebar={backToSidebar}
      />

      <MessageList
        messages={messages}
        selectedUser={activeUserWithDynamicTyping}
      />

      <MessageInput onSendMessage={handleSendMessage} />
    </main>
  );
}
