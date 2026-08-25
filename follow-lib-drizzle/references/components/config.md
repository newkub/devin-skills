# Configuration (`drizzle.config.ts`)

## Minimal Config

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

## Extended Config

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './src/schema.ts',
  driver: 'pglite',
  dbCredentials: { url: './database/' },
  extensionsFilters: ['postgis'],
  schemaFilter: 'public',
  tablesFilter: '*',
  introspect: { casing: 'camel' },
  migrations: { table: '__drizzle_migrations__', schema: 'drizzle' },
  breakpoints: true,
  verbose: true,
});
```

## Dialects (6 official)

| Dialect | Value | Notes |
|---|---|---|
| PostgreSQL | `postgresql` | Most features |
| MySQL | `mysql` | |
| SQLite | `sqlite` | Local + Turso + D1 |
| SingleStore | `singlestore` | MySQL-compatible |
| MS SQL | `mssql` | |
| CockroachDB | `cockroach` | Postgres-compatible |

## Drivers (optional, only when needed)

| Driver | Dialect | Use case |
|---|---|---|
| `turso` | `sqlite` | Turso libSQL |
| `d1-http` | `sqlite` | Cloudflare D1 |
| `expo` | `sqlite` | Expo React Native |
| `aws-data-api` | `postgresql` \| `mysql` | AWS RDS Data API |
| `pglite` | `postgresql` | In-browser Postgres |

## Config Options

| Option | Type | Description |
|---|---|---|
| `dialect` | `postgresql` \| `mysql` \| `sqlite` \| `singlestore` \| `mssql` \| `cockroach` | Database dialect (required) |
| `schema` | `string` \| `string[]` | Glob path(s) to schema file(s) |
| `out` | `string` | Migration output folder (default `./drizzle`) |
| `driver` | `string` | Optional driver name (see table above) |
| `dbCredentials` | `object` | Database connection credentials |
| `schemaFilter` | `string` \| `string[]` | Schemas to introspect (default `public`) |
| `tablesFilter` | `string` \| `string[]` | Table name filter (default `*`) |
| `extensionsFilters` | `string[]` | Skip extensions (e.g. `['postgis']`) |
| `introspect.casing` | `camel` \| `snake` | Casing for pulled columns |
| `migrations.table` | `string` | Migrations journal table |
| `migrations.schema` | `string` | Schema for migrations table |
| `breakpoints` | `boolean` | Insert `--> statement-breakpoint` |
| `verbose` | `boolean` | Verbose output |
| `strict` | `boolean` | Strict mode for prompts |

## Sources

- Config: https://orm.drizzle.team/docs/drizzle-config-file
