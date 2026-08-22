---
name: optimize-codebase
description: ปรับปรุง performance ด้วย optimize-* skills ตาม AGENTS.md
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
  - optimize-rendering
  - optimize-memory
  - optimize-query
  - optimize-caching
  - optimize-network
  - optimize-runtime
  - optimize-startup
  - optimize-latency
  - optimize-hydration
  - optimize-garbage-collection
  - optimize-database
  - optimize-bandwidth
  - optimize-concurrency
  - optimize-dns
  - optimize-event-loop
  - optimize-connection
  - optimize-io
  - optimize-serialization
  - optimize-pipeline
  - optimize-cpu
  - optimize-payload
  - optimize-cost
  - optimize-storage
  - optimize-battery
  - optimize-assets
  - optimize-throughput
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
3. ถ้า context ไม่ชัด -> ทำ /ask-requirement เพื่อเก็บ requirement
4. ถ้ายังไม่แน่ใจ -> ทำ /ask-me

### 2. Scan And Prioritize
> Goal: รู้ว่าส่วนไหนสำคัญกว่า
1. ทำ /scan-codebase เพื่อหา issues ทั่วไป
2. ตรวจสอบ quality, structure, และ technical debt
3. เรียง priority ตาม impact ก่อน effort

### 3. Run Skills
> Goal: ปรับปรุงแต่ละส่วนครบถ้วน
ทำ /optimize-rendering ถ้า rendering เป็นปัญหา
ทำ /optimize-memory ถ้า memory เป็นปัญหา
ทำ /optimize-query ถ้า query เป็นปัญหา
ทำ /optimize-caching ถ้า caching เป็นปัญหา
ทำ /optimize-latency ถ้า latency เป็นปัญหา
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
- Performance ปรับปรุงตาม AGENTS.md และทุก optimize-* skill รันตาม priority
- ผลตรวจสอบผ่าน
- รายงานสรุปครบถ้วน