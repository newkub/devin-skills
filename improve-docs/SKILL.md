---
name: improve-docs
description: แก้ไข documentation findings จาก review-docs, review-readme-md และ review-writing
argument-hint: "[doc-or-scope]"
related:
  - review-docs
  - review-readme-md
  - review-writing
  - review-usage-md
  - review-content-coverage
  - update-readme-md
  - update-usage-md
  - report-table
  - check-reference
  - ask-me
---

## Goal

แก้ไข documentation findings จาก `review-docs`, `review-readme-md`, `review-writing`, `review-usage-md` และ `review-content-coverage` จน docs ถูกต้อง ครบถ้วน และตรงกับ code จริง

## Scope

ใช้หลัง review docs family เมื่อต้องแก้เอกสาร: README, USAGE, API docs, guides, comments — ครอบคลุมความถูกต้อง, coverage, ตัวอย่าง และลิงก์ — ไม่ครอบคลุมการเขียน docs จากศูนย์ (ใช้ `create-docs` หรือ skill ที่เกี่ยวข้อง)

## Execute

### 1. Collect Findings

> Goal: รวบรวม doc findings จากทุก review source

1. รัน `/review-docs` หรือ review ที่เกี่ยวข้องถ้ายังไม่มี findings
2. จัดกลุ่ม: stale content, missing docs, broken links, wrong examples, coverage gaps
3. จับคู่ finding กับไฟล์ doc ที่ต้องแก้

### 2. Verify Against Code

> Goal: docs ต้องตรงกับ code จริงไม่ใช่สิ่งที่เดา

1. ทำ `/scan-codebase` เพื่อยืนยัน APIs, commands และ configs จริง
2. ทำ `/check-reference` สำหรับลิงก์และ references ใน docs
3. ทำเครื่องหมาย docs ที่อธิบาย feature ที่ไม่มีอยู่จริง

### 3. Fix Correctness

> Goal: แก้เนื้อหาที่ผิดหรือล้าสมัย

1. อัปเดต commands, APIs, options ให้ตรง code ปัจจุบัน
2. แก้ broken links และ references ที่หาย
3. แก้ code examples ให้ runnable

### 4. Fill Coverage Gaps

> Goal: เพิ่ม docs ที่ขาดสำหรับ features สำคัญ

1. เพิ่ม sections ที่ขาดตาม findings (install, usage, troubleshooting)
2. ใช้ `/update-readme-md` หรือ `/update-usage-md` สำหรับไฟล์มาตรฐาน
3. เขียนเฉพาะสิ่งที่มี evidence จาก code — ไม่เดา behavior

### 5. Improve Clarity

> Goal: docs อ่านง่ายและเป็นลำดับ

1. แก้ตาม findings จาก `/review-writing` และ `/review-readme-md`
2. จัดโครงสร้าง heading, lists และ examples ให้สอดคล้อง
3. ลบเนื้อหาซ้ำซ้อนระหว่าง docs

### 6. Validate And Report

> Goal: docs ผ่าน review และ links ใช้งานได้

1. รัน `/check-reference` อีกครั้งหลังแก้
2. ทำ `/report-table` สรุป findings → fix → ไฟล์ที่แก้
3. ระบุ docs ที่ยังขาดพร้อมเหตุผล

## Rules

### 1. Code Is Source Of Truth

- ทุก doc ต้องตรงกับ code ที่ verify แล้ว — ห้ามเดา
- ถ้า code และ docs ขัดกัน → แก้ docs หรือ escalate `/ask-me`

### 2. Minimal Scope

- แก้เฉพาะ findings ไม่ rewrite ทั้งไฟล์ถ้าไม่จำเป็น
- รักษา tone และ format เดิมของแต่ละ doc

### 3. Traceable Changes

- ทุก fix ระบุ finding ที่เกี่ยวข้อง
- ถ้าลบเนื้อหา → ระบุเหตุผล (stale, duplicate, wrong)

## Expected Outcome

- Docs ตรงกับ code จริงและผ่าน `/check-reference`
- Coverage gaps สำคัญถูกเติม
- ไม่มี broken links หรือ stale examples
- รายงานสรุป findings, fix และ gaps ที่เหลือ
