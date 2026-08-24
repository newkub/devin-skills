---
name: optimize-codebase
description: ปรับปรุง performance ด้วย optimize-* skills ตาม AGENTS.md
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - update-agents-md
  - ask-requirement
  - scan-codebase
  - validate
  - suggest-next-action
  - optimize-frontend
  - optimize-network
  - optimize-database
  - optimize-runtime
  - optimize-io
  - optimize-build
  - optimize-cost
  - optimize-battery
  - optimize-latency
  - optimize-caching
  - optimize-payload
---

## Goal

ปรับปรุง performance โดยรวมด้วย optimize-* skills ตาม context และ AGENTS.md

## Scope

ใช้กับ project ที่ต้องการปรับปรุง performance หลายด้าน โดยประสาน optimize-* skills ทีละตัว

## Execute

### 1. Read AGENTS.md And Requirements
> Goal: รู้ว่าควรปรับปรุงอะไร
1. ทำ /update-agents-md เพื่อสร้างหรืออัปเดต AGENTS.md ถ้ายังไม่มี
2. อ่าน AGENTS.md ของ project
3. ถ้า context ไม่ชัด → ทำ /ask-requirement เพื่อเก็บ requirement
4. ถ้ายังไม่แน่ใจ → ทำ /ask-me

### 2. Scan And Prioritize
> Goal: รู้ว่าส่วนไหนสำคัญกว่า
1. ทำ /scan-codebase เพื่อหา issues ทั่วไป
2. ตรวจสอบ quality, structure, และ technical debt
3. เรียง priority ตาม impact ก่อน effort

### 3. Run Skills
> Goal: ปรับปรุงแต่ละส่วนครบถ้วน
1. ทำ /review-frontend ถ้า frontend เป็นปัญหา
2. ทำ /review-network ถ้า network เป็นปัญหา
3. ทำ /review-database ถ้า database เป็นปัญหา
4. ทำ /optimize-runtime ถ้า CPU/memory/GC/startup เป็นปัญหา
5. ทำ /review-io ถ้า I/O/storage/serialization เป็นปัญหา
6. ทำ /optimize-build ถ้า build เป็นปัญหา
7. ทำ /improve-ci-cd ถ้า pipeline เป็นปัญหา
8. ทำ /optimize-latency, /optimize-caching, หรือ /optimize-payload ถ้าเป็นปัญหาเฉพาะ
9. เลือก skills อื่นๆ ตาม findings และ AGENTS.md

### 4. Validate And Report
> Goal: ยืนยันว่าปรับปรุงครบและไม่มี regression
1. ทำ /validate และ /run-check
2. สรุปผลด้วย /report
3. ทำ /suggest-next-action

## Rules

### 1. Orchestration
- ทำตาม AGENTS.md ถ้ามี
- ถ้า context ไม่ชัด → ถาม /ask-requirement ก่อน
- รันทีละ skill ตาม priority

## Expected Outcome

- Performance ปรับปรุงตาม AGENTS.md และทุก optimize-* skill รันตาม priority
- ผลตรวจสอบผ่าน
- รายงานสรุปครบถ้วน
