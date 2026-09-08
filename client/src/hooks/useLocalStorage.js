import { useState, useEffect } from 'react';

/**
 * Custom hook: useLocalStorage
 * Demonstrates extracting reusable state-persistence logic using React Hooks (useState + useEffect).
 *
 * @param {string} key - The key name under which data is stored in localStorage.
 * @param {*} initialValue - The fallback initial value if no entry exists in storage.
 * @returns {[*, Function]} A tuple containing the stored value and a state setter function.
 */
export function useLocalStorage(key, initialValue) {
  // useState with lazy initialization to read from localStorage only once on mount
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error);
      return initialValue;
    }
  });

  // useEffect to safely synchronize state updates with localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.warn(`[useLocalStorage] Error writing key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
