---
name: add-more
description: วิเคราะห์ gaps และเพิ่มสิ่งที่ขาดหายไปตาม context
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
---

## Goal

วิเคราะห์ gaps ของสิ่งที่มีอยู่และเพิ่มสิ่งที่ขาดหายไปตาม context ที่กำหนด

## Scope

ใช้สำหรับเพิ่มสิ่งใดก็ได้ที่ขาดหายไปใน project เช่น features, files, tests, configs, docs, workflows, modules, ฯลฯ ตาม context ที่ผู้ใช้ระบุ

## Execute

### 1. Identify Context
> Goal: Identify Context

1. ระบุ context ของสิ่งที่ต้องการเพิ่ม (features, files, tests, configs, docs, modules, ฯลฯ)
2. ทำ `/analyze-project` เพื่อเข้าใจโครงสร้างและ characteristics ของ project
3. ถ้า context เกี่ยวกับ features ให้ทำ `/deep-review`
4. ถ้า context เกี่ยวกับ file structure ให้ทำ `/deep-review`
5. บันทึกสิ่งที่มีอยู่ปัจจุบันเป็น baseline

### 2. Analyze Gaps
> Goal: Analyze Gaps

1. ระบุสิ่งที่มีอยู่ปัจจุบันใน context ที่กำหนด
2. ระบุสิ่งที่ควรมีแต่ยังไม่มี (gaps)
3. ถ้า context เกี่ยวกับ features ให้ทำ `/idea-features` เพื่อสร้างไอเดีย features ใหม่
4. ตรวจสอบ references และ dependencies ที่อ้างถึงสิ่งที่ยังไม่มี
5. ถ้ามี gaps มากกว่า 10 รายการ ให้ใช้ `/use-scripts` สำหรับ batch analysis

### 3. Prioritize
> Goal: Prioritize

1. จัดลำดับตาม impact (สิ่งที่มีผลกระทบมากก่อน)
2. จัดลำดับตาม dependencies (สิ่งที่เป็น dependencies ของสิ่งอื่นก่อน)
3. จัดลำดับตาม criticality (สิ่งที่จำเป็นสำหรับ functionality หลักก่อน)
4. จัดลำดับตาม effort (สิ่งที่ทำง่ายและมี impact มากก่อน)

### 4. Add Missing Items
> Goal: Add Missing Items

1. สร้างเพิ่มทีละรายการตามลำดับความสำคัญ
2. ทำตาม best practices ของ context นั้นๆ โดยใช้ `/follow-best-practice`
3. ตรวจสอบว่าไม่ซ้ำซ้อนกับสิ่งที่มีอยู่
4. ถ้ามี items มากกว่า 10 รายการ ให้ใช้ `/use-scripts` สำหรับ batch creation
5. อัพเดท references ที่เกี่ยวข้องทุกครั้งที่เพิ่ม item ใหม่

### 5. Validate
> Goal: Validate

1. ตรวจสอบว่าสิ่งที่เพิ่มใหม่ทำงานได้ถูกต้อง
2. ตรวจสอบว่าไม่ทำลาย functionality ที่มีอยู่
3. ตรวจสอบว่าไม่มี broken references หลังเพิ่ม
4. รัน verify หรือ test ตาม context (เช่น `/run-verify`, `/run-test`, `/run-build`)

### 6. Report
> Goal: Report

1. รัน `/report-table` เพื่อแสดง before/after ของสิ่งที่เพิ่มขึ้น
2. รัน `/report-ansi` เพื่อแสดงสรุปการเพิ่ม

## Rules

### 1. Context-Driven

- ระบุ context ก่อนเริ่ม (features, files, tests, configs, docs, modules, ฯลฯ)
- ทำ `/analyze-project` ก่อนเพื่อเข้าใจ project characteristics
- ถ้า context เกี่ยวกับ features ให้ทำ `/idea-features`
- ถ้า context เกี่ยวกับ structure ให้ทำ `/deep-review`

### 2. Non-Duplication

- ตรวจสอบว่าสิ่งที่เพิ่มไม่ซ้ำซ้อนกับสิ่งที่มีอยู่
- ถ้ามีสิ่งที่คล้ายกัน ให้ขยายหรือปรับปรุงแทนการสร้างใหม่
- ใช้ `/improve-*` workflows ถ้าต้องการปรับปรุงสิ่งที่มีอยู่แทนการเพิ่มใหม่

### 3. Conditional Execution

- ถ้ามี gaps มากกว่า 10 รายการ ให้ใช้ `/use-scripts` สำหรับ batch analysis และ creation
- ถ้าไม่มี gaps ให้หยุดและรายงาน
- ถ้า context เกี่ยวกับ code ให้รัน `/run-verify` หลังเพิ่ม
- ถ้า context เกี่ยวกับ tests ให้รัน `/run-test` หลังเพิ่ม

### 4. Prioritization

- เพิ่มสิ่งที่เป็น dependencies ของสิ่งอื่นก่อน
- เพิ่มสิ่งที่มี impact สูงก่อน
- เพิ่มสิ่งที่จำเป็นสำหรับ functionality หลักก่อน
- เพิ่มสิ่งที่ทำง่ายและมี impact มากก่อน (quick wins)

### 5. Preserve Functionality

- ตรวจสอบว่าสิ่งที่มีอยู่ยังทำงานได้หลังเพิ่ม
- ห้ามลบหรือแก้ไขสิ่งที่ไม่เกี่ยวข้องกับ task
- ทำตาม existing style และ conventions ของ project

## Expected Outcome

- สิ่งที่ขาดหายไปถูกเพิ่มให้ครบถ้วนตาม context
- ไม่มี duplication กับสิ่งที่มีอยู่
- ไม่มี broken references
- Functionality ที่มีอยู่ยังทำงานได้ถูกต้อง
- มีรายงาน before/after ของสิ่งที่เพิ่มขึ้น
