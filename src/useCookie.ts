import {
  useCallback,
  useEffect,
  useState,
} from 'react';

/**
 * Options for setting a cookie.
 */
export interface CookieOptions {
  /** Expiration date or number of days until expiry */
  expires?: Date | number;
  /** Cookie path (default: '/') */
  path?: string;
  /** Cookie domain */
  domain?: string;
  /** Whether the cookie requires HTTPS */
  secure?: boolean;
  /** SameSite attribute */
  sameSite?: 'Strict' | 'Lax' | 'None';
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const encodedName = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split('; ');

  for (const cookie of cookies) {
    if (cookie.startsWith(encodedName)) {
      return decodeURIComponent(cookie.substring(encodedName.length));
    }
  }

  return null;
}

function buildCookieString(
  name: string,
  value: string,
  options: CookieOptions = {},
): string {
  let cookie =
    encodeURIComponent(name) + '=' + encodeURIComponent(value);

  if (options.expires !== undefined) {
    let expiresDate: Date;
    if (typeof options.expires === 'number') {
      expiresDate = new Date(Date.now() + options.expires * 864e5);
    } else {
      expiresDate = options.expires;
    }
    cookie += '; expires=' + expiresDate.toUTCString();
  }

  cookie += '; path=' + (options.path || '/');

  if (options.domain) {
    cookie += '; domain=' + options.domain;
  }

  if (options.secure) {
    cookie += '; secure';
  }

  if (options.sameSite) {
    cookie += '; samesite=' + options.sameSite;
  }

  return cookie;
}

/**
 * useCookie hook
 *
 * Manages a browser cookie with read, write, and delete capabilities.
 * Provides a simple API for cookie manipulation with full options support.
 *
 * @param name - The name of the cookie
 * @returns A tuple of [cookieValue, setCookie, deleteCookie]
 *
 * @example
 * ```tsx
 * const [token, setToken, deleteToken] = useCookie('auth_token');
 *
 * // Set a cookie with options
 * setToken('abc123', { expires: 7, secure: true, sameSite: 'Strict' });
 *
 * // Read the cookie value
 * console.log(token); // 'abc123'
 *
 * // Delete the cookie
 * deleteToken();
 * ```
 */
export function useCookie(
  name: string,
): [string | null, (value: string, options?: CookieOptions) => void, () => void] {
  const [cookieValue, setCookieValue] = useState<string | null>(() =>
    getCookie(name),
  );

  // Re-read cookie when name changes
  useEffect(() => {
    setCookieValue(getCookie(name));
  }, [name]);

  const setCookie = useCallback(
    (value: string, options?: CookieOptions) => {
      if (typeof document !== 'undefined') {
        document.cookie = buildCookieString(name, value, options);
      }
      setCookieValue(value);
    },
    [name],
  );

  const deleteCookie = useCallback(() => {
    if (typeof document !== 'undefined') {
      document.cookie = buildCookieString(name, '', {
        expires: new Date(0),
      });
    }
    setCookieValue(null);
  }, [name]);

  return [cookieValue, setCookie, deleteCookie];
}
