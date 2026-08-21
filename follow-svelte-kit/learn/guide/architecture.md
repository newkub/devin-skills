# Architecture

## Purpose

อธิบายสถาปัตยกรรมภายในของ SvelteKit

## Overview

SvelteKit ใช้ adapter pattern เพื่อรองรับ deployment targets ที่หลากหลาย โดยมี server-side และ client-side rendering pipelines

## Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    SvelteKit App                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐       │
│  │   Routes    │   │   Loaders   │   │   Actions   │       │
│  │ +page.svelte│   │+page.server │   │+page.server │       │
│  └─────────────┘   └─────────────┘   └─────────────┘       │
│         │                 │                 │               │
│         └─────────────────┼─────────────────┘               │
│                           ▼                                 │
│                  ┌─────────────────┐                        │
│                  │   Renderer      │                        │
│                  │   (SSR/Hydrate)│                        │
│                  └─────────────────┘                        │
│                           │                                 │
│         ┌─────────────────┼─────────────────┐               │
│         ▼                 ▼                 ▼               │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐        │
│  │   Adapter   │   │   Adapter   │   │   Adapter   │        │
│  │   (Vercel)  │   │   (Node)    │   │(Cloudflare) │        │
│  └─────────────┘   └─────────────┘   └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Request Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                    Request Lifecycle                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Request arrives                                          │
│         │                                                   │
│         ▼                                                   │
│  2. hooks.server.ts (handle)                                │
│         │                                                   │
│         ▼                                                   │
│  3. Match route                                              │
│         │                                                   │
│         ▼                                                   │
│  4. Load functions (+page.server.ts, +page.ts)              │
│         │                                                   │
│         ▼                                                   │
│  5. Render page (+page.svelte)                               │
│         │                                                   │
│         ▼                                                   │
│  6. hooks.server.ts (afterHandle)                           │
│         │                                                   │
│         ▼                                                   │
│  7. Response sent                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── app.html              # HTML template
├── app.d.ts             # Global TypeScript types
├── hooks.server.ts      # Server hooks
├── routes/              # File-based routes
│   ├── +layout.svelte   # Root layout
│   ├── +page.svelte     # Page component
│   ├── +page.server.ts  # Server load + actions
│   ├── +page.ts         # Universal load
│   ├── +error.svelte    # Error page
│   └── api/              # API routes
│       └── +server.ts   # API handler
└── service-worker.ts     # Service worker
```

## Adapter Architecture

### Adapter Interface

```typescript
interface Adapter {
  name: string;
  adapt(
    builder: Builder,
    config: Config
  ): Promise<void>;
}

interface Builder {
  // Generate server response
  respond(
    request: Request,
    options: {
      platform?: object;
    }
  ): Promise<Response>;
  
  // Write files to output
  writeFile(path: string, data: string): Promise<void>;
  writeDir(path: string): Promise<void>;
  
  // Generate prerendered pages
  generatePreloadHash(): string;
  prerender(options: PrerenderOptions): Promise<void>;
}
```

### Built-in Adapters

| Adapter | Target | Notes |
|---------|--------|-------|
| adapter-auto | Auto-detect | Best for most cases |
| adapter-node | Node.js | Express, Fastify |
| adapter-static | Static hosting | Netlify, Vercel |
| adapter-vercel | Vercel | Edge functions |
| adapter-cloudflare | Cloudflare | Workers, Pages |
| adapter-deno | Deno Deploy | Deno runtime |

## Rendering Modes

### SSR (Server-Side Rendering)

```typescript
// +page.server.ts - runs on server
export async function load({ params }) {
  return { post: await getPost(params.slug) };
}
```

### CSR (Client-Side Rendering)

```typescript
// +page.ts - runs on client (after hydration)
export async function load({ fetch }) {
  const res = await fetch('/api/posts');
  return { posts: await res.json() };
}
```

### Universal Load

```typescript
// +page.ts - runs on both
export async function load({ fetch, depends }) {
  depends('app:posts'); // Invalidate with invalidate()
  
  const res = await fetch('/api/posts');
  return { posts: await res.json() };
}
```

## Hooks System

### Server Hooks

```typescript
// hooks.server.ts
export async function handle({ event, resolve }) {
  // Before response
  const response = await resolve(event);
  // After response
  return response;
}
```

### Init Hook (Startup)

```typescript
// hooks.server.ts
export async function initialize() {
  // Runs once at startup
}
```

## Stores & State

### Page Store

```typescript
import { page } from '$app/stores';
import { navigating } from '$app/stores';
import { updated } from '$app/stores';

// Reactive
$: console.log($page.params);
```

### State (Svelte 5)

```typescript
// $app/state
import { page, navigating } from '$app/state';

// Reactive (no $ needed)
console.log(page.params);
```

## Type System

### App Types

```typescript
// app.d.ts
declare global {
  namespace App {
    interface Locals {
      user: User | null;
    }
    interface PageData {
      title?: string;
    }
    interface Error {
      message: string;
    }
    interface Platform {
      env?: Record<string, string>;
    }
  }
}
```

### Page Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Data Flow                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  +page.server.ts ──> load ──> data ──> Page                │
│         │                                        │          │
│         │                                        ▼          │
│    server-only                        +page.svelte          │
│    data access                       (receives data)        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```