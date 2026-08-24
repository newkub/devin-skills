---
name: improve-docs
description: ปรับปรุง docs, comments, และ developer experience ด้านเอกสาร
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
  - follow-config
  - improve-efficiency
  - improve-reliability
  - improve-writing
  - resolve-errors
  - review-docs
  - run-check
  - suggest-next-action
  - validate
---

## Goal

ปรับปรุง docs, comments, และ developer experience ด้านเอกสารของ project

## Scope

ใช้กับ project หรือ workspace ที่ต้องการปรับปรุง documentation, comments, onboarding, DX, และ feedback — ไม่รวม UX writing สำหรับ user-facing copy (ใช้ `/improve-frontend`)

## Execute

### 1. Analyze
> Goal: วิเคราะห์สถานะ docs, comments, และ DX ปัจจุบัน
1. ทำ `/scan-codebase` เพื่อหา docs, README, comments, และ setup files
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
3. ระบุ pain points: ขาด docs, comments ไม่ชัด, setup ยาก, feedback loops ช้า
4. ถ้าไม่พบ issues → stop และ report

### 2. Improve Documentation
> Goal: ให้ docs ครบถ้วนและทันสมัย
1. ตรวจสอบ README, CONTRIBUTING, setup guide, และ docs
2. สร้างหรือปรับปรุง `docs/onboarding.md` หรือ `.devin/onboarding.md` ถ้าขาด
3. ระบุ one-command setup เช่น `bun install && bun dev`
4. ใช้ `/review-docs` ถ้า documentation ขาดหรือล้าหลัง

### 3. Improve Comments
> Goal: เพิ่ม comments ที่มีประโยชน์
1. อ่าน code ที่มี logic ซับซ้อนหรือ business rules ทีคนอื่นอาจเข้าใจยาก
2. เพิ่ม comment สำหรับ why ไม่ใช่ what
3. ลบ comments ทีซ้ำซ้อนหรือล้าหลัง
4. ทำตาม project conventions และ global rules

### 4. Improve Tooling
> Goal: เครื่องมือทำงานราบรื่น
1. ตรวจสอบ package scripts, dev server, hot reload, build, lint, test commands
2. ใช้ `/improve-efficiency` ถ้า build ช้า
3. ใช้ `/run-check` เพื่อตรวจสอบ quality pipeline
4. ใช้ `/follow-config` ถ้า config ซับซ้อนหรือไม่สม่ำเสมอ

### 5. Improve Feedback Loops
> Goal: ลดเวลารอและข้อผิดพลาด
1. ตรวจสอบ error messages ให้บอกสาเหตุและวิธีแก้
2. ใช้ `/improve-writing` สำหรับ CLI messages หรือ logs
3. ตรวจสอบ type check, lint, test runtime
4. ใช้ `/improve-reliability` ถ้าขาด insights สำหรับ debugging

### 6. Validate
> Goal: ยืนยันว่าปรับปรุงแล้วดีขึ้น
1. ทำ `/validate` หรือ `/run-check`
2. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)
3. ทำ `/suggest-next-action`

## Rules

### 1. Minimal Changes
- ใช้ minimal changes
- ไม่แก้นอก scope
- ถ้าไม่แน่ใจ → stop และ `/ask-me`

### 2. Comment Quality
- comment บอก why ไม่ใช่ what
- ไม่เพิ่ม comment ที่ซ้ำกับชื่อ function/variable
- ใช้ภาษาเดียวกับ project

### 3. Documentation Focus
- เน้นเอกสารที่ช่วย developer เริ่มต้นและ debug
- อัปเดต docs ที่ล้าหลัง code

## Expected Outcome
- docs, comments, และ DX ดีขึ้นตาม criteria
- ไม่มี regression
- รายงานสรุปผล
