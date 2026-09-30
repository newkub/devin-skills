---
name: separate-of-concerns
description: แยก concerns ที่ปนกันในไฟล์/โมดูลออกตามประเภท — UI, domain, data, IO, config
argument-hint: "[@files... | target-path]"
related:
  - refactor
  - follow-architecture
  - refactor-to-srp
  - scan-codebase
  - update-references
  - run-check
  - report-before-after

---

## Goal

แยก concerns ที่ปนอยู่ในไฟล์หรือโมดูลเดียวออกเป็น units ตามประเภท concern — presentation, domain logic, data access, IO/side effects, config, orchestration — โดยรักษา behavior และ public API เดิม

## Scope

- ใช้เมื่อไฟล์/โมดูลรวมหลาย concerns ปนกัน — เช่น route handler มี business logic + DB call, component มี fetch + validation rules + formatting ในที่เดียว
- Boundary กับ `/refactor-to-srp`: SRP = หนึ่ง reason to change ต่อ unit; skill นี้ = แยกตามประเภท concern แล้ววางให้ถูก layer
- ถูก dispatch จาก `/refactor` (mixed concerns scope) และใช้ระหว่าง `/follow-architecture` restructure เมื่อเจอ concerns ปนกัน
- ไม่ใช่ architecture restructure ทั้ง target — placement ตัดสินโดย `/follow-architecture`

## Execute

### 1. Identify Concerns

> Goal: รู้ว่ามี concerns อะไรปนกันอยู่ใน target

1. ทำ `/scan-codebase` หรืออ่าน `@files` ที่ระบุ — classify แต่ละ block ตาม concern type พร้อม evidence `file:line`
2. Concern types: `presentation` (UI/routes/handlers), `domain` (pure rules/calculations), `data` (persistence/queries), `io` (http/queue/clock/external calls), `config` (env/settings), `orchestration` (composition/wiring)
3. สรุป concern map เป็นตาราง — block → concern type → target location ที่ควรไป

### 2. Plan Separation

> Goal: รู้ว่าแต่ละ concern ไปอยู่ที่ไหน

1. Map concern → target location ตาม architecture ของ project — ไม่ชัดว่า layer/module ไหน → ทำ `/follow-architecture` ตัดสินก่อน
2. เรียงลำดับ extract: leaf concerns ก่อน (pure domain → data/io → wiring/orchestration ทีหลัง)
3. ระบุ consumers ของแต่ละ block — ทำ `/update-references` ไว้ในแผน

### 3. Extract Per Concern

> Goal: แต่ละ concern อยู่ในที่ของมัน ทีละ concern เดียว

1. Extract ทีละ concern: move code → file/module เป้าหมาย → export ผ่าน interface/barrel — ทำ `/refactor` ทีละ move
2. หลังแต่ละ extraction → ทำ `/update-references` แล้ว verify green ก่อน concern ถัดไป
3. caller เดิมเหลือแค่ orchestration/composition — ไม่เหลือ concern อื่นปน

### 4. Verify

> Goal: แยกครบและไม่มี regression

1. ตรวจทุก unit เหลือ concern เดียว — ไม่มี block ตกหล่น
2. ทำ `/run-check` (lint/typecheck) + tests ของ scope ที่แตะ
3. ทำ `/report-before-after` — concern map เดิม vs ใหม่

## Rules

- หนึ่ง extraction = หนึ่ง concern — ห้าม mix behavior change หรือ feature เข้า commit เดียวกัน
- Pure logic extractable ก่อนเสมอ — domain ออกจาก IO ก่อน แล้วค่อยจัด IO
- Placement ตาม dependency direction ของ architecture ปัจจุบัน — ห้ามวาง concern ผิด layer
- รักษา public API — barrel/export เดิมต้องทำงานเหมือนเดิม
- ใช้ /refactor, /update-references, /follow-architecture ถ้าจำเป็น

## Expected Outcome

- แต่ละ unit มี concern เดียวชัดเจน — wiring/orchestration อยู่ชั้นบนสุด
- ไม่มี mixed concerns เหลือใน target; ไม่มี broken references
- ผ่าน `/run-check` และ tests เหมือนก่อนแยก
