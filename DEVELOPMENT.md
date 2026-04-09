# Development Guide

## Quick Start for Testing

### Method 1: Using Example Next.js App (Recommended)

1. **Install dependencies untuk library:**

   ```bash
   npm install
   ```

2. **Install dependencies untuk example:**

   ```bash
   cd example
   npm install
   ```

3. **Jalankan example app:**

   ```bash
   npm run dev
   ```

4. **Buka browser:**
   ```
   http://localhost:3000
   ```

Example app sudah configured untuk import langsung dari source (`../src/index.ts`), jadi setiap perubahan di hook langsung keliatan tanpa perlu rebuild!

### Method 2: Test di Project Next.js Yang Sudah Ada

1. **Build library:**

   ```bash
   npm run build
   ```

2. **Link library secara lokal:**

   ```bash
   npm link
   ```

3. **Di project Next.js kamu:**

   ```bash
   npm link uhooks-js
   ```

4. **Pakai di komponen Next.js (jangan lupa `"use client"`):**

   ```tsx
   "use client";

   import { useState } from "react";
   import { useDebounce } from "uhooks-js";

   export default function SearchPage() {
     const [search, setSearch] = useState("");
     const debouncedSearch = useDebounce(search, 500);

     return (
       <input value={search} onChange={(e) => setSearch(e.target.value)} />
     );
   }
   ```

### Method 3: Watch Mode untuk Development

Jalankan library dalam watch mode sambil develop:

```bash
npm run dev
```

Ini akan rebuild otomatis setiap ada perubahan di source code.

## Cara Pakai di Next.js

### App Router (Next.js 13+)

Komponen yang pakai hooks harus punya directive `"use client"`:

```tsx
"use client";

import { useDebounce } from "uhooks-js";
import { useState, useEffect } from "react";

export default function MyComponent() {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    // Do something with debounced value
    console.log(debouncedValue);
  }, [debouncedValue]);

  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

### Pages Router (Next.js 12 dan sebelumnya)

Bisa langsung pakai tanpa `"use client"`:

```tsx
import { useDebounce } from "uhooks-js";
import { useState } from "react";

export default function Page() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 800);

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

## Testing Workflow

1. Buat perubahan di `src/useDebounce.ts`
2. Test di example app (auto-reload)
3. Atau rebuild dengan `npm run build`
4. Test di project kamu yang pakai `npm link`

## Publishing

Sebelum publish ke npm:

```bash
npm run build
npm publish
```

## Troubleshooting

**Error: Cannot find module 'uhooks-js'**

- Pastikan sudah run `npm link` di folder uhooks-js
- Pastikan sudah run `npm link uhooks-js` di project kamu

**Hook tidak update di Next.js**

- Pastikan komponen punya `"use client"` directive (App Router)
- Check console browser untuk errors
- Restart Next.js dev server

**Changes tidak keliatan**

- Restart Next.js dev server
- Clear `.next` folder: `rm -rf .next`
- Rebuild library: `npm run build`
