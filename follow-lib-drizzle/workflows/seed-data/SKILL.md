---
name: follow-lib-drizzle-seed-data
description: Drizzle seeding — drizzle-seed package, deterministic fixtures, reset, test seeds
argument-hint: "[scope]"
related:
  - follow-lib-drizzle
  - run-test
  - resolve-errors
---

## Goal

Seed data with `drizzle-seed` — deterministic pseudo-random fixtures, relations-aware, reset, per-env seeds

## Scope

seed/test data generation — `drizzle-seed` package (`seed()`, `reset()`), custom seed scripts, test fixture integration

## Execute

### 1. Install And Basic Seed

```bash
bun i -D drizzle-seed
```

```ts
import { seed } from 'drizzle-seed'
import * as schema from './schema'

await seed(db, schema)                       // auto-fill every table
await seed(db, schema, { count: 100 })       // rows per table
```

### 2. Controlled Generation

```ts
await seed(db, { users: schema.users, posts: schema.posts }).refine((f) => ({
  users: {
    count: 10,
    columns: { email: f.email(), name: f.fullName() },
    with: { posts: 5 },                      // 5 posts per user
  },
}))
```

- `.refine()` — per-table column generators + `with` relation counts
- `{ seed: 42 }` — deterministic output (reproducible fixtures)
- Weighted: `f.valuesFromArray`, `f.weightedRandom`, `f.date`, `f.int`, `f.loremIpsum`

### 3. Reset

```ts
import { reset } from 'drizzle-seed'
await reset(db, schema)                      // truncate all tables (FK-safe order)
```

- `reset` clears tables respecting FK order — faster than a manual truncate chain

### 4. Seed Scripts Per Env

- `scripts/seed.ts` — `bun run db:seed` npm script; dev seeds (rich fixtures) vs test seeds (minimal deterministic)
- Test integration: seed in `beforeEach`/`beforeAll` + `reset` cleanup — or per-test transaction rollback
- Exclude sensitive tables — pass only a schema subset: `seed(db, { users: schema.users })`

## Rules

- `drizzle-seed` is a dev dependency — never bundle it into the production path
- `{ seed: N }` fixed in tests — random seeds make flaky tests
- `reset` is destructive — guard with an env check (never run on a prod DATABASE_URL)
- Seed scripts validate the schema version — the seed and migration state must match

## Expected Outcome

- `bun run db:seed` fills deterministic data with complete relations
- Tests use seed/reset as reproducible fixtures
