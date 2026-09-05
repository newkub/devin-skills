---
name: follow-lib-better-auth
description: ใช้งาน Better Auth สำหรับ authentication และ authorization
argument-hint: "[scope]"
related:
---

## Goal

ตั้งค่า Better Auth เวอร์ชันล่าสุดสำหรับ type-safe authentication และ authorization ใน TypeScript projects

## Scope

ใช้กับ Next.js, Nuxt, SvelteKit, SolidStart, Hono, Elysia, TanStack Start, Express, Cloudflare Workers, Expo หรือ backend ใดๆ ที่รองรับ TypeScript

## Execute

### 1. Install

> Goal: ติดตั้ง Better Auth และ database adapter

1. รัน `npm install better-auth` (หรือ `pnpm add better-auth`, `yarn add better-auth`, `bun add better-auth`)
2. ตรวจสอบเวอร์ชันล่าสุดที่ `https://www.npmjs.com/package/better-auth` (ปัจจุบัน v1.7.2)
3. ติดตั้ง database adapter ถ้าไม่ใช้ built-in Kysely (เช่น `@better-auth/prisma-adapter`, `@better-auth/drizzle-adapter`)
4. ตั้งค่า environment variables `BETTER_AUTH_SECRET` และ `BETTER_AUTH_URL`
5. ใช้ `npx auth@latest init` สำหรับ scaffold Next.js project (optional)

### 2. Configure

> Goal: สร้าง auth config พร้อม plugins และ session settings

1. สร้างไฟล์ `auth.ts` ด้วย `betterAuth()` และ export ชื่อ `auth` หรือ default export
2. กำหนด database โดยตรง (เช่น `new Database('./sqlite.db')`, `new Pool({...})`) หรือผ่าน adapter
3. เปิดใช้ features เช่น `emailAndPassword: { enabled: true }` หรือ `socialProviders`
4. เพิ่ม plugins ที่ต้องการใน `plugins: [...]` (เช่น `twoFactor()`, `organization()`, `passkey()`)
5. ตั้งค่า `trustedOrigins` ให้เข้มงวด
6. ใช้ `npx auth@latest generate` สร้าง schema หรือ `npx auth@latest migrate` สำหรับ built-in Kysely adapter

### 3. Integrate

> Goal: เชื่อมต่อ auth กับ frontend และ backend routes

1. สร้าง API route สำหรับ auth handler ตาม framework (เช่น `toNextJsHandler(auth)`, `toElysiaHandler(auth)`, mount `/api/auth/*`)
2. ใช้ `createAuthClient` จาก `better-auth/react` (หรือ `/vue`, `/svelte`, `/solid`, `/client`) ใน frontend
3. ใช้ `authClient.signIn.email()`, `authClient.signUp.email()`, `authClient.signOut()` และ `authClient.useSession()`
4. จัดการ roles/permissions ผ่าน plugins เช่น `admin` หรือ `organization`

### 4. Secure

> Goal: รักษาความปลอดภัยของ auth flow

1. ใช้ environment variables สำหรับ `BETTER_AUTH_SECRET` ขั้นต่ำ 32 ตัวอักษรด้วย entropy สูง
2. กำหนด `trustedOrigins` อย่างเข้มงวด
3. ไม่ expose admin endpoints หรือ debug endpoints โดยไม่จำเป็น
4. ใช้ `https` ใน production

### 5. Test

> Goal: ทดสอบ auth flows และ protected routes

1. ทดสอบ sign in / sign up
2. ทดสอบ protected routes
3. ตรวจสอบ session refresh
4. ทดสอบ social providers ถ้าเปิดใช้

## Rules

### 1. Security

- ใช้ environment variables สำหรับ secrets
- กำหนด `trustedOrigins` อย่างเข้มงวด
- ไม่ expose admin endpoints โดยไม่จำเป็น
- ใช้ HTTPS ใน production

### 2. Type Safety

- ใช้ type-safe client (`better-auth/react`, `/vue`, `/svelte`, `/solid`, `/client`)
- กำหนด session options อย่างถูกต้อง

### 3. Database

- เลือก adapter ที่ตรงกับ ORM ที่ project ใช้
- รัน `npx auth@latest generate` หรือ `npx auth@latest migrate` ก่อน test

### 4. Framework Integration

- ใช้ handler ที่ framework จัดเตรียมไว้ถ้ามี
- mount auth handler ที่ base path เดียวกันเสมอ

### 5. Plugins

- เปิดเฉพาะ plugins ที่จำเป็น
- ติดตั้ง client plugin counterpart ถ้า plugin ต้องการ (เช่น `twoFactorClient`)

### 6. Upgrade

- อัปเกรด `better-auth` และ `@better-auth/*` พร้อมกัน
- อ่าน migration guide ก่อน upgrade major version (เช่น v1.7 มี breaking changes สำหรับ OAuth, MCP, SCIM)

## Expected Outcome

- Auth flow ทำงานถูกต้อง
- Type safety ครบ
- Session security ผ่าน
- Database schema ตรงกับ Better Auth config
- Protected routes ทำงานถูกต้อง
