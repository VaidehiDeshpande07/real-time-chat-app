import React, { createContext, useContext, useState, useReducer } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mockCurrentUser, mockUsers, mockConversations } from '../data/mockData';
import { appReducer, ACTIONS } from './appReducer';

// 1. Create the React Context
const AppContext = createContext(null);

// ─── Initial Reducer State ────────────────────────────────────────────────────
// Build initial unreadCounts from mockUsers static data
const initialUnreadCounts = mockUsers.reduce((acc, u) => {
  acc[u.id] = u.unreadCount || 0;
  return acc;
}, {});

const initialChatState = {
  selectedUser: mockUsers[0],
  conversations: mockConversations,
  unreadCounts: initialUnreadCounts,
  users: mockUsers,
};

/**
 * AppProvider Component
 * Supplies shared application state across all components without prop-drilling.
 *
 * Experiment 2 (preserved): useState for currentUser, currentView, showChatOnMobile
 * Experiment 3 (new):       useReducer for selectedUser, conversations, unreadCounts, users
 */
export function AppProvider({ children }) {
  // ── Experiment 2 state (preserved) ────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(mockCurrentUser);

  // Persisted view using custom hook useLocalStorage (Exp 2 custom hook)
  const [storedView, setStoredView] = useLocalStorage('nextalk-view', 'chat', 'pulsechat-view');
  const currentView = (storedView === 'login' || storedView === 'register') ? storedView : 'chat';
  const setCurrentView = setStoredView;

  // Controls mobile single-pane layout
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  // ── Experiment 3: useReducer for centralized chat state ───────────────────
  const [chatState, dispatch] = useReducer(appReducer, initialChatState);

  // ── Exp 3 Action functions (dispatch wrappers) ─────────────────────────────

  /** Select a contact — clears their unread count automatically */
  const selectUser = (user) => {
    dispatch({ type: ACTIONS.SELECT_USER, payload: { user } });
    setShowChatOnMobile(true);
  };

  /** Send a message to the currently selected user */
  const sendMessage = (text) => {
    if (!chatState.selectedUser) return;
    const newMsg = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id || 'u1',
      receiverId: chatState.selectedUser.id,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fromMe: true,
      status: 'delivered',
    };
    dispatch({
      type: ACTIONS.SEND_MESSAGE,
      payload: { userId: chatState.selectedUser.id, message: newMsg },
    });
  };

  /** Receive a message from a user (increments unread if not selected) */
  const receiveMessage = (userId, message) => {
    dispatch({ type: ACTIONS.RECEIVE_MESSAGE, payload: { userId, message } });
  };

  /** Explicitly mark all messages from a user as read */
  const markMessagesRead = (userId) => {
    dispatch({ type: ACTIONS.MARK_MESSAGES_READ, payload: { userId } });
  };

  /** Update a user's online/offline status */
  const setUserOnline = (userId, isOnline) => {
    dispatch({ type: ACTIONS.SET_ONLINE_STATUS, payload: { userId, isOnline } });
  };

  // ── Exp 4+ helpers (no-ops until backend connected) ───────────────────────
  const setUsers = (users) => {
    dispatch({ type: ACTIONS.SET_USERS, payload: { users } });
  };

  const setConversations = (conversations) => {
    dispatch({ type: ACTIONS.SET_CONVERSATIONS, payload: { conversations } });
  };

  // ── Navigation actions (preserved from Exp 1/2) ───────────────────────────
  const backToSidebar = () => setShowChatOnMobile(false);

  const logout = () => {
    localStorage.removeItem('nextalk_token');
    setCurrentView('login');
  };

  // ── Context value ──────────────────────────────────────────────────────────
  const value = {
    // Experiment 2 state (preserved)
    currentUser,
    setCurrentUser,
    currentView,
    setCurrentView,
    showChatOnMobile,
    setShowChatOnMobile,

    // Experiment 3 state (from reducer)
    selectedUser: chatState.selectedUser,
    conversations: chatState.conversations,
    unreadCounts: chatState.unreadCounts,
    users: chatState.users,

    // Experiment 3 action functions
    selectUser,
    sendMessage,
    receiveMessage,
    markMessagesRead,
    setUserOnline,

    // Experiment 4+ helpers
    setUsers,
    setConversations,

    // Navigation
    backToSidebar,
    logout,

    // Expose dispatch for advanced use (Exp 4+)
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Custom consumer hook: useAppContext
 * Clean wrapper to consume AppContext in any child component.
 */
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an <AppProvider>');
  }
  return context;
}

export default AppContext;
