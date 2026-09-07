---
name: optimize-imports
description: จัดการ imports ทั้ง project ลบ unused, แก้ barrel files ที่ทำ tree-shaking พัง
argument-hint: "[path]"
related:
  - run-lint
  - follow-tool-knip
  - use-astgrep
  - report-before-after
---

## Goal

ปรับ import structure ทั้ง project — ลบ unused imports, แก้ barrel files (`index.ts` re-export) ที่ทำ tree-shaking พัง, sort/organize imports ตาม convention และลด import cost ของ heavy modules

## Scope

- ตรวจ `import`/`export`/`require` statements ใน JS/TS project
- ครอบคลุม: unused imports, barrel file re-exports, side-effect imports, deep imports ที่ดึงทั้ง package, circular import chains
- Action-oriented: แก้ imports จริง — verify ด้วย lint + typecheck + build

## Execute

### 1. Baseline

> Goal: วัด import health ปัจจุบัน

1. รัน `/follow-tool-knip` หรือ lint rule (`unused-imports`) หา unused imports/exports
2. หา barrel files: `index.ts` ที่ `export *` หรือ re-export จำนวนมาก
3. ใช้ `use-astgrep` หา side-effect imports (`import 'x'`) และ deep imports ของ lib หนัก (`lodash`, `moment`)

### 2. Remove Unused Imports

> Goal: ลบ imports ที่ไม่ถูกใช้

1. ใช้ linter auto-fix (`eslint --fix`, `biome check --write`, `organize-imports`) เท่าที่ทำได้
2. ตรวจที่เหลือด้วย `use-astgrep` — ระวัง imports ที่มี side effects หรือใช้ใน decorators/reflection
3. รัน `/run-typecheck` หลังลบทุกครั้ง

### 3. Fix Barrel Files

> Goal: แก้ barrels ที่ทำ tree-shaking พัง

1. flag `export *` จาก barrel ที่ดึง modules ทั้งหมด (รวม heavy/side-effect modules)
2. แนะนำ explicit named exports หรือ import ตรงจาก module (`pkg/module` แทน `pkg`)
3. ถ้า bundler รองรับ `package.json` `sideEffects: false` → เพิ่มเพื่อช่วย tree-shaking
4. ตรวจว่า barrels ที่จะแก้ไม่มี consumers เยอะเกิน — ใช้ `/check-file-relations` หา importers

### 4. Reduce Heavy Imports

> Goal: แทนที่ imports ที่ดึง bundle ใหญ่

1. flag default imports ของ lib หนัก → เปลี่ยนเป็น named/subpath imports (`import debounce from 'lodash/debounce'`)
2. flag date/moment libs → แนะนำทางเลือกเบากว่า (`/use-lib-better`, `/optimize-deps`)
3. dynamic import สำหรับ modules ที่ใช้เฉพาะบาง route/branch

### 5. Verify

> Goal: ยืนยันไม่พังและ bundle ลดลง

1. `/run-lint` + `/run-typecheck` ต้องผ่าน
2. `/run-build` แล้วเทียบ bundle size — ทำ `/check-bundle-regression` หรือ `/report-before-after`

## Rules

### 1. Verify Each Step

- รัน typecheck หลังลบ imports ทุก batch — side-effect imports ต้องไม่ถูกลบ
- ห้ามลบ imports ที่ linter ไม่แน่ใจโดยไม่ตรวจ usage จริง

### 2. Preserve Public API

- barrel files ที่เป็น public API ของ package ต้องไม่เปลี่ยน export surface
- ถ้าเปลี่ยน import paths → ทำ `/update-references` เสมอ

### 3. Convention Aware

- ใช้ organize-imports config ที่ project มีอยู่ (biome/eslint/prettier sort order)
- monorepo: ตรวจ boundary rules ร่วมด้วย (`/check-monorepo-boundaries`)

## Expected Outcome

- Unused imports ถูกลบ — lint/typecheck ผ่าน
- Barrel files ไม่ทำ tree-shaking พัง
- Bundle size ลดลงพร้อมตัวเลข before/after
