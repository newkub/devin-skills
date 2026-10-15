---
name: follow-service-instantdb
description: Install and use InstantDB as a real-time backend for frontend apps
argument-hint: "[scope]"
related:
  - follow-lib-react
  - follow-create-web
  - follow-lang-python
  - resolve-errors
  - update-references
  - suggest-next-action
  - use-scripts

---

## Goal

Install and use InstantDB as a real-time backend for frontend apps with schema, queries, transactions, auth, permissions, storage, and streams

## Scope

Used for:
- Creating or integrating InstantDB in a project with React, Next.js, SolidJS, Svelte, Vue, TanStack Start, or Python
- Defining schema, permissions, and client configuration
- Implementing real-time queries, transactions, auth, storage, presence, streams
- Using `instant-cli` for push/pull schema and managing apps

Not included:
- Creating UI components per framework (use `follow-lib-react`, `follow-create-web` (nextjs), etc.)
- Self-hosting (see official docs)

## Execute

### Workflows

> Goal: dispatch to the workflow matching the topic

- Setup: SDK install per framework, `instant-cli init`, db client → `## Merged Details → setup-instantdb`
- Config: `instant.schema.ts`, `instant.perms.ts`, env vars, push/pull → `## Merged Details → config-instantdb`
- Verify: app id valid, query responds, schema sync → `## Merged Details → verify-connection`

### 1. Detect Project

> Goal: Know the current framework and dependencies

1. Read `package.json` to identify the framework and package manager
2. Check whether the project uses `bun`, `npm`, `pnpm`, or `yarn`
3. If there is no `package.json` → stop and report

### 2. Install InstantDB

> Goal: Install the correct dependencies per framework

1. Install the client SDK per framework:
   - React: `bun add @instantdb/react`
   - Next.js: `bun add @instantdb/react`
   - SolidJS: `bun add @instantdb/solid`
   - Svelte: `bun add @instantdb/svelte`
   - Vue: `bun add @instantdb/vue`
   - TanStack Start: `bun add @instantdb/react`
   - Vanilla JS: `bun add @instantdb/core`
   - Python: `pip install instantdb` (used together with `follow-lang-python`)
Latest: `@instantdb/react@1.0.67` (verified 2026-09-12); the CLI package is named `instant-cli` (not `@instantdb/cli`, which does not exist on npm)

2. Install the CLI for dev: `bun add -D instant-cli` or use `npx instant-cli@latest`
3. Confirm the dependencies are in `package.json`

### 3. Initialize App

> Goal: Create the starting schema, perms, and env config

1. Run `npx instant-cli@latest init` (or `bunx instant-cli init`)
2. Select an Instant app or create a new one via the CLI
3. Check that `instant.schema.ts`, `instant.perms.ts`, `.env.local` were created
4. Confirm `NEXT_PUBLIC_INSTANT_APP_ID` or `VITE_INSTANT_APP_ID` is set

### 4. Define Schema

> Goal: Create a correct, type-safe data model

