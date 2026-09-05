---
name: follow-create-web-saas
description: สร้าง SaaS website ด้วย SolidJS, TanStack, oRPC, Elysia, UnoCSS
related:
  - follow-create-web
  - follow-create-web-landing
  - follow-create-web-paas
  - follow-solid-tanstack
  - follow-lib-unocss
  - follow-lib-better-auth
  - follow-service-stripe
  - review-uxui
  - review-frontend
  - follow-service-cloudflare
  - deploy-to-cloudflare
  - deploy-to-vercel
---

## Goal

สร้าง SaaS website ทีมี services, pricing, auth, และ dashboard

## Scope

- สร้าง SaaS project จาก scratch
- ใช้ SolidJS + TanStack Start + oRPC + Elysia + UnoCSS
- มี landing, pricing, auth, dashboard, admin
- รองรับ payments และ subscriptions

## Execute

### 1. Review Tech Stack And Gather Requirements

> Goal: ตรวจสอบ tech stack และเข้าใจ scope

1. ทำ `/follow-my-tech-stack` เพื่อสรุป stack
2. ทำ `/review-techstack` เพื่อ review dependencies
3. บันทึกเหตุผลทีเลือก stack
4. รับชื่อ project, target users, และ feature list
5. ระบุ SSR หรือ full-stack
6. ระบุ integrations: auth, payments (Stripe), CMS, analytics
7. ถ้า stack ไม่ชัด → ใช้ default `/follow-solid-tanstack`

### 2. Setup Framework

> Goal: สร้าง scaffold

1. ทำ `/follow-solid-tanstack` เพื่อ setup project
2. ตรวจสอบ `package.json`, `tsconfig.json`, `vite.config.ts`
3. รัน `bun install` และ `bun run dev`

### 3. Configure TanStack Ecosystem

> Goal: ใช้ TanStack libraries

1. ทำ `/follow-lib-tanstack-ecosystem` เลือก Query, Form, Table ตาม feature
2. ตั้งค่า providers และ clients ใน entry point
3. ตรวจสอบ type safety ของ router และ query

### 4. Add Auth

> Goal: จัดการ authentication

1. ทำ `/follow-lib-better-auth` เลือก provider
2. สร้าง `src/routes/login`, `src/routes/register`, `src/routes/dashboard`
3. ป้องกัน routes ทีต้อง auth ด้วย middleware
4. ตรวจสอบ session, token, refresh logic

### 5. Add Payments

> Goal: รองรับ payments

1. ทำ `/follow-service-stripe` ตั้งค่า Stripe
2. สร้าง `src/routes/pricing`
3. สร้าง checkout flow และ webhook handler
4. ตรวจสอบ subscription status ใน dashboard

### 6. Build API And Data Layer

> Goal: สร้าง API

1. ใช้ oRPC procedures ใน `src/rpc/`
2. ใช้ TanStack Query สำหรับ data fetching
3. ใช้ Zod สำหรับ validation
4. ตรวจสอบ type safety จาก client ถึง server

### 7. Design Components And Pages

> Goal: สร้าง UI

1. ใช้ `/review-uxui` ออกแบบ layout, navigation, responsive
2. สร้าง `src/routes/` สำหรับ TanStack file-based routing
3. สร้าง `src/components/` สำหรับ reusable UI
4. ทำ `/follow-single-responsibility` ตรวจสอบแต่ละ component

### 8. Build Dashboard

> Goal: สร้าง dashboard

1. สร้าง `src/routes/dashboard` พร้อม sidebar/topnav
2. สร้างหน้า overview, settings, billing
3. ใช้ TanStack Table สำหรับ data grids
4. รองรับ role-based UI

### 9. Style And Polish

> Goal: ใช้ UnoCSS

1. ทำ `/follow-lib-unocss` ตั้งค่า theme, presets, icons
2. ใช้ design tokens สำหรับ colors, spacing, typography
3. ตรวจสอบ dark mode และ responsive

### 10. Test, Validate And Deploy

> Goal: test, validate และ deploy website

1. ทำ `/run-test-all` สำหรับ unit, integration, e2e
2. ทำ `/review-frontend` ตรวจ accessibility, performance
3. ทำ `/deep-validate` ถ้ามี complex flows
4. ถ้า Cloudflare → ทำ `/follow-service-cloudflare`
5. ถ้า Vercel → ทำ `/follow-service-vercel`
6. ตรวจสอบ environment variables และ build config
7. ทดสอบ production URL

## Rules

### 1. Stack Defaults

- ถ้า user ไม่ระบุ stack → ใช้ SolidJS + TanStack + oRPC + Elysia + UnoCSS
- ถ้า user ระบุ stack อื่น → ทำตาม stack นั้น

### 2. Quality

- ทำ `/follow-single-responsibility` หลัง major components
- ทำ `/review-frontend` ก่อน deploy
- ทำ `/productionize-implementation` หลังเสร็จ

### 3. References

- ใช้ `?follow-solid-tanstack/references/` สำหรับ oRPC, Elysia, TanStack Start, UnoCSS
- ใช้ `?follow-lib-tanstack-ecosystem/references/index.md` สำหรับ TanStack libraries
- ใช้ `?follow-lib-effect-ts/references/index.md` ถ้าใช้ Effect-TS

### 4. Safety

- ไม่ commit secrets ลง repository
- ใช้ `/follow-secret-manager` สำหรับ secrets
- ใช้ `environment variables` สำหรับ non-sensitive config
- ถ้ามี destructive changes → dry run ก่อน

- ใช้ /follow-create-web ถ้าจำเป็น
- ใช้ /follow-create-web-landing ถ้าจำเป็น
- ใช้ /follow-create-web-paas ถ้าจำเป็น
- ใช้ /deploy-to-cloudflare ถ้าจำเป็น
- ใช้ /deploy-to-vercel ถ้าจำเป็น

## Expected Outcome

- SaaS website รันด้วย SolidJS + TanStack + oRPC + Elysia + UnoCSS
- Project structure, routing, components, API ครบถ้วน
- Auth, pricing, dashboard, payments ทำงานได้
- Type safety ระหว่าง client และ server
- Tests ผ่านหรือมี plan
- Deploy สำเร็จหรือพร้อม deploy
