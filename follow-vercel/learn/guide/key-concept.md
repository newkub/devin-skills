# Vercel - Key Concepts

แนวคิดหลักและคำศัพท์สำคัญสำหรับ Vercel

## 1. Vercel Architecture

### How Vercel Works

```text
┌──────────────────────────────────────────────────────────┐
│                   Vercel Infrastructure                  │
├──────────────────────────────────────────────────────────┤
│                                                           │
│   Git Repository                                          │
│        │                                                  │
│        ▼                                                  │
│   ┌─────────────────────────────────────────┐           │
│   │          Build System                   │           │
│   │  ┌───────────┐  ┌───────────┐          │           │
│   │  │  Builder  │  │  Builder  │  ...     │           │
│   │  └───────────┘  └───────────┘          │           │
│   └─────────────────────┬───────────────────┘           │
│                         │                                │
│                         ▼                                │
│   ┌─────────────────────────────────────────┐           │
│   │          Edge Network                   │           │
│   │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │           │
│   │  │ PoP │ │ PoP │ │ PoP │ │ PoP │  ...  │           │
│   │  └─────┘ └─────┘ └─────┘ └─────┘      │           │
│   └─────────────────────────────────────────┘           │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Purpose |
|-----------|---------|
| **Build System** | Compiles and optimizes code |
| **Edge Network** | Delivers content from nearby servers |
| **Serverless Functions** | Runs API endpoints |
| **Preview URLs** | Shows deploys for each PR |

## 2. Deployment Model

### Deployment Types

```text
┌─────────────────────────────────────────────────┐
│              Deployment Types                    │
├─────────────────────────────────────────────────┤
│                                                  │
│  Production Deployment                           │
│  └── Always on production URL                    │
│  └── Triggered by push to main                   │
│                                                  │
│  Preview Deployment                              │
│  └── One per pull request                        │
│  └── Ephemeral URL                               │
│  └── Auto-deleted on PR close                    │
│                                                  │
│  Local Development                               │
│  └── `vercel dev` for local testing             │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Deployment Flow

```text
git push
     │
     ├──▶ Build Triggered
     │         │
     │         ▼
     │   ┌─────────────────┐
     │   │  Framework     │
     │   │  Detection     │
     │   └────────┬────────┘
     │            │
     │            ▼
     │   ┌─────────────────┐
     │   │  Build Command │
     │   │  (bun run build)│
     │   └────────┬────────┘
     │            │
     │            ▼
     │   ┌─────────────────┐
     │   │  Output        │
     │   │  Generation    │
     │   └────────┬────────┘
     │            │
     │            ▼
     └───▶ Deploy to Edge
```

## 3. Framework Support

### Auto-Detected Frameworks

| Framework | Detection |
|-----------|-----------|
| Next.js | `next.config.js` |
| React | `package.json` |
| Vue | `vue.config.js` |
| Svelte | `svelte.config.js` |
| Nuxt | `nuxt.config.js` |
| Astro | `astro.config.mjs` |
| Gatsby | `gatsby-config.js` |

### Custom Framework

```toml
# vercel.json
{
  "framework": null,
  "buildCommand": "bun run build",
  "outputDirectory": "dist"
}
```

## 4. Serverless Functions

### API Routes

```typescript
// pages/api/users.ts (Pages Router)
export default function handler(req, res) {
  res.status(200).json({ users: [] });
}

// app/api/users/route.ts (App Router)
export async function GET() {
  return Response.json({ users: [] });
}
```

### Edge Functions

```typescript
// Middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Custom-Header', 'value');
  return response;
}
```

## 5. Environment Variables

### Variable Scopes

| Scope | Access | Example |
|-------|--------|---------|
| System | All environments | `VERCEL_URL` |
| Production | Production only | `DATABASE_URL` |
| Preview | Preview only | `PREVIEW_API_KEY` |
| Development | Local only | `LOCAL_DB` |

### Usage in Code

```typescript
// Access in serverless function
const apiKey = process.env.API_KEY;

// Access in build command
// Use in vercel.json or package.json scripts
```

## 6. Regions & Edge

### Deployment Regions

```typescript
// vercel.json - specify regions
{
  "regions": ["iad1", "sfo1", "hnd1"]
}

// Serverless function regions
export const config = {
  regions: ['iad1', 'sfo1']
};
```

### Edge Runtime

```typescript
// Edge function (runs at edge)
export const runtime = 'edge';

export default async function handler(req) {
  return new Response('Hello from Edge!');
}
```

## 7. Build Configuration

### vercel.json Schema

```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" }
  ]
}
```

### Environment Variables

```json
{
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "BUILD_TOKEN": "@build-token"
    }
  }
}
```

## 8. Caching Strategy

### Automatic Caching

```text
┌─────────────────────────────────────────────────┐
│              Vercel Cache Layers                 │
├─────────────────────────────────────────────────┤
│                                                  │
│  Browser Cache                                   │
│  └── By Cache-Control headers                    │
│                                                  │
│  Edge Cache (CDN)                                │
│  └── Static assets cached globally              │
│                                                  │
│  Build Cache                                     │
│  └── bun packages, node_modules                 │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Incremental Static Regeneration

```typescript
// pages/posts/[id].tsx
export async function getStaticProps({ params }) {
  const post = await fetchPost(params.id);

  return {
    props: { post },
    revalidate: 60 // Revalidate every 60 seconds
  };
}
```

## 9. Integrations

### Database Connectors

```text
PostgreSQL    → @vercel/postgres
MySQL         → @vercel/mysql
Redis         → @upstash/redis
MongoDB       → mongodb/atlas
Prisma        → prisma/prisma
Drizzle       → drizzle-orm/drizzle
```

### Monitoring

```text
Sentry        → Error tracking
Datadog       → APM
New Relic     → Performance
Vercel Analytics → Built-in
```

## 10. CLI Commands

### Essential Commands

| Command | Description |
|---------|-------------|
| `vercel` | Deploy to preview |
| `vercel --prod` | Deploy to production |
| `vercel dev` | Start local dev server |
| `vercel logs` | View function logs |
| `vercel env pull` | Pull env vars locally |
| `vercel secrets add` | Add secret |

## สรุป

- Vercel ใช้ git-based deployment model
- Auto-detects frameworks และ builds automatically
- Serverless functions รองรับหลาย runtimes
- Edge network สำหรับ low latency
- Built-in preview deployments สำหรับ PRs
