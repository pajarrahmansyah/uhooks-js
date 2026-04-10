import {
  useCallback,
  useRef,
  useState,
} from 'react';

/**
 * useCopyToClipboard hook
 *
 * Copies text to the clipboard using the modern Clipboard API with a
 * fallback to document.execCommand for older browsers. Tracks the
 * last successfully copied text.
 *
 * @param resetDelay - Time in ms before copiedText resets to null (default: 2000)
 * @returns A tuple of [copiedText, copy]
 *
 * @example
 * ```tsx
 * const [copiedText, copy] = useCopyToClipboard();
 *
 * return (
 *   <button onClick={() => copy('Hello World!')}>
 *     {copiedText ? 'Copied!' : 'Copy'}
 *   </button>
 * );
 * ```
 */
export function useCopyToClipboard(
  resetDelay: number = 2000,
): [string | null, (text: string) => Promise<boolean>] {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (typeof navigator === 'undefined') return false;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        setCopiedText(text);

        // Reset after delay
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setCopiedText(null);
        }, resetDelay);

        return true;
      } catch {
        setCopiedText(null);
        return false;
      }
    },
    [resetDelay],
  );

  return [copiedText, copy];
}
