---
name: improve-governance
description: ปรับปรุง governance และ compliance ของ project
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
  - follow-best-practice
  - learn-from-web
  - use-scripts
  - validate
  - resolve-errors
  - suggest-next-action
---

## Goal

ปรับปรุง governance และ compliance ของ project ให้ดีขึ้น โดยจัดระเบียบ policies, standards, controls, และการตรวจสอบ

## Scope

ใช้กับ project หรือ workspace ที่ต้องการปรับปรุง governance, compliance, policies, standards, และ controls — ไม่รวมการปรับปรุงทีละส่วนลึกซึ้ง (ใช้ `/improve-*` ย่อย)

## Execute

### 1. Analyze
> Goal: วิเคราะห์สถานะ governance และ compliance ปัจจุบัน
1. ทำ `/scan-codebase` เพื่อหา policies, standards, controls, และเอกสารที่เกี่ยวข้อง
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
3. ระบุ gaps: ขาด policy, ไม่มี owner, ไม่มี audit trail, ไม่สอดคล้องมาตรฐาน
4. ถ้าไม่พบ issues → stop และ report

### 2. Improve Governance
> Goal: จัดระเบียบ policies, roles, และ standards
1. ตรวจสอบ governance framework: roles, responsibilities, decision logs, approval processes
2. เพิ่มหรือปรับปรุง policies, guidelines, และ standards ที่ขาด
3. ใช้ `/follow-best-practice` หรือ `/learn-from-web` หา best practices เฉพาะ domain
4. ระบุ owner และ review cadence สำหรับแต่ละ policy

### 3. Improve Compliance
> Goal: ให้ project สอดคล้องกับ requirements และมาตรฐาน
1. ระบุ compliance requirements: security, data privacy, accessibility, licenses, regulations
2. ตรวจสอบ current implementation ตาม requirements
3. แก้ไข gaps ตาม priority โดยใช้ skills ย่อยที่เหมาะสม
4. ถ้าแก้ > 10 ไฟล์ → ทำ `/use-scripts`

### 4. Validate
> Goal: ยืนยันว่าปรับปรุงแล้วดีขึ้น
1. ทำ `/validate` หรือ `/run-check`
2. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)
3. ทำ `/suggest-next-action`

## Rules

### 1. Minimal Changes
- ใช้ minimal changes
- ไม่แก้นอก scope
- ถ้าไม่แน่ใจ → stop และ `/ask-me`

### 2. Evidence Based
- ทุก policy หรือ compliance fix ต้องมี reference หรือ standard อ้างอิง
- ไม่สร้าง policy ที่ไม่มีผลต่อการทำงาน

## Expected Outcome
- governance และ compliance ดีขึ้นตาม criteria
- ไม่มี regression
- รายงานสรุปผล
