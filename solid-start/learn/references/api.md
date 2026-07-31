# SolidStart API Reference

## Overview

SolidStart API ประกอบด้วยหลายส่วนที่ช่วยให้คุณสร้าง web applications ได้อย่างยืดหยุ่น รวมถึง routing, data fetching, server functions, และ deployment configurations

## Core APIs

### Routing API

**File-based Routing**
- ระบบ routing อิงตาม file system
- รองรับ dynamic routes ด้วย `[param]` syntax
- รองรับ nested routes และ layouts

```typescript
// src/routes/index.tsx - Home page
export default function Home() {
  return <h1>Hello World</h1>
}

// src/routes/users/[id].tsx - Dynamic route
export default function UserPage({ params }) {
  return <div>User ID: {params.id}</div>
}
```

**Route Configuration**
- ใช้ `export const route` สำหรับ config เพิ่มเติม
- กำหนด preload behavior, streaming, และ metadata

```typescript
export const route = {
  preload: true,
  preloadTimeout: 500,
}
```

### Data Fetching API

**Server Functions**
- RPC-style functions ที่ทำงานบน server
- ใช้ `createServerAction$` สำหรับ mutations
- ใช้ `createServerData$` สำหรับ data fetching

```typescript
import { createServerAction$ } from "solid-start/server"

const increment = createServerAction$(async (num: number) => {
  return num + 1
})
```

**Resource API**
- ใช้ `createResource` สำหรับ async data
- รองรับ Suspense boundaries
- สามารถ preload data ได้

```typescript
const [data] = createResource(() => fetch('/api/data').then(r => r.json()))
```

### Server API

**API Routes**
- สร้าง API endpoints ใน `src/routes/api/`
- รองรับ HTTP methods ต่างๆ (GET, POST, PUT, DELETE)
- ใช้ event object สำหรับ request/response

```typescript
// src/routes/api/users.ts
export async function GET({ request }) {
  const users = await db.users.getAll()
  return new Response(JSON.stringify(users))
}

export async function POST({ request }) {
  const body = await request.json()
  const user = await db.users.create(body)
  return new Response(JSON.stringify(user), { status: 201 })
}
```

**Request Event**
- `request` - Request object
- `params` - Route parameters
- `env` - Environment variables
- `cookies` - Cookie management
- `session` - Session data

### Client-side API

**Navigation**
- `useNavigate` - Hook สำหรับ navigation
- `useLocation` - Hook สำหรับ location
- `useParams` - Hook สำหรับ route parameters

```typescript
const navigate = useNavigate()
const location = useLocation()
const params = useParams()
```

**Meta API**
- ใช้ `Meta` component สำหรับ SEO
- กำหนด title, description, และ metadata

```typescript
import { Meta } from "solid-start"

export default function About() {
  return (
    <>
      <Meta title="About Us" description="Learn about our company" />
      <h1>About</h1>
    </>
  )
}
```

## Deployment APIs

### Platform-specific APIs

**Vercel**
- รองรับ Edge functions
- ใช้ `vercel.json` สำหรับ config

**Netlify**
- รองรับ serverless functions
- ใช้ `netlify.toml` สำหรับ config

**Cloudflare**
- รองรับ Cloudflare Pages
- ใช้ `wrangler.toml` สำหรับ config

**Node.js**
- รองรับ traditional server deployment
- ใช้ `app.config.ts` สำหรับ config

## Utility APIs

### Streaming
- ใช้ `Suspense` สำหรับ streaming
- รองรับ progressive rendering

### Error Handling
- ใช้ `ErrorBoundary` สำหรับ error handling
- สามารถ custom error pages ได้

### Loading States
- ใช้ `Show` สำหรับ loading states
- รองรับ skeleton screens

## Configuration API

**app.config.ts**
- กำหนด SSR/SSG modes
- กำหนด routing behavior
- กำหนด deployment target

```typescript
export default {
  ssr: true,
  router: {
    base: "/app"
  }
}
```

## Type Definitions

SolidStart มี TypeScript types ที่ครบถ้วน:

- `Route` - Route configuration type
- `ServerEvent` - Server event type
- `NavigationEvent` - Navigation event type
- `ResourceReturn` - Resource return type

## References

- [SolidStart API Routes](https://docs.solidjs.com/solid-start/building-your-application/api-routes)
- [SolidStart Data API](https://docs.solidjs.com/solid-start/building-your-application/data-loading)
- [SolidStart Routing](https://docs.solidjs.com/solid-start/building-your-application/routing)
