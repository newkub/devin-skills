---
name: follow-service-instantdb-setup-instantdb
description: ติดตั้ง InstantDB SDK ตาม framework, init app และสร้าง db client
argument-hint: "[project-path]"
related:
  - follow-service-instantdb
  - check-env-vars
  - resolve-errors
  - run-verify
  - update-references
  - suggest-next-action
---

## Goal

ติดตั้ง InstantDB SDK ตาม framework, รัน `instant-cli init` เพื่อผูก app และสร้าง `db` client ให้พร้อม query/transact — first-time setup เท่านั้น

## Scope

- ติดตั้ง `@instantdb/<framework>` และ `instant-cli`
- สร้าง `instant.schema.ts`, `instant.perms.ts`, env app id
- Init typed `db` client จาก env
- ไม่ครอบคลุม schema/permissions config ละเอียด → ใช้ `subskills/config-instantdb/SKILL.md`

## Execute

### 1. Detect Project

> Goal: รู้ framework และ package manager ปัจจุบัน

1. อ่าน `package.json` เพื่อระบุ framework (React, Next.js, SolidJS, Svelte, Vue, vanilla)
2. ระบุ package manager (`bun`, `npm`, `pnpm`, `yarn`)
3. ตรวจว่ามี `instant.schema.ts` หรือ `@instantdb/*` อยู่แล้ว → ถ้ามี skip ไป verify
4. ถ้าไม่มี `package.json` → stop และ report

### 2. Install SDK And CLI

> Goal: ติดตั้ง dependencies ที่ถูกต้องตาม framework

1. ติดตั้ง client SDK ตาม framework:
   - React/Next.js/TanStack Start: `bun add @instantdb/react`
   - SolidJS: `bun add @instantdb/solid`, Svelte: `bun add @instantdb/svelte`, Vue: `bun add @instantdb/vue`
   - Vanilla JS: `bun add @instantdb/core` — ภาษาอื่นดู official docs
2. ติดตั้ง CLI ด้วย `bun add -D instant-cli` (package ชื่อ `instant-cli` ไม่ใช่ `@instantdb/cli`)
3. ยืนยัน dependencies อยู่ใน `package.json`

### 3. Initialize App

> Goal: ผูก Instant app และสร้าง config files

1. รัน `npx instant-cli@latest init` (หรือ `bunx instant-cli init`)
2. เลือก Instant app เดิมหรือสร้างใหม่ผ่าน CLI — ถ้าไม่มี account → stop และแจ้ง user
3. ตรวจว่า `instant.schema.ts`, `instant.perms.ts`, `.env.local` ถูกสร้าง
4. ยืนยัน env app id ถูก set — `NEXT_PUBLIC_INSTANT_APP_ID` หรือ `VITE_INSTANT_APP_ID` ตาม framework

### 4. Create Client And Verify

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

## Rules

- ใช้ official docs `https://www.instantdb.com/docs` เป็นแหล่งหลัก
- ห้าม hardcode `INSTANT_APP_ID` หรือ secrets ใน source code
- ใช้ `schema` parameter ใน `init({ schema })` เสมอเพื่อ type safety
- ไม่ rewrite project — integrate เข้า structure เดิม
- เสร็จแล้วทำ `/suggest-next-action`

## Expected Outcome

- SDK ตาม framework + `instant-cli` ติดตั้งครบ
- `instant.schema.ts`, `instant.perms.ts`, env app id ถูกสร้าง
- `db` client พร้อมใช้งานและ query ผ่าน verify
