# Service Instantdb API & Dependencies

## Install

Client packages (pick per framework — all share `@instantdb/core`):

```sh
bun add @instantdb/react       # React / Next.js
# or
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

## Version

- Latest (`@instantdb/react`, `@instantdb/core`, `@instantdb/admin`, `instant-cli`): 1.0.67
- [Package Registry](https://www.npmjs.com/package/@instantdb/react)
- [Repository](https://github.com/instantdb/instant)

## Dependencies

- `@instantdb/react` depends on `@instantdb/core` (installed automatically).
- `instant-cli` requires Node.js and an Instant account; authenticate via `instant-cli login` or `INSTANT_CLI_AUTH_TOKEN` in CI.
- App ID is read from `INSTANT_APP_ID` or framework env vars (`NEXT_PUBLIC_INSTANT_APP_ID`, `VITE_INSTANT_APP_ID`, `PUBLIC_INSTANT_APP_ID`, `NUXT_PUBLIC_INSTANT_APP_ID`, `EXPO_PUBLIC_INSTANT_APP_ID`).

## Common API / Commands

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

## Source

- Official docs: https://www.instantdb.com/docs
- Init / schema: https://www.instantdb.com/docs/init, https://www.instantdb.com/docs/modeling-data
- InstaQL: https://www.instantdb.com/docs/instaql
- CLI: https://www.instantdb.com/docs/cli
- Backend/admin: https://www.instantdb.com/docs/backend
