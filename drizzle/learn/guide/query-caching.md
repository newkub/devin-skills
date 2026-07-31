---
title: Query Caching
description: ใช้ Query Caching ใน Drizzle ORM สำหรับ improve performance
---

## Goal

ใช้ query caching สำหรับ improve performance ด้วย caching query results

## Scope

ใช้สำหรับ cache query results ด้วย custom logic หรือ predefined integrations

## Execute

### 1. Global Caching Configuration

ตั้งค่า global cache:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import { upstashCache } from 'drizzle-orm/upstash';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!);
const cache = upstashCache({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const db = drizzle(client, {
  cache: {
    global: true,
    instance: cache,
  },
});
```

### 2. Explicit Caching

ใช้ `.$withCache()` สำหรับ explicit caching:

```typescript
const result = await db
  .select()
  .from(users)
  .$withCache({
    ttl: 60, // cache for 60 seconds
  });
```

### 3. Custom Cache Implementation

สร้าง custom cache:

```typescript
import { Cache } from 'drizzle-orm';

class CustomCache implements Cache {
  async get(key: string) {
    // Implement get logic
  }

  async set(key: string, value: unknown, ttl?: number) {
    // Implement set logic
  }

  async delete(key: string) {
    // Implement delete logic
  }
}

const db = drizzle(client, {
  cache: {
    global: true,
    instance: new CustomCache(),
  },
});
```

### 4. Cache Invalidation

Invalidation strategies:

```typescript
// Time-based expiration
.$withCache({ ttl: 60 })

// Manual invalidation
await cache.delete('query-key');

// Tag-based invalidation
.$withCache({ 
  tags: ['users', 'recent'],
  ttl: 60,
})
```

## Rules

- ใช้ caching สำหรับ queries ที่ read-heavy
- ตั้งค่า TTL ที่เหมาะสมกับ data freshness requirements
- ใช้ tag-based invalidation สำหรับ complex invalidation logic
- ระวัง stale data issues
- ไม่ cache queries ที่มี side effects

## Expected Outcome

- Improved query performance
- Reduced database load
- Configurable cache strategies
