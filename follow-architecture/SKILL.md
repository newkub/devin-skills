---
name: follow-architecture
description: Dispatcher เลือก architecture pattern ตาม directory — packages/crates ใช้ Clean, apps ใช้ Layered
argument-hint: "[clean|layered|path]"
related:
  - review-architecture
  - refactor
  - restructure
  - update-references
---

## Goal

เลือกและ apply architecture pattern ที่ถูกต้องให้แต่ละส่วนของ monorepo/project — `packages/`/`crates/` ใช้ Clean Architecture, `apps/` ใช้ Layered Architecture — โดย route ไปยัง `/refactor` scope ที่ตรง pattern

## Scope

- ใช้เมื่อต้องจัด architecture ของ directory, workspace หรือทั้ง monorepo
- Canonical pattern guides อยู่ที่ `/review-architecture` `## Pattern Guides` — ไม่ duplicate ที่นี่ (SSOT)
- ไม่ครอบคลุม microservices — อ่าน `### Pattern: Microservices Architecture` ใน `/review-architecture` โดยตรง

## Execute

### 1. Select Skill Per Directory

> Goal: แต่ละ directory ได้ pattern ที่ถูกต้องตาม convention

| Target | Refactor Scope |
|--------|----------------|
| `packages/*`, `crates/*` (shared libs, modules, domain packages, Rust crates) | `/refactor` clean → `references/architecture-clean.md` |
| `apps/*` (web, mobile, api entry points) | `/refactor` layered → `references/architecture-layered.md` |
| directory อื่น หรือไม่ใช่ monorepo | ถาม user หรือเลือกตามลักษณะ code (testability สูง/domain-heavy → clean; UI-driven/CRUD → layered) |

1. ถ้า argument ระบุ `clean` → `/refactor` ตาม `references/architecture-clean.md`; `layered` → `/refactor` ตาม `references/architecture-layered.md`
2. ถ้า argument เป็น path → map ตามตารางแล้ว dispatch ไป `/refactor` scope นั้น
3. ถ้าไม่ระบุ → scan root: มี `packages/` หรือ `crates/` → clean ทุก package/crate; มี `apps/` → layered ทุก app; หลายกลุ่ม → ทำทีละอันตาม severity
4. ถ้า project เดี่ยวไม่มี `packages/`/`crates/`/`apps/` → ถาม user ว่าต้องการ pattern ใด

### 2. Apply Pattern

> Goal: แต่ละ target ถูก restructure ตาม pattern

1. ทำตาม Execute ของ skill ที่ dispatch ไป — ทำทีละ package/app ไม่ mix pattern ใน target เดียว
2. หลังแต่ละ target → `/update-references` แล้ว `/run-check` ก่อนไป target ถัดไป

### 3. Report

> Goal: สรุป pattern ที่ apply ครบทุก target

1. ทำ `/report` table: No., Target, Pattern, Changes, Status
2. ทำ `/report-before-after` ถ้ามี baseline
3. ทำ `/suggest-next-action`

## Rules

- Convention: `packages/`, `crates/` = Clean Architecture, `apps/` = Layered Architecture — ห้าม apply สลับกันโดยไม่มีเหตุผลจาก user
- ทีละ target เสร็จก่อนไปต่อ — ห้าม restructure หลาย package พร้อมกัน
- รักษา public API/behavior เดิม — เป็น structural change ไม่ใช่ feature change
- ใช้ /refactor, /restructure, /update-references ระหว่าง apply

## Expected Outcome

- ทุก `packages/*`, `crates/*` เป็น Clean Architecture (functional core, ports & adapters)
- ทุก `apps/*` เป็น Layered Architecture (presentation → domain → data)
- ไม่มี broken imports หรือ circular dependencies หลัง restructure
