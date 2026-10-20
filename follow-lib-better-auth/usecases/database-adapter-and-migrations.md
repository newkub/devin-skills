# Use Case — Database Adapter and Schema Migrations

> Point Better Auth at the project's own database with an adapter, then generate and apply the auth tables through the official CLI. Source: https://www.better-auth.com/docs/adapters/drizzle (accessed 2026-10-20)

## 1. Wrap the existing client in an adapter

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
});
```

`provider` is `"pg" | "mysql" | "sqlite"` and must match the actual driver. A `pg` adapter over a Neon HTTP client works; a `sqlite` adapter over Postgres connects and then fails on the first write.

Passing `schema` lets the adapter map the auth models onto your table names instead of guessing them.

## 2. Generate the tables into your own migration flow

```bash
npx @better-auth/cli generate
npx @better-auth/cli migrate
```

`generate` writes the schema for the configured adapter without touching the database — commit that output and let the project's normal migration tool create the tables. `migrate` applies it directly and is the one to use for a fresh local database only.

Never run `migrate` against production: it bypasses the review and rollback path the rest of the schema goes through.

## 3. Tune session lifetime and cookie caching

```ts
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
});
```

`updateAge` decides how often the session row is touched; a value shorter than the request interval makes every page view a write. `cookieCache` avoids a database read per request, at the cost of up to `maxAge` seconds of staleness after a revocation.

If a banned user must lose access immediately, set `cookieCache` off for that flow or call the revoke API and expire the cookie.

## 4. Keep the schema in sync after upgrades

1. `/run-install` — bump `better-auth`
2. `npx @better-auth/cli generate` — diff the output against the committed schema
3. Review the diff for new columns or tables, then run the project migration
4. `/run-test` — sign up, sign in, sign out against the migrated database

A minor upgrade can add a column; skipping the generate step leaves a runtime error on the first new-code path.

## 5. Verify

1. `/run-dev` — sign-up writes a user row and a session row
2. Restart the server and reload — the session still resolves (the adapter is actually reading the database)
3. `/run-build` — the auth module is not bundled into client code; check that no server-only import leaked
4. `/deep-test database` — the auth tables exist with the expected indexes, including the unique constraint on email

## Pitfalls

- Two adapters in one project (Drizzle for auth, Prisma for the app) writing the same tables.
- Running `migrate` in CI against a shared database, which applies unreviewed schema changes.
- `provider` copied from a template without checking the driver; the failure appears on write, not on connect.
- Forgetting `schema` and letting the adapter use default table names that clash with existing ones.
- Turning on `cookieCache` and expecting immediate revocation in the same request cycle.

## Related

- `references/apis.md`
- `best-practices/better-auth.md`
- `usecases/email-password-and-session.md`
- `usecases/two-factor-and-passkey-plugins.md`
