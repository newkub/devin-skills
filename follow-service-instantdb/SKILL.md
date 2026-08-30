---
name: follow-service-instantdb
description: ติดตั้งและใช้งาน InstantDB เป็น real-time backend สำหรับ frontend apps
related:
  - follow-lib-react
  - follow-framework-nextjs
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
- สร้าง UI component ตาม framework (ให้ใช้ `follow-lib-react`, `follow-framework-nextjs`, ฯลฯ)
- Self-hosting (ให้ดู official docs)

## Execute

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
2. ติดตั้ง CLI สำหรับ dev: `bun add -D @instantdb/cli` หรือใช้ `npx instant-cli@latest`
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

## Expected Outcome

- Project ติดตั้ง InstantDB client ตาม framework
- `instant.schema.ts` และ `instant.perms.ts` ถูกต้องและถูก push
- `db` client พร้อมใช้งาน query และ transaction
- Type-safe real-time CRUD ทำงานได้
- Auth และ permissions ถูกกำหนดตาม scope (ถ้ามี)