---
title: Database-Specific Features
description: ใช้ features เฉพาะของ PostgreSQL, MySQL, และ SQLite ใน Drizzle ORM
---

## Goal

ใช้ database-specific features สำหรับ PostgreSQL, MySQL, และ SQLite

## Scope

ใช้สำหรับ features เฉพาะของแต่ละ database dialect

## Execute

### 1. PostgreSQL Features

#### JSON/JSONB

ใช้ JSON columns:

```typescript
import { pgTable, jsonb } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
  metadata: jsonb('metadata').$type<{
    preferences: Record<string, unknown>;
  }>(),
});
```

Query JSON data:

```typescript
const result = await db
  .select()
  .from(users)
  .where(sql`${users.metadata}->>'theme' = 'dark'}`);
```

#### Arrays

ใช้ array columns:

```typescript
import { array, text } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
  tags: array(text()).arrayOf('tags'),
});
```

#### Enums

ใช้ enum columns:

```typescript
import { pgEnum } from 'drizzle-orm/pg-core';

const roleEnum = pgEnum('role', ['user', 'admin', 'moderator']);

const users = pgTable('users', {
  role: roleEnum('role').notNull(),
});
```

#### Full Text Search

ใช้ full text search:

```typescript
import { sql } from 'drizzle-orm';

const result = await db
  .select()
  .from(posts)
  .where(
    sql`to_tsvector('english', ${posts.content}) @@ to_tsquery('english', ${searchQuery})`
  );
```

#### Row Level Security (RLS)

ใช้ RLS policies:

```typescript
import { pgPolicy } from 'drizzle-orm/pg-core';

const usersPolicy = pgPolicy('users_policy', {
  for: 'select',
  to: 'authenticated',
  using: sql`user_id = current_user()`,
});
```

### 2. MySQL Features

#### JSON

ใช้ JSON columns:

```typescript
import { mysqlTable, json } from 'drizzle-orm/mysql-core';

const users = mysqlTable('users', {
  metadata: json('metadata').$type<{
    preferences: Record<string, unknown>;
  }>(),
});
```

#### Sets

ใช้ set columns:

```typescript
import { set, varchar } from 'drizzle-orm/mysql-core';

const users = mysqlTable('users', {
  roles: set('roles', ['admin', 'user', 'moderator']),
});
```

### 3. SQLite Features

#### JSON

ใช้ JSON columns:

```typescript
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

const users = sqliteTable('users', {
  metadata: text('metadata', { mode: 'json' }).$type<{
    preferences: Record<string, unknown>;
  }>(),
});
```

#### FTS5 (Full Text Search)

ใช้ FTS5:

```typescript
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

const posts = sqliteTable('posts', {
  content: text('content'),
});

const postsFts = sqliteTable('posts_fts', {
  content: text('content'),
});
```

Query FTS:

```typescript
const result = await db
  .select()
  .from(postsFts)
  .where(sql`${postsFts.content} MATCH ${searchQuery}`);
```

## Rules

- ใช้ dialect-specific imports สำหรับ features เฉพาะ
- ตรวจสอบ database version compatibility
- ใช้ JSON สำหรับ flexible schema
- ใช้ enums สำหรับ type-safe string values
- ใช้ FTS สำหรับ text search performance

## Expected Outcome

- Database-specific features ที่ type-safe
- Optimal use ของ database capabilities
- Cross-database compatibility เมื่อจำเป็น
