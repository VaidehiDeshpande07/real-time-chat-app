import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import Sidebar from './components/chat/Sidebar';
import ChatArea from './components/chat/ChatArea';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ExperimentInfo from './components/common/ExperimentInfo';
import { mockCurrentUser, mockUsers } from './data/mockData';

export default function App() {
  const [currentView, setCurrentView] = useState('chat'); // 'chat' | 'login' | 'register' | 'about'
  const [currentUser, setCurrentUser] = useState(mockCurrentUser);
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setShowChatOnMobile(true);
  };

  const handleBackToSidebar = () => {
    setShowChatOnMobile(false);
  };

  const handleLogout = () => {
    setCurrentView('login');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navbar */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'chat' && (
          <div className="flex h-full w-full">
            {/* Sidebar (Responsive: Visible on mobile if not looking at a chat) */}
            <Sidebar
              currentUser={currentUser}
              users={mockUsers}
              selectedUser={selectedUser}
              onSelectUser={handleSelectUser}
              onLogout={handleLogout}
              isVisibleOnMobile={!showChatOnMobile}
            />

            {/* Main Chat Feed (Responsive: Visible on mobile if looking at a chat) */}
            <ChatArea
              selectedUser={selectedUser}
              onBackToSidebar={handleBackToSidebar}
              isVisibleOnMobile={showChatOnMobile}
            />
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

        {currentView === 'about' && (
          <div className="h-full overflow-y-auto">
            <ExperimentInfo onReturnToChat={() => setCurrentView('chat')} />
          </div>
        )}
      </div>
    </div>
  );
}
