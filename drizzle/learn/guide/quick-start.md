# Quick Start

## Purpose

เริ่มต้นใช้งาน Drizzle ORM ตั้งแต่ติดตั้งจนถึง query ข้อมูล

## Scope

- Installation
- Schema Definition
- Database Connection
- Running Queries
- Generating Migrations

## Step Overview

| ขั้นตอน | คำอธิบาย | เวลา |
|---------|----------|------|
| **1. Install** | ติดตั้ง packages | 1 นาที |
| **2. Define Schema** | สร้าง schema files | 5 นาที |
| **3. Connect DB** | ตั้งค่า database connection | 2 นาที |
| **4. Run Queries** | ทดสอบ query ข้อมูล | 5 นาที |
| **5. Migrate** | สร้างและ run migrations | 3 นาที |

## Step 1: Install

```bash
bun install drizzle-orm pg
bun install -D drizzle-kit @types/pg
```

## Step 2: Define Schema

สร้างไฟล์ `src/db/schema.ts`:

```typescript
import { pgTable, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content'),
  authorId: uuid('author_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))
```

## Step 3: Connect Database

สร้างไฟล์ `src/db/index.ts`:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
})

export const db = drizzle(pool, { schema })
```

## Step 4: Run Queries

### Insert

```typescript
import { db } from './db'
import { users, posts } from './db/schema'

const newUser = await db.insert(users).values({
  name: 'John Doe',
  email: 'john@example.com',
}).returning()
```

### Select

```typescript
// Select all users
const allUsers = await db.select().from(users)

// Select with relations
const userWithPosts = await db.query.users.findMany({
  with: { posts: true },
})
```

### Update

```typescript
await db
  .update(users)
  .set({ name: 'Jane Doe' })
  .where(eq(users.id, newUser[0].id))
```

### Delete

```typescript
await db
  .delete(users)
  .where(eq(users.id, newUser[0].id))
```

## Step 5: Migrations

สร้างไฟล์ `drizzle.config.ts`:

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

สร้างและ run migrations:

```bash
# Generate migration
npx drizzle-kit generate

# Push to database
npx drizzle-kit push
```

## Project Structure

```text
my-project/
├── src/
│   └── db/
│       ├── schema.ts       # Schema definitions
│       └── index.ts        # Database connection
├── drizzle.config.ts       # Drizzle Kit config
├── .env                    # DATABASE_URL
└── package.json
```

## Summary

| ขั้นตอน | Command / Action |
|---------|-----------------|
| **Install** | `bun install drizzle-orm pg drizzle-kit` |
| **Schema** | สร้าง `schema.ts` ด้วย `pgTable()` |
| **Connect** | สร้าง `db` instance ด้วย `drizzle()` |
| **Query** | ใช้ `db.select()`, `db.insert()`, `db.update()`, `db.delete()` |
| **Migrate** | `npx drizzle-kit generate && npx drizzle-kit push` |
