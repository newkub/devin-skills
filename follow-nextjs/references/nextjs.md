# Next.js 15 Reference

## Install

```bash
# Create new project
bun create next-app@latest my-app --yes

# Manual install
bun add next@latest react@latest react-dom@latest
```

## Version Info

- Latest stable: `15.5.x` (as of 2026)
- Node.js >= 20.9
- React 19 stable (App Router uses React canary built-in)
- Turbopack is the default bundler (stable for dev, beta for build)
- Peer dependencies: `react`, `react-dom`

## CLI Commands

```bash
bun dev              # Start dev server (Turbopack default)
bun run build        # Build for production
bun run start        # Start production server
next dev --webpack   # Use Webpack instead of Turbopack
next build --turbopack # Build with Turbopack (beta)
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

## Data Fetching

`params` and `searchParams` are `Promise` in Next.js 15+ (must `await`):

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)
  return <h1>{post.title}</h1>
}
```

### fetch() Caching

- `fetch()` is NOT cached by default in Next.js 15+
- Use explicit cache options:

```tsx
// Time-based revalidation
fetch(url, { next: { revalidate: 3600 } })

// Tag-based revalidation
fetch(url, { next: { tags: ['posts'] } })

// Static data
fetch(url, { cache: 'force-cache' })

// Always fresh
fetch(url, { cache: 'no-store' })
```

## generateMetadata

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)
  return { title: post.title }
}
```

## generateStaticParams

```tsx
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ id: post.id }))
}
```

## Server Actions

```tsx
'use server'

import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
})

export async function submitForm(formData: FormData) {
  const parsed = schema.parse({
    name: formData.get('name'),
  })
  // Handle mutation
  return { success: true }
}
```

## create-next-app Options

```bash
bun create next-app@latest my-app --ts --app --turbopack --tailwind --src-dir --import-alias "@/*"
```

Key flags: `--ts`, `--app`, `--turbopack` (default), `--react-compiler`, `--tailwind`, `--src-dir`, `--biome`.

## Supported Browsers

Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+.

## Source

- https://nextjs.org/docs/app/getting-started/installation
- https://nextjs.org/docs/app/getting-started/server-and-client-components
- https://nextjs.org/blog/next-15
- https://nextjs.org/blog/next-15-5
