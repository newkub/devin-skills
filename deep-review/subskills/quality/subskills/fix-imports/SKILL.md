---
name: review-quality-fix-imports
description: Apply import/dependency findings — unused imports, barrel files, heavy imports
argument-hint: "[scope-or-findings]"
related:
  - review-quality
  - follow-tool-knip
  - use-astgrep
  - check-file-relations
  - check-bundle-regression
  - check-monorepo
  - run-lint
  - run-typecheck
  - run-build
  - update-references
  - report-before-after
  - resolve-errors
---

## Goal

Apply import/dependency findings จาก `/review-quality` — ลบ unused imports, แก้ barrel files ที่ทำ tree-shaking พัง, sort/organize imports ตาม convention และลด import cost ของ heavy modules

## Scope

- ตรวจ `import`/`export`/`require` statements ใน JS/TS project
- ครอบคลุม: unused imports, barrel file re-exports, side-effect imports, deep imports ที่ดึงทั้ง package, circular import chains
- Action-oriented: แก้ imports จริง — verify ด้วย lint + typecheck + build
- รายละเอียด fix guide ต้นฉบับ: `references/fix-optimize-imports.md`

## Execute

### 1. Baseline

> Goal: วัด import health ปัจจุบัน

1. รัน `/follow-tool-knip` หรือ lint rule (`unused-imports`) หา unused imports/exports
2. หา barrel files: `index.ts` ที่ `export *` หรือ re-export จำนวนมาก
3. ใช้ `/use-astgrep` หา side-effect imports (`import 'x'`) และ deep imports ของ lib หนัก (`lodash`, `moment`)
4. หา circular import chains ถ้ามี finding — ทำ `/check-file-relations` หรือ `madge`

### 2. Remove Unused Imports

> Goal: ลบ imports ที่ไม่ถูกใช้โดยไม่พัง

1. ใช้ linter auto-fix (`eslint --fix`, `biome check --write`, organize-imports) เท่าที่ทำได้
2. ตรวจที่เหลือด้วย `/use-astgrep` — ระวัง imports ที่มี side effects หรือใช้ใน decorators/reflection
3. รัน `/run-typecheck` หลังลบทุก batch

### 3. Fix Barrel Files

> Goal: barrels ไม่ทำ tree-shaking พัง

1. flag `export *` จาก barrel ที่ดึง modules ทั้งหมด (รวม heavy/side-effect modules)
2. เปลี่ยนเป็น explicit named exports หรือ import ตรงจาก module (`pkg/module` แทน `pkg`)
3. ถ้า bundler รองรับ `package.json` `sideEffects: false` → เพิ่มเพื่อช่วย tree-shaking
4. ตรวจ consumers ก่อนแก้ barrel — ใช้ `/check-file-relations` หา importers

### 4. Reduce Heavy Imports

> Goal: แทนที่ imports ที่ดึง bundle ใหญ่

1. flag default imports ของ lib หนัก → เปลี่ยนเป็น named/subpath imports (`import debounce from 'lodash/debounce'`)
2. flag date/heavy libs → แนะนำทางเลือกเบากว่าผ่าน `/review-dependencies`
3. dynamic import สำหรับ modules ที่ใช้เฉพาะบาง route/branch

### 5. Verify

> Goal: ไม่พังและ bundle ลดลง

1. `/run-lint` + `/run-typecheck` ต้องผ่าน
2. `/run-build` แล้วเทียบ bundle size — ทำ `/check-bundle-regression` หรือ `/report-before-after`

## Rules

- รัน typecheck หลังลบ imports ทุก batch — side-effect imports ต้องไม่ถูกลบ
- ห้ามลบ imports ที่ linter ไม่แน่ใจโดยไม่ตรวจ usage จริง
- barrel files ที่เป็น public API ของ package ต้องไม่เปลี่ยน export surface
- ถ้าเปลี่ยน import paths → ทำ `/update-references` เสมอ
- ใช้ organize-imports config ที่ project มีอยู่; monorepo → ตรวจ `/check-monorepo` ร่วมด้วย
- ถ้า check ไม่ผ่าน → `/resolve-errors` สูงสุด 3 รอบแล้ว report

## Expected Outcome

- Unused imports ถูกลบ — lint/typecheck ผ่าน
- Barrel files ไม่ทำ tree-shaking พัง — heavy imports ถูกแทนที่
- Bundle size ลดลงพร้อมตัวเลข before/after

