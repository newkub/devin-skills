---
name: follow-create-product
description: สร้าง product ครบวงจรจาก idea ถึง website พร้อม auth, payments, dashboard และ ship
argument-hint: "[product-idea]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - follow-create-web
  - follow-service-workos
  - follow-service-stripe
  - follow-lib-unocss-theme
  - follow-design-system
  - review-uxui
  - ship
  - report-table
  - enhance-prompt
  - follow-my-tech-stack
  - review-techstack
  - realize-implementation
---

## Goal

แปลง idea หรือ requirements เป็น product ทีพร้อมใช้งาน ครอบคลุม product spec, UX/UI, landing page, `/features`, `/pricing`, `/user`, `/dashboard`, auth, payments, และ ship

## Scope

- ใช้กับ product ทีมี website, user pages, billing, และ dashboard
- สร้าง product spec, user stories, และ roadmap ก่อนลงมือ build
- เรียก `/follow-create-web` เพื่อสร้าง website project
- เรียก `/follow-service-workos` สำหรับ auth
- เรียก `/follow-service-stripe` สำหรับ payments, pricing, billing
- เรียก `/ship` เมื่องานเสร็จ

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Understand Input

> Goal: วิเคราะห์ product idea

1. รับ `product-idea`, requirements, หรือ feedback จาก user
2. ระบุ target users และ personas
3. ระบุ problems ทีจะแก้
4. ระบุ value proposition
5. ถ้า input กำกวม → ใช้ `/enhance-prompt` หรือ `/ask-me` ก่อน

### 3. Define Product Scope

> Goal: กำหนดขอบเขต product

1. ระบุ core features
2. ระบุ MVP scope
3. ระบุ out-of-scope
4. ระบุ success metrics
5. ใช้ `/report-table` สรุป scope, priority, effort

### 4. Build Product Spec

> Goal: เขียน product specification

1. Overview และ goals
2. User personas และ use cases
3. Feature list พร้อม priority
4. User stories รูปแบบ `As a [user] I want [feature] so that [benefit]`
5. Acceptance criteria สำหรับแต่ละ feature
6. Metrics และ KPIs

### 5. Create Roadmap

> Goal: วางแผนการพัฒนา

1. แบ่ง phase: `now`, `next`, `later`
2. ระบุ dependencies ระหว่าง features
3. ประเมิน effort แบบ rough (S/M/L)
4. ใช้ `/report-table` สรุป roadmap

### 6. Design UX And Pages

> Goal: ออกแบบ UX/UI และ page structure

1. ใช้ `/follow-design-system` เพื่อกำหนด design principles
2. ใช้ `/follow-lib-unocss-theme` เพื่อสร้าง theme tokens
3. วาง page structure: `/` landing, `/features`, `/pricing`, `/user`, `/dashboard`
4. ใช้ `/review-uxui` ตรวจ layout, navigation, responsive, CTA
5. สร้าง wireframe/sketch ด้วย `/report-uxui-sketch` ถ้าจำเป็น

### 7. Create Website

> Goal: สร้าง website project

1. เรียก `/follow-create-web` พร้อม product spec และ page list
2. สร้าง routes สำหรับ `/`, `/features`, `/pricing`, `/user`, `/dashboard`
3. ใช้ `/follow-single-responsibility` ตรวจแต่ละ page/component
4. ทดสอบ dev server และ build

### 8. Add Authentication

> Goal: เพิ่มระบบ user auth

1. เรียก `/follow-service-workos` ถ้าต้องการ SSO/Directory Sync
2. หรือเรียก `/follow-lib-better-auth` สำหรับ auth ใน app
3. สร้าง `/user` page แสดง profile, settings
4. ปกป้อง `/dashboard` ด้วย auth guard

### 9. Add Payments

> Goal: เพิ่ม billing และ pricing

1. เรียก `/follow-service-stripe`
2. สร้าง `/pricing` page แสดง plans พร้อม CTA
3. สร้าง `/user/billing` page สำหรับ manage subscription
4. เชื่อม Stripe webhooks เข้ากับ `/dashboard`

### 10. Build Product Pages

> Goal: สร้างเนื้อหาและ features บนแต่ละ page

1. `/` landing page: hero, value prop, social proof, CTA
2. `/features`: feature list พร้อม screenshots/illustrations
3. `/pricing`: plans, comparison, FAQ
4. `/user`: profile, settings, billing shortcut
5. `/dashboard`: overview, metrics, upgrade prompts
6. ใช้ `/realize-implementation` เพื่อตรวจว่าไม่มี TODO/MOCK/placeholder

### 11. Ship

> Goal: ส่งมอบ product

1. เรียก `/deep-validate` สำหรับ type, quality, security, cross-reference
2. เรียก `/run-test-all` ถ้ามี tests
3. เรียก `/ship` เพื่อ commit และ deploy
4. รายงาน product URL, features, และ next actions

## Rules

### 1. MVP First

- สร้าง product spec ก่อน build
- ลงมือ build ทีละ phase
- ไม่ over-engineer ก่อน validate

### 2. User Centric

- เน้น user problem และ benefit ในแต่ละ page
- ทุก feature ควรมี user story และ acceptance criteria
- ระบุ personas ชัดเจน

### 3. Page Conventions

- `/` เป็น landing page
- `/features` แสดงคุณสมบัติ
- `/pricing` แสดงแผนและ CTA
- `/user` สำหรับ profile และ billing
- `/dashboard` สำหรับ overview หลัง login

### 4. No Leaks

- ไม่ hardcode API keys, secrets, credentials
- ใช้ `/follow-secret-manager` สำหรับจัดการ secrets และ environment variables ทั้งหมด
- ตรวจสอบ webhook signatures

### 5. UX Quality

- ใช้ `/review-uxui` ก่อน ship
- ทำ responsive, dark mode, accessible
- ใช้ design tokens สม่ำเสมอ

- ใช้ /open-web-for-config-secret ถ้าจำเป็น

## Expected Outcome

- Product spec ครบถ้วน
- User stories พร้อม acceptance criteria
- Roadmap แบ่ง phase
- Website รันได้ด้วย pages ครบ
- Auth และ payments ทำงาน
- `/pricing`, `/user`, `/dashboard`, `/features` พร้อมใช้งาน
- Product ถูก ship พร้อม URL และ next actions

