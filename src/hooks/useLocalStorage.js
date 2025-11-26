import { useState, useEffect } from 'react';

/**
 * A custom hook that manages state synchronized with localStorage.
 * 
 * @param {string} key The key to store the value under in localStorage
 * @param {any} initialValue The initial value to use if no value is found in localStorage
 * @returns {[any, Function]} A stateful value, and a function to update it
 */
function useLocalStorage(key, initialValue) {
    // Get from local storage then
    // parse stored json or if none return initialValue
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.error(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;
