import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mockCurrentUser, mockUsers } from '../data/mockData';

// 1. Create the React Context
const AppContext = createContext(null);

/**
 * AppProvider Component
 * Supplies shared application state across all components without prop-drilling.
 */
export function AppProvider({ children }) {
  // Shared state: currentUser (for role and profile info)
  const [currentUser, setCurrentUser] = useState(mockCurrentUser);

  // Shared state: selected contact for active conversation
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);

  // Shared state: persisted currentView using our custom hook useLocalStorage
  // This stores the user's active view preference ('chat' | 'login' | 'register' | 'about')
  const [currentView, setCurrentView] = useLocalStorage('pulsechat-view', 'chat');

  // Shared state: controls mobile single-pane layout (sidebar vs active chat)
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  // Helper action: selecting a contact in the sidebar
  const selectUser = (user) => {
    setSelectedUser(user);
    setShowChatOnMobile(true);
  };

  // Helper action: navigating back to the contact list on mobile
  const backToSidebar = () => {
    setShowChatOnMobile(false);
  };

  // Helper action: logging out (returns to login view)
  const logout = () => {
    setCurrentView('login');
  };

  const value = {
    currentUser,
    setCurrentUser,
    selectedUser,
    setSelectedUser,
    currentView,
    setCurrentView,
    showChatOnMobile,
    setShowChatOnMobile,
    users: mockUsers,
    selectUser,
    backToSidebar,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Custom consumer hook: useAppContext
 * Clean, type-friendly wrapper to consume AppContext in any child component.
 */
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an <AppProvider>');
  }
  return context;
}

export default AppContext;
