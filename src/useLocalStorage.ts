import {
  useCallback,
  useEffect,
  useState,
} from 'react';

/**
 * useLocalStorage hook
 *
 * Persists state in localStorage with automatic JSON serialization/deserialization.
 * Supports cross-tab synchronization via the storage event and provides
 * a familiar useState-like API.
 *
 * @param key - The localStorage key
 * @param initialValue - The initial value if no stored value exists
 * @returns A tuple of [storedValue, setValue, removeValue]
 *
 * @example
 * ```tsx
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
 *
 * // Set directly
 * setTheme('dark');
 *
 * // Set with updater function
 * setTheme(prev => prev === 'light' ? 'dark' : 'light');
 *
 * // Remove from localStorage and reset to initial value
 * removeTheme();
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prevValue) => {
        const newValue =
          value instanceof Function ? value(prevValue) : value;
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(key, JSON.stringify(newValue));
          } catch (error) {
            console.error(
              `Error setting localStorage key "${key}":`,
              error,
            );
          }
        }
        return newValue;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  // Cross-tab synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          const newValue =
            event.newValue !== null
              ? (JSON.parse(event.newValue) as T)
              : initialValue;
          setStoredValue(newValue);
        } catch {
          setStoredValue(initialValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  // Re-read when key changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      } else {
        setStoredValue(initialValue);
      }
    } catch {
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
