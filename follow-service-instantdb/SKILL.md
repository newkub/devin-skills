---
name: follow-service-instantdb
description: ติดตั้งและใช้งาน InstantDB เป็น real-time backend สำหรับ frontend apps
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

ติดตั้งและใช้งาน InstantDB เป็น real-time backend สำหรับ frontend apps พร้อม schema, queries, transactions, auth, permissions, storage, และ streams

## Scope

ใช้สำหรับ:
- สร้างหรือ integrate InstantDB ใน project ที่มี React, Next.js, SolidJS, Svelte, Vue, TanStack Start, หรือ Python
- กำหนด schema, permissions, และ client configuration
- Implement real-time queries, transactions, auth, storage, presence, streams
- ใช้งาน `instant-cli` สำหรับ push/pull schema และ manage apps

ไม่รวม:
- สร้าง UI component ตาม framework (ให้ใช้ `follow-lib-react`, `follow-create-web` (nextjs), ฯลฯ)
- Self-hosting (ให้ดู official docs)

## Execute

### Workflows

> Goal: dispatch ไปยัง workflow ที่ตรงกับ topic

- Setup: SDK install ตาม framework, `instant-cli init`, db client → `workflows/setup-instantdb/SKILL.md`
- Config: `instant.schema.ts`, `instant.perms.ts`, env vars, push/pull → `workflows/config-instantdb/SKILL.md`
- Verify: app id valid, query ตอบกลับ, schema sync → `workflows/verify-connection/SKILL.md`

### 1. Detect Project

> Goal: รู้ framework และ dependencies ปัจจุบัน

1. อ่าน `package.json` เพื่อระบุ framework และ package manager
2. ตรวจสอบว่า project ใช้ `bun`, `npm`, `pnpm`, หรือ `yarn`
3. ถ้าไม่มี `package.json` → stop และ report

### 2. Install InstantDB

> Goal: ติดตั้ง dependencies ที่ถูกต้องตาม framework

1. ติดตั้ง client SDK ตาม framework:
   - React: `bun add @instantdb/react`
   - Next.js: `bun add @instantdb/react`
   - SolidJS: `bun add @instantdb/solid`
   - Svelte: `bun add @instantdb/svelte`
   - Vue: `bun add @instantdb/vue`
   - TanStack Start: `bun add @instantdb/react`
   - Vanilla JS: `bun add @instantdb/core`
   - Python: `pip install instantdb` (ใช้งานร่วมกับ `follow-lang-python`)
Latest: `@instantdb/react@1.0.67` (verified 2026-09-12); CLI package ชื่อ `instant-cli` (ไม่ใช่ `@instantdb/cli` ซึ่งไม่มีใน npm)

2. ติดตั้ง CLI สำหรับ dev: `bun add -D instant-cli` หรือใช้ `npx instant-cli@latest`
3. ยืนยันว่า dependencies อยู่ใน `package.json`

### 3. Initialize App

> Goal: สร้าง schema, perms, และ env config เริ่มต้น

1. รัน `npx instant-cli@latest init` (หรือ `bunx instant-cli init`)
2. เลือก Instant app หรือสร้างใหม่ผ่าน CLI
3. ตรวจสอบ `instant.schema.ts`, `instant.perms.ts`, `.env.local` ถูกสร้าง
4. ยืนยันว่า `NEXT_PUBLIC_INSTANT_APP_ID` หรือ `VITE_INSTANT_APP_ID` ถูก set

### 4. Define Schema

> Goal: สร้าง data model ทีถูกต้องและ type-safe

1. อ่าน [references/instantdb-api.md](references/instantdb-api.md) และ [references/instantdb-configuration.md](references/instantdb-configuration.md)
2. แก้ไข `instant.schema.ts` เพื่อเพิ่ม entities, fields, links, rooms
3. ใช้ `i.entity({ ... })`, `i.string()`, `i.boolean()`, `i.date()` ตาม docs
4. ระบุ `unique`, `indexed`, `optional` ตามที่จำเป็น
5. รัน `npx instant-cli@latest push schema` เพื่อ push ขึ้น production

### 5. Create Client

> Goal: สร้าง db client ทีใช้งานได้ใน project

1. สร้าง `src/lib/instant.ts` (หรือ path ทีเหมาะสมกับ project):
   ```ts
   import { init } from "@instantdb/react";
   import schema from "../../instant.schema";
   export const db = init({
     appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
     schema,
     useDateObjects: true,
   });
   ```
