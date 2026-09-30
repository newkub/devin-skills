---
name: follow-clean-arch
description: Restructure target เป็น Clean Architecture — modules/{domain,features,ports,adapters}
argument-hint: "[target-path]"
related:
  - refactor
  - follow-architecture
  - follow-architecture
  - separate-of-concerns
  - deep-review
  - scan-codebase
  - update-references
  - run-check
  - report-before-after

---

## Goal

Restructure target (default: ทุก package ใน `packages/` หรือ `crates/`) ให้เป็น Clean Architecture — pure domain core, application orchestration, ports & adapters — โดยรักษา behavior และ public API เดิม

## Scope

- ใช้กับ `packages/*`, `crates/*` (shared libraries, domain modules, Rust crates), หลาย `apps/*` ที่ต้อง unified support (แชร์ modules ข้าม entry points) และ target ที่ user ระบุชัดเจน
- Pattern detail ฉบับเต็ม (SSOT): `/deep-review` `## Pattern Guides` → `references/pattern-clean.md`
- File structure + layer table (canonical): [templates/file-structure.md](templates/file-structure.md)
- app เดียว (`apps/*` ตัวเดียว, ไม่ต้อง unified support) → ใช้ `/follow-architecture` `### Pattern: Layered` (flat type-grouped) แทน
- ถูก dispatch จาก `/follow-architecture` และ `/refactor` architecture scope

## Execute

### 1. Prepare

> Goal: เข้าใจ structure ปัจจุบันและ blast radius

1. ทำ `/scan-codebase` บน target — ระบุ domain logic, side effects, external deps
2. อ่าน `references/pattern-clean.md` ของ `/deep-review` — canonical guide สำหรับ structure, rules และ splitting thresholds
3. อ่าน [templates/file-structure.md](templates/file-structure.md) — canonical file structure + layer table ของ target
4. ระบุ public API ปัจจุบัน (barrel `index`, exported symbols) — ต้องรักษาไว้
5. หา consumers ของ package — ทำ `/update-references` ไว้ในแผน

### 2. Restructure To Layers

> Goal: code แยกตาม dependency direction — domain ไม่พึ่ง infrastructure

1. สร้าง structure ตาม [templates/file-structure.md](templates/file-structure.md): `modules/<name>/{domain,features,ports,adapters}` + `index.ts`, `core/` (primitives + `ports/`), `adapters/`, `infra/`, `contracts/`, `config/`, entry/composition ที่ `app/`
2. ย้าย pure logic → `modules/*/domain/` + `core/`; use cases/orchestration → `modules/*/features/`; interfaces → `ports/`; IO/framework → `infra/` + `adapters/` — ทำ `/refactor` ทีละ move
3. ถ้า concerns ปนกันในไฟล์เดียว (logic + IO + config) → ทำ `/separate-of-concerns` แยก concern ก่อนจัด layer
4. กำหนด ports (interfaces) ที่ `features/` ต้องการ — adapters/infra implement; wire ทั้งหมดที่ `app/runtime.ts` composition root
5. ทำ `/update-references` + structure refactor (`/refactor` structure scope) หลังย้ายแต่ละชุด

### 3. Verify

> Goal: dependency direction ถูกต้องและ build ผ่าน

1. ตรวจไม่มี import จาก `core/`/`modules/*/domain`/`features` ไป `infra/`/`adapters/` — รัน `madge` หา circular deps ถ้ามี
2. ทำ `/run-check` (lint/typecheck) และ test ของ package
3. ทำ `/report-before-after` — structure เดิม vs ใหม่

## Rules

- Dependency direction: `core` ← `modules` ← `adapters`/`infra` ← `app` — ห้ามกลับทิศ (detail ตาม layer table ใน `templates/file-structure.md`)
- `domain/` + `core/` ต้อง pure — ไม่มี IO, framework imports, side effects; ไม่มี `fx/` layer — side effects อยู่ `infra/` orchestrate ผ่าน `features/` + ports
- Public API ผ่าน `index` เท่านั้น — ห้าม deep imports ข้าม layer/module จากภายนอก; modules ข้ามกันผ่าน `contracts/` หรือ ports
- รักษา behavior เดิม — ทดสอบต้องผ่านเหมือนก่อน restructure
- ใช้ /refactor, /update-references, /separate-of-concerns ถ้าจำเป็น

File structure และ layer table ฉบับเต็ม → [templates/file-structure.md](templates/file-structure.md)

## Expected Outcome

- Target เป็น Clean Architecture: `modules/<name>/` มี `domain/` pure, `features/` orchestrate ผ่าน `ports/`, `infra/`/`adapters/` implement adapters, `app/` composition root wire ทั้งหมด
- ไม่มี circular dependencies; public API เดิมยังใช้ได้
- ผ่าน `/run-check` และ tests
