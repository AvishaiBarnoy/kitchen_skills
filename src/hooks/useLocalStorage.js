import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage persistence with error handling
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The initial value if nothing is stored
 * @returns {[value, setValue]} - Returns the stored value and a setter function
 */
export function useLocalStorage(key, initialValue) {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook for persisting skill points with automatic saving
 * @param {Array} skills - Array of skill objects to validate against
 * @returns {[points, setPoints, resetPoints]} - Points object, setter, and reset function
 */
export function usePersistedSkillPoints(skills) {
  const [points, setPoints] = useLocalStorage('skillPoints', {});
  
  const resetPoints = () => {
    setPoints({});
  };
  
  return [points, setPoints, resetPoints];
}

export default useLocalStorage;