# Drivers And Clients

## Install Commands

```bash
# Core
bun add drizzle-orm
bun add -D drizzle-kit

# PostgreSQL
bun add pg dotenv              # node-postgres
bun add @neondatabase/serverless  # Neon (HTTP + WebSocket)
bun add @vercel/postgres        # Vercel Postgres
bun add @planetscale/database   # PlanetScale MySQL

# MySQL
bun add mysql2

# SQLite
bun add better-sqlite3          # Node.js
# Bun: native `bun:sqlite` — no install needed

# Turso / libSQL
bun add @libsql/client

# AWS Data API
bun add @aws-sdk/client-rds-data

# PGLite (in-browser Postgres)
bun add @electric-sql/pglite
```

## Client Initialization

### PostgreSQL (node-postgres)

```ts
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL!);
```

### Neon HTTP (serverless, single queries)

```ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });
```

### Neon WebSocket (interactive transactions)

```ts
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

### Vercel Postgres

```ts
import { drizzle } from 'drizzle-orm/vercel-pg';
import { sql } from '@vercel/postgres';

const db = drizzle(sql);
```

### PlanetScale (MySQL serverless)

```ts
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';

const db = drizzle(connect({ url: process.env.DATABASE_URL }));
```

### Bun + SQLite

```ts
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const sqlite = new Database('sqlite.db');
sqlite.exec('PRAGMA journal_mode = WAL;'); // performance
const db = drizzle(sqlite);
```

### Node.js + SQLite (better-sqlite3)

```ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database('sqlite.db');
sqlite.pragma('journal_mode = WAL');
const db = drizzle(sqlite);
```

### Turso / libSQL

```ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ url: process.env.DATABASE_URL!, authToken: process.env.DATABASE_TOKEN });
const db = drizzle(client);
```

### Cloudflare D1

```ts
import { drizzle } from 'drizzle-orm/d1';
const db = drizzle(env.DB); // env from wrangler bindings
```

### PGLite (in-browser)

```ts
import { drizzle } from 'drizzle-orm/pglite';
import { PGlite } from '@electric-sql/pglite';

const client = new PGlite('./database/');
const db = drizzle(client);
```

## Schema Binding For RQB

ส่ง `schema` object เข้า `drizzle()` เพื่อเปิดใช้ `db.query.*` relational API:

```ts
import * as schema from './db/schema';
const db = drizzle(process.env.DATABASE_URL!, { schema });
```

## Sources

- Connect: https://orm.drizzle.team/docs/get-started
- Serverless: https://orm.drizzle.team/docs/get-started-postgresql
