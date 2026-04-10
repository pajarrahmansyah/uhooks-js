import {
  useEffect,
  useRef,
} from 'react';

/**
 * useEventListener hook
 *
 * Attaches an event listener to a target element declaratively.
 * The handler is stored in a ref so the listener is not re-attached
 * on every render. Cleans up automatically on unmount.
 *
 * @param eventName - The name of the event to listen for
 * @param handler - The event handler callback
 * @param element - The target element (defaults to window)
 * @param options - Optional AddEventListenerOptions
 *
 * @example
 * ```tsx
 * // Listen to window scroll
 * useEventListener('scroll', (event) => {
 *   console.log('Window scrolled', window.scrollY);
 * });
 *
 * // Listen to a specific element
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * useEventListener('click', handleClick, buttonRef);
 * ```
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions,
): void;

export function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: React.RefObject<HTMLElement | null>,
  options?: boolean | AddEventListenerOptions,
): void;

export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: React.RefObject<Document | null>,
  options?: boolean | AddEventListenerOptions,
): void;

export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element?: React.RefObject<HTMLElement | Document | null>,
  options?: boolean | AddEventListenerOptions,
): void {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement = element?.current ?? (typeof window !== 'undefined' ? window : null);

    if (!targetElement) return;

    const listener = (event: Event) => {
      handlerRef.current(event);
    };

    targetElement.addEventListener(eventName, listener, options);
    return () => {
      targetElement.removeEventListener(eventName, listener, options);
    };
  }, [eventName, element, options]);
}
