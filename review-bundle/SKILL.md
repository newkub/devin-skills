---
name: review-bundle
description: ตรวจสอบ bundle size, build output, chunks และ output ก่อน build production
argument-hint: "[app-or-package]"
related:
  - run-build
  - report
  - review-assets
  - run-review
---

## Goal

ตรวจสอบ bundle size, build output, chunks และ output ก่อน build production โดยไม่แก้ไข config — ส่งต่อ fix ไปยัง section `## Fix` เมื่อ user confirm

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

1. ทำ `/report` ด้วย columns: No., Area, Severity, Finding, Evidence, Fix
2. ชี้ไป section `## Fix` เมื่อ user confirm ให้แก้

### Subskills

> Goal: dispatch งาน fix ไปยัง subskill เมื่อ user confirm ให้แก้ findings

| Topic | Subskill |
|-------|----------|
| Apply bundle findings — dedupe deps, splitting, lazy loading | `subskills/optimize-bundle/SKILL.md` |

## Rules

### 1. Read Only

- ห้ามแก้ไข build config หรือ bundle ระหว่าง review
- ใช้ build output และ analyzer เท่านั้น

### 2. Evidence Required

- ทุก finding ต้องมี bundle size, chunk name หรือ config line
- ไม่แนะนำ chunking โดยไม่มี evidence

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. baseline: `/run-build` + bundle analyzer — sizes ต่อ chunk, biggest deps
2. code splitting: route-based `import()`, vendor split, lazy heavy features
3. tree shaking: named imports, `sideEffects`, dev-only code ออก
4. compression: brotli/gzip, minify, hashed names + long-term cache
5. verify: build เทียบ before/after, smoke test lazy chunks

## References

- [Full-dimension checklist](references/checklist.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /review-assets ถ้าจำเป็น

## Expected Outcome

- รายงาน findings ครอบคลุม bundle size, chunks, deps
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน section `## Fix`
