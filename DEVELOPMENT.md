# Development Guide

## Quick Start for Testing

### Method 1: Using the Example Next.js App (Recommended)

1. **Install library dependencies:**

   ```bash
   npm install
   ```

2. **Install example app dependencies:**

   ```bash
   cd example
   npm install
   ```

3. **Start the example app:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

The example app is configured to import directly from source (`../src/index.ts`), so any changes to the hooks are reflected immediately without needing to rebuild.

### Method 2: Test in an Existing Next.js Project

1. **Build the library:**

   ```bash
   npm run build
   ```

2. **Link the library locally:**

   ```bash
   npm link
   ```

3. **In your Next.js project:**

   ```bash
   npm link @pajarrahmansyah/uhooks-js
   ```

4. **Use in a Next.js component (remember `"use client"` for App Router):**

   ```tsx
   "use client";

   import { useState } from "react";
   import { useDebounce } from "@pajarrahmansyah/uhooks-js";

   export default function SearchPage() {
     const [search, setSearch] = useState("");
     const debouncedSearch = useDebounce(search, 500);

     return (
       <input value={search} onChange={(e) => setSearch(e.target.value)} />
     );
   }
   ```

### Method 3: Watch Mode

Run the library in watch mode while developing:

```bash
npm run dev
```

This automatically rebuilds whenever source files change.

## Using with Next.js

### App Router (Next.js 13+)

Components that use hooks must include the `"use client"` directive:

```tsx
"use client";

import { useDebounce } from "@pajarrahmansyah/uhooks-js";
import { useState, useEffect } from "react";

export default function MyComponent() {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    console.log(debouncedValue);
  }, [debouncedValue]);

  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

### Pages Router (Next.js 12 and below)

No directive needed — use hooks directly:

```tsx
import { useDebounce } from "@pajarrahmansyah/uhooks-js";
import { useState } from "react";

export default function Page() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 800);

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

## Development Workflow

1. Make changes in `src/`
2. Test in the example app (auto-reloads)
3. Or rebuild with `npm run build` and test via `npm link`

## Publishing

Before publishing to npm:

```bash
npm run build
npm publish
```

## Troubleshooting

**Error: Cannot find module 'uhooks-js'**

- Make sure you ran `npm link` inside the uhooks-js folder
- Make sure you ran `npm link @pajarrahmansyah/uhooks-js` inside your project

**Hook not updating in Next.js**

- Ensure the component has the `"use client"` directive (App Router)
- Check the browser console for errors
- Restart the Next.js dev server

**Changes not reflected**

- Restart the Next.js dev server
- Clear the `.next` folder: `rm -rf .next`
- Rebuild the library: `npm run build`
