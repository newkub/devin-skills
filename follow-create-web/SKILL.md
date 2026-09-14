---
name: follow-create-web
description: เลือกและสร้าง web project ตามประเภท landing, saas, paas หรือ framework ที่ระบุ
argument-hint: "[scope]"
related:
  - follow-create-plugins
  - review-dependencies
  - follow-lib-unocss
  - follow-robots-txt
  - deep-optimize
  - follow-design-system
  - review-uxui
  - follow-service-cloudflare
  - review-frontend
  - run-dev
---
## Goal

เลือกประเภท web project ทีเหมาะสมและส่งต่อให้ skill ทีถูกต้อง

## Scope

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: follow-create-web-landing, follow-create-web-saas, follow-create-web-paas)

- รับ requirement และระบุประเภท web: landing, saas, paas
- ส่งต่องานสร้าง project ไปยัง skill ที่เหมาะสม
- ไม่ลงมือ implement เองโดยตรง

### Framework Skills

| Framework | Skill |
|---|---|
| Astro | `/follow-create-web-astro` |
| Next.js | `/follow-create-web-nextjs` |
| Nuxt | `/follow-create-web-nuxt` |
| SvelteKit | `/follow-create-web-svelte` |
| SolidStart | `/follow-create-web-solidstart` |
| TanStack Start (Solid) | `/follow-create-web-solid-tanstack-router` |
| Docs site (single-page README+docs, Comark Vue → CF Workers) | `/follow-create-web-docs` |

- Latest: Vite `8.3.0` (default toolchain, Rolldown-powered) (verified 2026-09-12)

## Execute

### 1. Gather Requirements

> Goal: เข้าใจ web project

1. รับชื่อ project, target users, และ feature list
2. ระบุ integrations ทีต้องการ: auth, payments, dashboard, CMS, analytics
3. ระบุ SSR, SPA, หรือ full-stack
4. ถ้า user ไม่รู้อยากได้ web แบบไหน → ถามก่อนดำเนินการ

### 2. Choose Web Type

> Goal: เลือกประเภท web

1. ถ้าเป็น static info นำเสนอข้อมูล → สร้างแบบ landing page ตาม flow ของ skill นี้
2. ถ้ามี services + pricing + auth + dashboard → สร้างแบบ SaaS ตาม flow ของ skill นี้
3. ถ้าเป็น saas + advanced UI/UX → สร้างแบบ PaaS/advanced ตาม flow ของ skill นี้
4. ถ้าต้องการ TUI Rust → ทำ `/follow-create-tui-ratatui`
5. ถ้า stack ไม่ชัด → ใช้ default `/follow-create-web-solid-tanstack-router`

### 3. Delegate And Validate

> Goal: ส่งต่องานและตรวจสอบ

1. เรียก skill ทีเลือกพร้อม requirements ทีบันทึกไว้
2. ตรวจสอบว่า skill ทำงานครบถ้วนตาม expected outcome
3. ทำ `/follow-robots-txt` ก่อน deploy เพื่อตั้งค่า `robots.txt` ตามสถานะ site
4. ทำ `/deep-validate` ถ้ามี complex flows

## Rules

### 1. Stack Defaults

- ถ้า user ไม่ระบุ stack → ใช้ SolidJS + TanStack + oRPC + Elysia + UnoCSS สำหรับ saas/paas และ SolidJS + TanStack + UnoCSS สำหรับ landing
- ถ้า user ระบุ stack อื่น → ทำตาม stack นั้น

### 2. Quality

- ทำ `/follow-single-responsibility` หลังจากสร้าง major components
- ทำ `/deep-optimize` สำหรับ SEO/performance/bundle
- ทำ `/review-frontend` ก่อน deploy
- ทำ `/implement-to-production` หลัง website เสร็จ

### 3. Safety

- ไม่ commit secrets ลง repository
- ใช้ `/follow-secret-manager` สำหรับ API keys, DB URLs และ secrets
- ใช้ `environment variables` สำหรับ non-sensitive config
- ถ้ามี destructive changes → dry run ก่อน

### 4. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ paths, commands, skill names
- รายงานด้วย `/report`

- ใช้ /review-dependencies ถ้าจำเป็น
- ใช้ /review-dependencies ถ้าจำเป็น
- ใช้ /follow-lib-unocss ถ้าจำเป็น
- ใช้ /follow-design-system ถ้าจำเป็น
- ใช้ /review-uxui ถ้าจำเป็น
- ใช้ /follow-service-cloudflare ถ้า deploy บน Cloudflare
- ใช้ /run-dev ถ้าจำเป็น
- ใช้ /follow-create-plugins ถ้าจำเป็น


## Expected Outcome

- ประเภท web ถูกเลือกตาม requirements
- Project ถูกสร้างโดย skill ทีเหมาะสม
- Type safety ระหว่าง client และ server
- Tests ผ่านหรือมี plan ทีชัดเจน
- พร้อม deploy หรือ deploy สำเร็จ
