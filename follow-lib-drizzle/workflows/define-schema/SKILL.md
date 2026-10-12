---
name: follow-lib-drizzle-define-schema
description: Drizzle schema design — pg/mysql/sqlite tables, columns, indexes, relations, enums, types
argument-hint: "[dialect]"
related:
  - follow-lib-drizzle
  - run-typecheck
  - resolve-errors
---

## Goal

เขียน Drizzle schema ครบ — table/column definitions per dialect, relations, indexes, enums, custom types

## Scope

schema authoring — `pgTable`/`mysqlTable`/`sqliteTable`, column builders, `relations()`, indexes/constraints; migrations ของ schema → `migrate-schema`/`use-drizzle-kit`

## Execute

### 1. Dialect Table Builders

```ts
import { pgTable, serial, text, integer, timestamp, boolean, uuid, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core'
// mysql-core: mysqlTable, int, varchar, datetime, json, ...
// sqlite-core: sqliteTable, integer, text, blob, real, ...

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

### 2. Columns And Constraints

- `.primaryKey()`, `.notNull()`, `.unique()`, `.default()`, `.defaultNow()`, `.defaultRandom()`
- `.references(() => users.id, { onDelete: 'cascade' })` — FK
- `.array()` (pg), `jsonb`/`json`, `customType` สำหรับ unsupported types
- Composite: `primaryKey({ columns: [a, b] })`, `unique().on(a, b)`, `check()` constraints ใน callback arg

### 3. Indexes And Config Callback

```ts
export const posts = pgTable('posts', { ... }, (t) => [
  index('posts_author_idx').on(t.authorId),
  uniqueIndex('posts_slug_idx').on(t.slug),
])
```

- v0.36+: callback returns array (object syntax deprecated)
- `pgEnum('status', ['a','b'])`, sequences, views (`pgView`), materialized views

### 4. Relations

```ts
export const usersRelations = relations(users, ({ many }) => ({ posts: many(posts) }))
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}))
```

- `relations()` = สำหรับ relational queries (`db.query.*.findMany({ with: ... })`) — ไม่ใช่ DB-level constraint
- `one`/`many` + `relationName` เมื่อ ambiguous (self/multiple FKs ไป table เดียวกัน)

### 5. Schema Organization

- `src/db/schema/*.ts` per domain → `src/db/schema/index.ts` barrel — drizzle-kit `schema` points ที่ barrel
- Infer types: `typeof users.$inferSelect`, `$inferInsert` — ไม่เขียน interface ซ้ำ

## Rules

- Column builders ต้องตรง dialect (`pg-core` vs `mysql-core` vs `sqlite-core`) — ห้ามผสม
- `relations()` ≠ FK — FK ต้อง `.references()`; relations ใช้กับ query API
- Indexes/unique/checks ใน callback arg เป็น array syntax (v0.36+)
- ใช้ `$inferSelect`/`$inferInsert` — schema เป็น single source of truth ของ types

## Expected Outcome

- Schema typed per dialect ครบ tables/relations/indexes
- `$infer*` types ใช้ใน codebase — ไม่มี manual interfaces
