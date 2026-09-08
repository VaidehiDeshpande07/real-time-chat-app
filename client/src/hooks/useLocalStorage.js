import { useState, useEffect } from 'react';

/**
 * Custom hook: useLocalStorage
 * Demonstrates extracting reusable state-persistence logic using React Hooks (useState + useEffect).
 * Supports backward-compatible migration from legacy keys without breaking saved preferences.
 *
 * @param {string} key - The primary key name under which data is stored in localStorage.
 * @param {*} initialValue - The fallback initial value if no entry exists in storage.
 * @param {string|null} [legacyFallbackKey=null] - Optional legacy key to migrate from if primary key is not yet set.
 * @returns {[*, Function]} A tuple containing the stored value and a state setter function.
 */
export function useLocalStorage(key, initialValue, legacyFallbackKey = null) {
  // useState with lazy initialization to read from localStorage only once on mount
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return initialValue;
      }
      // Check for primary key first
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }

      // Backward-compatibility: if primary key not found, check and migrate legacyFallbackKey
      if (legacyFallbackKey) {
        const legacyItem = window.localStorage.getItem(legacyFallbackKey);
        if (legacyItem !== null) {
          const parsed = JSON.parse(legacyItem);
          // Migrate value forward to new key
          window.localStorage.setItem(key, JSON.stringify(parsed));
          return parsed;
        }
      }

      return initialValue;
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
