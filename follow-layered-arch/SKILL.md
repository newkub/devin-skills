---
name: follow-layered-arch
description: Restructure target เป็น Layered Architecture — presentation, domain, data ไม่ bypass
argument-hint: "[target-path]"
related:
  - refactor
  - follow-architecture
  - follow-clean-arch
  - separate-of-concerns
  - review-architecture
  - scan-codebase
  - update-references
  - run-check
  - report-before-after

---

## Goal

Restructure target (default: ทุก app ใน `apps/`) ให้เป็น Layered Architecture — presentation, domain, data layers แยกชัดเจน ไม่ bypass — โดยรักษา behavior เดิม

## Scope

- ใช้กับ app เดียว — `apps/*` ตัวเดียว หรือ single-app project (web, mobile, api entry points) และ target ที่ user ระบุชัดเจน
- Pattern detail ฉบับเต็ม (SSOT): `/review-architecture` `## Pattern Guides` → `subagents/arch-reviewer/pattern-layered.md`
- File structure + layer table (canonical): [templates/file-structure.md](templates/file-structure.md)
- หลาย `apps/*` ต้อง unified support หรือ `packages/*`, `crates/*` → ใช้ `/follow-clean-arch` แทน
- ถูก dispatch จาก `/follow-architecture` และ `/refactor` architecture scope

## Execute

### 1. Prepare

> Goal: เข้าใจ structure ปัจจุบันและเลือก layered variant ที่เหมาะ

1. ทำ `/scan-codebase` บน target — ระบุ routes/pages, business logic, data access
2. อ่าน `subagents/arch-reviewer/pattern-layered.md` ของ `/review-architecture` — เลือก variant (traditional / feature-based / four-layer / hybrid) ตามขนาด app
3. อ่าน [templates/file-structure.md](templates/file-structure.md) — canonical file structure + layer table ของ target
4. ระบุ public API และ route entry points ปัจจุบัน — ต้องรักษาไว้
5. วางแผน layer mapping: presentation (pages/routes/components/controllers), domain (use cases/services), data (repositories/clients)

### 2. Restructure To Layers

> Goal: code แยกตาม layer — ไม่ bypass, dependencies ชี้ลงทางเดียว

1. สร้าง structure ตาม variant ที่เลือกจาก guide — baseline ตาม [templates/file-structure.md](templates/file-structure.md)
2. ย้าย UI/routes → presentation; business rules → domain; persistence/external calls → data — ทำ `/refactor` ทีละ move
3. ถ้า concerns ปนกันในไฟล์เดียว (handler + logic + query) → ทำ `/separate-of-concerns` แยก concern ก่อนจัด layer
4. Enforce dependencies: presentation → domain → data เท่านั้น; public API ผ่าน `index` barrel ต่อ layer
5. Align tests ตาม layers; ทำ `/update-references` + structure refactor (`/refactor` structure scope) หลังย้ายแต่ละชุด

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
- ใช้ /refactor, /update-references, /separate-of-concerns ถ้าจำเป็น

File structure และ layer table ฉบับเต็ม → [templates/file-structure.md](templates/file-structure.md)

## Expected Outcome

- App เป็น Layered Architecture ตาม variant ที่เลือก — layers แยกชัด ไม่ bypass
- Barrel exports สม่ำเสมอ; ไม่มี circular dependencies
- ผ่าน `/run-check` และ tests
