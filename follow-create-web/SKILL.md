---
name: follow-create-web
description: เลือกและสร้าง web project ตามประเภท landing, saas หรือ paas
related:
  - follow-create-web-landing
  - follow-create-web-saas
  - follow-create-web-paas
  - follow-create-tui
  - follow-my-tech-stack
  - review-techstack
  - follow-solid-tanstack
  - follow-lib-unocss
  - follow-robots-txt
---

## Goal

เลือกประเภท web project ทีเหมาะสมและส่งต่อให้ sub-skill ทีถูกต้อง

## Scope

- รับ requirement และระบุประเภท web: landing, saas, paas
- ส่งต่องานสร้าง project ไปยัง sub-skill
- ไม่ลงมือ implement เองโดยตรง

## Execute

### 1. Gather Requirements

> Goal: เข้าใจ web project

1. รับชื่อ project, target users, และ feature list
2. ระบุ integrations ทีต้องการ: auth, payments, dashboard, CMS, analytics
3. ระบุ SSR, SPA, หรือ full-stack
4. ถ้า user ไม่รู้อยากได้ web แบบไหน → ถามก่อนดำเนินการ

### 2. Choose Web Type

> Goal: เลือกประเภท web

1. ถ้าเป็น static info นำเสนอข้อมูล → ทำ `/follow-create-web-landing`
2. ถ้ามี services + pricing + auth + dashboard → ทำ `/follow-create-web-saas`
3. ถ้าเป็น saas + advanced UI/UX → ทำ `/follow-create-web-paas`
4. ถ้าต้องการ TUI Rust → ทำ `/follow-create-tui`
5. ถ้า stack ไม่ชัด → ใช้ default `/follow-solid-tanstack`

### 3. Delegate And Validate

> Goal: ส่งต่องานและตรวจสอบ

1. เรียก sub-skill ทีเลือกพร้อม requirements ทีบันทึกไว้
2. ตรวจสอบว่า sub-skill ทำงานครบถ้วนตาม expected outcome
3. ทำ `/follow-robots-txt` ก่อน deploy เพื่อตั้งค่า `robots.txt` ตามสถานะ site
4. ทำ `/deep-validate` ถ้ามี complex flows

## Rules

### 1. Stack Defaults

- ถ้า user ไม่ระบุ stack → ใช้ SolidJS + TanStack + oRPC + Elysia + UnoCSS สำหรับ saas/paas และ SolidJS + TanStack + UnoCSS สำหรับ landing
- ถ้า user ระบุ stack อื่น → ทำตาม stack นั้น

### 2. Quality

- ทำ `/follow-single-responsibility` หลังจากสร้าง major components
- ทำ `/review-frontend` ก่อน deploy
- ทำ `/realize-implementation` หลัง website เสร็จ

### 3. Safety

- ไม่ commit secrets ลง repository
- ใช้ `/follow-secret-manager` สำหรับ API keys, DB URLs และ secrets
- ใช้ `environment variables` สำหรับ non-sensitive config
- ถ้ามี destructive changes → dry run ก่อน

### 4. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ paths, commands, skill names
- รายงานด้วย `/report-table`

## Expected Outcome

- ประเภท web ถูกเลือกตาม requirements
- Project ถูกสร้างโดย sub-skill ทีเหมาะสม
- Type safety ระหว่าง client และ server
- Tests ผ่านหรือมี plan ทีชัดเจน
- พร้อม deploy หรือ deploy สำเร็จ
