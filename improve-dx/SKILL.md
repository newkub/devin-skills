---
name: improve-dx
description: ปรับปรุง developer experience ของ project ด้าน tooling, onboarding, docs และ feedback
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - improve-codebase
---

## Goal

ปรับปรุง developer experience (DX) ให้ developer เริ่มต้น, ทำงาน, debug, และสื่อสารได้ง่ายขึ้น

## Scope

ใช้กับ project หรือ workspace ที่ต้องการปรับปรุง DX ด้าน tooling, onboarding, documentation, scripts, feedback

## Execute

### 1. Analyze
> Goal: วิเคราะห์สถานะปัจจุบัน
1. ทำ /scan-codebase เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ /review-codebase เพื่อรายละเอียดเพิ่ม
3. ระบุ pain points ของ developer: setup, build, test, debug, deploy, docs
4. ถ้าไม่พบ issues -> stop และ report

### 2. Improve Tooling
> Goal: เครื่องมือทำงานราบรื่น
1. ตรวจสอบ package scripts, dev server, hot reload, build, lint, test commands
2. ใช้ /optimize-build ถ้า build ช้า
3. ใช้ /run-check เพื่อตรวจสอบ quality pipeline
4. ใช้ /follow-config ถ้า config ซับซ้อนหรือไม่สม่ำเสมอ

### 3. Improve Onboarding
> Goal: developer ใหม่เริ่มได้เร็ว
1. ตรวจสอบ README, CONTRIBUTING, setup guide, local env instructions
2. สร้างหรือปรับปรุง `docs/onboarding.md` หรือ `.devin/onboarding.md`
3. ใช้ /review-docs ถ้า documentation ขาดหรือล้าหลัง
4. ระบุ one-command setup เช่น `bun install && bun dev`

### 4. Improve Feedback Loops
> Goal: ลดเวลารอและข้อผิดพลาด
1. ตรวจสอบ error messages ให้บอกสาเหตุและวิธีแก้
2. ใช้ /review-ux-writing สำหรับ CLI messages หรือ logs
3. ตรวจสอบ type check, lint, test runtime
4. ใช้ /review-observability ถ้าขาด insights สำหรับ debugging

### 5. Validate
> Goal: ยืนยันว่าปรับปรุงแล้วดีขึ้น
1. ทำ /validate หรือ /run-check
2. ถ้าไม่ผ่าน -> ทำ /resolve-errors แล้ว retry (max 3)
3. ทำ /suggest-next-action

## Rules
### 1. Minimal Changes
- ใช้ minimal changes
- ไม่แก้นอก scope
- ถ้าไม่แน่ใจ -> stop และ /ask-me

## Expected Outcome
- DX ดีขึ้นตาม criteria
- ไม่มี regression
- รายงานสรุปผล