2. เปลี่ยน `@instantdb/react` ให้ตรงกับ framework ทีใช้
3. อย่า hardcode app ID หรือ secrets ใน source code

### 6. Query And Transact

> Goal: อ่านและเขียนข้อมูลแบบ real-time

1. ใช้ `db.useQuery({ todos: {} })` เพื่อ read real-time data
2. ใช้ `db.transact(db.tx.todos[id()].update({ ... }))` เพื่อ write
3. ใช้ `db.tx.<entity>[id()].delete()` สำหรับ delete
4. จัดการ `isLoading`, `error`, `data` จาก `useQuery`
5. ดู patterns เพิ่มเติมใน [references/instantdb-api.md](references/instantdb-api.md)

### 7. Setup Auth And Permissions

> Goal: ป้องกันข้อมูลด้วย auth และ rules

1. ถ้าใช้ built-in auth: อ่าน [references/instantdb-configuration.md](references/instantdb-configuration.md) เรื่อง magic codes, OAuth
2. ตั้งค่า `instant.perms.ts` ด้วย `allow`/`bind` rules
3. ใช้ `auth.id`, `auth.email` ใน permission rules
4. รัน `npx instant-cli@latest push perms` เมื่อแก้ permissions
5. ถ้าใช้ Clerk/Firebase Auth → follow คู่มือ official docs

### 8. Use Advanced Features

> Goal: ใช้ features เสริมของ InstantDB

1. Storage: ใช้ `$files` entity และ `db.storage.uploadFile`
2. Presence: ใช้ `db.rooms.usePresence`
3. Streams: ใช้ `db.rooms.useStream`
4. Admin HTTP API สำหรับ server-side operations
5. ถ้าไม่ใช้ในขอบเขตนี้ → ข้ามขั้นตอนนี้

### 9. Validate

> Goal: ยืนยันว่า implementation ทำงานได้

1. รัน `bunx tsc --noEmit` หรือ `bun run build` เพื่อ typecheck
2. รัน dev server และทดสอบ CRUD real-time
3. รัน `npx instant-cli@latest status` เพื่อตรวจสอบ app connection
4. ถ้ามี errors → ทำ `resolve-errors` แล้ว revalidate

### 10. Update References

> Goal: อัปเดต references และสรุป next action

1. ถ้ามีการเพิ่ม links/rooms → อัปเดต [references/instantdb-configuration.md](references/instantdb-configuration.md)
2. ทำ `update-references` สำหรับ skills ทีเกี่ยวข้อง
3. ทำ `suggest-next-action` เพื่อแนะนำ step ถัดไป

## Rules

### 1. Source Of Truth
- ใช้ official docs ที่ `https://www.instantdb.com/docs` เป็นแหล่งหลัก
- ถ้า official docs ขัดแย้งกับ training data → ใช้ official docs
- ระบุ version ทีติดตั้งใน `package.json` เสมอ

### 2. Security
- อย่า hardcode `INSTANT_APP_ID`, API keys, tokens ใน source code
- ใช้ environment variables หรือ secret manager
- กำหนด permissions ก่อน expose ข้อมูล sensitive
- อย่า push schema/perms โดยไม่ตรวจสอบ dry-run

### 3. Type Safety
- ใช้ `schema` parameter ใน `init({ schema })` เสมอ
- ใช้ generated types จาก `InstaQLEntity<typeof schema, "...">`
- ใช้ `useDateObjects: true` ถ้าต้องการ `Date` objects

### 4. Minimal Changes
- ไม่ rewrite ทั้ง project ถ้าแค่ integrate InstantDB
- ใช้ config files ที project มีอยู่แล้ว
- ถ้าต้องแก้ >10 ไฟล์ → ทำ `use-scripts`

## Merged Details

### config-instantdb

##### Goal

ตั้งค่า/แก้ไข InstantDB configuration — `instant.schema.ts`, `instant.perms.ts`, env vars และ push/pull — โดยไม่ clobber schema เดิม

##### Scope

- แก้ entities, fields, links, rooms ใน `instant.schema.ts`
- กำหนด `allow`/`bind` rules ใน `instant.perms.ts`
- จัดการ env app id และ `instant-cli push/pull`
- ไม่ครอบคลุม SDK install/init → ใช้ `workflows/setup-instantdb/SKILL.md`

##### Execute

