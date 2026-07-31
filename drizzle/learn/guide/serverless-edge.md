---
title: Serverless and Edge Runtime Support
description: ใช้ Drizzle ORM บน serverless และ edge runtimes เช่น Cloudflare Workers, D1, Turso
---

## Goal

ใช้ Drizzle ORM บน serverless และ edge runtimes

## Scope

ใช้สำหรับ Cloudflare Workers, D1, Turso, Neon, PlanetScale, และ edge environments

## Execute

### 1. Cloudflare D1

ติดตั้ง driver:

```bash
bun add drizzle-orm
```

ใช้กับ D1 binding:

```typescript
import { drizzle } from 'drizzle-orm/d1';
import { schema } from './schema';

export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.DB, { schema });
    
    const users = await db.select().from(users);
    
    return Response.json(users);
  },
};
```

ตั้งค่า wrangler.toml:

```toml
[[d1_databases]]
binding = "DB"
database_name = "my-db"
database_id = "your-database-id"
```

### 2. Turso (libsql)

ติดตัอ:

```bash
bun add @libsql/client
```

ใช้กับ Turso:

```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { schema } from './schema';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client, { schema });
```

### 3. Neon (HTTP)

ติดตั้ง:

```bash
bun add @neondatabase/serverless
```

ใช้กับ Neon HTTP:

```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { schema } from './schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });
```

### 4. PlanetScale

ติดตั้ง:

```bash
bun add @planetscale/database
```

ใช้กับ PlanetScale:

```typescript
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { schema } from './schema';

const connection = connect({
  url: process.env.DATABASE_URL,
});

const db = drizzle(connection, { schema });
```

### 5. Edge Runtime with Next.js

ใช้กับ Next.js Edge API routes:

```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { schema } from './schema';

export const runtime = 'edge';

export async function GET() {
  const db = drizzle(sql, { schema });
  const users = await db.select().from(users);
  
  return Response.json(users);
}
```

### 6. Bun Runtime

ใช้กับ Bun native SQLite:

```typescript
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { schema } from './schema';

const sqlite = new Database('db.sqlite');
const db = drizzle(sqlite, { schema });
```

## Rules

- เลือก driver ที่เหมาะสมกับ platform
- ใช้ HTTP drivers สำหรับ serverless environments
- ตั้งค่า connection pooling สำหรับ high traffic
- ใช้ environment variables สำหรับ credentials
- ตรวจสอบ cold start performance

## Expected Outcome

- Drizzle ORM ที่ทำงานบน serverless/edge runtimes
- Efficient connection management
- Low latency database operations
