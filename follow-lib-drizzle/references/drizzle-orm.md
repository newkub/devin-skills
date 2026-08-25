# Drizzle ORM Reference

## Version Info

- **Package**: `drizzle-orm` v0.45.2 (published ~5 months ago)
- **Dev Package**: `drizzle-kit` v0.31.10 (published ~4 months ago)
- **License**: Apache-2.0
- **Peer Dependencies**: None (zero dependencies)
- **TypeScript**: >=4.5.0 recommended
- **Source**: https://orm.drizzle.team/docs/get-started

## Install

```bash
# Bun
bun add drizzle-orm
bun add -D drizzle-kit

# PostgreSQL driver
bun add pg dotenv

# MySQL driver
bun add mysql2

# SQLite (Bun native)
# No driver needed — uses built-in `bun:sqlite`

# SQLite (Node.js)
bun add better-sqlite3

# Turso/libsql
bun add @libsql/client
```

## Configuration (`drizzle.config.ts`)

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Extended config example

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './src/schema.ts',
  driver: 'pglite',
  dbCredentials: {
    url: './database/',
  },
  extensionsFilters: ['postgis'],
  schemaFilter: 'public',
  tablesFilter: '*',
  introspect: {
    casing: 'camel',
  },
  migrations: {
    table: '__drizzle_migrations__',
    schema: 'drizzle',
  },
  breakpoints: true,
  verbose: true,
});
```

### Config options

| Option | Type | Description |
|--------|------|-------------|
| `dialect` | `postgresql` \| `mysql` \| `sqlite` \| `turso` \| `singlestore` \| `mssql` \| `cockroach` | Database dialect |
| `schema` | `string` \| `string[]` | Glob path to schema file(s) |
| `out` | `string` | Migration output folder (default: `./drizzle`) |
| `driver` | `string` | Driver name (e.g. `pglite`, `turso`) |
| `dbCredentials` | `object` | Database connection credentials |

## Schema Definition

```ts
import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
```

### SQLite schema

```ts
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer().primaryKey().autoincrement(),
  name: text().notNull(),
  email: text().notNull().unique(),
});
```

## Database Client

```ts
// PostgreSQL (node-postgres)
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(process.env.DATABASE_URL!);

// Bun + SQLite
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

// Node.js + SQLite (better-sqlite3)
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);
```

## Type Inference

```ts
// Select type (what the database returns)
type SelectUser = typeof usersTable.$inferSelect;

// Insert type (what you insert)
type InsertUser = typeof usersTable.$inferInsert;
```

## Queries

```ts
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';

// Insert
const user: typeof usersTable.$inferInsert = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};
await db.insert(usersTable).values(user);

// Select all
const users = await db.select().from(usersTable);

// Select with filter
const user = await db.select().from(usersTable).where(eq(usersTable.email, 'john@example.com'));

// Update
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, 'john@example.com'));

// Delete
await db.delete(usersTable).where(eq(usersTable.email, 'john@example.com'));
```

## CLI Commands

```bash
# Push schema directly (rapid prototyping)
bunx drizzle-kit push

# Generate migration files
bunx drizzle-kit generate

# Generate with name
bunx drizzle-kit generate --name=add_users_table

# Apply migrations
bunx drizzle-kit migrate

# Pull schema from existing database
bunx drizzle-kit pull

# Export schema
bunx drizzle-kit export

# Check for schema drift
bunx drizzle-kit check

# Open Drizzle Studio
bunx drizzle-kit studio

# Use custom config file
bunx drizzle-kit generate --config=drizzle-dev.config.ts
```

## Sources

- Get Started: https://orm.drizzle.team/docs/get-started/postgresql-new
- Config File: https://orm.drizzle.team/docs/drizzle-config-file
- Migrations: https://orm.drizzle.team/docs/migrations
