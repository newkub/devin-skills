---
name: improve-codebase
description: ปรับปรุง codebase โดยรวมด้วย improve-* skills และลด redundancy ตาม AGENTS.md
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - update-agents-md
  - ask-requirement
  - ask-me
  - scan-codebase
  - improve-correctness
  - improve-reliability
  - improve-uxui
  - improve-modularity
  - improve-docs
  - improve-governance
  - improve-security
  - improve-api
  - improve-rate-limiting
  - check-reference
  - update-reference
  - validate
  - run-check
  - report
  - suggest-next-action
---

## Goal

ปรับปรุง codebase โดยรวมด้วย improve-* skills ตาม context และ AGENTS.md พร้อมลด redundancy

## Scope

ใช้กับ project ที่ต้องการปรับปรุงหลายมิติ โดยประสาน improve-* skills ทีละตัว และตรวจจับเนื้อหาซ้ำซ้อน

## Execute

### 1. Read AGENTS.md And Requirements
> Goal: รู้ว่าควรปรับปรุงอะไร
1. ทำ `/update-agents-md` เพื่อสร้างหรืออัปเดต AGENTS.md ถ้ายังไม่มี
2. อ่าน AGENTS.md ของ project
3. ถ้า context ไม่ชัด → ทำ `/ask-requirement` เพื่อเก็บ requirement
4. ถ้ายังไม่แน่ใจ → ทำ `/ask-me`

### 2. Scan And Prioritize
> Goal: รู้ว่าส่วนไหนสำคัญกว่า
1. ทำ `/scan-codebase` เพื่อหา issues ทั่วไป
2. ตรวจสอบ quality, structure, และ technical debt
3. เรียง priority ตาม impact ก่อน effort

### 3. Detect And Reduce Redundancy
> Goal: ลดเนื้อหาซ้ำซ้อนก่อนปรับปรุงเฉพาะส่วน
1. รัน `bunx jscpd` สำหรับ code duplication, `bunx knip` สำหรับ unused exports/files, `bunx madge --circular` สำหรับ circular dependencies
2. ค้นหา duplicate sections ด้วย `grep` สำหรับ markdown/docs
3. จัดประเภท: exact duplicate (ลบ), near-duplicate (merge), partial overlap (extract shared), reference-only
4. ทำ dry run preview ก่อนลบหรือ merge; ถ้าลบแล้ว context ขาด → ยกเลิก
5. ทำ `/check-reference` หรือ `/update-reference` เพื่ออัปเดท references หลังรวมหรือลบ

### 4. Run Improve Skills
> Goal: ปรับปรุงแต่ละส่วนครบถ้วนตาม priority
1. ทำ `/improve-uxui` ถ้า UX/UI เป็นปัญหา
2. ทำ `/improve-correctness` ถ้า correctness, type safety, หรือ tests เป็นปัญหา
3. ทำ `/improve-reliability` ถ้า reliability, observability, หรือ recovery เป็นปัญหา
4. ทำ `/improve-modularity` ถ้า modularity, isolation, หรือ side effects เป็นปัญหา
5. ทำ `/improve-docs` ถ้า docs, comments, หรือ DX เป็นปัญหา
6. ทำ `/improve-governance` ถ้า governance หรือ compliance เป็นปัญหา
7. ทำ `/improve-security` ถ้า security เป็นปัญหา
8. ทำ `/improve-api` ถ้า API เป็นปัญหา
9. ทำ `/improve-rate-limiting` ถ้า load หรือ rate เป็นปัญหา
10. เลือก skills อื่นๆ ตาม findings และ AGENTS.md

### 5. Validate And Report
> Goal: ยืนยันว่าปรับปรุงครบและไม่มี regression
1. ทำ `/validate` และ `/run-check`
2. สรุปผลด้วย `/report`
3. ทำ `/suggest-next-action`

## Rules

### 1. Orchestration
- ทำตาม AGENTS.md ถ้ามี
- ถ้า context ไม่ชัด → ถาม `/ask-requirement` ก่อน
- รันทีละ skill ตาม priority

### 2. Redundancy Safety
- ใช้ tools ก่อน manual review สำหรับ redundancy
- แสดง dry run preview ก่อนลบ
- ถ้าลบแล้ว context ขาด → ยกเลิก

## Expected Outcome
- Codebase ปรับปรุงตาม AGENTS.md ด้วย improve-* skills ตาม priority
- Redundancy ลดลงและไม่มี broken references
- ผลตรวจสอบผ่าน
- รายงานสรุปครบถ้วน
