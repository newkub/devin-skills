---
name: review-bundle
description: ตรวจสอบ bundle size, build output, chunks และ output ก่อน build production
argument-hint: "[app-or-package]"
related:
  - optimize-bundle
  - run-build
  - report-table
  - review-assets
---

## Goal

ตรวจสอบ bundle size, build output, chunks และ output ก่อน build production โดยไม่แก้ไข config ก่อนส่งต่อให้ `/optimize-bundle`

## Scope

ใช้กับ project ที่ใช้ Vite / Rolldown / esbuild / Webpack หรือ bundler ใดก็ตาม โดยเฉพาะ monorepo

## Execute

### 1. Inspect Build Configuration

> Goal: เข้าใจ build config

1. อ่าน `package.json` scripts ที่เกี่ยวกับ build, dev, deploy
2. อ่าน `vite.config.*`, `tsup.config.*`, `wrangler.jsonc`, `turbo.json`
3. ระบุ framework และ output target

### 2. Analyze Bundle Output

> Goal: รู้ว่า output มีปัญหาอะไร

1. ทำ `/run-build` แล้วใช้ bundle analyzer
2. วัด `dist/` size
3. ค้นหา chunks ทีใหญ่เกิน 500 kB และ duplicate vendor modules

### 3. Review Chunk And Dependency Strategy

> Goal: ประเมิน chunking และ deps

1. ตรวจ manual chunks และ dynamic imports
2. ตรวจ tree shaking และ dead code
3. ตรวจ third-party dependencies ที bundle ซ้ำ

### 4. Rate And Report

> Goal: สรุป findings พร้อม fix direction

1. ทำ `/report-table` ด้วย columns: No., Area, Severity, Finding, Evidence, Fix
2. ชี้ไป `/optimize-bundle` สำหรับการแก้ไข
3. ถ้ามี assets ปัญหาด้วย → เชื่อม `/review-assets`

## Rules

### 1. Read Only

- ห้ามแก้ไข build config หรือ bundle ระหว่าง review
- ใช้ build output และ analyzer เท่านั้น

### 2. Evidence Required

- ทุก finding ต้องมี bundle size, chunk name หรือ config line
- ไม่แนะนำ chunking โดยไม่มี evidence

## Expected Outcome

- รายงาน findings ครอบคลุม bundle size, chunks, deps
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน `/optimize-bundle`
