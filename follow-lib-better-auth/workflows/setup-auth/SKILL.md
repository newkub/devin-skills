---
name: follow-lib-better-auth-setup-auth
description: Install Better Auth, create auth.ts and the database adapter, ready to use
argument-hint: "[framework-or-adapter]"
related:
  - follow-lib-better-auth
  - follow-lib-drizzle
  - follow-secret-manager
  - learn
  - resolve-errors
---

## Goal

Install Better Auth, create `auth.ts` with a database adapter and mount the handler so sign in/up works — first-time setup only

## Scope

- Use when the project has no Better Auth yet (if it exists already → verify only)
- Covers: install, env vars, `auth.ts`, database adapter, handler mounting
- Does not cover providers/plugins config — do `workflows/config-providers/SKILL.md` instead

## Execute

### 1. Check Precondition

> Goal: check the environment and current state before setup

1. Read `package.json` — if `better-auth` is already there → skip to verify
2. Identify the framework (Next.js, Hono, Elysia, TanStack Start, etc.) and the ORM/database the project uses
3. Check the env vars `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` — if missing → create the secret (≥32 chars, high entropy) then store it via `/follow-secret-manager`, never commit

### 2. Install

> Goal: install `better-auth` and the adapter matching the ORM

1. Run `bun add better-auth` (or the package manager matching the lockfile)
2. Install the adapter if not using built-in Kysely — e.g. `bun add @better-auth/drizzle-adapter` (run `/follow-lib-drizzle` together if Drizzle isn't set up yet)
3. Confirm `better-auth` is a runtime dependency

### 3. Create auth.ts

> Goal: a minimal working config

1. Create `auth.ts` (or `src/lib/auth.ts` per the project structure) with `betterAuth()` then export `auth`
2. Define the database — matching the adapter: `new Database()`/`new Pool()` for Kysely, or `drizzleAdapter(db)` for Drizzle
3. Enable `emailAndPassword: { enabled: true }` as the baseline (social providers are done in `config-providers`)
4. Set `trustedOrigins` to only the origins actually used
5. Run `bunx auth@latest generate` (creates the schema) or `bunx auth@latest migrate` (Kysely adapter) — for the Drizzle adapter, generate via drizzle-kit as usual

### 4. Mount Handler And Client

> Goal: the auth routes can answer requests

1. Mount the auth handler per framework: `toNextJsHandler(auth)`, `toElysiaHandler(auth)`, etc. at `/api/auth/*` — always the same base path
2. Create the client with `createAuthClient` from `better-auth/react` (or `/vue`, `/svelte`, `/solid`, `/client`)
3. Test the basic `authClient.signUp.email()` / `authClient.signIn.email()` flows

### 5. Verify

> Goal: smoke check the auth flow end-to-end

1. Sign up a real user → the session cookie is set, `useSession()`/`getSession` returns the session
2. A protected route rejects anonymous and accepts a valid session
3. Run the project's lint/typecheck
4. If verification fails → run `/resolve-errors` max 3 rounds, then stop and report; if it passes → `/suggest-next-action`

## Rules

- Idempotent — if setup already exists, only verify; never overwrite the existing `auth.ts`
- Secrets always via env vars (`BETTER_AUTH_SECRET` ≥32 chars) — never hardcode
- Write the minimal config first — add plugins/providers later via `config-providers`
- The schema must be generated before testing — if unsure about an adapter/option → check the official docs

## Expected Outcome

- `better-auth` + adapter installed, `auth.ts` exports `auth` with the database
- Handler mounted at `/api/auth/*`, client ready to use
- Sign up / sign in flows work — ready to do `workflows/config-providers/SKILL.md`
