import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from 'react';

import { useLocalStorage } from '../hooks/useLocalStorage';
import { mockCurrentUser, mockUsers, mockConversations } from '../data/mockData';
import { appReducer, ACTIONS } from './appReducer';

import {
  getUsers,
  getMessages,
  sendMessage as sendMessageAPI,
} from '../services/api';
import { initSocket, getSocket, disconnectSocket } from '../services/socket';

const AppContext = createContext(null);

// Initial unread counts
const initialUnreadCounts = mockUsers.reduce((acc, user) => {
  acc[user.id] = user.unreadCount || 0;
  return acc;
}, {});

// Initial chat state
const tokenExists = typeof window !== 'undefined' && !!localStorage.getItem('token');
const initialChatState = {
  selectedUser: tokenExists ? null : mockUsers[0],
  conversations: tokenExists ? {} : mockConversations,
  unreadCounts: tokenExists ? {} : initialUnreadCounts,
  users: tokenExists ? [] : mockUsers,
};

export function AppProvider({ children }) {

  // Current logged-in user
  const storedUser = localStorage.getItem('user');

  const [currentUser, setCurrentUser] = useState(
    storedUser ? JSON.parse(storedUser) : null
  );

  // View
const [storedView, setStoredView] = useLocalStorage(
  'nextalk-view',
  'landing',
  'pulsechat-view'
);
const currentView =
  storedView === 'login' ||
  storedView === 'register' ||
  storedView === 'chat' ||
  storedView === 'landing'
    ? storedView
    : 'landing';
  const setCurrentView = setStoredView;

  // Mobile layout
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  // Reducer
  const [chatState, dispatch] = useReducer(
    appReducer,
    initialChatState
  );

  // ---------------------------------------------------------
  // LOAD USERS FROM MONGODB
  // ---------------------------------------------------------

  const fetchUsersFromDB = async (authToken) => {
    const token = authToken || localStorage.getItem('token');
    if (!token) return;

    try {
      console.log('[Frontend Auth] Fetching registered users from MongoDB...');
      const data = await getUsers(token);

      const stored = localStorage.getItem('user');
      const loggedInUser = stored ? JSON.parse(stored) : null;

      const formattedUsers = data
        .filter((user) => user._id !== loggedInUser?._id && user._id !== loggedInUser?.id)
        .map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          status: user.status || 'offline',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name
          )}`,
          role: user.role || 'USER',
          unreadCount: 0,
        }));

      console.log(`[Frontend Auth] Successfully loaded ${formattedUsers.length} real users from MongoDB`);

      dispatch({
        type: ACTIONS.SET_USERS,
        payload: {
          users: formattedUsers,
        },
      });

      // Select first real contact if available
      if (formattedUsers.length > 0) {
        dispatch({
          type: ACTIONS.SELECT_USER,
          payload: {
            user: formattedUsers[0],
          },
        });
      } else {
        dispatch({
          type: ACTIONS.SELECT_USER,
          payload: {
            user: null,
          },
        });
      }

    } catch (error) {
      console.error(
        '[Frontend Auth] Failed to load users from MongoDB:',
        error.message
      );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUsersFromDB(token);
    }
  }, []);

  // ---------------------------------------------------------
  // SOCKET.IO REAL-TIME LIFECYCLE & EVENT LISTENERS
  // ---------------------------------------------------------

  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentUserId = currentUser?._id || currentUser?.id;

    if (!token || !currentUserId) {
      disconnectSocket();
      return;
    }

    console.log('[AppContext] Initializing real-time Socket.IO connection...');
    const socket = initSocket(token);

    // Handle incoming real-time message
    const handleNewMessage = (msg) => {
      if (!msg) return;
      const senderId = String(msg.sender?._id || msg.sender);
      const receiverId = String(msg.receiver?._id || msg.receiver);
      const isFromMe = senderId === String(currentUserId);
      const partnerId = isFromMe ? receiverId : senderId;

      const formattedMsg = {
        id: msg._id,
        senderId: senderId,
        receiverId: receiverId,
        text: msg.content,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        fromMe: isFromMe,
        status: 'delivered',
      };

      if (isFromMe) {
        dispatch({
          type: ACTIONS.SEND_MESSAGE,
          payload: { userId: partnerId, message: formattedMsg },
        });
      } else {
        dispatch({
          type: ACTIONS.RECEIVE_MESSAGE,
          payload: { userId: partnerId, message: formattedMsg },
        });
      }
    };

    // Handle user presence events
    const handleUserOnline = ({ userId }) => {
      console.log(`[Socket.IO Event] Contact came online: ${userId}`);
      dispatch({
        type: ACTIONS.SET_ONLINE_STATUS,
        payload: { userId, isOnline: true },
      });
    };

    const handleUserOffline = ({ userId }) => {
      console.log(`[Socket.IO Event] Contact went offline: ${userId}`);
      dispatch({
        type: ACTIONS.SET_ONLINE_STATUS,
        payload: { userId, isOnline: false },
      });
    };

    const handleOnlineList = (onlineUserIds) => {
      console.log(`[Socket.IO Event] Received online users list:`, onlineUserIds);
      dispatch({
        type: ACTIONS.SET_ONLINE_USERS,
        payload: { onlineUserIds },
      });
    };

    socket.on('message:new', handleNewMessage);
    socket.on('user:online', handleUserOnline);
    socket.on('user:offline', handleUserOffline);
    socket.on('users:online_list', handleOnlineList);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('user:online', handleUserOnline);
      socket.off('user:offline', handleUserOffline);
      socket.off('users:online_list', handleOnlineList);
    };
  }, [currentUser?.id, currentUser?._id]);

  // ---------------------------------------------------------
  // LOAD MESSAGES FROM MONGODB
  // ---------------------------------------------------------

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token || !chatState.selectedUser?.id) return;

    const loadMessages = async () => {
      try {
        const data = await getMessages(
          chatState.selectedUser.id,
          token
        );

        const loggedInUser = JSON.parse(
          localStorage.getItem('user')
        );

        const formattedMessages = data.map((message) => ({
          id: message._id,
          senderId: message.sender._id,
          receiverId: message.receiver._id,
          text: message.content,

          timestamp: new Date(
            message.createdAt
          ).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),

          fromMe:
            message.sender._id === loggedInUser?._id,

          status: 'delivered',
        }));

        dispatch({
          type: ACTIONS.SET_CONVERSATIONS,
          payload: {
            conversations: {
              [chatState.selectedUser.id]:
                formattedMessages,
            },
          },
        });

      } catch (error) {
        console.error(
          'Failed to load messages:',
          error.message
        );
      }
    };

    loadMessages();

  }, [chatState.selectedUser?.id]);

  // ---------------------------------------------------------
  // SELECT USER
  // ---------------------------------------------------------

  const selectUser = (user) => {
    dispatch({
      type: ACTIONS.SELECT_USER,
      payload: { user },
    });

    setShowChatOnMobile(true);
  };

  // ---------------------------------------------------------
  // SEND MESSAGE (SOCKET.IO REAL-TIME WITH REST FALLBACK)
  // ---------------------------------------------------------

  const sendMessage = async (text) => {
    if (!chatState.selectedUser || !text?.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const targetUserId = chatState.selectedUser.id;
    const socket = getSocket();

    // 1. Prefer Socket.IO for real-time delivery
    if (socket && socket.connected) {
      socket.emit(
        'message:send',
        { receiver: targetUserId, content: text.trim() },
        (response) => {
          if (response && response.status === 'ok') {
            const data = response.message;
            const newMsg = {
              id: data._id,
              senderId: data.sender._id || data.sender,
              receiverId: data.receiver._id || data.receiver,
              text: data.content,
              timestamp: new Date(data.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              fromMe: true,
              status: 'delivered',
            };

            dispatch({
              type: ACTIONS.SEND_MESSAGE,
              payload: {
                userId: targetUserId,
                message: newMsg,
              },
            });
          } else {
            console.warn('[Socket.IO] Send failed, falling back to REST API:', response?.message);
            fallbackSendREST(targetUserId, text.trim(), token);
          }
        }
      );
    } else {
      // 2. Fallback to REST API if socket is not currently connected
      console.log('[AppContext] Socket disconnected, sending message via REST API...');
      await fallbackSendREST(targetUserId, text.trim(), token);
    }
  };

  const fallbackSendREST = async (targetUserId, text, token) => {
    try {
      const data = await sendMessageAPI(targetUserId, text, token);

      const newMsg = {
        id: data._id,
        senderId: data.sender._id,
        receiverId: data.receiver._id,
        text: data.content,
        timestamp: new Date(data.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        fromMe: true,
        status: 'delivered',
      };

      dispatch({
        type: ACTIONS.SEND_MESSAGE,
        payload: {
          userId: targetUserId,
          message: newMsg,
        },
      });
    } catch (error) {
      console.error('Failed to send message via REST:', error.message);
    }
  };

  // ---------------------------------------------------------
  // OTHER REDUCER FUNCTIONS
  // ---------------------------------------------------------

  const receiveMessage = (userId, message) => {
    dispatch({
      type: ACTIONS.RECEIVE_MESSAGE,
      payload: {
        userId,
        message,
      },
    });
  };

  const markMessagesRead = (userId) => {
    dispatch({
      type: ACTIONS.MARK_MESSAGES_READ,
      payload: { userId },
    });
  };

  const setUserOnline = (userId, isOnline) => {
    dispatch({
      type: ACTIONS.SET_ONLINE_STATUS,
      payload: {
        userId,
        isOnline,
      },
    });
  };

  const setUsers = (users) => {
    dispatch({
      type: ACTIONS.SET_USERS,
      payload: { users },
    });
  };

  const setConversations = (conversations) => {
    dispatch({
      type: ACTIONS.SET_CONVERSATIONS,
      payload: { conversations },
    });
  };

  // ---------------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------------

  const backToSidebar = () => {
    setShowChatOnMobile(false);
  };

  const login = (userData, token) => {
    if (token) localStorage.setItem('token', token);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentUser({
        ...userData,
        id: userData._id || userData.id,
        avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}`,
        role: userData.role || 'USER'
      });
    }
    // Fetch fresh real MongoDB users immediately
    fetchUsersFromDB(token);
    setCurrentView('chat');
  };

  const logout = () => {
    // Clean up real-time socket connection
    disconnectSocket();

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setCurrentUser(mockCurrentUser);
    dispatch({
      type: ACTIONS.SET_USERS,
      payload: { users: [] }
    });
    dispatch({
      type: ACTIONS.SELECT_USER,
      payload: { user: null }
    });
    setCurrentView('landing');
  };

  // ---------------------------------------------------------
  // CONTEXT VALUE
  // ---------------------------------------------------------

  const value = {
    currentUser,
    setCurrentUser,
    login,

    currentView,
    setCurrentView,

    showChatOnMobile,
    setShowChatOnMobile,

    selectedUser: chatState.selectedUser,
    conversations: chatState.conversations,
    unreadCounts: chatState.unreadCounts,
    users: chatState.users,

    selectUser,
    sendMessage,
    receiveMessage,
    markMessagesRead,
    setUserOnline,

    setUsers,
    setConversations,

    backToSidebar,
    logout,

    dispatch,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// ---------------------------------------------------------
// CUSTOM HOOK
// ---------------------------------------------------------

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useAppContext must be used within an <AppProvider>'
    );
  }

  return context;
}

export default AppContext;