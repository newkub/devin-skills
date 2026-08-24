---
name: follow-better-auth
description: ใช้งาน Better Auth สำหรับ authentication และ authorization
---

## Goal

ตั้งค่า Better Auth สำหรับ type-safe auth ใน TypeScript projects

## Scope

ใช้กับ Next.js, Nuxt, SvelteKit, SolidStart, หรือ backend ใดๆ ที่รองรับ TypeScript

## Execute

### 1. Install
> Goal: Install

1. ติดตั้ง `better-auth`
2. ติดตั้ง adapter สำหรับ database (prisma, drizzle, mongodb, etc.)
3. ตั้งค่า environment variables

### 2. Configure
> Goal: Configure

1. สร้าง `auth.ts` พร้อม `betterAuth()` config
2. กำหนด plugins (email, oauth, passkey, admin)
3. ตั้งค่า trusted origins
4. กำหนด session ให้ปลอดภัย

### 3. Integrate
> Goal: Integrate

1. สร้าง API route สำหรับ auth handler
2. ใช้ client ใน frontend (`useSession`, `signIn`, `signUp`, `signOut`)
3. จัดการ roles/permissions

### 4. Test
> Goal: Test

1. ทดสอบ sign in / sign up
2. ทดสอบ protected routes
3. ตรวจสอบ session refresh

## Rules

- ใช้ environment variables สำหรับ secrets
- กำหนด trusted origins อย่างเข้มงวด
- ไม่ expose admin endpoints โดยไม่จำเป็น
- ใช้ type-safe client

## Expected Outcome

- Auth flow ทำงานถูกต้อง
- Type safety ครบ
- Session security ผ่าน
