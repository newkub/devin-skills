---
name: follow-layered-architecture
description: Apply Layered Architecture ให้ app — presentation → domain → data, public API ผ่าน index
argument-hint: "[@path]"
related:
  - follow-architecture
  - follow-clean-architecture
  - review-architecture
  - refactor
  - restructure
  - update-references
  - run-check
---

## Goal

Restructure target (default: ทุก app ใน `apps/`) ให้เป็น Layered Architecture — presentation, domain, data layers แยกชัดเจน ไม่ bypass — โดยรักษา behavior เดิม

## Scope

- ใช้กับ `apps/*` (web, mobile, api entry points) และ target ที่ user ระบุชัดเจน
- Pattern detail ฉบับเต็ม: `/review-architecture` `## Pattern Guides` → `### Pattern: Layered Architecture` (Execute — Layered steps 1-5 + Rules รวม Nuxt-specific)
- `packages/*` → ใช้ `/follow-clean-architecture` แทน

## Execute

### 1. Prepare

> Goal: เข้าใจ structure ปัจจุบันและเลือก layered variant ที่เหมาะ

1. ทำ `/scan-codebase` บน target — ระบุ routes/pages, business logic, data access
2. อ่าน `### Pattern: Layered Architecture` ใน `/review-architecture` — เลือก variant (traditional / feature-based / four-layer / hybrid) ตามขนาด app
3. ระบุ public API และ route entry points ปัจจุบัน — ต้องรักษาไว้
4. วางแผน layer mapping: presentation (pages/routes/components/controllers), domain (use cases/services), data (repositories/clients)

### 2. Restructure To Layers

> Goal: code แยกตาม layer — ไม่ bypass, dependencies ชี้ลงทางเดียว

1. สร้าง structure ตาม variant ที่เลือกจาก guide
2. ย้าย UI/routes → presentation; business rules → domain; persistence/external calls → data — ทำ `/refactor` ทีละ move
3. Enforce dependencies: presentation → domain → data เท่านั้น; public API ผ่าน `index` barrel ต่อ layer
4. Align tests ตาม layers; ทำ `/update-references` + `/restructure` หลังย้ายแต่ละชุด

### 3. Verify

> Goal: layer boundaries ถูก enforce และ app ทำงานเหมือนเดิม

1. ตรวจไม่มี layer bypass (presentation เรียก data โดยตรง) และไม่มี deep imports ข้าม layer
2. รัน `madge` หา circular dependencies ถ้ามี
3. ทำ `/run-check` และ tests; ทำ `/report-before-after`

## Rules

- Dependencies ชี้ลงทางเดียว: presentation → domain → data — ห้าม bypass หรือชี้ขึ้น
- Public API ผ่าน `index` entry point ของแต่ละ layer — ห้าม deep imports
- ใช้ path aliases ของ project แทน relative imports ข้าม layer
- รักษา behavior เดิม — routes/pages ทำงานเหมือนก่อน restructure
- ใช้ /refactor, /restructure, /update-references ถ้าจำเป็น

## Expected Outcome

- App เป็น Layered Architecture ตาม variant ที่เลือก — layers แยกชัด ไม่ bypass
- Barrel exports สม่ำเสมอ; ไม่มี circular dependencies
- ผ่าน `/run-check` และ tests
