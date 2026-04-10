# uhooks-js

A collection of useful React hooks for everyday use. Zero external dependencies, fully typed with TypeScript, and SSR-safe.

## Installation

```bash
npm install uhooks-js
```

or

```bash
yarn add uhooks-js
```

## Hooks

| Hook | Description |
|------|-------------|
| [`useDebounce`](#usedebounce) | Delay updating a value until input stabilizes |
| [`useLocalStorage`](#uselocalstorage) | Persist state in localStorage with cross-tab sync |
| [`useCookie`](#usecookie) | Read, write, and delete browser cookies |
| [`useDeviceDetect`](#usedevicedetect) | Detect mobile, tablet, or desktop device |
| [`useToggle`](#usetoggle) | Manage a boolean toggle state |
| [`usePrevious`](#useprevious) | Get the previous render's value |
| [`useClickOutside`](#useclickoutside) | Detect clicks outside an element |
| [`useCopyToClipboard`](#usecopytoclipboard) | Copy text to the clipboard |
| [`useMediaQuery`](#usemediaquery) | Evaluate a CSS media query in JavaScript |
| [`useWindowSize`](#usewindowsize) | Track window width and height |
| [`useFetch`](#usefetch) | Fetch data with loading and error states |
| [`useEventListener`](#useeventlistener) | Attach event listeners declaratively |

---

### useDebounce

Delays updating a value until after a specified delay has elapsed since the last change. Perfect for search inputs and API calls.

```tsx
import { useDebounce } from "uhooks-js";

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSearchResults(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

**API:**

```typescript
useDebounce<T>(value: T, delay?: number): T
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `T` | — | The value to debounce |
| `delay` | `number` | `500` | Delay in milliseconds |

---

### useLocalStorage

Persists state in `localStorage` with JSON serialization and cross-tab synchronization. API mirrors `useState`.

```tsx
import { useLocalStorage } from "uhooks-js";

function ThemeToggle() {
  const [theme, setTheme, removeTheme] = useLocalStorage("theme", "light");

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
      <button onClick={removeTheme}>Reset</button>
    </div>
  );
}
```

**API:**

```typescript
useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void]
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | `string` | The localStorage key |
| `initialValue` | `T` | Fallback value when key is not found |

Returns `[storedValue, setValue, removeValue]`.

---

### useCookie

Reads, writes, and deletes a browser cookie with full options support.

```tsx
import { useCookie } from "uhooks-js";

function AuthComponent() {
  const [token, setToken, deleteToken] = useCookie("auth_token");

  return (
    <div>
      <p>Token: {token ?? "none"}</p>
      <button onClick={() => setToken("abc123", { expires: 7, secure: true })}>
        Set Token
      </button>
      <button onClick={deleteToken}>Log Out</button>
    </div>
  );
}
```

**API:**

```typescript
useCookie(name: string): [string | null, (value: string, options?: CookieOptions) => void, () => void]
```

**`CookieOptions`:**

| Option | Type | Description |
|--------|------|-------------|
| `expires` | `Date \| number` | Expiration date or number of days |
| `path` | `string` | Cookie path (default: `"/"`) |
| `domain` | `string` | Cookie domain |
| `secure` | `boolean` | Require HTTPS |
| `sameSite` | `"Strict" \| "Lax" \| "None"` | SameSite attribute |

---

### useDeviceDetect

Detects whether the current device is mobile, tablet, or desktop using viewport width and user agent. Updates on resize.

```tsx
import { useDeviceDetect } from "uhooks-js";

function Layout() {
  const { isMobile, isTablet, isDesktop, device } = useDeviceDetect();

  if (isMobile) return <MobileLayout />;
  if (isTablet) return <TabletLayout />;
  return <DesktopLayout />;
}
```

**API:**

```typescript
useDeviceDetect(): DeviceInfo
```

```typescript
interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  device: "mobile" | "tablet" | "desktop";
}
```

Breakpoints: mobile `< 768px`, tablet `768–1024px`, desktop `> 1024px`.

---

### useToggle

Manages a boolean state with a toggle function. Useful for modals, menus, and dark mode switches.

```tsx
import { useToggle } from "uhooks-js";

function Modal() {
  const [isOpen, toggle, setOpen] = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>Toggle Modal</button>
      <button onClick={() => setOpen(false)}>Close</button>
      {isOpen && <div className="modal">Modal content</div>}
    </div>
  );
}
```

**API:**

```typescript
useToggle(initialValue?: boolean): [boolean, () => void, (value: boolean) => void]
```

Returns `[value, toggle, setValue]`.

---

### usePrevious

Returns the value from the previous render. Returns `undefined` on the first render.

```tsx
import { usePrevious } from "uhooks-js";

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Now: {count} — Before: {prevCount ?? "—"}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
```

**API:**

```typescript
usePrevious<T>(value: T): T | undefined
```

---

### useClickOutside

Calls a handler when the user clicks or taps outside the referenced element. Useful for dropdowns, modals, and popovers.

```tsx
import { useClickOutside } from "uhooks-js";

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));

  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <ul className="dropdown-menu">...</ul>}
    </div>
  );
}
```

**API:**

```typescript
useClickOutside<T extends HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void
): React.RefObject<T | null>
```

---

### useCopyToClipboard

Copies text to the clipboard and tracks the last copied value. Resets after a configurable delay.

```tsx
import { useCopyToClipboard } from "uhooks-js";

function CopyButton({ text }: { text: string }) {
  const [copiedText, copy] = useCopyToClipboard(2000);

  return (
    <button onClick={() => copy(text)}>
      {copiedText ? "Copied!" : "Copy"}
    </button>
  );
}
```

**API:**

```typescript
useCopyToClipboard(resetDelay?: number): [string | null, (text: string) => Promise<boolean>]
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `resetDelay` | `number` | `2000` | Milliseconds before `copiedText` resets to `null` |

---

### useMediaQuery

Evaluates a CSS media query string and returns whether it currently matches. Updates live.

```tsx
import { useMediaQuery } from "uhooks-js";

function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <div className={prefersDark ? "dark" : "light"}>
      {isMobile ? <MobileNav /> : <DesktopNav />}
    </div>
  );
}
```

**API:**

```typescript
useMediaQuery(query: string): boolean
```

---

### useWindowSize

Tracks the current window dimensions and updates on resize.

```tsx
import { useWindowSize } from "uhooks-js";

function ResponsiveComponent() {
  const { width, height } = useWindowSize();

  return (
    <p>Window: {width} × {height}px</p>
  );
}
```

**API:**

```typescript
useWindowSize(): WindowSize

interface WindowSize {
  width: number;
  height: number;
}
```

---

### useFetch

Fetches data from a URL with automatic loading/error state management and cleanup on unmount.

```tsx
import { useFetch } from "uhooks-js";

interface User {
  id: number;
  name: string;
}

function UserList() {
  const { data, error, loading, refetch } = useFetch<User[]>(
    "https://api.example.com/users"
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <ul>
        {data?.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

**API:**

```typescript
useFetch<T>(url: string | null | undefined, options?: RequestInit): FetchState<T>

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: () => void;
}
```

Pass `null` or `undefined` as the URL to skip fetching.

---

### useEventListener

Attaches an event listener to a target element declaratively. Cleans up automatically on unmount.

```tsx
import { useEventListener } from "uhooks-js";

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);

  useEventListener("scroll", () => {
    setScrollY(window.scrollY);
  });

  return <p>Scroll position: {scrollY}px</p>;
}
```

```tsx
// Attach to a specific element
const buttonRef = useRef<HTMLButtonElement>(null);
useEventListener("click", handleClick, buttonRef);
```

**API:**

```typescript
useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element?: React.RefObject<HTMLElement | Document | null>,
  options?: boolean | AddEventListenerOptions
): void
```

`element` defaults to `window` when not provided.

---

## Next.js Compatibility

All hooks are SSR-safe. For **Next.js 13+ (App Router)**, add `"use client"` to any component that uses hooks:

```tsx
"use client";

import { useLocalStorage } from "uhooks-js";
```

For **Pages Router** (Next.js 12 and below), use hooks directly without any directive.

## TypeScript

This library is written in TypeScript and ships type definitions out of the box. No `@types` package needed.

## Development

See the [Development Guide](DEVELOPMENT.md) for local setup, watch mode, and testing instructions.

## License

MIT

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
