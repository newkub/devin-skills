# Schema Definition

## Dialect Imports

| Dialect | Import path | Table builder |
|---|---|---|
| PostgreSQL | `drizzle-orm/pg-core` | `pgTable` |
| MySQL | `drizzle-orm/mysql-core` | `mysqlTable` |
| SQLite | `drizzle-orm/sqlite-core` | `sqliteTable` |
| SingleStore | `drizzle-orm/singlestore-core` | `singlestoreTable` |
| MS SQL | `drizzle-orm/mssql-core` | `mssqlTable` |
| CockroachDB | `drizzle-orm/cockroach-core` | `pgTable` (Postgres-compatible) |

## PostgreSQL Schema

```ts
import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp().defaultNow().notNull(),
});
```

## SQLite Schema

```ts
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer().primaryKey().autoincrement(),
  name: text().notNull(),
  email: text().notNull().unique(),
});
```

## MySQL Schema

```ts
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int().autoincrement().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
```

## Relations

```ts
import { relations } from 'drizzle-orm';

export const usersRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable),
}));

export const postsRelations = relations(postsTable, ({ one }) => ({
  author: one(usersTable, { fields: [postsTable.authorId], references: [usersTable.id] }),
}));
```

## Type Inference

```ts
type SelectUser = typeof usersTable.$inferSelect;
type InsertUser = typeof usersTable.$inferInsert;
```

## Sources

- Schema: https://orm.drizzle.team/docs/sql-schema-declaration
- Relations: https://orm.drizzle.team/docs/relations
