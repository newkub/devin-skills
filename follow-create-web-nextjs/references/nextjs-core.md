# Next.js 16 Reference

## Install

```bash
# Create new project
bun create next-app@latest my-app --yes

# Manual install
bun add next@latest react@latest react-dom@latest
```

## Version Info

- Latest stable: `16.3.2` (as of Aug 2026)
- Node.js >= 20.9 (Node.js 18 no longer supported)
- TypeScript >= 5.1
- React 19.2 stable (View Transitions, `useEffectEvent()`)
- Turbopack is the stable default bundler for both dev and build
- React Compiler stable
- Peer dependencies: `react`, `react-dom`

## CLI Commands

```bash
bun dev              # Start dev server (Turbopack default)
bun run build        # Build for production (Turbopack default)
bun run start        # Start production server
next dev --webpack   # Use Webpack instead of Turbopack
next build --webpack # Build with Webpack
```

## package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

## Project Structure

```
app/
  layout.tsx    # Root layout (required, must contain <html> and <body>)
  page.tsx      # Home page
  globals.css   # Global styles
  error.tsx     # Error boundary
  loading.tsx   # Loading UI
  not-found.tsx # 404 page
  api/          # API routes (route handlers)
  (group)/      # Route groups (no URL impact)
components/
hooks/
lib/
types/
public/
```

## Root Layout

`app/layout.tsx`:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## Server And Client Components

Server Components are the default. Use `'use client'` for interactivity:

`app/ui/counter.tsx`:

```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

### Passing Data From Server To Client

`app/[id]/page.tsx`:

```tsx
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)

  return <LikeButton likes={post.likes} />
}
```

### Reducing Client Bundle Size

Push `'use client'` to the deepest component:

```tsx
// Client Component
import Search from './search'
// Server Component
import Logo from './logo'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <Search />
      </nav>
      <main>{children}</main>
    </>
  )
}
```
