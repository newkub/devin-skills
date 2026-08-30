---
name: follow-lib-better-auth
description: ใช้งาน Better Auth สำหรับ authentication และ authorization
related:
  - use-lib-better
  - follow-lib-animejs
  - follow-lib-arktype
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ตั้งค่า Better Auth สำหรับ type-safe auth ใน TypeScript projects

## Scope

ใช้กับ Next.js, Nuxt, SvelteKit, SolidStart, หรือ backend ใดๆ ที่รองรับ TypeScript

## Execute

### 1. Install

> Goal: ติดตั้ง Better Auth และ database adapter

1. ติดตั้ง `better-auth`
2. ติดตั้ง adapter สำหรับ database (`prisma`, `drizzle`, `mongodb`, etc.)
3. ตั้งค่า environment variables

### 2. Configure

> Goal: สร้าง auth config พร้อม plugins และ session settings

1. สร้าง `auth.ts` พร้อม `betterAuth()` config
2. กำหนด plugins (`email`, `oauth`, `passkey`, `admin`)
3. ตั้งค่า trusted origins
4. กำหนด session ให้ปลอดภัย

### 3. Integrate

> Goal: เชื่อมต่อ auth กับ frontend และ backend routes

1. สร้าง API route สำหรับ auth handler
2. ใช้ client ใน frontend (`useSession`, `signIn`, `signUp`, `signOut`)
3. จัดการ roles/permissions

### 4. Test

> Goal: ทดสอบ auth flows และ protected routes

1. ทดสอบ sign in / sign up
2. ทดสอบ protected routes
3. ตรวจสอบ session refresh

## Rules

### 1. Security

- ใช้ environment variables สำหรับ secrets
- กำหนด trusted origins อย่างเข้มงวด
- ไม่ expose admin endpoints โดยไม่จำเป็น

### 2. Type Safety

- ใช้ type-safe client
- กำหนด session ให้ปลอดภัย

- ใช้ /use-lib-better ถ้าจำเป็น
- ใช้ /follow-lib-animejs ถ้าจำเป็น
- ใช้ /follow-lib-arktype ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /use-my-packages-on-registry ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น

## Expected Outcome

- Auth flow ทำงานถูกต้อง
- Type safety ครบ
- Session security ผ่าน