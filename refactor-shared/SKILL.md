---
name: refactor-shared
description: Extract shared code ไป packages/shared แล้ว rewire consumers ให้ใช้
argument-hint: "[scope]"
related:
  - refactor
  - refactor-workspace
  - follow-single-of-source
  - follow-reusable
  - use-lib-effective
  - follow-monorepo
  - update-references
  - check-repo-hygiene
  - run-verify
  - run-test
  - report-before-after
  - dont-over-engineer
---

## Goal

Extract code ที่ใช้ซ้ำข้าม workspace members (duplicated utils, types, schemas, components, hooks) ไปไว้ที่ `packages/shared` — หนึ่ง fact หนึ่ง source — แล้ว rewire ทุก consumer ให้ import จาก shared package

## Scope

ใช้กับ monorepo ที่มี duplication ข้าม packages/apps — extract เฉพาะ code ที่ใช้จริงใน 2+ consumers

- ถ้า project ไม่ใช่ monorepo หรือไม่มี `packages/` layout → ใช้ `/refactor` แทน
- ถ้า scope คือ split/merge workspace members ทั้งก้อน → ใช้ `/refactor-workspace`
- ถ้า dep ตัวนอกทำได้อยู่แล้ว → อย่า extract เอง ใช้ `/use-lib-effective` แทน

## Execute

### 1. Inventory Shared Candidates

> Goal: รู้ว่าอะไร duplicate จริงและคุ้ม extract

1. ทำ `/follow-monorepo` เพื่อเข้าใจ workspace layout และ shared package convention ของ project
2. หา duplication ข้าม workspace members — `jscpd`, `sg scan` หรือ manual scan ตาม domain (utils, types, schemas, components, hooks, constants)
3. เก็บ candidates พร้อม consumer count — extract เฉพาะที่มี 2+ consumers จริง ห้าม extract เผื่อ
4. ทำ `/use-lib-effective` — ถ้า dep เดิมหรือ lib ใน catalog ทำได้ อย่าสร้าง shared module ใหม่
5. ถ้า `packages/shared` ยังไม่มี → สร้างตาม convention ของ workspace (manifest, tsconfig, build config ตาม member อื่น)

### 2. Plan Extraction

> Goal: แผนที่ย้ายทีละหน่วยได้โดยไม่พัง

1. จัดกลุ่ม candidates ตาม domain — `types/`, `utils/`, `schemas/`, `components/`, `hooks/`, `constants/` (ตาม structure ของ `packages/shared` ที่มีอยู่)
2. จัดลำดับ leaf-first: pure types/constants → utils → components/hooks ที่พึ่งพาพวกมัน
3. ระบุทุก consumer site ต่อ candidate — import sites, re-export sites, test usage
4. ทำ `/plan` แล้วขอ confirm ถ้า candidates > 5 หน่วยหรือแตะ critical paths

### 3. Extract To Shared

> Goal: code อยู่ใน `packages/shared` ผ่าน public API เดียว

1. ย้าย implementation ไป `packages/shared/src/<domain>/` — canonical version เลือกจากตัวที่ complete ที่สุด (merge เฉพาะส่วนที่ต่างกันจริง)
2. export ผ่าน barrel `index.ts` ต่อ domain และ root barrel — ห้าม deep import ข้าม boundary
3. ถ้า candidates ต่างกันเล็กน้อย → unify ผ่าน parameters/config อย่าคง 2 versions
4. เก็บ license/attribution comments เดิมถ้ามี

### 4. Rewire Consumers

> Goal: ทุก consumer import จาก shared เหมือนกัน

1. แทนที่ local copies ด้วย import จาก `packages/shared` ผ่าน package name/path alias ของ project — ทีละ consumer
2. mechanical replace หลายไฟล์ → `/edit-by-astgrep` (dry-run + confirm ก่อนเขียนทับเสมอ)
3. ลบ local copies หลัง consumer ทั้งหมด rewire แล้วเท่านั้น — ห้ามลบก่อน verify
4. ทำ `/update-references` หลังทุก batch — barrel exports, tsconfig paths, package deps

### 5. Verify

> Goal: ไม่มี duplication เหลือและไม่มี regression

1. ทำ `/run-verify` — typecheck + lint + test + build ตามที่ workspace รองรับ
2. ทำ `/check-repo-hygiene circular-dependencies` — shared ต้องไม่พึ่ง consumers
3. re-run duplication scan — candidates เดิมต้องเหลือ canonical version เดียว
4. ถ้า verify fail → revert batch นั้นแล้วแก้ สูงสุด 3 รอบ → stop/report

## Rules

### 1. Extract Only Real Duplication

- ต้องมี 2+ consumers จริง — ห้าม extract เผื่ออนาคต (`/dont-over-engineer`)
- ถ้า code ต่างกันเพราะ domain ต่างกัน (coincidental similarity) → อย่ารวม

### 2. Single Source Of Truth

- หลัง refactor ต้องเหลือ implementation เดียวใน `packages/shared` (`/follow-single-of-source`)
- canonical เลือกจาก version ที่ complete ที่สุด — merge เฉพาะ diffs ที่มีเหตุผล

### 3. Public API Boundary

- consumers import ผ่าน barrel/package name เท่านั้น — ห้าม deep import เข้า `packages/shared/src/**`
- `packages/shared` ห้าม depend บน workspace member อื่น — foundation เท่านั้น

### 4. Preserve Behavior

- refactor เท่านั้น ห้าม mix feature/fix — behavior และ public API เหมือนเดิมเสมอ
- tests ต้องเขียวก่อนและหลัง; ไม่มี tests บน candidate → เขียน characterization tests ก่อน extract (`/update-tests`)

### 5. Incremental

- extract ทีละ domain batch → verify → `/git-commit` checkpoint ก่อน batch ถัดไป
- ลบ local copy เฉพาะหลังทุก consumer rewire และ verify ผ่าน

- ใช้ /refactor ถ้าจำเป็น
- ใช้ /refactor-workspace ถ้าจำเป็น
- ใช้ /update-references ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น

## Expected Outcome

- shared code อยู่ใน `packages/shared` ผ่าน barrel exports เดียว
- ทุก consumer ใช้ shared version — ไม่มี local copies เหลือ
- ไม่มี circular dependencies — `packages/shared` เป็น leaf dependency
- ผ่าน lint/typecheck/test/build — รายงาน before/after duplication count
