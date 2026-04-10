import {
  useEffect,
  useRef,
} from 'react';

/**
 * useClickOutside hook
 *
 * Detects clicks outside of a referenced element and calls the provided
 * handler. Useful for closing dropdowns, modals, popovers, and other
 * overlay components.
 *
 * @param handler - Callback function invoked when a click outside is detected
 * @returns A ref to attach to the target element
 *
 * @example
 * ```tsx
 * const dropdownRef = useClickOutside(() => {
 *   setIsOpen(false);
 * });
 *
 * return (
 *   <div ref={dropdownRef}>
 *     <DropdownContent />
 *   </div>
 * );
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const handlerRef = useRef(handler);

  // Keep handler ref up to date without re-attaching listeners
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handlerRef.current(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, []);

  return ref;
}
