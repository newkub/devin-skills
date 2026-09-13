---
name: follow-deep-review
description: บังคับทำตาม deep-review — รัน/อ่าน findings ก่อนวางแผนหรือแก้ไขเสมอ
argument-hint: "[scope]"
related:
  - deep-review
  - deep-plan
  - review-gaps
  - report
  - suggest-next-action
---

## Goal

ให้แน่ใจว่างานต่อไปทำตาม `/deep-review` — มี findings ล่าสุดก่อนเสมอ และทุก action อ้างอิง findings จริง ไม่วางแผนหรือแก้ไขบนสมมติฐาน

## Scope

ใช้ก่อน `/deep-plan`, implementation, หรือ refactor ที่ต้องการ evidence จาก review — aggregate findings จาก `/deep-review` report หรือ dimensional reviews ที่เคยรัน

- ดูเพิ่มเติม: /deep-review, /review-gaps

## Execute

### 1. Check Existing Findings

> Goal: หา review findings ล่าสุดที่มีอยู่

1. ตรวจว่ามี deep-review findings ล่าสุดสำหรับ scope นี้หรือไม่ (report ใน session, report files, dimensional review results)
2. ถ้า findings เก่าหรือครอบคลุมไม่พอ → ทำ `/deep-review` กับ scope นั้น
3. ถ้ามี dimensional findings กระจายอยู่ → ทำ `/review-gaps` รวมเป็น prioritized list

### 2. Extract Relevant Findings

> Goal: เลือกเฉพาะ findings ที่เกี่ยวกับ scope งาน

1. กรอง findings ตาม scope: files, domains, severity ที่เกี่ยวข้อง
2. จัดลำดับ: Critical/High ก่อน — findings เหล่านี้บังคับต้องมีในแผน
3. ระบุ findings ที่ out of scope พร้อมเหตุผล — ห้ามทิ้งเงียบๆ

### 3. Follow Findings

> Goal: map findings เข้ากับงานที่จะทำ

1. ทุก Critical/High finding ใน scope ต้อง map เป็น task หรือ constraint ในแผน
2. ระบุ findings ที่ block งานหลัก — ต้องแก้ก่อน หรือระบุ workaround
3. ถ้า findings ขัดกับ requirements → หยุดและ `/ask-me`

### 4. Report

> Goal: สรุปว่า findings ถูกนำไปใช้อย่างไร

1. ทำ `/report` คอลัมน์: `No.`, `Finding`, `Severity`, `Action`, `Mapped To`
2. ทำ `/suggest-next-action` — ปกติคือ `/deep-plan` หรือ `/deep-review-then-fix`

## Rules

- ห้ามเริ่ม planning/implementation โดยไม่มี findings ล่าสุด — ถ้าไม่มีให้รัน `/deep-review` ก่อน
- ห้ามเลือกเฉพาะ findings ที่สะดวก — Critical/High ทั้งหมดต้องถูกจัดการหรือ escalate
- Findings ต้อง traceable — ทุก action อ้างกลับถึง finding ต้นทางได้
- Skill นี้ไม่แก้ไข findings — แค่รวบรวมและบังคับให้งานถัดไปทำตาม

- ใช้ /deep-review-then-fix ถ้าจำเป็น
- ใช้ /loop-until-complete ถ้าจำเป็น

## Expected Outcome

- Findings ล่าสุดพร้อมใช้ก่อนงานหลักเสมอ
- ทุก Critical/High finding ใน scope ถูก map เข้างาน
- งานถัดไป (`/deep-plan`, implementation) มี evidence base ชัดเจน
- รายงาน mapping findings → actions ครบถ้วน
