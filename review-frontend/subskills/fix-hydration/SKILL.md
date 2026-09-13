---
name: review-frontend-fix-hydration
description: Fix hydration mismatches and reduce hydration cost — islands, lazy hydration, client JS
argument-hint: "[scope-or-findings]"
related:
  - review-frontend
  - run-profiler
  - run-build
  - run-test
  - review-performance
  - report-before-after
  - report
  - resolve-errors
---

## Goal

แก้ hydration findings จาก `/review-frontend` — ทั้ง hydration mismatch (server/client render ไม่ตรง) และ hydration cost (JS ที่ hydrate ทั้ง page ทั้งที่ส่วนใหญ่ static) ด้วย islands architecture, lazy hydration และลด client-side JS

## Scope

- SSR/SSG frameworks: Next.js, Nuxt, Astro, SvelteKit, SolidStart
- ครอบคลุม: hydration mismatch root causes (non-deterministic render, browser-only APIs, invalid HTML nesting), components ที่ hydrate โดยไม่ interactive, client directives เกิน, third-party scripts ใน hydration path
- Action-oriented: แก้ hydration boundaries จริง — วัด TBT/INP ก่อน-หลัง

## Execute

### 1. Measure And Classify

> Goal: รู้ว่า finding เป็น mismatch หรือ cost พร้อม baseline

1. วัด client bundle ต่อ route — แยก hydration JS จาก critical CSS/data
2. หา long tasks ตอน hydration ด้วย `/run-profiler` หรือ browser tracing
3. สำหรับ mismatch: อ่าน console errors, เทียบ server HTML กับ client render, หา root cause (dates, random, `window`/`localStorage` ตอน render, invalid nesting เช่น `<p>` ครอบ `<div>`)
4. flag pages ที่ mostly static แต่ ship JS เต็ม

### 2. Fix Hydration Mismatches

> Goal: server และ client render output เดียวกัน

1. ย้าย browser-only access (`window`, `localStorage`, `matchMedia`) ไป post-mount (effect, `onMounted`, client directive)
2. ทำ non-deterministic values ให้ stable — locale-locked date format, seeded random, หรือ render หลัง mount
3. แก้ invalid HTML nesting และ conditional render ที่ต่างกันระหว่าง server/client
4. ถ้า content ต่างโดยตั้งใจ → ใช้ two-pass render หรือ `suppressHydrationWarning` เฉพาะ leaf node ที่จำเป็น

### 3. Reduce Hydration Scope

> Goal: hydrate เฉพาะส่วนที่ interactive จริง

1. Map components: interactive (state, events) vs display-only
2. ลบ `client:load`/`'use client'` บน components ที่ไม่มี interactivity — ย้าย display-only กลับ server components
3. Islands: ใช้ `client:*` directives (Astro) หรือ islands pattern ของ framework
4. Lazy hydration: `client:visible`/`client:idle` สำหรับ below-fold/non-critical widgets
5. Defer third-party (chat, analytics, ads) ออกจาก hydration path — load on interaction/idle
6. พิจารณา progressive enhancement/vanilla listeners แทน hydration บางจุด — resumability frameworks (Qwik) เสนอเป็น decision ถ้า cost สูงมาก

### 4. Verify

> Goal: interactivity ครบ metrics ดีขึ้น mismatch หาย

1. ทดสอบ interactions ทั้งหมดจริง — buttons, forms, dynamic sections — ไม่มี hydration errors ใน console
2. วัด TBT/INP/LCP ใหม่ ทำ `/review-performance` ถ้าต้องการ
3. เทียบ JS bytes ต่อ route ด้วย `/report-before-after`

## Rules

- ทุก interactive element ต้องยังทำงาน — ทดสอบจริงไม่ใช่เดา
- lazy hydration ต้อง hydrate ก่อน user interact — visible/idle-triggered ไม่ใช่ never
- mismatch fix ต้องแก้ที่ root cause — ห้าม mask ด้วย `suppressHydrationWarning` ทั้ง tree
- ใช้ primitives ของ framework — ไม่เปลี่ยน rendering strategy ทั้ง app เพื่อ micro-gain
- ระบุ per-route ไม่ใช่ตัวเลขรวมทั้ง app; ถ้า check ไม่ผ่าน → `/resolve-errors` สูงสุด 3 รอบ

## Expected Outcome

- Hydration mismatches หาย — console สะอาด server/client render ตรงกัน
- Hydration JS ลดลงต่อ route พร้อมตัวเลข
- Interactive components hydrate เมื่อจำเป็นเท่านั้น — TBT/INP ดีขึ้น

