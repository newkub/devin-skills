---
name: follow-architecture
description: Architecture pattern convention — เลือก Clean หรือ Layered ก่อน restructure
argument-hint: "[clean | layered]"
related:
  - refactor
  - deep-review
  - scan-codebase
  - follow-single-of-source
  - ask-me
  - report-before-after
---

## Goal

กำหนดมาตรฐานการเลือกและใช้ architecture pattern เดียวกัน — ทุก restructure ต้อง detect target → เลือก pattern ให้ fits (Clean หรือ Layered) → apply ผ่าน path เดียว ห้าม restructure แบบเดา

## Scope

ใช้เมื่อจะเปลี่ยน layer structure, boundaries หรือ dependency direction ของไฟล์/workspace/codebase — `/refactor` scope `architecture|clean|layered` อ่าน convention นี้ก่อน (`### 4. Architecture Refactor` เป็น entry ที่ apply จริง) — microservices และ distributed topology เป็นคนละ scope ไม่อยู่ใน convention นี้

## References

- `references/architecture.md` — detail ทั้งหมด: pattern selection table, canonical pointers ถึง stack-owner templates, boundary rules (SSOT — ห้าม copy ตารางไปที่อื่น `/follow-single-of-source`)
- `references/follow-clean-arch.md` — canonical Clean pattern guide (file structure + layer table ใน `## Guide`)
- `references/follow-layered-arch.md` — canonical Layered pattern guide (flat structure + layer table ใน `## Guide`)

## Execute

### 1. Detect Target

> Goal: รู้ว่า target คืออะไร มีกี่ app entry points

1. รัน `/scan-codebase` + `/deep-review` dimension `review-architecture` บน target ก่อนเสมอ — เก็บ evidence ของ coupling/boundary/dependency direction
2. ระบุ `apps/*`, `packages/*`, `crates/*` และจำนวน entry points + shared domain ที่หลาย app ใช้ร่วมกัน

### 2. Select Pattern

> Goal: เลือก pattern เดียวที่ fits ตามลักษณะ target

1. Lookup ตาราง selection ใน `references/architecture.md` — `packages/`/`crates/` หรือหลาย `apps/*` unified → Clean; single app → Layered (flat type-grouped)
2. argument `clean`/`layered` ถูกระบุ → ใช้ pattern นั้นตรงๆ ข้ามตาราง; target ชัดตรง stack ไหน → ใช้ template ของ owner skill (ตารางใน `references/architecture.md`)
3. ยังไม่ชัด → `/ask-me` ก่อนเลือก — ห้าม mix สอง pattern ใน target เดียว

### 3. Apply Via Refactor

> Goal: restructure ทีละ batch ผ่าน path เดียว

1. แจง pattern ที่เลือกแล้วส่งต่อ `/refactor architecture` — pattern guide แยกตาม pattern: `references/follow-clean-arch.md` และ `references/follow-layered-arch.md` (canonical file structures + layer tables อยู่ใน `## Guide` ของแต่ละ guide)
2. ย้ายทีละ batch → `/update-references` + `/run-check` เขียวก่อน batch ถัดไป; แดง → rollback

### 4. Verify Pattern Holds

> Goal: pattern ตั้งอยู่บนจริง ไม่ใช่แค่ folder name

1. dependency direction ตรวจด้วย `/follow-tool-madge` (no circular) + `/deep-review` dimension `review-architecture` เทียบ baseline
2. `/report-before-after` แสดง old → new layer map

## Rules

### 1. Single Apply Entry

- การ restructure จริงเกิดผ่าน `/refactor architecture` เท่านั้น — skill นี้ถือ convention/การเลือก pattern ไม่ทำเองซ้ำ
- pattern detail เป็นของ pattern guide ใน `references/` (`## Guide`) และ owner skill ของ stack นั้น — ห้าม duplicate ไว้ที่นี่

### 2. Boundaries

- `domain/` + `core/` ต้อง pure — ไม่มี IO/framework import; public API ผ่าน barrel `index` เท่านั้น ห้าม deep import ข้าม layer/module จาก outside
- modules คุยกันผ่าน `contracts/` หรือ ports — ทิศ `usecases → features → domain` ห้ามกลับด้าน

### 3. Behavior

- preserve behavior + public API เสมอ — tests ต้องเขียวเหมือนก่อน restructure
- หนึ่ง target หนึ่ง pattern, หนึ่ง move batch ต่อหนึ่ง verify cycle

## Expected Outcome

- target ใช้ pattern เดียวที่ fits with evidence จาก review-architecture — multi-app unified/`packages/`/`crates/` = Clean, single app = Layered
- ไม่มี circular dependencies, public API เดิมยังใช้ได้, `/run-check` + tests เขียว
- layer map ใหม่อ่านออกจาก structure ได้ทันที โดยไม่ต้องเปิดไฟล์
