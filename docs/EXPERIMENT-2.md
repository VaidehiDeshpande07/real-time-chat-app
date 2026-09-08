# EXPERIMENT 2: React Hooks (useState, useEffect, useContext, and Custom Hooks)

---

## 1. Experiment Title & Aim
* **Title:** Implementation of React Hooks in a Modern Web Application.
* **Aim:** To implement and demonstrate the fundamental React Hooks (`useState`, `useEffect`, `useContext`) and design a custom hook (`useLocalStorage`) within the PulseChat real-time chat application, establishing clean, modular, and reusable state management without external libraries.

---

## 2. Theory & Concepts

### 2.1 What are React Hooks?
Introduced in React 16.8, **React Hooks** are functions that enable developers to use state and other React features (like lifecycle methods, context, and refs) inside functional components without writing class components.
* **Rules of Hooks:**
  1. Only call hooks at the top level (never inside loops, conditions, or nested functions).
  2. Only call hooks from React function components or custom hooks.

### 2.2 Core Hooks Explained

#### 1. `useState`
* **Concept:** Preserves local state values between component re-renders. Calling the setter function queues a re-render of the component with the new state.
* **Syntax:** `const [state, setState] = useState(initialValue);`
* **Role in PulseChat:**
  * Component-level interactive values such as search query strings, filter selections, message input values, and locally queued messages.

#### 2. `useEffect`
* **Concept:** Handles side effects (DOM mutations, timers, data fetching, subscriptions). It accepts a callback function and a dependency array.
* **Syntax:** `useEffect(() => { /* side effect */ return () => { /* cleanup */ }; }, [dependencies]);`
* **Role in PulseChat:**
  * **Document Title Synchronization:** Updates `document.title` dynamically to reflect the selected contact (e.g., `"Chat with Sarah Connor | PulseChat (Exp 2)"`).
  * **Timer Management & Cleanup:** Simulates contact typing indicators with `setTimeout` and cleans up via `clearTimeout` when switching users to prevent memory leaks.

#### 3. `useContext`
* **Concept:** Solves the **"prop-drilling"** anti-pattern by creating a shared data store that any descendant component can subscribe to without passing props down intermediate components.
* **Syntax:**
  1. `const MyContext = createContext(defaultValue);`
  2. `<MyContext.Provider value={sharedValue}> <Children /> </MyContext.Provider>`
  3. `const value = useContext(MyContext);`
* **Role in PulseChat:**
  * `AppContext.jsx` wraps the root application and distributes global state: `currentUser`, `selectedUser`, `currentView`, `showChatOnMobile`, and user selection actions.

#### 4. Custom Hook (`useLocalStorage`)
* **Concept:** A custom hook is a JavaScript function whose name starts with `use` and that may call other hooks. It allows developers to extract and reuse component logic across the application.
* **Role in PulseChat:**
  * `useLocalStorage(key, initialValue)` encapsulates reading from and writing to the browser's `window.localStorage` with safe JSON parsing and fallback error boundaries. It persists UI preferences (such as the active view tab) across page reloads.

---

## 3. Implementation Details in PulseChat

### 3.1 Custom Hook: `client/src/hooks/useLocalStorage.js`
```javascript
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // Lazy state initialization
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading key "${key}":`, error);
      return initialValue;
    }
  });

  // Synchronize state changes to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.warn(`Error writing key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
