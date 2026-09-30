---
name: follow-clean-arch
description: Restructure target เป็น Clean Architecture — pure domain, application, infrastructure
argument-hint: "[target-path]"
related:
  - refactor
  - follow-layered-arch
  - review-architecture
  - scan-codebase
  - update-references
  - run-check
  - report-before-after

---

## Goal

Restructure target (default: ทุก package ใน `packages/` หรือ `crates/`) ให้เป็น Clean Architecture — pure domain core, application orchestration, ports & adapters — โดยรักษา behavior และ public API เดิม

## Scope

- ใช้กับ `packages/*`, `crates/*` (shared libraries, domain modules, Rust crates) และ target ที่ user ระบุชัดเจน
- Pattern detail ฉบับเต็ม (SSOT): `/review-architecture` `## Pattern Guides` → `references/pattern-clean.md`
- `apps/*` → ใช้ `/follow-layered-arch` แทน
- ถูก dispatch จาก `/refactor` architecture scope (`packages/`/`crates/` → clean)

## Execute

### 1. Prepare

> Goal: เข้าใจ structure ปัจจุบันและ blast radius

1. ทำ `/scan-codebase` บน target — ระบุ domain logic, side effects, external deps
2. อ่าน `references/pattern-clean.md` ของ `/review-architecture` — canonical guide สำหรับ structure, rules และ splitting thresholds
3. ระบุ public API ปัจจุบัน (barrel `index`, exported symbols) — ต้องรักษาไว้
4. หา consumers ของ package — ทำ `/update-references` ไว้ในแผน

### 2. Restructure To Layers

> Goal: code แยกตาม dependency direction — domain ไม่พึ่ง infrastructure

1. สร้าง structure ตาม guide: `domain/` (pure types + logic), `application/` (use cases, ports), `infrastructure/` (adapters), entry ที่ `index`
2. ย้าย pure logic → `domain/`; orchestration → `application/`; IO/framework → `infrastructure/` — ทำ `/refactor` ทีละ move
3. กำหนด ports (interfaces) ที่ `application/` ต้องการ — adapters implement ฝั่ง infrastructure
4. ทำ `/update-references` + structure refactor (`/refactor` structure scope) หลังย้ายแต่ละชุด

### 3. Verify

> Goal: dependency direction ถูกต้องและ build ผ่าน

1. ตรวจไม่มี import จาก `domain`/`application` ไป `infrastructure` — รัน `madge` หา circular deps ถ้ามี
2. ทำ `/run-check` (lint/typecheck) และ test ของ package
3. ทำ `/report-before-after` — structure เดิม vs ใหม่

## Rules

- Dependency direction: domain ← application ← infrastructure ← entry — ห้ามกลับทิศ
- Domain ต้อง pure — ไม่มี IO, framework imports, side effects
- Public API ผ่าน `index` เท่านั้น — ห้าม deep imports ข้าม layer จากภายนอก
- รักษา behavior เดิม — ทดสอบต้องผ่านเหมือนก่อน restructure
- ใช้ /refactor, /update-references ถ้าจำเป็น

| No. | Layer | File Structure | Naming | Exports | Tests | Deps | Risk |
|-----|-------|----------------|--------|---------|-------|------|------|
| 1 | `domain/` | pure types + logic เท่านั้น | entities/value objects ตาม business terms — ไม่มี tech suffix | types + pure functions | unit tests pure — ไม่ mock IO | ไม่ import จาก layer อื่น | สูง — core logic ห้ามพึ่ง infra |
| 2 | `application/` | use cases + ports (interfaces) | `*UseCase`/`*.use-case`, ports = `*Port` หรือ interface ตาม convention | use cases, port types | unit tests ด้วย mock ports | → `domain/` เท่านั้น | กลาง — orchestration |
| 3 | `infrastructure/` | adapters implement ports | `*Adapter`/`*Repository`/`*.impl` ผูกกับ tech ที่ใช้ | concrete adapters | integration tests | → `application/` ports, `domain/` | กลาง — IO/framework |
| 4 | `index` | barrel exports เท่านั้น | re-export เท่านั้น — ไม่มี logic | public API ทั้งหมด | smoke test public API | → ทุก layer (composition root) | ต่ำ |

## Expected Outcome

- Package เป็น Clean Architecture: `domain/` pure, `application/` orchestrate ผ่าน ports, `infrastructure/` implement adapters
- ไม่มี circular dependencies; public API เดิมยังใช้ได้
- ผ่าน `/run-check` และ tests
