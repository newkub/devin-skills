---
name: review-dx
description: Review developer experience ครอบคลุม build, errors, tools, HMR, onboarding พร้อม review score
related:
  - scan-codebase
  - suggest-next-action
  - review-config
---

## Goal

Review developer experience ครอบคลุม build performance, error messages, development tools, HMR, onboarding, local development พร้อม review score

## Scope

DX review สำหรับ: build times, error messages clarity, development tools, HMR setup, onboarding documentation, local development experience — ไม่รวมการ fix

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ DX ปัจจุบันของ project

1. ทำ `/scan-codebase`, ตรวจสอบ build configuration และ scripts
2. ตรวจสอบ error messages ใน build และ dev tools
3. ตรวจสอบ development tools setup (IDE, linting, formatting, pre-commit hooks)
4. ตรวจสอบ HMR configuration
5. ตรวจสอบ onboarding documentation (README, setup guide, contribution guide)

### 2. Analyze Build Performance

> Goal: รู้ว่า build และ dev startup เร็วพอหรือไม่

1. ตรวจสอบ build times (< 1 นาที target)
2. ตรวจสอบ incremental builds และ cache usage
3. ตรวจสอบ parallel build tasks
4. ตรวจสอบ bundle size
5. ระบุ bottlenecks ใน build process

### 3. Analyze Error Messages And Tools

> Goal: รู้ว่า error messages และ tools ช่วย developer ได้พอหรือไม่

1. ตรวจสอบ error messages มี suggestions สำหรับ fix
2. ตรวจสอบ error codes สำหรับ easy reference
3. ตรวจสอบ stack traces ที่ readable
4. ตรวจสอบ IDE integrations และ extensions
5. ตรวจสอบ linting และ formatting อัตโนมัติ
6. ตรวจสอบ pre-commit hooks

### 4. Analyze HMR And Onboarding

> Goal: รู้ว่า HMR และ onboarding ราบรื่นหรือไม่

1. ตรวจสอบ HMR ทำงานได้อย่างราบรื่น
2. ตรวจสอบ state preservation ระหว่าง HMR
3. ตรวจสอบ fast refresh setup
4. ตรวจสอบ README ครบถ้วน
5. ตรวจสอบ setup guide เป็น step-by-step
6. ตรวจสอบ troubleshooting guide

### 5. Score And Report

> Goal: Report ชัดเจน  actionable สอดคล้อง Goal

1. ให้ score ตาม DX dimensions: build performance, error messages, tools, HMR, onboarding
2. จำแนก severity: critical (build > 5 นาที), high (no HMR), medium (poor error messages), low (missing docs)
3. รายงานเป็นตาราง: dimension | issues found | severity | action item
4. ทำ `/suggest-next-action` สำหรับขั้นตอนถัดไป

## Rules

### 1. Fast Feedback Loops

- Build ควรใช้เวลา < 1 นาที
- Tests ควรรันเร็ว
- Linting ควรเร็ว
- HMR ควร instant
- ไม่ block developers ด้วย slow processes

### 2. Clear Error Messages

- บอกสิ่งที่ผิด
- บอกวิธีแก้
- บอกที่มาของ error
- ใช้ภาษาที่เข้าใจง่าย

### 3. Non-Redundancy

- รายละเอียด config review อยู่ใน `/review-config` แล้ว
- workflow นี้เป็น review เท่านั้น ไม่ fix

### 4. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder

## Expected Outcome

- ตาราง: dimension | issues found | severity | action item
- DX gaps ถูกระบุและจัดลำดับ
- Review score สำหรับ developer experience
- Action items ชัดเจนสำหรับขั้นตอนถัดไป