```

### 3.2 Context Provider: `client/src/context/AppContext.jsx`
```javascript
import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mockCurrentUser, mockUsers } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(mockCurrentUser);
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [currentView, setCurrentView] = useLocalStorage('pulsechat-view', 'chat');
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  const selectUser = (user) => {
    setSelectedUser(user);
    setShowChatOnMobile(true);
  };

  const backToSidebar = () => setShowChatOnMobile(false);
  const logout = () => setCurrentView('login');

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

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
```

### 3.3 Dynamic Title Side Effect with Cleanup: `client/src/App.jsx`
```javascript
useEffect(() => {
  const originalTitle = document.title;
  if (currentView === 'chat') {
    document.title = selectedUser
      ? `Chat with ${selectedUser.name} | PulseChat (Exp 2)`
      : 'PulseChat | Real-Time Chat (Exp 2)';
  } else if (currentView === 'login') {
    document.title = 'Sign In | PulseChat (Exp 2)';
  } else if (currentView === 'register') {
    document.title = 'Create Account | PulseChat (Exp 2)';
  } else if (currentView === 'about') {
    document.title = 'Experiment 2 Lab Manual | PulseChat';
  }

  return () => {
    document.title = originalTitle;
  };
}, [currentView, selectedUser]);
```

### 3.4 Timer Cleanup in Side Effect: `client/src/components/chat/ChatArea.jsx`
```javascript
useEffect(() => {
  setMessages(mockMessages);
  setIsTypingSimulated(Boolean(selectedUser?.isTyping));

  let timerId = null;
  if (selectedUser?.isTyping) {
    timerId = setTimeout(() => {
      setIsTypingSimulated(false);
    }, 2500);
  }

  // Effect cleanup prevents memory leaks on fast contact switching
  return () => {
    if (timerId) clearTimeout(timerId);
  };
}, [selectedUser?.id, selectedUser?.isTyping]);
```

---

## 4. Summary of Files Created and Modified

| Action | File | Responsibility |
| :--- | :--- | :--- |
| **Created** | `client/src/hooks/useLocalStorage.js` | Custom hook for persistent state backed by `localStorage` |
| **Created** | `client/src/context/AppContext.jsx` | Shared application context, provider, and `useAppContext` consumer hook |
| **Created** | `docs/EXPERIMENT-2.md` | College lab practical documentation |
| **Modified** | `client/src/main.jsx` | Wrapped root application with `<AppProvider>` |
| **Modified** | `client/src/App.jsx` | Subscribed to `AppContext` and implemented dynamic title `useEffect` |
| **Modified** | `client/src/components/common/Navbar.jsx` | Consumed context directly and updated Exp 2 badge |
| **Modified** | `client/src/components/chat/Sidebar.jsx` | Refactored to consume shared context while keeping local `useState` for search |
| **Modified** | `client/src/components/chat/ChatArea.jsx` | Refactored to consume context and added `useEffect` with timer cleanup |
| **Modified** | `client/src/components/common/ExperimentInfo.jsx` | Added React Hooks theory and live state inspector |
| **Modified** | `README.md` | Updated roadmap to reflect Experiment 2 completion |

---

## 5. Testing & Verification Procedure

1. **Development Server Execution:**
   ```bash
   cd client
   npm run dev
   ```
2. **Context API Verification:**
   * Open `http://localhost:5173/`.
   * Verify that contact selection updates across components without prop-drilling.
   * Verify that the top navbar reflects changes to `currentView` across all screens.
3. **`useEffect` Dynamic Title Verification:**
   * Select **Sarah Connor** in the contacts list; observe the browser tab title:
     `Chat with Sarah Connor | PulseChat (Exp 2)`.
   * Select **David Miller**; observe title changes to:
     `Chat with David Miller | PulseChat (Exp 2)`.
   * Switch to **Login View**; observe title changes to:
     `Sign In | PulseChat (Exp 2)`.
4. **`useLocalStorage` Custom Hook Persistence Verification:**
   * Switch to the **"📋 Exp 2 Overview"** tab or **"🔐 Login View"**.
   * Refresh the browser (`F5` or `Ctrl+R`).
   * Verify that the active tab remains on your chosen view instead of resetting to default.
5. **Production Build Verification:**
   ```bash
   npm run build
   ```
   * Verified: 30 modules compiled in 1.03s with 0 errors.

---

## 6. Result & Conclusion
Experiment 2 was successfully implemented. React Hooks (`useState`, `useEffect`, `useContext`) and a custom hook (`useLocalStorage`) were seamlessly integrated into the PulseChat application. All Experiment 1 layouts, styles, and responsive behaviors were preserved.

---

## 7. Viva & Practical Exam Questions

### Q1: What is the main advantage of `useContext` over passing props?
> **Answer:** `useContext` avoids "prop-drilling", where data must be passed through intermediary components that do not actually need the data themselves just to reach deeply nested children.

### Q2: Why is a cleanup function necessary in `useEffect`?
> **Answer:** Cleanup functions run before the component unmounts or before re-running the effect on dependency change. They are essential to cancel asynchronous subscriptions, clear intervals/timeouts, and avoid memory leaks.

### Q3: What makes a function a "Custom Hook"?
> **Answer:** A custom hook is a standard JavaScript function that starts with the prefix `use` and internally invokes other React hooks (such as `useState` or `useEffect`). It allows extracting and reusing stateful component logic.

### Q4: Why use lazy initialization in `useState(() => ...)`?
> **Answer:** Reading from `localStorage` is a synchronous I/O operation. Passing a callback function to `useState` ensures the initialization logic executes only once during the initial render rather than on every re-render.
