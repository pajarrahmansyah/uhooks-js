import {
  useEffect,
  useState,
} from 'react';

/**
 * Window dimensions.
 */
export interface WindowSize {
  /** Window inner width in pixels */
  width: number;
  /** Window inner height in pixels */
  height: number;
}

/**
 * useWindowSize hook
 *
 * Tracks the current window dimensions and updates on resize.
 *
 * @returns The current window width and height
 *
 * @example
 * ```tsx
 * const { width, height } = useWindowSize();
 *
 * return (
 *   <p>Window size: {width} x {height}</p>
 * );
 * ```
 */
export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>(() => {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 };
    }
    return { width: window.innerWidth, height: window.innerHeight };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
}
