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

### Cache Components (Next.js 16)

Use `'use cache'` directive for explicit opt-in caching:

```tsx
'use cache'

import { getPost } from '@/lib/data'

export default async function Post({ id }: { id: string }) {
  const post = await getPost(id)
  return <h1>{post.title}</h1>
}
```

Cache invalidation APIs:

```tsx
import { updateTag, revalidateTag } from 'next/cache'

// Update and revalidate in one call
await updateTag('posts')

// Revalidate only
await revalidateTag('posts')
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

## Proxy (formerly Middleware)

Next.js 16 replaces `middleware.ts` with `proxy.ts` to clarify the network boundary:

```tsx
// proxy.ts
import { NextResponse } from 'next/server'

export function proxy(request: Request) {
  // Auth checks only — no database calls
  const token = request.headers.get('authorization')
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}
```

- Runs on Edge Runtime
- Use for auth checks only
- No database calls

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
- https://nextjs.org/blog/next-16
- https://nextjs.org/blog/next-16-3
