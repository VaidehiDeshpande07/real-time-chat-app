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
      return {
        ...state,
        selectedUser: user,
        unreadCounts: {
          ...state.unreadCounts,
          [user.id]: 0,
        },
      };
    }

    // Appends an outgoing message to the conversation
    case ACTIONS.SEND_MESSAGE: {
      const { userId, message } = action.payload;
      const existing = state.conversations[userId] || [];
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [userId]: [...existing, message],
        },
      };
    }

    // Appends incoming message; increments unread if user is not selected
    case ACTIONS.RECEIVE_MESSAGE: {
      const { userId, message } = action.payload;
      const existing = state.conversations[userId] || [];
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

    // Updates online/offline status for a user
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

    // Replaces users list (used in Experiment 4+ from API)
    case ACTIONS.SET_USERS: {
      return {
        ...state,
        users: action.payload.users,
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
