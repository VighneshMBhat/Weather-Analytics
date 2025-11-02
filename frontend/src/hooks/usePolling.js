import React, { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Custom hook for polling with interval
 * Automatically pauses when page is hidden to save resources
 * 
 * @param {Function} fn - Function to call on each interval
 * @param {number} interval - Interval in milliseconds (default: 60000ms = 1 minute)
 * @param {boolean} enabled - Whether polling is enabled (default: true)
 */
export function usePolling(fn, interval = 60000, enabled = true) {
  const savedCallback = useRef();
  const intervalIdRef = useRef(null);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = fn;
  }, [fn]);

  // Set up the interval
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const tick = async () => {
      if (savedCallback.current) {
        await savedCallback.current();
      }
    };

    // Call immediately on mount
    tick();

    // Then set up interval
    intervalIdRef.current = setInterval(tick, interval);

    // Handle page visibility to pause polling when page is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, clear interval
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
      } else {
        // Page is visible again, restart interval
        tick(); // Call immediately
        intervalIdRef.current = setInterval(tick, interval);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [interval, enabled]);
}

/**
 * Custom hook for debouncing a value
 * 
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default usePolling;
