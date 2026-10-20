# Use Case — Schema, Relations and Typed Reads

> Model users/posts with Drizzle, derive row types, and read nested data through the relational query API. Source: https://orm.drizzle.team/docs/rqb (accessed 2026-10-20)

## 1. Tables

```ts
import { pgTable, uuid, text, timestamp, boolean, index } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  published: boolean("published").notNull().default(false),
}, (t) => [index("posts_author_idx").on(t.authorId)])
```

## 2. Relations

```ts
import { relations } from "drizzle-orm"

export const usersRelations = relations(users, ({ many }) => ({ posts: many(posts) }))
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}))
```

## 3. Client with the schema (enables `db.query`)

```ts
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema"

export const db = drizzle(process.env.DATABASE_URL!, { schema })

const rows = await db.query.users.findMany({
  with: { posts: { where: eq(posts.published, true), columns: { title: true } } },
})
```

## 4. Infer row types instead of hand-writing interfaces

```ts
type User = typeof users.$inferSelect
type NewUser = typeof users.$inferInsert
```

## Pitfalls

- Declaring relations but omitting `{ schema }` in `drizzle()` → `db.query` is undefined at runtime.
- `references()` without `onDelete` → deleting a parent throws a foreign-key error in production.
- Importing `drizzle-orm/pg-core` for MySQL/SQLite → use `mysql-core`/`sqlite-core` with the matching driver.
- Hand-written row interfaces → silent drift; always `$inferSelect`/`$inferInsert`.

## Related

- `references/apis.md`
- `usecases/typed-queries-and-joins.md`
- `usecases/transactions-and-migrations.md`
