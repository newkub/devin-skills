---
name: follow-create-website
description: Create a website project using SolidJS, TanStack, oRPC, Elysia, and UnoCSS
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - deploy-to-cloudflare
  - deploy-to-vercel
  - follow-my-tech-stack
  - review-techstack
  - follow-create-sdk
---
## Goal

สร้าง website project ด้วย stack SolidJS, TanStack Start, oRPC, Elysia และ UnoCSS ตามมาตรฐานที่กำหนด

## Scope

- สร้าง website project จาก scratch
- เลือกและตั้งค่า stack (default คือ SolidJS + TanStack)
- ติดตั้ง dependencies และ config ทีจำเป็น
- สร้าง pages, routes, components, API
- ตรวจสอบ quality และ deploy

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Gather Requirements

> Goal: เข้าใจ scope ของ website

1. รับชื่อ project, target users, และ feature list จาก user
2. ระบุว่าต้องการ SSR, SPA, หรือ full-stack
3. ระบุ integrations: auth, payments, CMS, analytics
4. ถ้า stack ไม่ชัด → ใช้ default `/follow-solid-tanstack`

### 3. Choose Stack

> Goal: เลือก stack ทีเหมาะสม

1. ถ้า user ต้องการ SolidJS + TanStack → ทำ `/follow-solid-tanstack`
2. ถ้าต้องการ React + Next.js → ทำ `/follow-framework-nextjs` หรือ `/follow-lib-react`
3. ถ้าต้องการ Vue → ทำ `/follow-lib-vue` หรือ Nuxt → ทำ `/follow-framework-nuxt`
4. บันทึกเหตุผลทีเลือก stack นั้น

### 4. Setup Framework

> Goal: สร้าง scaffold project

1. ทำ `/follow-solid-tanstack` เพื่อ setup project structure
2. ตรวจสอบ `package.json`, `tsconfig.json`, `vite.config.ts`
3. รัน `bun install` และ `bun run dev` ทดสอบว่า project รันได้

### 5. Configure TanStack Ecosystem

> Goal: ใช้ TanStack libraries ให้เหมาะสม

1. ทำ `/follow-lib-tanstack-ecosystem` เพื่อเลือก Query, Form, Table, Virtual ตาม feature
2. ตั้งค่า providers และ clients ใน entry point
3. ตรวจสอบ type safety ของ router และ query

### 6. Add Effect-TS If Needed

> Goal: ใช้ Effect-TS ถ้าต้องการ functional programming patterns

1. ถ้ามี complex async flows, error handling, หรือ DI → ทำ `/follow-lib-effect-ts`
2. ตรวจสอบว่า Effect-TS ไม่ซ้อนทับ patterns ของ oRPC
3. ใช้ Effect สำหรับ business logic ไม่ใช้ client-side state

### 7. Design Components And Pages

> Goal: สร้าง UI ทีเป็นระเบียบ

1. ใช้ `/review-uxui` ออกแบบ layout, navigation, responsive
2. สร้าง `src/routes/` สำหรับ TanStack file-based routing
3. สร้าง `src/components/` สำหรับ reusable UI
4. ทำ `/follow-single-responsibility` เพื่อตรวจสอบแต่ละ component/page ทำงานเดียว

### 8. Build API And Data Layer

> Goal: สร้าง API สำหรับ website

1. ใช้ oRPC procedures ใน `src/rpc/`
2. ใช้ TanStack Query สำหรับ data fetching
3. ใช้ Zod สำหรับ validation
4. ตรวจสอบ type safety จาก client ถึง server

### 9. Style And Polish

> Goal: ใช้ UnoCSS และ theme system

1. ทำ `/follow-lib-unocss` เพื่อตั้งค่า theme, presets, icons
2. ใช้ design tokens สำหรับ colors, spacing, typography
3. ตรวจสอบ dark mode และ responsive

### 10. Test And Validate

> Goal: ตรวจสอบว่า website ทำงานถูกต้อง

1. รัน `bun run build` และ `bun run start`
2. ทำ `/run-test-all` สำหรับ unit, integration, e2e
3. ทำ `/review-frontend` เพื่อตรวจ accessibility, performance
4. ทำ `/deep-validate` ถ้ามี complex flows

### 11. Deploy

> Goal: deploy website ไปยัง target platform

1. ถ้า Cloudflare → ทำ `/follow-service-cloudflare`
2. ถ้า Vercel → ทำ `/follow-service-vercel`
3. ตรวจสอบ environment variables และ build config
4. ทดสอบ production URL

#### 11.2 Register As Devin Skill If Needed

> Goal: ถ้า website เป็น devin skill ให้ update registry

1. ถ้า project นี้จะเป็น devin global skill → ทำ `/update-devin-global-skills`
2. อัปเดต `AGENTS.md` และ `README.md`
3. ทำ `/deep-validate` เพื่อตรวจสอบ conventions

## Rules

### 1. Stack Defaults

- ถ้า user ไม่ระบุ stack → ใช้ SolidJS + TanStack + oRPC + Elysia + UnoCSS
- ถ้า user ระบุ stack อื่น → ทำตาม stack นั้นแทน

### 2. Quality

- ทำ `/follow-single-responsibility` หลังจากสร้าง major components
- ทำ `/review-frontend` ก่อน deploy
- ทำ `/realize-implementation` หลัง website เสร็จ

### 3. References

- ใช้ `?follow-solid-tanstack/references/` สำหรับ details ของ oRPC, Elysia, TanStack Start, UnoCSS
- ใช้ `?follow-lib-tanstack-ecosystem/references/index.md` สำหรับ TanStack libraries
- ใช้ `?follow-lib-effect-ts/references/index.md` สำหรับ Effect-TS

### 4. Safety

- ไม่ commit secrets ลง repository
- ใช้ `/follow-secret-manager` สำหรับจัดการ API keys, DB URLs และ secrets ทั้งหมด
- ใช้ `environment variables` สำหรับ non-sensitive config
- ถ้ามี destructive changes → dry run ก่อน

### 5. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ paths, commands, skill names
- รายงานด้วย `/report-table`

## Expected Outcome

- Website project รันด้วย SolidJS + TanStack + oRPC + Elysia + UnoCSS
- Project structure, routing, components, API ครบถ้วน
- Type safety ระหว่าง client และ server
- Tests ผ่านหรือมี plan ทีชัดเจน
- Deploy สำเร็จหรือพร้อมสำหรับ deploy
- AGENTS.md อัปเดตถ้า project เป็น devin skill