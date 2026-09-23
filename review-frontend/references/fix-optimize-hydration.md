# Fix Guide

(merged from: optimize-hydration)

## Goal

ลด hydration cost ของ SSR/SSG pages — JS ที่ต้อง hydrate ทั้ง page ทั้งที่ส่วนใหญ่ static — ด้วย islands architecture, lazy hydration และลด client-side JS

## Scope

- ตรวจ SSR frameworks: Next.js, Nuxt, Astro, SvelteKit, SolidStart
- ครอบคลุม: components ที่ hydrate โดยไม่ interactive, client directives เกิน, large hydration trees, third-party scripts ใน hydration path
- Action-oriented: แก้ hydration boundaries จริง — วัด TBT/INP ก่อน-หลัง

## Execute

### 1. Measure Hydration Cost

> Goal: วัด JS ที่ hydrate ต่อ page

1. วัด client bundle ที่ load ต่อ route — แยก hydration JS จาก critical CSS/data
2. หา long tasks ตอน hydration — `/run-profiler` หรือ browser tracing
3. flag: pages ที่ mostly static แต่ ship JS เต็ม

### 2. Identify Hydration Boundaries

> Goal: หาส่วนที่ต้อง interactive จริง

1. map components: interactive (state, events) vs display-only
2. flag: `client:load`/`'use client'` บน components ที่ไม่มี interactivity
3. flag: third-party widgets (chat, analytics) ที่ hydrate ทันทีทั้งที่ใช้ทีหลัง

### 3. Apply Optimizations

> Goal: ลด hydration scope ตาม framework

1. Islands: แปลงเป็น islands ถ้า framework รองรับ — Astro `client:*` directives, Fresh islands
2. Lazy hydration: `client:visible`/`client:idle` สำหรับ below-fold/non-critical widgets
3. Reduce client components: Next/Nuxt — ย้าย display-only กลับ server components
4. Event delegation: แทน hydration บางจุดด้วย progressive enhancement/vanilla listeners
5. Split third-party: defer chat/analytics/ads ออกจาก hydration path — load on interaction/idle
6. Resumability: พิจารณา frameworks ที่ไม่ hydrate เลย (Qwik) ถ้า cost สูงมาก — เสนอเป็น decision

### 4. Verify

> Goal: ยืนยัน interactivity ครบและ metrics ดีขึ้น

1. ทดสอบ interactions ทั้งหมดยังทำงาน — buttons, forms, dynamic sections
2. วัด TBT/INP/LCP ใหม่ — `/review-performance`
3. เทียบ JS bytes ต่อ route — `/report-before-after`

## Rules

### 1. Interactivity Preserved

- ทุก interactive element ต้องยังทำงาน — ทดสอบจริงไม่ใช่เดา
- lazy hydration ต้อง hydrate ก่อน user interact — visible-triggered ไม่ใช่ never

### 2. Measure First

- มี baseline JS/hydration cost — แก้เฉพาะที่มี evidence
- ระบุ per-route ไม่ใช่ตัวเลขรวมทั้ง app

### 3. Framework Idiomatic

- ใช้ primitives ของ framework (server components, islands, lazy) — ไม่สร้าง workaround เอง
- ไม่เปลี่ยน rendering strategy ทั้ง app เพื่อ micro-gain

## Expected Outcome

- Hydration JS ลดลงต่อ route พร้อมตัวเลข
- Interactive components hydrate เมื่อจำเป็นเท่านั้น
- TBT/INP ดีขึ้นโดยไม่เสีย functionality
