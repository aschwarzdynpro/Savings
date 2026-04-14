import { useEffect, useState } from 'react';

/**
 * Returns `value` after it has been stable for `delayMs` milliseconds.
 * Used to throttle network requests on every keystroke.
 */
export function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(handle);
  }, [value, delayMs]);
  return debounced;
}
