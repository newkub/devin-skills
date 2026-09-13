---
name: follow-lib-better-auth-setup-auth
description: ติดตั้ง Better Auth, สร้าง auth.ts และ database adapter ให้พร้อมใช้งาน
argument-hint: "[framework-or-adapter]"
related:
  - follow-lib-better-auth
  - follow-lib-drizzle
  - follow-secret-manager
  - learn
  - resolve-errors
---

## Goal

ติดตั้ง Better Auth, สร้าง `auth.ts` พร้อม database adapter และ mount handler ให้ sign in/up ทำงานได้ — first-time setup เท่านั้น

## Scope

- ใช้เมื่อ project ยังไม่มี Better Auth (ถ้ามีอยู่แล้ว → verify เท่านั้น)
- ครอบคลุม: install, env vars, `auth.ts`, database adapter, handler mounting
- ไม่ครอบคลุม providers/plugins config — ทำ `subskills/config-providers/SKILL.md` แทน

## Execute

### 1. Check Precondition

> Goal: ตรวจสอบ environment และ current state ก่อน setup

1. อ่าน `package.json` — ถ้ามี `better-auth` แล้ว → skip ไป verify
2. ระบุ framework (Next.js, Hono, Elysia, TanStack Start ฯลฯ) และ ORM/database ที่ project ใช้
3. ตรวจ env vars `BETTER_AUTH_SECRET` และ `BETTER_AUTH_URL` — ถ้าขาด → สร้าง secret (≥32 chars, high entropy) แล้วเก็บผ่าน `/follow-secret-manager` ห้าม commit

### 2. Install

> Goal: ติดตั้ง `better-auth` และ adapter ที่ตรง ORM

1. รัน `bun add better-auth` (หรือ package manager ตาม lockfile)
2. ติดตั้ง adapter ถ้าไม่ใช้ built-in Kysely — เช่น `bun add @better-auth/drizzle-adapter` (ทำ `/follow-lib-drizzle` ร่วมถ้ายังไม่มี Drizzle)
3. ยืนยัน `better-auth` เป็น runtime dependency

### 3. Create auth.ts

> Goal: config ขั้นต่ำที่ทำงานได้

1. สร้าง `auth.ts` (หรือ `src/lib/auth.ts` ตาม project structure) ด้วย `betterAuth()` แล้ว export `auth`
2. กำหนด database — ตรง adapter: `new Database()`/`new Pool()` สำหรับ Kysely, หรือ `drizzleAdapter(db)` สำหรับ Drizzle
3. เปิด `emailAndPassword: { enabled: true }` เป็น baseline (social providers ทำใน `config-providers`)
4. ตั้ง `trustedOrigins` เฉพาะ origins ที่ใช้จริง
5. รัน `bunx auth@latest generate` (สร้าง schema) หรือ `bunx auth@latest migrate` (Kysely adapter) — Drizzle adapter ให้ generate ผ่าน drizzle-kit ตามปกติ

### 4. Mount Handler And Client

> Goal: auth routes ตอบ request ได้

1. Mount auth handler ตาม framework: `toNextJsHandler(auth)`, `toElysiaHandler(auth)` ฯลฯ ที่ `/api/auth/*` — base path เดียวกันเสมอ
2. สร้าง client ด้วย `createAuthClient` จาก `better-auth/react` (หรือ `/vue`, `/svelte`, `/solid`, `/client`)
3. ทดสอบ `authClient.signUp.email()` / `authClient.signIn.email()` flow เบื้องต้น

### 5. Verify

> Goal: smoke check auth flow end-to-end

1. Sign up user จริง → session cookie ถูก set, `useSession()`/`getSession` คืน session
2. Protected route ปฏิเสธ anonymous และยอมรับ session ที่ถูกต้อง
3. รัน lint/typecheck ของ project
4. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report; ผ่าน → `/suggest-next-action`

## Rules

- Idempotent — ถ้า setup ไปแล้วให้ verify เท่านั้น ห้าม overwrite `auth.ts` เดิม
- Secrets ผ่าน env vars เสมอ (`BETTER_AUTH_SECRET` ≥32 chars) — ห้าม hardcode
- เขียน config ขั้นต่ำก่อน — plugins/providers เพิ่มทีหลังผ่าน `config-providers`
- Schema ต้อง generate ก่อน test — ถ้าไม่แน่ใจ adapter/option → ดู official docs

## Expected Outcome

- `better-auth` + adapter ติดตั้ง, `auth.ts` export `auth` พร้อม database
- Handler mount ที่ `/api/auth/*`, client พร้อมใช้
- Sign up/sign in flow ทำงานจริง — พร้อมทำ `subskills/config-providers/SKILL.md` ต่อ
