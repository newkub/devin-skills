# Configuration

## Purpose

Drizzle Kit configuration options for `drizzle.config.ts`

## Config File

Create `drizzle.config.ts` in project root:

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `schema` | `string` | Yes | Path to schema files directory |
| `out` | `string` | Yes | Path to migrations output directory |
| `dialect` | `'postgresql' \| 'mysql' \| 'sqlite'` | Yes | Database dialect |
| `dbCredentials` | `object` | Yes | Database connection credentials |
| `verbose` | `boolean` | No | Enable verbose logging |
| `strict` | `boolean` | No | Enable strict mode |
| `breakpoints` | `boolean` | No | Enable breakpoints for migration generation |
| `migrationsTable` | `string` | No | Custom migrations table name |

## Database Credentials

### PostgreSQL

```typescript
dbCredentials: {
  url: process.env.DATABASE_URL,        // Connection URL
  // OR individual parameters
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'mydb',
}
```

### MySQL

```typescript
dbCredentials: {
  url: process.env.DATABASE_URL,
  // OR
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'mydb',
}
```

### SQLite

```typescript
dbCredentials: {
  url: './drizzle.db',
}
```

## Optional Settings

```typescript
export default {
  schema: './src/db/schema',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
  
  verbose: true,
  strict: true,
  migrationsTable: '__drizzle_migrations',
  breakpoints: true,
} satisfies Config;
```

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
```

## Type Safety

Use `satisfies Config` to ensure type checking:

```typescript
import type { Config } from 'drizzle-kit';

export default {
  // TypeScript will error if missing required options
} satisfies Config;
```

## Summary

| Dialect | Connection |
|---------|------------|
| **PostgreSQL** | `url` or `host/port/user/password/database` |
| **MySQL** | `url` or `host/port/user/password/database` |
| **SQLite** | `url` (file path) |