###### 1. Read Current Config

> Goal: รู้ schema/perms ปัจจุบันก่อนแก้

1. อ่าน `instant.schema.ts` และ `instant.perms.ts` ที่มีอยู่
2. ทำ `/check-secrets env-vars` เพื่อระบุ app id var ที่ขาดหรือผิด prefix
3. รัน `npx instant-cli@latest pull` ถ้าต้อง sync config ล่าสุดจาก server ก่อนแก้
4. ถ้าไม่มี config files เลย → ทำ `workflows/setup-instantdb/SKILL.md` แทน

###### 2. Update Schema

> Goal: เพิ่ม/แก้ data model แบบ type-safe

1. แก้ `instant.schema.ts` เพิ่ม entities, fields, links, rooms เฉพาะส่วนที่ต้องการ — merge ห้าม rewrite ทั้งไฟล์
2. ใช้ `i.entity({ ... })`, `i.string()`, `i.number()`, `i.boolean()`, `i.date()` และ `i.any()` ตาม docs
3. ระบุ `.unique()`, `.indexed()`, `.optional()` ตามความจำเป็น
4. กำหนด links ด้วย `forward`/`reverse` labels ให้ชัดเจน

###### 3. Update Permissions

> Goal: ป้องกัน data access ด้วย rules

1. แก้ `instant.perms.ts` ด้วย `allow`/`bind` rules ต่อ entity และ action (`view`, `create`, `update`, `delete`)
2. ใช้ `auth.id`, `auth.email` ใน rules — deny by default สำหรับ data sensitive
3. ผูก rules กับ links เช่น `data.user` เมื่อต้องเช็ค ownership
4. Review rules ก่อน push — ห้าม expose data โดยไม่ตั้งใจ

###### 4. Push And Verify

> Goal: apply config และยืนยัน typecheck ผ่าน

1. รัน `npx instant-cli@latest push schema` เมื่อแก้ schema
2. รัน `npx instant-cli@latest push perms` เมื่อแก้ permissions
3. รัน `bunx tsc --noEmit` หรือ `bun run build` เพื่อ typecheck schema types
4. รัน `npx instant-cli@latest status` ยืนยัน connection — ถ้า fail → `resolve-errors` max 3 รอบ
5. ถ้ามี links/rooms ใหม่ → อัปเดต references ของ parent และทำ `/update-references`

##### Rules

- Merge เฉพาะ keys ที่จำเป็น — ห้าม overwrite schema/perms ทั้งไฟล์
- อย่า push schema/perms โดยไม่ review diff ก่อน
- ใช้ generated types จาก `InstaQLEntity<typeof schema, "...">` สำหรับ type safety
- ห้าม hardcode app id/secrets — ใช้ env vars ตาม framework prefix
- ถ้า field type/rule syntax ไม่แน่ใจ → ดู official docs `https://www.instantdb.com/docs`

##### Expected Outcome

- `instant.schema.ts` และ `instant.perms.ts` ถูก merge และ push สำเร็จ
- Typecheck ผ่านและ rules ป้องกัน data sensitive ถูกต้อง
- Env vars ถูกต้องตาม framework

### setup-instantdb

##### Goal

ติดตั้ง InstantDB SDK ตาม framework, รัน `instant-cli init` เพื่อผูก app และสร้าง `db` client ให้พร้อม query/transact — first-time setup เท่านั้น

##### Scope

- ติดตั้ง `@instantdb/<framework>` และ `instant-cli`
- สร้าง `instant.schema.ts`, `instant.perms.ts`, env app id
- Init typed `db` client จาก env
- ไม่ครอบคลุม schema/permissions config ละเอียด → ใช้ `workflows/config-instantdb/SKILL.md`

##### Execute

###### 1. Detect Project

> Goal: รู้ framework และ package manager ปัจจุบัน

1. อ่าน `package.json` เพื่อระบุ framework (React, Next.js, SolidJS, Svelte, Vue, vanilla)
2. ระบุ package manager (`bun`, `npm`, `pnpm`, `yarn`)
3. ตรวจว่ามี `instant.schema.ts` หรือ `@instantdb/*` อยู่แล้ว → ถ้ามี skip ไป verify
4. ถ้าไม่มี `package.json` → stop และ report

###### 2. Install SDK And CLI

> Goal: ติดตั้ง dependencies ที่ถูกต้องตาม framework

