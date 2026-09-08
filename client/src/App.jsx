import React, { useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Sidebar from './components/chat/Sidebar';
import ChatArea from './components/chat/ChatArea';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import { useAppContext } from './context/AppContext';

export default function App() {
  // 1. Consume shared state and actions from AppContext via useContext
  const { currentView, setCurrentView, selectedUser } = useAppContext();

  // 2. Demonstrate useEffect for dynamic browser document title updates
  useEffect(() => {
    const originalTitle = document.title;

    if (currentView === 'chat') {
      document.title = selectedUser
        ? `Chat with ${selectedUser.name} | NexTalk`
        : 'NexTalk | Direct Messages';
    } else if (currentView === 'login') {
      document.title = 'Sign In | NexTalk';
    } else if (currentView === 'register') {
      document.title = 'Create Account | NexTalk';
    } else {
      document.title = 'NexTalk | Real-Time Messaging';
    }

    // Effect cleanup function
    return () => {
      document.title = originalTitle;
    };
  }, [currentView, selectedUser]);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Application Navbar */}
      <Navbar />

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'chat' && (
          <div className="flex h-full w-full">
            {/* Sidebar (Contacts list, search, presence) */}
            <Sidebar />

            {/* Main Chat Feed (Conversation header, message feed, input bar) */}
            <ChatArea />
          </div>
        )}

        {currentView === 'login' && (
          <div className="h-full overflow-y-auto">
            <LoginForm
              onNavigateToRegister={() => setCurrentView('register')}
              onDemoLogin={() => setCurrentView('chat')}
            />
          </div>
        )}

        {currentView === 'register' && (
          <div className="h-full overflow-y-auto">
            <RegisterForm
              onNavigateToLogin={() => setCurrentView('login')}
              onDemoRegister={() => setCurrentView('chat')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
