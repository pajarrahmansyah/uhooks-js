# uhooks-js

A collection of useful React hooks for everyday use.

## Installation

```bash
npm install uhooks-js
```

or

```bash
yarn add uhooks-js
```

## Hooks

### useDebounce

Delays updating a value until after a specified delay has elapsed since the last time the value changed. Perfect for search inputs, API calls, or any scenario where you want to wait for user input to stabilize before taking action.

#### Usage

```tsx
import { useDebounce } from "uhooks-js";
import { useState, useEffect } from "react";

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // This will only run 500ms after the user stops typing
      console.log("Searching for:", debouncedSearchTerm);
      // Make your API call here
      fetchSearchResults(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

#### API

```typescript
useDebounce<T>(value: T, delay?: number): T
```

**Parameters:**

- `value`: The value to debounce (can be any type)
- `delay`: The delay in milliseconds (default: 500ms)

**Returns:**

- The debounced value

#### Examples

**Search with API calls:**

```tsx
function UserSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 800);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (debouncedQuery) {
      fetch(`/api/users?q=${debouncedQuery}`)
        .then((res) => res.json())
        .then((data) => setResults(data));
    }
  }, [debouncedQuery]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
      />
      <ul>
        {results.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Form validation:**

```tsx
function UsernameInput() {
  const [username, setUsername] = useState("");
  const debouncedUsername = useDebounce(username, 600);
  const [isAvailable, setIsAvailable] = useState(null);

  useEffect(() => {
    if (debouncedUsername) {
      checkUsernameAvailability(debouncedUsername).then((available) =>
        setIsAvailable(available),
      );
    }
  }, [debouncedUsername]);

  return (
    <div>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Choose username"
      />
      {isAvailable !== null && (
        <span>{isAvailable ? "✓ Available" : "✗ Taken"}</span>
      )}
    </div>
  );
}
```

## Next.js Compatibility

This library works perfectly with Next.js! For **Next.js 13+ (App Router)**, make sure to use the `"use client"` directive in components that use hooks:

```tsx
"use client";

import { useDebounce } from "uhooks-js";
import { useState } from "react";

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

For **Pages Router** (Next.js 12 and below), you can use it directly without any directive.

## Development & Testing

Want to test this library locally or contribute? Check out the [Development Guide](DEVELOPMENT.md) for:

- How to test with the included Next.js example app
- How to use `npm link` for local testing
- Watch mode for development

Quick start:

```bash
# Install dependencies
npm install

# Run example app
cd example
npm install
npm run dev
```

## TypeScript

This library is written in TypeScript and includes type definitions out of the box.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
