---
name: improve-codebase
description: ปรับปรุง codebase ด้วย improve-* skills ตาม AGENTS.md
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
  - scan-codebase
  - validate
  - suggest-next-action
  - improve-uxui
  - improve-seo
  - improve-security
  - improve-dx
  - improve-observability
  - improve-compliance
  - improve-disaster-recovery
  - improve-ci-cd
  - improve-reliability
  - improve-rate-limiting
  - improve-discoverability
  - improve-predictability
  - improve-isolation
  - improve-modularity
  - improve-governance
  - improve-compatibility
  - improve-docs
  - improve-api
---

## Goal

ปรับปรุง codebase โดยรวมด้วย improve-* skills ตาม context และ AGENTS.md

## Scope

ใช้กับ project ที่ต้องการปรับปรุงหลายมิติ โดยประสาน improve-* skills ทีละตัว

## Execute

### 1. Read AGENTS.md And Requirements
> Goal: รู้ว่าควรปรับปรุงอะไร
1. ทำ /update-agents-md เพื่อสร้างหรืออัปเดต AGENTS.md ถ้ายังไม่มี
2. อ่าน AGENTS.md ของ project
3. ถ้า context ไม่ชัด -> ทำ /ask-requirement เพื่อเก็บ requirement
4. ถ้ายังไม่แน่ใจ -> ทำ /ask-me

### 2. Scan And Prioritize
> Goal: รู้ว่าส่วนไหนสำคัญกว่า
1. ทำ /scan-codebase เพื่อหา issues ทั่วไป
2. ตรวจสอบ quality, structure, และ technical debt
3. เรียง priority ตาม impact ก่อน effort

### 3. Run Skills
> Goal: ปรับปรุงแต่ละส่วนครบถ้วน
ทำ /improve-uxui ถ้า UX/UI เป็นปัญหา
ทำ /improve-seo ถ้า SEO เป็นปัญหา
ทำ /improve-security ถ้า security เป็นปัญหา
ทำ /improve-api ถ้า API เป็นปัญหา
ทำ /improve-dx ถ้า DX เป็นปัญหา
6. เลือก skills อื่นๆ ตาม findings และ AGENTS.md

### 4. Validate And Report
> Goal: ยืนยันว่าปรับปรุงครบและไม่มี regression
1. ทำ /validate และ /run-check
2. สรุปผลด้วย /report
3. ทำ /suggest-next-action

## Rules
### 1. Orchestration
- ทำตาม AGENTS.md ถ้ามี
- ถ้า context ไม่ชัด -> ถาม /ask-requirement ก่อน
- รันทีละ skill ตาม priority

## Expected Outcome
- Codebase ปรับปรุงตาม AGENTS.md และทุก improve-* skill รันตาม priority
- ผลตรวจสอบผ่าน
- รายงานสรุปครบถ้วน