1. ติดตั้ง client SDK ตาม framework:
   - React/Next.js/TanStack Start: `bun add @instantdb/react`
   - SolidJS: `bun add @instantdb/solid`, Svelte: `bun add @instantdb/svelte`, Vue: `bun add @instantdb/vue`
   - Vanilla JS: `bun add @instantdb/core` — ภาษาอื่นดู official docs
2. ติดตั้ง CLI ด้วย `bun add -D instant-cli` (package ชื่อ `instant-cli` ไม่ใช่ `@instantdb/cli`)
3. ยืนยัน dependencies อยู่ใน `package.json`

###### 3. Initialize App

> Goal: ผูก Instant app และสร้าง config files

1. รัน `npx instant-cli@latest init` (หรือ `bunx instant-cli init`)
2. เลือก Instant app เดิมหรือสร้างใหม่ผ่าน CLI — ถ้าไม่มี account → stop และแจ้ง user
3. ตรวจว่า `instant.schema.ts`, `instant.perms.ts`, `.env.local` ถูกสร้าง
4. ยืนยัน env app id ถูก set — `NEXT_PUBLIC_INSTANT_APP_ID` หรือ `VITE_INSTANT_APP_ID` ตาม framework

###### 4. Create Client And Verify

> Goal: สร้าง typed db client และ smoke check

1. สร้าง `src/lib/instant.ts` (หรือ path ที่เหมาะสม):
   ```ts
   import { init } from "@instantdb/react";
   import schema from "../../instant.schema";
   export const db = init({
     appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
     schema,
     useDateObjects: true,
   });
   ```
2. เปลี่ยน import ให้ตรง framework ที่ใช้ — ห้าม hardcode app id
3. รัน dev server และทดสอบ `db.useQuery` เบื้องต้น
4. ทำ `/run-verify` — ถ้า fail → `resolve-errors` max 3 รอบ

##### Rules

- ใช้ official docs `https://www.instantdb.com/docs` เป็นแหล่งหลัก
- ห้าม hardcode `INSTANT_APP_ID` หรือ secrets ใน source code
- ใช้ `schema` parameter ใน `init({ schema })` เสมอเพื่อ type safety
- ไม่ rewrite project — integrate เข้า structure เดิม
- เสร็จแล้วทำ `/suggest-next-action`

##### Expected Outcome

- SDK ตาม framework + `instant-cli` ติดตั้งครบ
- `instant.schema.ts`, `instant.perms.ts`, env app id ถูกสร้าง
- `db` client พร้อมใช้งานและ query ผ่าน verify

### verify-connection

##### Goal

ยืนยันหลัง setup/config ว่า InstantDB เชื่อมต่อได้จริง — `INSTANT_APP_ID` valid, client query ตอบกลับ, admin token ถ้ามีใช้ได้

##### Scope

- ใช้เมื่อ `/follow-service-instantdb` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่ push schema หรือ transact จริง

##### Execute

###### 1. Check App Credentials

> Goal: app id และ tokens มีครบ

1. ตรวจ `INSTANT_APP_ID` มีค่า (ไม่ print ค่า)
2. ถ้าใช้ admin SDK → ตรวจ `INSTANT_APP_ADMIN_TOKEN` มี
3. ถ้าใช้ CLI → `instant-cli whoami` ยืนยัน login

###### 2. Smoke Test Query

> Goal: client เชื่อม backend ได้

1. init client ด้วย app id → รัน query ว่าง `db.useQuery({})` หรือ `db.queryOnce`
2. ตรวจ response ไม่ใช่ auth error — invalid app id จะ fail ตรงนี้
3. ถ้ามี schema → ตรวจ `instant.schema.ts` sync กับ backend (`instant-cli pull` dry check)

###### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `invalid-app-id` / `auth-failed` / `schema-drift`

##### Rules

- ใช้ read queries เท่านั้น — ห้าม transact
- ไม่ print admin token
- schema drift → รายงานให้ `workflows/config-instantdb/SKILL.md` จัดการ

##### Expected Outcome

- Verdict connection พร้อม app-id evidence

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

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

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

- Project ติดตั้ง InstantDB client ตาม framework
- `instant.schema.ts` และ `instant.perms.ts` ถูกต้องและถูก push
- `db` client พร้อมใช้งาน query และ transaction
- Type-safe real-time CRUD ทำงานได้
- Auth และ permissions ถูกกำหนดตาม scope (ถ้ามี)