# How It Works

## Next.js Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Request Flow                                                │
│  ───────────                                                │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌──────────┐  │
│  │ Request │───►│ Route   │───►│ Server  │───►│ Response │  │
│  │         │    │ Matching│    │ Render  │    │          │  │
│  └─────────┘    └─────────┘    └─────────┘    └──────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Caching Layers                                       │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐  │    │
│  │  │ Request │  │  Data   │  │  Full   │  │ Static │  │    │
│  │  │  Memo   │  │  Cache  │  │ Route   │  │  Cache │  │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Rendering Modes

### Static Generation (SSG)

```
Build Time                    Request Time
    │                              │
    ▼                              ▼
┌─────────────────┐         ┌─────────────────┐
│ Generate HTML   │         │ Serve Pre-built │
│ from Page.tsx  │─────────►│     HTML        │
└─────────────────┘         └─────────────────┘
```

### Server-Side Rendering (SSR)

```
Request Time
    │
    ▼
┌─────────────────┐         ┌─────────────────┐
│ Render Page.tsx │──Data───►│   Fetch Data    │
│   on Server     │         │   (DB/API)      │
└────────┬────────┘         └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Send HTML     │
│   to Browser    │
└─────────────────┘
```

### Incremental Static Regeneration (ISR)

```
Initial Request              Subsequent Requests
    │                              │
    ▼                              ▼
┌─────────────────┐         ┌─────────────────┐
│ Generate Page   │         │ Serve Cached    │
│ & Cache         │◄────────│ (for X seconds) │
└─────────────────┘         └─────────────────┘
         │
         │ (after timeout)
         ▼
┌─────────────────┐
│  Regenerate     │
│  in Background  │
└─────────────────┘
```

## App Router Structure

```
┌─────────────────────────────────────────────────────┐
│                    app/                              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  layout.tsx ─────────────────────────────────────    │
│  │         └── Root layout (required)               │
│  │                                                  │
│  page.tsx ─────────────────────────────────────     │
│  │         └── Renders at route path               │
│  │                                                  │
│  loading.tsx ────────────────────────────────────   │
│  │         └── Loading UI (streaming)              │
│  │                                                  │
│  error.tsx ─────────────────────────────────────    │
│  │         └── Error UI                            │
│  │                                                  │
│  not-found.tsx ─────────────────────────────────    │
│  │         └── 404 UI                              │
│  │                                                  │
│  route.ts ───────────────────────────────────────   │
│  │         └── API Route Handler                   │
│  │                                                  │
│  (auth)/ ───────────────────────────────────────   │
│  │         └── Route Group (no URL prefix)         │
│  │                                                  │
│  blog/[slug]/ ──────────────────────────────────    │
│                └── Dynamic Segment                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Server Components

```
┌─────────────────────────────────────────────────────┐
│              Component Architecture                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Server Components                Client Components   │
│  ┌───────────────────┐           ┌────────────────┐ │
│  │ ✅ Database access │           │ ✅ useState    │ │
│  │ ✅ File system     │           │ ✅ useEffect   │ │
│  │ ✅ API calls       │           │ ✅ Event       │ │
│  │ ✅ No JS bundle    │           │   listeners    │ │
│  │ ✅ Default         │           │ ✅ interactivity│ │
│  └───────────────────┘           └────────────────┘ │
│              │                           │          │
│              │      Can import           │          │
│              └──────────┬────────────────┘          │
│                         │                           │
│                         ▼                           │
│                ┌─────────────────┐                  │
│                │ Can receive     │                  │
│                │ children prop   │                  │
│                └─────────────────┘                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Data Fetching Pattern

```typescript
// Sequential data fetching
async function Page() {
  const user = await getUser();
  const posts = await getPosts(user.id); // Waits for user first
  return <UserProfile user={user} posts={posts} />;
}

// Parallel data fetching
async function Page() {
  const [user, posts] = await Promise.all([
    getUser(),
    getPosts()
  ]);
  return <UserProfile user={user} posts={posts} />;
}

// Streaming with Suspense
import { Suspense } from 'react';

async function Page() {
  return (
    <>
      <Hero />
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>
    </>
  );
}
```