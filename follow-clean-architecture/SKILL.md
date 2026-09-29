---
name: follow-clean-architecture
description: Apply Clean Architecture — functional core, ports & adapters, domain ไม่พึ่ง infrastructure
argument-hint: "[@path]"
related:
  - follow-architecture
  - follow-layered-architecture
  - review-architecture
  - refactor
  - restructure
  - update-references
  - run-check
---

## Goal

Restructure target (default: ทุก package ใน `packages/`) ให้เป็น Clean Architecture — pure domain core, application orchestration, ports & adapters — โดยรักษา behavior และ public API เดิม

## Scope

- ใช้กับ `packages/*` (shared libraries, domain modules) และ target ที่ user ระบุชัดเจน
- Pattern detail ฉบับเต็ม: `/review-architecture` `## Pattern Guides` → `### Pattern: Clean Architecture` (Execute — Clean steps 1-8 + Rules)
- `apps/*` → ใช้ `/follow-layered-architecture` แทน

## Execute

### 1. Prepare

> Goal: เข้าใจ structure ปัจจุบันและ blast radius

1. ทำ `/scan-codebase` บน target — ระบุ domain logic, side effects, external deps
2. อ่าน `### Pattern: Clean Architecture` ใน `/review-architecture` — canonical guide สำหรับ structure, rules และ splitting thresholds
3. ระบุ public API ปัจจุบัน (barrel `index`, exported symbols) — ต้องรักษาไว้
4. หา consumers ของ package — ทำ `/update-references` ไว้ในแผน

### 2. Restructure To Layers

> Goal: code แยกตาม dependency direction — domain ไม่พึ่ง infrastructure

1. สร้าง structure ตาม guide: `domain/` (pure types + logic), `application/` (use cases, ports), `infrastructure/` (adapters), entry ที่ `index`
2. ย้าย pure logic → `domain/`; orchestration → `application/`; IO/framework → `infrastructure/` — ทำ `/refactor` ทีละ move
3. กำหนด ports (interfaces) ที่ `application/` ต้องการ — adapters implement ฝั่ง infrastructure
4. ทำ `/update-references` + `/restructure` หลังย้ายแต่ละชุด

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
- ใช้ /refactor, /restructure, /update-references ถ้าจำเป็น

## Expected Outcome

- Package เป็น Clean Architecture: `domain/` pure, `application/` orchestrate ผ่าน ports, `infrastructure/` implement adapters
- ไม่มี circular dependencies; public API เดิมยังใช้ได้
- ผ่าน `/run-check` และ tests
