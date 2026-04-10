import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

/**
 * State returned by the useFetch hook.
 */
export interface FetchState<T> {
  /** The fetched data, or null if not yet loaded */
  data: T | null;
  /** The error, or null if no error occurred */
  error: Error | null;
  /** Whether a fetch is in progress */
  loading: boolean;
  /** Function to manually re-trigger the fetch */
  refetch: () => void;
}

/**
 * useFetch hook
 *
 * Fetches data from a URL with automatic loading and error state management.
 * Supports AbortController for cleanup on unmount or URL change, and provides
 * a refetch function for manual re-triggering.
 *
 * @param url - The URL to fetch from, or null/undefined to skip fetching
 * @param options - Optional RequestInit options (headers, method, body, etc.)
 * @returns Fetch state with data, error, loading, and refetch
 *
 * @example
 * ```tsx
 * interface User {
 *   id: number;
 *   name: string;
 * }
 *
 * const { data, error, loading, refetch } = useFetch<User[]>(
 *   'https://api.example.com/users'
 * );
 *
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 *
 * return (
 *   <div>
 *     {data?.map(user => <p key={user.id}>{user.name}</p>)}
 *     <button onClick={refetch}>Refresh</button>
 *   </div>
 * );
 * ```
 */
export function useFetch<T>(
  url: string | null | undefined,
  options?: RequestInit,
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const optionsRef = useRef(options);
  const fetchIdRef = useRef(0);

  // Keep options ref in sync without triggering refetch
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const fetchData = useCallback(async () => {
    if (!url || typeof window === 'undefined') return;

    const currentFetchId = ++fetchIdRef.current;
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...optionsRef.current,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = (await response.json()) as T;

      // Only update state if this is still the latest fetch
      if (currentFetchId === fetchIdRef.current) {
        setData(result);
        setLoading(false);
      }
    } catch (err) {
      if (
        currentFetchId === fetchIdRef.current &&
        (err as Error).name !== 'AbortError'
      ) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    }

    return () => {
      controller.abort();
    };
  }, [url]);

  useEffect(() => {
    const cleanup = fetchData();
    return () => {
      cleanup?.then((abort) => abort?.());
    };
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
}
