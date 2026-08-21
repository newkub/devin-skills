# Features

Features และ capabilities ของ Next.js

## File-based Routing

```
app/
├── page.tsx              → /
├── about/page.tsx         → /about
├── blog/[slug]/page.tsx   → /blog/:slug
└── (auth)/login/page.tsx  → /login
```

## Server Actions

```tsx
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  await db.post.create({ data: { title } });
  revalidatePath('/blog');
}
```

## Data Fetching

| Pattern | Syntax |
|---------|--------|
| Server Component fetch | `fetch('/api/data')` |
| Route Handler | `app/api/route.ts` |
| Server Actions | `action()` |

## Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
/>
```

## Metadata API

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Page',
  description: 'Page description',
  openGraph: {
    images: ['/og-image.jpg']
  }
};
```

## Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
```
