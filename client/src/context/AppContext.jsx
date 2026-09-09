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

const AppContext = createContext(null);

// Initial unread counts
const initialUnreadCounts = mockUsers.reduce((acc, user) => {
  acc[user.id] = user.unreadCount || 0;
  return acc;
}, {});

// Initial chat state
const initialChatState = {
  selectedUser: mockUsers[0],
  conversations: mockConversations,
  unreadCounts: initialUnreadCounts,
  users: mockUsers,
};

export function AppProvider({ children }) {

  // Current logged-in user
  const storedUser = localStorage.getItem('user');

  const [currentUser, setCurrentUser] = useState(
    storedUser ? JSON.parse(storedUser) : mockCurrentUser
  );

  // View
  const [storedView, setStoredView] = useLocalStorage(
    'nextalk-view',
    'chat',
    'pulsechat-view'
  );

  const currentView =
    storedView === 'login' || storedView === 'register'
      ? storedView
      : 'chat';

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

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return;

    const loadUsers = async () => {
      try {
        const data = await getUsers(token);

        const loggedInUser = JSON.parse(
          localStorage.getItem('user')
        );

        const formattedUsers = data
          .filter((user) => user._id !== loggedInUser?._id)
          .map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            status: user.status,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name
            )}`,
            role: 'User',
            unreadCount: 0,
          }));

        dispatch({
          type: ACTIONS.SET_USERS,
          payload: {
            users: formattedUsers,
          },
        });

        // Select first real user
        if (formattedUsers.length > 0) {
          dispatch({
            type: ACTIONS.SELECT_USER,
            payload: {
              user: formattedUsers[0],
            },
          });
        }

      } catch (error) {
        console.error(
          'Failed to load users:',
          error.message
        );
      }
    };

    loadUsers();
  }, []);

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
  // SEND MESSAGE TO MONGODB
  // ---------------------------------------------------------

  const sendMessage = async (text) => {
    if (!chatState.selectedUser) return;

    const token = localStorage.getItem('token');

    if (!token) return;

    try {
      const data = await sendMessageAPI(
        chatState.selectedUser.id,
        text,
        token
      );

      const newMsg = {
        id: data._id,

        senderId: data.sender._id,
        receiverId: data.receiver._id,

        text: data.content,

        timestamp: new Date(
          data.createdAt
        ).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),

        fromMe: true,
        status: 'delivered',
      };

      dispatch({
        type: ACTIONS.SEND_MESSAGE,
        payload: {
          userId: chatState.selectedUser.id,
          message: newMsg,
        },
      });

    } catch (error) {
      console.error(
        'Failed to send message:',
        error.message
      );
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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setCurrentUser(mockCurrentUser);
    setCurrentView('login');
  };

  // ---------------------------------------------------------
  // CONTEXT VALUE
  // ---------------------------------------------------------

  const value = {
    currentUser,
    setCurrentUser,

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