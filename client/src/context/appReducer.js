/**
 * appReducer.js - Experiment 3: Complex State Management
 *
 * Pure reducer function managing centralized chat state.
 * Used with React useReducer hook inside AppContext.
 */

// Action Type Constants
export const ACTIONS = {
  SELECT_USER:        'SELECT_USER',
  SEND_MESSAGE:       'SEND_MESSAGE',
  RECEIVE_MESSAGE:    'RECEIVE_MESSAGE',
  MARK_MESSAGES_READ: 'MARK_MESSAGES_READ',
  SET_ONLINE_STATUS:  'SET_ONLINE_STATUS',
  SET_ONLINE_USERS:   'SET_ONLINE_USERS',
  SET_USERS:          'SET_USERS',
  SET_CONVERSATIONS:  'SET_CONVERSATIONS',
};

/**
 * appReducer - pure function, no side effects, always returns new state.
 * State shape: { selectedUser, conversations, unreadCounts, users }
 */
export function appReducer(state, action) {
  switch (action.type) {

    // Selects a contact and clears their unread count
    case ACTIONS.SELECT_USER: {
  const { user } = action.payload;

  // Allow clearing the selected user
  if (!user) {
    return {
      ...state,
      selectedUser: null,
    };
  }

  return {
    ...state,
    selectedUser: user,
    unreadCounts: {
      ...state.unreadCounts,
      [user.id]: 0,
    },
  };
}

    // Appends an outgoing message to the conversation (preventing duplicates)
    case ACTIONS.SEND_MESSAGE: {
      const { userId, message } = action.payload;
      const existing = state.conversations[userId] || [];
      // Prevent duplicate messages with same ID
      if (message.id && existing.some((m) => m.id === message.id)) {
        return state;
      }
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [userId]: [...existing, message],
        },
      };
    }

    // Appends incoming message; increments unread if user is not selected (preventing duplicates)
    case ACTIONS.RECEIVE_MESSAGE: {
      const { userId, message } = action.payload;
      const existing = state.conversations[userId] || [];
      // Prevent duplicate messages with same ID
      if (message.id && existing.some((m) => m.id === message.id)) {
        return state;
      }
      const isCurrentUser = state.selectedUser?.id === userId;
      const prevUnread = state.unreadCounts[userId] || 0;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [userId]: [...existing, message],
        },
        unreadCounts: {
          ...state.unreadCounts,
          [userId]: isCurrentUser ? 0 : prevUnread + 1,
        },
      };
    }

    // Resets unread count to zero for a user
    case ACTIONS.MARK_MESSAGES_READ: {
      const { userId } = action.payload;
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [userId]: 0,
        },
      };
    }

    // Updates online/offline status for a single user
    case ACTIONS.SET_ONLINE_STATUS: {
      const { userId, isOnline } = action.payload;
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === userId || u._id === userId
            ? { ...u, status: isOnline ? 'online' : 'offline' }
            : u
        ),
        selectedUser:
          state.selectedUser?.id === userId || state.selectedUser?._id === userId
            ? { ...state.selectedUser, status: isOnline ? 'online' : 'offline' }
            : state.selectedUser,
      };
    }

    // Bulk updates online status based on connected users list
    case ACTIONS.SET_ONLINE_USERS: {
      const { onlineUserIds } = action.payload;
      const onlineSet = new Set(onlineUserIds);
      return {
        ...state,
        users: state.users.map((u) => {
          const isOnline = onlineSet.has(u.id) || onlineSet.has(u._id);
          return { ...u, status: isOnline ? 'online' : 'offline' };
        }),
        selectedUser: state.selectedUser
          ? {
              ...state.selectedUser,
              status:
                onlineSet.has(state.selectedUser.id) || onlineSet.has(state.selectedUser._id)
                  ? 'online'
                  : 'offline',
            }
          : null,
      };
    }

    // Replaces users list while preserving current real-time online presence
    case ACTIONS.SET_USERS: {
      const existingOnlineSet = new Set(
        state.users.filter((u) => u.status === 'online').map((u) => u.id || u._id)
      );
      const mergedUsers = action.payload.users.map((u) => {
        const uId = u.id || u._id;
        return existingOnlineSet.has(uId) ? { ...u, status: 'online' } : u;
      });
      return {
        ...state,
        users: mergedUsers,
      };
    }

    // Merges conversations (used in Experiment 4+ from API)
    case ACTIONS.SET_CONVERSATIONS: {
      return {
        ...state,
        conversations: {
          ...state.conversations,
          ...action.payload.conversations,
        },
      };
    }

    default:
      console.warn('[appReducer] Unknown action type: ' + action.type);
      return state;
  }
}
