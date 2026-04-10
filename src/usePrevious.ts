import {
  useEffect,
  useRef,
} from 'react';

/**
 * usePrevious hook
 *
 * Returns the value from the previous render. Useful for comparing
 * current and previous values to determine what changed.
 *
 * @param value - The value to track
 * @returns The previous value, or undefined on the first render
 *
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 *
 * console.log(`Changed from ${prevCount} to ${count}`);
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