1. Read [## Merged Details → `### references/instantdb-api`](## Merged Details → `### references/instantdb-api`) and [## Merged Details → `### references/instantdb-configuration`](## Merged Details → `### references/instantdb-configuration`)
2. Edit `instant.schema.ts` to add entities, fields, links, rooms
3. Use `i.entity({ ... })`, `i.string()`, `i.boolean()`, `i.date()` per the docs
4. Mark `unique`, `indexed`, `optional` as needed
5. Run `npx instant-cli@latest push schema` to push to production

### 5. Create Client

> Goal: Create a usable db client in the project

1. Create `src/lib/instant.ts` (or a path suited to the project):
   ```ts
   import { init } from "@instantdb/react";
   import schema from "../../instant.schema";
   export const db = init({
     appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
     schema,
     useDateObjects: true,
   });
   ```
2. Change `@instantdb/react` to match the framework in use
3. Never hardcode app IDs or secrets in source code

### 6. Query And Transact

> Goal: Read and write data in real time

1. Use `db.useQuery({ todos: {} })` to read real-time data
2. Use `db.transact(db.tx.todos[id()].update({ ... }))` to write
3. Use `db.tx.<entity>[id()].delete()` for delete
4. Handle `isLoading`, `error`, `data` from `useQuery`
5. See more patterns in [## Merged Details → `### references/instantdb-api`](## Merged Details → `### references/instantdb-api`)

### 7. Setup Auth And Permissions

> Goal: Protect data with auth and rules

1. If using built-in auth: read [## Merged Details → `### references/instantdb-configuration`](## Merged Details → `### references/instantdb-configuration`) about magic codes and OAuth
2. Configure `instant.perms.ts` with `allow`/`bind` rules
3. Use `auth.id`, `auth.email` in permission rules
4. Run `npx instant-cli@latest push perms` when permissions change
5. If using Clerk/Firebase Auth → follow the official docs guides

### 8. Use Advanced Features

> Goal: Use InstantDB's extra features

1. Storage: use the `$files` entity and `db.storage.uploadFile`
2. Presence: use `db.rooms.usePresence`
3. Streams: use `db.rooms.useStream`
4. Admin HTTP API for server-side operations
5. If not used in this scope → skip this step

### 9. Validate

> Goal: Confirm the implementation works

1. Run `bunx tsc --noEmit` or `bun run build` to typecheck
2. Run the dev server and test real-time CRUD
3. Run `npx instant-cli@latest status` to check the app connection
4. If errors occur → do `resolve-errors` then revalidate

### 10. Update References

> Goal: Update references and summarize the next action

1. If links/rooms were added → update [## Merged Details → `### references/instantdb-configuration`](## Merged Details → `### references/instantdb-configuration`)
2. Do `update-references` for related skills
3. Do `suggest-next-action` to recommend the next step

## Rules

### 1. Source Of Truth
- Use official docs at `https://www.instantdb.com/docs` as the primary source
- If official docs conflict with training data → use the official docs
- Always state the installed version in `package.json`

### 2. Security
- Never hardcode `INSTANT_APP_ID`, API keys, or tokens in source code
- Use environment variables or a secret manager
- Define permissions before exposing sensitive data
- Never push schema/perms without reviewing a dry run

### 3. Type Safety
- Always use the `schema` parameter in `init({ schema })`
- Use generated types from `InstaQLEntity<typeof schema, "...">`
- Use `useDateObjects: true` when `Date` objects are wanted

### 4. Minimal Changes
- Do not rewrite the whole project just to integrate InstantDB
- Use the config files the project already has
- If more than 10 files must change → do `use-scripts`

## Merged Details

### config-instantdb

##### Goal

Set/edit InstantDB configuration — `instant.schema.ts`, `instant.perms.ts`, env vars, and push/pull — without clobbering the existing schema

##### Scope

- Edit entities, fields, links, rooms in `instant.schema.ts`
- Define `allow`/`bind` rules in `instant.perms.ts`
- Manage the env app id and `instant-cli push/pull`
- Does not cover SDK install/init → use `## Merged Details → setup-instantdb`

##### Execute

###### 1. Read Current Config

> Goal: Know the current schema/perms before editing

1. Read the existing `instant.schema.ts` and `instant.perms.ts`
2. Do `/check-secrets env-vars` to identify missing or wrongly prefixed app id vars
3. Run `npx instant-cli@latest pull` if the latest config must be synced from the server before editing
4. If no config files exist at all → do `## Merged Details → setup-instantdb` instead

###### 2. Update Schema

> Goal: Add/edit the data model type-safely

1. Edit `instant.schema.ts` adding entities, fields, links, rooms only where needed — merge, never rewrite the whole file
2. Use `i.entity({ ... })`, `i.string()`, `i.number()`, `i.boolean()`, `i.date()`, and `i.any()` per the docs
3. Mark `.unique()`, `.indexed()`, `.optional()` as required
4. Define links with explicit `forward`/`reverse` labels

###### 3. Update Permissions

> Goal: Protect data access with rules

1. Edit `instant.perms.ts` with per-entity, per-action `allow`/`bind` rules (`view`, `create`, `update`, `delete`)
2. Use `auth.id`, `auth.email` in rules — deny by default for sensitive data
3. Bind rules to links such as `data.user` when checking ownership
4. Review rules before push — never expose data accidentally

###### 4. Push And Verify

> Goal: apply config and confirm typecheck passes

1. Run `npx instant-cli@latest push schema` when the schema changes
2. Run `npx instant-cli@latest push perms` when permissions change
3. Run `bunx tsc --noEmit` or `bun run build` to typecheck schema types
4. Run `npx instant-cli@latest status` to confirm the connection — if it fails → `resolve-errors` max 3 rounds
5. If new links/rooms exist → update the parent's references and do `/update-references`

##### Rules

- Merge only the necessary keys — never overwrite whole schema/perms files
- Never push schema/perms without reviewing the diff first
- Use generated types from `InstaQLEntity<typeof schema, "...">` for type safety
- Never hardcode app id/secrets — use env vars with the framework prefix
- If unsure about a field type/rule syntax → check official docs `https://www.instantdb.com/docs`

##### Expected Outcome

- `instant.schema.ts` and `instant.perms.ts` merged and pushed successfully
- Typecheck passes and rules protect sensitive data correctly
- Env vars correct per framework

### setup-instantdb

##### Goal

Install the InstantDB SDK per framework, run `instant-cli init` to link the app, and create the `db` client ready for query/transact — first-time setup only

##### Scope

- Install `@instantdb/<framework>` and `instant-cli`
- Create `instant.schema.ts`, `instant.perms.ts`, env app id
- Init the typed `db` client from env
- Does not cover detailed schema/permissions config → use `## Merged Details → config-instantdb`

##### Execute

###### 1. Detect Project

> Goal: Know the current framework and package manager

1. Read `package.json` to identify the framework (React, Next.js, SolidJS, Svelte, Vue, vanilla)
2. Identify the package manager (`bun`, `npm`, `pnpm`, `yarn`)
3. Check whether `instant.schema.ts` or `@instantdb/*` already exists → if so, skip to verify
4. If there is no `package.json` → stop and report

###### 2. Install SDK And CLI

> Goal: Install the correct dependencies per framework

1. Install the client SDK per framework:
   - React/Next.js/TanStack Start: `bun add @instantdb/react`
   - SolidJS: `bun add @instantdb/solid`, Svelte: `bun add @instantdb/svelte`, Vue: `bun add @instantdb/vue`
   - Vanilla JS: `bun add @instantdb/core` — for other languages check official docs
2. Install the CLI with `bun add -D instant-cli` (the package is named `instant-cli`, not `@instantdb/cli`)
3. Confirm the dependencies are in `package.json`

###### 3. Initialize App

> Goal: Link the Instant app and create config files

1. Run `npx instant-cli@latest init` (or `bunx instant-cli init`)
2. Pick an existing Instant app or create a new one via the CLI — if there is no account → stop and tell the user
3. Check that `instant.schema.ts`, `instant.perms.ts`, `.env.local` were created
4. Confirm the env app id is set — `NEXT_PUBLIC_INSTANT_APP_ID` or `VITE_INSTANT_APP_ID` per framework

###### 4. Create Client And Verify

> Goal: Create the typed db client and smoke check it

1. Create `src/lib/instant.ts` (or a suitable path):
   ```ts
   import { init } from "@instantdb/react";
   import schema from "../../instant.schema";
   export const db = init({
     appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
     schema,
     useDateObjects: true,
   });
   ```
2. Change the import to match the framework in use — never hardcode the app id
3. Run the dev server and test basic `db.useQuery`
4. Do `/run-verify` — if it fails → `resolve-errors` max 3 rounds

##### Rules

- Use official docs `https://www.instantdb.com/docs` as the primary source
- Never hardcode `INSTANT_APP_ID` or secrets in source code
- Always use the `schema` parameter in `init({ schema })` for type safety
- Do not rewrite the project — integrate into the existing structure
- When done, do `/suggest-next-action`

##### Expected Outcome

- Framework SDK + `instant-cli` fully installed
- `instant.schema.ts`, `instant.perms.ts`, env app id created
- `db` client ready to use and query — verify passed

### verify-connection

##### Goal

Confirm after setup/config that InstantDB really connects — `INSTANT_APP_ID` valid, client query responds, admin token usable when present

##### Scope

- Used when `/follow-service-instantdb` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not push schema or transact for real

##### Execute

###### 1. Check App Credentials

> Goal: app id and tokens are complete

1. Check `INSTANT_APP_ID` has a value (do not print it)
2. If the admin SDK is used → check `INSTANT_APP_ADMIN_TOKEN` exists
3. If using the CLI → `instant-cli whoami` confirms login

###### 2. Smoke Test Query

> Goal: the client reaches the backend

1. Init the client with the app id → run an empty query `db.useQuery({})` or `db.queryOnce`
2. Confirm the response is not an auth error — an invalid app id fails here
3. If a schema exists → check `instant.schema.ts` is synced with the backend (`instant-cli pull` dry check)

###### 3. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `invalid-app-id` / `auth-failed` / `schema-drift`

##### Rules

- Use read queries only — never transact
- Do not print the admin token
- Schema drift → report it so `## Merged Details → config-instantdb` handles it

##### Expected Outcome

- Connection verdict with app-id evidence

### references/apis

#### Service Instantdb API & Dependencies

##### Install

Client packages (pick per framework — all share `@instantdb/core`):

```sh
bun add @instantdb/react       # React / Next.js
#### or
npm install @instantdb/react

bun add @instantdb/core        # Vanilla JS / shared core
bun add @instantdb/admin       # Server-side (admin token)
bun add @instantdb/react-native  # React Native
```

CLI and scaffolder (run via `npx`/`bunx`, no install needed):

```sh
npx instant-cli@latest login
npx create-instant-app --next      # scaffold Next.js + Instant
npx create-instant-app --vite-react
```

##### Version

- Latest (`@instantdb/react`, `@instantdb/core`, `@instantdb/admin`, `instant-cli`): 1.0.67
- [Package Registry](https://www.npmjs.com/package/@instantdb/react)
- [Repository](https://github.com/instantdb/instant)

##### Dependencies

- `@instantdb/react` depends on `@instantdb/core` (installed automatically).
- `instant-cli` requires Node.js and an Instant account; authenticate via `instant-cli login` or `INSTANT_CLI_AUTH_TOKEN` in CI.
- App ID is read from `INSTANT_APP_ID` or framework env vars (`NEXT_PUBLIC_INSTANT_APP_ID`, `VITE_INSTANT_APP_ID`, `PUBLIC_INSTANT_APP_ID`, `NUXT_PUBLIC_INSTANT_APP_ID`, `EXPO_PUBLIC_INSTANT_APP_ID`).

##### Common API / Commands

Client SDK (`@instantdb/react` / `@instantdb/core`):

| commands | description | default | options |
|---|---|---|---|
| `init({ appId, schema })` | Create a db client instance | cloud endpoint | `schema`, `useDateObjects`, `websocketURI`, `devtool` |
| `i.schema({ entities, links, rooms })` | Define data model (`@instantdb/core`/`react`) | — | entity/link/room definitions |
| `i.entity({...})` | Define an entity with attributes | — | `i.string()`, `i.number()`, `i.boolean()`, `i.date()`, `i.json()`, `i.any()` each chainable `.unique()`, `.indexed()`, `.optional()` |
| `id()` | Generate a new UUID for an entity | — | — |
| `lookup(attr, value)` | Reference an entity by a unique attribute | — | e.g. `lookup('email', 'a@b.c')` |
| `db.useQuery(query)` | Live query hook (React) — returns `{ isLoading, error, data }` | realtime | InstaQL: `where`, `order`, `limit`, `first`, `offset`, `fields`, nested links, `$` clauses (`$files`, `$users`, `like`, `and`, `or`) |
| `db.queryOnce(query)` | One-shot query (non-hook) | — | same InstaQL syntax |
| `db.transact(tx | tx[])` | Run one or batch of transactions | — | accepts array for batch |
| `db.tx.<ns>[id].update(attrs)` | Create/update entity attributes | upsert semantics | `upsert: false` opt-out where supported |
| `db.tx.<ns>[id].merge(attrs)` | Deep-merge (nested objects) | — | — |
| `db.tx.<ns>[id].link({ label: id })` | Create link to another entity | — | link labels from schema |
| `db.tx.<ns>[id].unlink({ label: id })` | Remove a link | — | — |
| `db.tx.<ns>[id].delete()` | Delete an entity | — | — |
| `db.tx.<ns>[id].ruleParams` | Pass params to permission rules | — | used with `instant.perms.ts` |
| `InstaQLEntity<typeof schema, 'ns'>` | Type helper for query result rows | — | 3rd arg for link inclusion |
| `db.auth.sendMagicCode({ email })` | Email magic-code sign-in step 1 | — | — |
| `db.auth.signInWithMagicCode({ email, code })` | Verify magic code, sign in | — | — |
| `db.auth.createAuthorizationURL({ clientName, redirectURL })` | OAuth URL (Google/Apple/GitHub/LinkedIn) | — | `state`, `nonce` |
| `db.auth.exchangeOAuthCode({ code, codeVerifier })` | Complete OAuth redirect flow | — | — |
| `db.auth.signInWithIdToken({ clientName, idToken, nonce })` | Sign in with OIDC id token | — | — |
| `db.auth.signInAsGuest()` | Guest (anonymous) auth | — | — |
| `db.auth.signOut()` | Sign out current user | — | — |
| `db.useAuth()` | React hook: `{ isLoading, user, error }` | — | — |
| `db.room(type, id)` | Create a room handle for presence/topics | — | `initialPresence` |
| `room.usePresence(...)` / `db.rooms.usePublishTopic` / `useTopicEffect` / `useCursors` / `useTypingIndicator` | Presence, cursors, ephemeral topics | — | `keys`, `initialData` |
| `db.storage.uploadFile(path, file)` | Upload to Instant Storage | — | — |
| `db.getLocalId(name)` | Stable local device id | — | — |

Admin SDK (`@instantdb/admin`, server only):

| commands | description | default | options |
|---|---|---|---|
| `init({ appId, adminToken })` | Admin client — bypasses permissions | — | `schema` for type-safety |
| `db.query(query)` | Server-side InstaQL query | admin scope | `db.asUser({ email | token | guest })` to scope |
| `db.transact(tx[])` | Server-side transactions | — | same tx builder |
| `db.auth.verifyToken(token)` | Verify a user refresh token | — | — |
| `db.auth.createToken(email)` | Mint a user token | — | — |

Instant CLI (`instant-cli`):

| commands | description | default | options |
|---|---|---|---|
| `instant-cli login` | Browser auth with Instant account | saves token locally | `-p` prints token for `INSTANT_CLI_AUTH_TOKEN` |
| `instant-cli logout` | Remove stored credentials | — | — |
| `instant-cli init` | Link/create app, write `instant.schema.ts` + `instant.perms.ts` | interactive | `--app <id>`, `--temp` (ephemeral 24h app) |
| `instant-cli init-without-files` | Create app, print `{appId, adminToken}` JSON to stdout | — | `--title`, `--temp` |
| `instant-cli push schema` | Push data-model changes | interactive rename prompts | `--rename old:new`, `--yes` |
| `instant-cli push perms` | Push permission rules | — | — |
| `instant-cli pull` | Regenerate schema + perms from production | — | `pull schema` / `pull perms` |
| `instant-cli query '<instaql>'` | Run query from terminal, JSON5 to stdout | `--admin` | `--as-email`, `--as-guest`, `--as-token` |
| `instant-cli claim` | Transfer a `--temp` app into your account | — | — |

##### Source

- Official docs: https://www.instantdb.com/docs
- Init / schema: https://www.instantdb.com/docs/init, https://www.instantdb.com/docs/modeling-data
- InstaQL: https://www.instantdb.com/docs/instaql
- CLI: https://www.instantdb.com/docs/cli
- Backend/admin: https://www.instantdb.com/docs/backend

### references/instantdb-api

#### InstantDB Core API

##### Init

```ts
import { init } from "@instantdb/react";
import schema from "../instant.schema";

export const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  schema,
  useDateObjects: true,
});
```

##### Schema

```ts
import { i } from "@instantdb/core";

const schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    todos: i.entity({
      text: i.string(),
      done: i.boolean(),
      createdAt: i.date(),
    }),
  },
  links: {
    todosOwner: {
      forward: { on: "todos", has: "one", label: "owner", onDelete: "cascade" },
      reverse: { on: "$users", has: "many", label: "todos" },
    },
  },
  rooms: {},
});

export default schema;
```

##### Query

```ts
const { isLoading, error, data } = db.useQuery({ todos: {} });
const { todos } = data || {};
```

##### Transaction

```ts
import { id } from "@instantdb/react";

// Create
db.transact(db.tx.todos[id()].update({ text: "Buy milk", done: false }));

// Update
db.transact(db.tx.todos[todo.id].update({ done: true }));

// Delete
db.transact(db.tx.todos[todo.id].delete());

// Batch
db.transact([db.tx.todos[id1].update({ ... }), db.tx.todos[id2].delete()]);
```

##### Type Helpers

```ts
import type { InstaQLEntity } from "@instantdb/react";
type Todo = InstaQLEntity<typeof schema, "todos">;
```

For full API see https://www.instantdb.com/docs

### references/instantdb-cli

#### Instant CLI Reference

| Command | Description |
|---|---|
| `npx instant-cli@latest login` | Authenticate with Instant account |
| `npx instant-cli@latest logout` | Remove local authentication token |
| `npx instant-cli@latest init` | Pick/create app and generate `instant.schema.ts` and `instant.perms.ts` |
| `npx instant-cli@latest push schema` | Push schema changes to the app |
| `npx instant-cli@latest push perms` | Push permission changes to the app |
| `npx instant-cli@latest push` | Push both schema and permissions |
| `npx instant-cli@latest pull` | Pull latest schema and perms from the app |
| `npx instant-cli@latest status` | Show app connection status |
| `npx create-instant-app --next` | Scaffold Next.js app with Instant |
| `npx create-instant-app --vite_react` | Scaffold Vite React app with Instant |

For latest commands see https://www.instantdb.com/docs/cli

### references/instantdb-configuration

#### InstantDB Configuration

##### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_INSTANT_APP_ID` | App ID for Next.js |
| `VITE_INSTANT_APP_ID` | App ID for Vite |
| `INSTANT_APP_ID` | App ID for vanilla/other |

##### Schema Options

- `i.string()` - text field
- `i.boolean()` - boolean field
- `i.date()` - date field
- `i.number()` - number field
- `.unique()` - unique constraint
- `.indexed()` - indexed for queries
- `.optional()` - nullable field

##### Permission Rules

```ts
const rules = {
  todos: {
    bind: { isOwner: "auth.id == data.creator" },
    allow: {
      view: "true",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
  },
};
```

##### Auth Methods

- Magic codes
- Google OAuth
- Sign in with Apple
- GitHub OAuth
- LinkedIn OAuth
- Clerk
- Firebase Auth

##### Advanced Features

- Storage: upload/download files via `$files` entity
- Presence: real-time user activity
- Streams: broadcast large data
- Webhooks: HTTP callbacks
- Admin HTTP API: server-side operations

See https://www.instantdb.com/docs/auth and https://www.instantdb.com/docs/permissions

### references/instantdb-website

#### InstantDB Official Resources

| Resource | Link |
|----------|------|
| Website | https://www.instantdb.com/ |
| Docs | https://www.instantdb.com/docs |
| Tutorial | https://www.instantdb.com/tutorial |
| Examples | https://www.instantdb.com/examples |
| Recipes | https://www.instantdb.com/recipes |
| GitHub | https://github.com/instantdb/instant |
| Dashboard | https://www.instantdb.com/dash |

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review-codebase` runs.

##### Primary Package

| Field | Value |
|-------|-------|
| Package | `@instantdb/react` |
| Registry | `npm` |
| Latest Version | `1.0.67` |
| Release Date | `2026-08-31` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | InstantDB |
| License | `Apache-2.0` |
| Repository | `https://github.com/instantdb/instant` |
| Website | `https://www.instantdb.com/` |
| Documentation | `https://www.instantdb.com/docs` |
| Releases / Changelog | `https://github.com/instantdb/instant/releases` |

##### Install

```bash
bun add @instantdb/react
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `instant-cli` | `npm` | `1.0.67` | Dev CLI for init/push schema & perms (NOT `@instantdb/cli`, which does not exist) |
| `@instantdb/core` | `npm` | `1.0.67` | Vanilla JS client |
| `@instantdb/solidjs` | `npm` | `1.0.67` | SolidJS client — correct name is `solidjs`, not `@instantdb/solid` (does not exist) |
| `@instantdb/svelte` | `npm` | `1.0.67` | Svelte client |
| `@instantdb/vue` | `npm` | `1.0.67` | Vue client |
| `@instantdb/admin` | `npm` | `1.0.67` | Server-side admin SDK |
| `instantdb` | `PyPI` | `unknown` | Python client |

##### Notes

- Breaking changes in latest major: v1.0 line is stable; SDK reached `1.x`
- Version pinned in SKILL.md: `1.0.67`
- SKILL.md references `@instantdb/solid` for SolidJS — the actual npm package is `@instantdb/solidjs`

### references/routes

#### Follow Service Instantdb Route Map

- Website: <https://github.com/instantdb/instant/tree/main/client/packages/react>
- Routes discovered (homepage): 30

##### Routes

- /collections
- /customer-stories
- /enterprise
- /enterprise/premium-support
- /enterprise/startups
- /features
- /features/actions
- /features/ai/github-app
- /features/code-quality
- /features/code-review
- /features/codespaces
- /features/copilot
- /features/copilot/copilot-business
- /features/issues
- /instantdb
- /instantdb/instant
- /instantdb/instant/actions
- /instantdb/instant/blob/main/client/packages/react/.npmignore
- /instantdb/instant/blob/main/client/packages/react/README.md
- /instantdb/instant/blob/main/client/packages/react/package.json
- /instantdb/instant/blob/main/client/packages/react/tsconfig.dev.json
- /instantdb/instant/blob/main/client/packages/react/tsconfig.json
- /instantdb/instant/blob/main/client/packages/react/tsconfig.test.json
- /instantdb/instant/blob/main/client/packages/react/vite.config.ts
- /instantdb/instant/commits/main/client/packages/react
- /instantdb/instant/issues
- /instantdb/instant/projects
- /instantdb/instant/pulls
- /instantdb/instant/pulse
- /instantdb/instant/security

### references/website

#### Service Instantdb Official Resources

- [Website](https://github.com/instantdb/instant/tree/main/client/packages/react)
- [Repository](https://github.com/instantdb/instant)
- [Package Registry](https://www.npmjs.com/package/@instantdb/react)
- About: Instant is the best backend for AI-coded apps.  You get auth, permissions, storage, presence, and streams — everything you need to ship a...

## Expected Outcome

- Project has the InstantDB client installed per framework
- `instant.schema.ts` and `instant.perms.ts` are correct and pushed
- The `db` client is ready for queries and transactions
- Type-safe real-time CRUD works
- Auth and permissions defined per scope (if used)