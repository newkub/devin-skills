---
name: follow-create-web-landing
description: สร้าง static landing website ด้วย SolidJS, TanStack และ UnoCSS
related:
  - follow-create-web
  - follow-create-web-saas
  - follow-create-web-paas
  - follow-solid-tanstack
  - follow-lib-unocss
  - review-uxui
  - review-frontend
  - follow-service-cloudflare
  - deploy-to-cloudflare
  - deploy-to-vercel
---

## Goal

สร้าง static landing website ทีนำเสนอข้อมูล แสดงผลเร็ว และ responsive

## Scope

- สร้าง landing website จาก scratch
- ใช้ SolidJS + TanStack + UnoCSS
- ไม่ต้อง auth, payments, dashboard, หรือ backend API
- เน้น content, SEO, responsive, และ speed

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack

1. ทำ `/follow-my-tech-stack` เพื่อสรุป stack
2. ทำ `/review-techstack` เพื่อ review dependencies
3. บันทึกเหตุผลทีเลือก stack

### 2. Gather Requirements

> Goal: เข้าใจ scope

1. รับชื่อ project, target users, feature list
2. ระบุ sections: hero, features, about, pricing, contact, CTA, footer
3. ระบุ integrations: analytics, SEO, CMS, contact form
4. ถ้า stack ไม่ชัด → ใช้ default SolidJS + TanStack + UnoCSS

### 3. Setup Framework

> Goal: สร้าง scaffold

1. ทำ `/follow-solid-tanstack` เพื่อ setup project
2. ตรวจสอบ `package.json`, `tsconfig.json`, `vite.config.ts`
3. รัน `bun install` และ `bun run dev`

### 4. Configure TanStack Ecosystem

> Goal: ใช้ TanStack libraries ให้เหมาะสม

1. ทำ `/follow-lib-tanstack-ecosystem` เลือก Query, Form, Table ตาม feature
2. ตั้งค่า providers และ clients ใน entry point
3. ตรวจสอบ type safety ของ router

### 5. Design Components And Pages

> Goal: สร้าง UI

1. ใช้ `/review-uxui` ออกแบบ layout, navigation, responsive
2. สร้าง `src/routes/` สำหรับ TanStack file-based routing
3. สร้าง `src/components/` สำหรับ reusable sections
4. ทำ `/follow-single-responsibility` ตรวจสอบแต่ละ component

### 6. Style And Polish

> Goal: ใช้ UnoCSS

1. ทำ `/follow-lib-unocss` ตั้งค่า theme, presets, icons
2. ใช้ design tokens สำหรับ colors, spacing, typography
3. ตรวจสอบ dark mode และ responsive

### 7. SEO And Static Export

> Goal: รองรับ SEO และ static hosting

1. ตั้งค่า meta tags, Open Graph, JSON-LD ในแต่ละ route
2. ใช้ static export ถ้า deploy บน CDN
3. ตรวจสอบ sitemap และ robots.txt

### 8. Test And Validate

> Goal: ตรวจสอบ website

1. รัน `bun run build` และ `bun run start`
2. ทำ `/run-test-all` สำหรับ unit, integration, e2e
3. ทำ `/review-frontend` ตรวจ accessibility, performance

### 9. Deploy

> Goal: deploy website

1. ถ้า Cloudflare → ทำ `/follow-service-cloudflare`
2. ถ้า Vercel → ทำ `/follow-service-vercel`
3. ตรวจสอบ environment variables และ build config
4. ทดสอบ production URL

## Rules

### 1. Stack Defaults

- ถ้า user ไม่ระบุ stack → ใช้ SolidJS + TanStack + UnoCSS
- ไม่ใช้ oRPC หรือ Elysia ยกเว้นมี backend จำเป็น

### 2. Quality

- ทำ `/follow-single-responsibility` หลัง major components
- ทำ `/review-frontend` ก่อน deploy
- ทำ `/productionize-implementation` หลังเสร็จ

### 3. References

- ใช้ `?follow-solid-tanstack/references/` สำหรับ framework details
- ใช้ `?follow-lib-tanstack-ecosystem/references/index.md` สำหรับ libraries
- ใช้ `?follow-lib-unocss/references/index.md` สำหรับ UnoCSS

### 4. Safety

- ไม่ commit secrets ลง repository
- ใช้ `/follow-secret-manager` สำหรับ secrets
- ใช้ `environment variables` สำหรับ non-sensitive config

- ใช้ /follow-create-web ถ้าจำเป็น
- ใช้ /follow-create-web-saas ถ้าจำเป็น
- ใช้ /follow-create-web-paas ถ้าจำเป็น
- ใช้ /deploy-to-cloudflare ถ้าจำเป็น
- ใช้ /deploy-to-vercel ถ้าจำเป็น

## Expected Outcome

- Landing website รันด้วย SolidJS + TanStack + UnoCSS
- Project structure, routing, components ครบถ้วน
- SEO และ responsive รองรับ
- Tests ผ่านหรือมี plan
- Deploy สำเร็จหรือพร้อม deploy
