---
name: review-sdk
description: Review SDK/library public surface — exports, semver, types, breaking changes, docs contract
argument-hint: "[package-or-scope]"
related:
  - scan-codebase
  - review-api
  - review-techstack
  - review-quality
  - review-docs
  - check-backward-compatibility
  - deep-review-then-fix
  - report
  - suggest-next-action
---

## Goal

Review public API surface ของ library/SDK/package — exports map, semver contract, type declarations, breaking changes, consumer ergonomics, docs contract — report-only

## Scope

ใช้กับ package ที่ publish (npm/JSR/crates/PyPI) หรือ internal library ที่มี consumers — ไม่รวม REST/HTTP API design (`/review-api`), stack selection (`/review-techstack`), general code quality (`/review-quality`), docs structure (`/review-docs`)

## Execute

### 1. Prepare And Identify Surface

> Goal: รู้ว่า public surface คืออะไร

1. ทำ `/scan-codebase` — หา entry points, `exports`/`main`/`types` fields, barrel files (`index.ts`)
2. ระบุ published artifacts — `package.json` `files`, `publishConfig`, build output

### 2. Check Exports And Entry Points

> Goal: surface ชัดเจน ไม่ leak internals

1. `exports` map ครบ — `.` + subpaths, `types`/`import`/`require` conditions ถูกต้อง
2. ไม่ leak internal paths — deep imports ที่ไม่ได้ declare, `_internal`/`private` modules exposed
3. barrel files ไม่ over-export — named exports, ไม่มี `export *` ที่ลาก internal ออกไป
4. `sideEffects` flag ถูกต้องสำหรับ tree-shaking

### 3. Check Semver And Compatibility

> Goal: versioning contract เคารพ consumers

1. ทำ `/check-backward-compatibility` — public API diff ระหว่าง versions
2. breaking changes ต้อง major bump + changelog entry + migration notes
3. deprecations มี path ชัด — `@deprecated` JSDoc, runtime warnings, removal timeline
4. peer dependencies ranges ไม่แคบ/กว้างเกิน — React/framework peers ใช้ range ที่รองรับหลาย version

### 4. Check Types And Ergonomics

> Goal: DX ของ consumer ดี

1. `.d.ts` ถูก generate และ map กับ runtime exports — no `any` leaks ใน public signatures
2. generics/overloads อ่านง่าย, error types exported, options objects มี defaults
3. ESM/CJS dual-publish ถูกต้อง (ถ้า claim ทั้งคู่), `types` condition ก่อน `default`
4. edge cases — Node/Bun/Deno/browser targets ที่ claim ต้องทำงานจริง

### 5. Check Docs Contract

> Goal: docs ตรงกับ API จริง

1. ทุก public export มี docs/JSDoc, README examples runnable
2. API reference ตรงกับ exports จริง — ไม่มี docs ของ API ที่ถูก remove แล้ว
3. changelog ครบ, migration guide สำหรับ major versions

### 6. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — findings ต่อ dimension พร้อม severity + evidence
2. ทำ `/suggest-next-action`

## Severity

- `Critical`: breaking change ไม่มี major bump/migration notes, internal secrets/internals leak ผ่าน exports, types พังทำ consumer compile ไม่ได้
- `High`: exports map ผิด (import ไม่ได้ใน ESM/CJS), peer deps conflict กับ versions หลัก, missing `.d.ts`
- `Medium`: over-export internals, `any` leaks, docs ไม่ตรง exports, deprecation ไม่มี path
- `Low`: subpath ergonomics, JSDoc gaps, cosmetic naming

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence — export path, line number, หรือ diff จาก `/check-backward-compatibility`
- HTTP API contract issues → `/review-api`; dep health → `/review-dependencies`
- ตรวจจากมุม consumer เสมอ — คำถามคือ "คนใช้เจออะไร"

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix → `/deep-review-then-fix`

### Fix Steps

1. exports: แก้ `exports` map, ซ่อน internal paths, เพิ่ม `types` condition
2. compat: revert/mark breaking changes, เพิ่ม deprecation path, ขยาย peer ranges
3. types: แก้ `any` leaks, generate `.d.ts` ถูก, test ด้วย `tsc` consumer-side หรือ `attw`/`publint`
4. docs: sync README/API reference กับ exports จริง, เขียน migration guide
5. verify: `publint` + `attw --pack` + smoke install ใน fresh project

## Expected Outcome

- ตาราง findings ต่อ dimension พร้อม severity และ evidence
- รู้ public surface contract, breaking-change risk, consumer DX
- Next action ชัดเจนผ่าน `/suggest-next-action`
