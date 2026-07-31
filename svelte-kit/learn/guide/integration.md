# Integration

## Purpose

แนวทางการรวม SvelteKit กับ libraries และ services ยอดนิยม

## Scope

- Database (Drizzle, Prisma)
- Authentication
- API integration
- Deployment
- Testing

## Database

### Drizzle ORM

```bash
bun install drizzle-orm
bun install -D drizzle-kit
```

```typescript
// src/lib/server/db.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users } from '$lib/server/schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

```typescript
// src/lib/server/schema.ts
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});
```

### Prisma

```bash
bun install prisma @prisma/client
npx prisma init
```

```typescript
// prisma/schema.prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String
  posts Post[]
}

model Post {
  id      String  @id @default(cuid())
  title   String
  content String?
  author  User    @relation(fields: [authorId], references: [id])
  authorId String
}
```

```typescript
// src/lib/server/prisma.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
```

## Authentication

### Lucia Auth

```bash
bun install lucia @lucia-auth/adapter-drizzle
```

```typescript
// src/lib/server/auth.ts
import { lucia } from '$lib/server/auth';
import { drizzleAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '$lib/server/db';

const adapter = drizzleAdapter(db, ...);

export const auth = lucia({
  adapter,
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production'
    }
  }
});

export type DatabaseSession = typeof auth.$Infer.Session;
export type DatabaseUser = typeof auth.$Infer.User;
```

```typescript
// src/hooks.server.ts
import { auth } from '$lib/server/auth';

export async function handle({ event, resolve }) {
  const sessionId = event.cookies.get(auth.sessionCookieName);
  
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }
  
  const { session, user } = await auth.validateSession(sessionId);
  
  event.locals.user = user;
  event.locals.session = session;
  
  return resolve(event);
}
```

### Better Auth

```bash
bun install better-auth
```

## API Integration

### REST API

```typescript
// src/routes/api/posts/+server.ts
import { json } from '@sveltejs/kit';

export async function GET({ url, fetch }) {
  const limit = Number(url.searchParams.get('limit') ?? 10);
  const posts = await db.select().from(postsTable).limit(limit);
  
  return json(posts);
}

export async function POST({ request, fetch }) {
  const data = await request.json();
  
  const post = await db.insert(postsTable).values(data).returning();
  
  return json(post, { status: 201 });
}
```

### GraphQL

```bash
bun install graphql graphql-request
```

```typescript
// src/lib/server/graphql.ts
import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!, {
  headers: {
    authorization: `Bearer ${process.env.GRAPHQL_API_KEY}`
  }
});

export async function query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  return client.request(query, variables);
}
```

## Validation

### Zod

```bash
bun install zod
```

```typescript
// src/lib/schemas.ts
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
```

```typescript
// +page.server.ts
import { CreateUserSchema } from '$lib/schemas';
import { fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const result = CreateUserSchema.safeParse(Object.fromEntries(data));
    
    if (!result.success) {
      return fail(400, { errors: result.error.flatten() });
    }
    
    // Create user
    return { success: true };
  }
};
```

## Deployment

### Vercel

```bash
bun i -D @sveltejs/adapter-vercel
```

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: adapter({
      runtime: 'nodejs20.x'
    })
  }
};
```

### Cloudflare Pages

```bash
bun i -D @sveltejs/adapter-cloudflare
```

```javascript
import adapter from '@sveltejs/adapter-cloudflare';

export default {
  kit: {
    adapter: adapter()
  }
};
```

### Node.js

```bash
bun i -D @sveltejs/adapter-node
```

```javascript
import adapter from '@sveltejs/adapter-node';

export default {
  kit: {
    adapter: adapter()
  }
};
```

## Environment Setup

### Multiple Environments

```bash
# .env (local)
DATABASE_URL=postgres://localhost:5432/mydb
PUBLIC_API_URL=http://localhost:3000

# .env.production (production)
DATABASE_URL=postgres://...
PUBLIC_API_URL=https://api.example.com
```

### Type-safe Environment

```typescript
// src/lib/env.ts
import { env } from '$env/dynamic/private';
import { PUBLIC_API_URL } from '$env/static/public';

export const config = {
  apiUrl: PUBLIC_API_URL,
  dbUrl: env.DATABASE_URL
};
```