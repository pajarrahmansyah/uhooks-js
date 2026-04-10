import {
  useCallback,
  useState,
} from 'react';

/**
 * useToggle hook
 *
 * Manages a boolean state with a convenient toggle function.
 * Useful for modals, dropdowns, dark mode switches, and any
 * on/off state management.
 *
 * @param initialValue - The initial boolean value (default: false)
 * @returns A tuple of [value, toggle, setValue]
 *
 * @example
 * ```tsx
 * const [isOpen, toggleOpen, setOpen] = useToggle(false);
 *
 * // Toggle the value
 * <button onClick={toggleOpen}>Toggle Menu</button>
 *
 * // Set explicitly
 * <button onClick={() => setOpen(true)}>Open</button>
 * <button onClick={() => setOpen(false)}>Close</button>
 * ```
 */
export function useToggle(
  initialValue: boolean = false,
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const set = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return [value, toggle, set];
}
