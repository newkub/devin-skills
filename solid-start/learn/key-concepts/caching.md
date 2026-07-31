# Caching

## แนวคิดหลัก

SolidStart มี built-in caching strategies สำหรับปรับปรุง performance โดยอัตโนมัติ cache requests, data, และ responses เพื่อลด load และปรับปรุง UX

## Caching Levels

### 1. Request Deduplication

SolidStart จะ deduplicate requests อัตโนมัติ:

```typescript
// หลาย components เรียก data เดียวกัน
const data1 = useRouteData();
const data2 = useRouteData();
// เรียก API เพียงครั้งเดียว
```

### 2. Route Data Caching

Cache route data ด้วย `cache`:

```typescript
import { cache } from "@solidjs/router";

export function routeData() {
  return cache(async () => {
    const res = await fetch("/api/data");
    return res.json();
  }, "data");
}
```

### 3. Server-Side Caching

Cache responses บน server:

```typescript
// routes/api/data.ts
export async function GET() {
  const cached = await cache.get("data");
  if (cached) {
    return json(cached);
  }

  const data = await fetchData();
  await cache.set("data", data, { ttl: 60 });
  return json(data);
}
```

## Caching Strategies

### Time-Based Caching

Cache ตามเวลาที่กำหนด:

```typescript
export function routeData() {
  return cache(async () => {
    const res = await fetch("/api/data");
    return res.json();
  }, "data", { ttl: 60 }); // 60 seconds
}
```

### Stale-While-Revalidate (SWR)

ใช้ stale data ขณะ revalidate:

```typescript
import { createQuery } from "@tanstack/solid-query";

export function usePosts() {
  return createQuery(() => ({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/posts");
      return res.json();
    },
    staleTime: 5000, // 5 seconds
    refetchOnWindowFocus: true,
  }));
}
```

### Cache-First Strategy

ใช้ cache ก่อน ถ้ามี:

```typescript
export async function getData() {
  const cached = await cache.get("data");
  if (cached) {
    return cached;
  }

  const data = await fetchData();
  await cache.set("data", data);
  return data;
}
```

## HTTP Caching

### Cache-Control Headers

กำหนด cache headers:

```typescript
export async function GET() {
  const data = await fetchData();
  return json(data, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600"
    }
  });
}
```

### ETag

ใช้ ETag สำหรับ validation:

```typescript
export async function GET(req: Request) {
  const data = await fetchData();
  const etag = generateETag(data);

  const ifNoneMatch = req.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304 });
  }

  return json(data, {
    headers: { "ETag": etag }
  });
}
```

### Last-Modified

ใช้ Last-Modified สำหรับ validation:

```typescript
export async function GET(req: Request) {
  const data = await fetchData();
  const lastModified = data.updatedAt;

  const ifModifiedSince = req.headers.get("if-modified-since");
  if (ifModifiedSince && new Date(ifModifiedSince) >= lastModified) {
    return new Response(null, { status: 304 });
  }

  return json(data, {
    headers: { "Last-Modified": lastModified.toUTCString() }
  });
}
```

## Browser Caching

### Service Worker Caching

ใช้ service worker สำหรับ offline caching:

```typescript
// sw.js
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll([
        "/",
        "/about",
        "/styles.css",
        "/app.js"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### Local Storage Caching

Cache data ใน local storage:

```typescript
export function useCachedData<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = createSignal<T | null>(null);

  onMount(async () => {
    const cached = localStorage.getItem(key);
    if (cached) {
      setData(JSON.parse(cached));
    }

    const fresh = await fetcher();
    setData(fresh);
    localStorage.setItem(key, JSON.stringify(fresh));
  });

  return data;
}
```

## Server Caching

### Redis Caching

ใช้ Redis สำหรับ distributed caching:

```typescript
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedData(key: string) {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  const data = await fetchData();
  await redis.setex(key, 3600, JSON.stringify(data));
  return data;
}
```

### In-Memory Caching

ใช้ in-memory cache:

```typescript
const cache = new Map<string, { data: any; expiry: number }>();

export function getCache(key: string) {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

export function setCache(key: string, data: any, ttl: number = 3600) {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl * 1000
  });
}
```

## Cache Invalidation

### Manual Invalidation

Invalid cache ด้วย code:

```typescript
import { invalidateCache } from "@solidjs/router";

export function invalidateData() {
  invalidateCache("data");
}
```

### Time-Based Invalidation

Invalid cache ตามเวลา:

```typescript
export function routeData() {
  return cache(async () => {
    const res = await fetch("/api/data");
    return res.json();
  }, "data", { ttl: 60 }); // Auto invalidate after 60s
}
```

### Event-Based Invalidation

Invalid cache เมื่อ event เกิดขึ้น:

```typescript
export function onDataUpdate() {
  invalidateCache("data");
  // Trigger re-fetch
}
```

## CDN Caching

### Cloudflare Cache

กำหนด cache rules ใน Cloudflare:

```toml
# wrangler.toml
[build]
command = "bun run build"

[site]
bucket = "./public"

[[rules]]
type = "Text"
glob = "*.json"
fallthrough = true

[rules.cache]
max_age = 3600
stale_while_revalidate = 86400
```

### Vercel Cache

กำหนด cache headers สำหรับ Vercel:

```typescript
export async function GET() {
  const data = await fetchData();
  return json(data, {
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
```

## Caching Best Practices

| Practice | คำอธิบาย |
|----------|-----------|
| **Cache wisely** | Cache เฉพาะ data ที่เหมาะสม |
| **Set TTL** | กำหนด TTL ที่เหมาะสม |
| **Invalidation** | มี strategy สำหรับ invalidation |
| **Monitor** | Monitor cache hit rate |
| **Test** | Test caching behavior |

## Cache Keys

### Hierarchical Keys

ใช้ hierarchical keys:

```typescript
const cacheKey = `user:${userId}:posts`;
const userPosts = await cache.get(cacheKey);
```

### Tag-Based Caching

ใช้ tags สำหรับ grouping:

```typescript
await cache.set("post:1", data, { tags: ["posts"] });
await cache.set("post:2", data, { tags: ["posts"] });

// Invalidate all posts
await cache.invalidateTags(["posts"]);
```

## Common Patterns

### Cache Aside Pattern

```typescript
export async function getData(key: string) {
  const cached = await cache.get(key);
  if (cached) {
    return cached;
  }

  const data = await fetchData(key);
  await cache.set(key, data);
  return data;
}
```

### Write-Through Pattern

```typescript
export async function setData(key: string, data: any) {
  await cache.set(key, data);
  await database.set(key, data);
}
```

### Write-Behind Pattern

```typescript
export async function setData(key: string, data: any) {
  await cache.set(key, data);
  // Async write to database
  queueTask(() => database.set(key, data));
}
```

## Performance Monitoring

### Cache Hit Rate

Monitor cache hit rate:

```typescript
let hits = 0;
let misses = 0;

export async function getCache(key: string) {
  const cached = await cache.get(key);
  if (cached) {
    hits++;
    return cached;
  }
  misses++;
  return null;
}

export function getCacheHitRate() {
  return hits / (hits + misses);
}
```

### Cache Size

Monitor cache size:

```typescript
export function getCacheSize() {
  return cache.size;
}

export function clearCache() {
  cache.clear();
}
```
