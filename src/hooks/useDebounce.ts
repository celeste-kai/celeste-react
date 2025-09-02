import { useState, useEffect } from "react";

/**
 * Debounces a value - useful for search inputs to avoid excessive API calls
 * @param value The value to debounce
 * @param delay Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Alternative hook that provides more control over the debouncing process
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300,
): [T, () => void] {
  const [debounceTimer, setDebounceTimer] = useState<number | undefined>();

  const debouncedCallback = ((...args: Parameters<T>) => {
    if (debounceTimer) {
      window.clearTimeout(debounceTimer);
    }

    const newTimer = window.setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(newTimer);
  }) as T;

  const cancel = () => {
    if (debounceTimer) {
      window.clearTimeout(debounceTimer);
      setDebounceTimer(undefined);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        window.clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return [debouncedCallback, cancel];
}
