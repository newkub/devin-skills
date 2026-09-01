---
name: extract-pattern
description: เขียน pattern rules จากข้อมูลที่ให้มา
argument-hint: "[pattern]"
related:
  - review-architecture
  - learn-from-pattern
  - follow-best-practice
---

## Goal

สร้าง pattern rules ที่อธิบายโครงสร้างและลักษณะเฉพาะจากข้อมูลที่ให้มา

## Scope

ใช้ `extract-pattern` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม

## Execute

### 1. Analyze Input Data

> Goal: วิเคราะห์ข้อมูลเพื่อระบุประเภทและความสัมพันธ์

1. อ่านและวิเคราะห์ข้อมูลที่ได้รับ
2. ระบุประเภทของข้อมูล
3. หาความสัมพันธ์ระหว่างข้อมูล
4. ระบุลักษณะเฉพาะและความซ้ำซ้อน

### 2. Identify Patterns

> Goal: หา pattern ที่เกิดซ้ำและโครงสร้างที่สำคัญ

1. หา pattern ที่เกิดซ้ำในข้อมูล
2. ระบุโครงสร้างที่สำคัญ
3. หาข้อยกเว้นและกรณีพิเศษ
4. จัดกลุ่ม pattern ที่คล้ายกัน

### 3. Write Pattern Rules

> Goal: เขียน rules ที่อธิบาย pattern อย่างชัดเจน

1. เขียน rules ที่อธิบาย pattern อย่างชัดเจน
2. ใช้ภาษาที่เข้าใจง่ายและกระชับ
3. ให้ตัวอย่างที่ชัดเจนสำหรับแต่ละ rule
4. ระบุเงื่อนไขและข้อจำกัด

### 4. Validate Rules

> Goal: ตรวจสอบความครบถ้วนและความใช้งานได้จริงของ rules

1. ตรวจสอบว่า rules ครอบคลุมทุกกรณี
2. ทดสอบ rules กับข้อมูลตัวอย่าง
3. ตรวจสอบว่าไม่มีข้อยกเว้นที่ไม่ได้ระบุ
4. ยืนยันว่า rules ใช้งานได้จริง

## Rules

### 1. Pattern Rule Quality

1. Pattern rules ต้องชัดเจนและเข้าใจง่าย
2. ต้องมีตัวอย่างประกอบทุก rule
3. ต้องระบุเงื่อนไขและข้อจำกัด
4. ห้ามเขียน rules ที่ซับซ้อนเกินความจำเป็น
5. ต้องครอบคลุมทุกกรณีที่เป็นไปได้

- ใช้ /review-architecture ถ้าจำเป็น
- ใช้ /learn-from-pattern ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น

## Expected Outcome

- Pattern rules ที่ชัดเจนและเข้าใจง่าย
- ตัวอย่างประกอบทุก rule
- เงื่อนไขและข้อจำกัดที่ชัดเจน
- Rules ที่ครอบคลุมทุกกรณี