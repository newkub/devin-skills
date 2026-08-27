---
name: report-idea
description: สร้างและรายงานไอเดียตาม user context ทั่วไป
---

## Goal

วิเคราะห์ context ที่ user ให้มาแล้วสร้างไอเดีย/ข้อเสนอ พร้อมรายงานในรูปแบบตารางทีอ่านง่าย

## Scope

ใช้เมื่อ user ต้องการไอเดียทั่วไปจาก context: problem, project, workflow, skill, feature, หรือหัวข้อใดๆ

## Execute

### 1. Analyze Context

> Goal: เข้าใจ context ของ user

1. อ่าน prompt และ context ทีให้มา
2. ระบุ domain: `project`, `skill`, `feature`, `workflow`, `product`, `code`
3. ระบุ constraints: time, budget, tech, team
4. ถ้า context ไม่ชัด → ถาม user

### 2. Generate Ideas

> Goal: สร้างไอเดียหลายทิศทาง

1. ระดมไอเดียจาก context
2. แบ่งประเภท: ทางเลือก A/B/C, short-term/long-term, low/high effort
3. ประเมินแต่ละ idea ด้วย criteria: impact, effort, risk, feasibility
4. ลบ ideas ที่ซ้ำหรือไม่เหมาะสม

### 3. Structure Ideas

> Goal: จัดรูปแบบไอเดีย

1. เลือก top ideas ไม่เกิน 10 อัน
2. กำหนด columns:
   - No.
   - Idea
   - Category
   - Impact
   - Effort
   - Risk
   - Feasibility
   - Next Step
3. เรียงตาม Impact แล้ว Effort
4. ใช้ grouping ตาม Category

### 4. Report

> Goal: นำเสนอไอเดียด้วยตาราง

1. ใช้ `/report-table` แสดง ideas
2. ใช้ `/report-before` ถ้าต้องการ report สถานะก่อนลงมือ
3. ระบุ top 3 ideas ทีควรทำก่อน
4. ทำ `/suggest-next-action`

## Rules

### 1. Context First

- ไม่เดาไอเดียนอก context
- ถาม user ถ้าข้อมูลไม่พอ
- ใช้ keywords จาก prompt เพื่อปั้น ideas

### 2. Actionable

- ทุก idea ต้องมี Next Step ชัดเจน
- ไม่เสนอ idea ที่กว้างเกินไป
- ระบุผลลัพธ์ทีคาดหวัง

### 3. Feasible

- ประเมิน effort แบบ rough (S/M/L)
- ระบุ risk จริงๆ
- ไม่เสนอ idea ที่ conflict กับ constraints

### 4. Format

- ตอบใน chat ด้วย markdown table
- ทุกตารางต้องมีคอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ...
- ใช้ symbols สำหรับ impact/effort/risk
- จัดกลุ่มตาม category

## Expected Outcome

- รายการไอเดียทีสอดคล้องกับ context
- ตารางทีมีคอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ... พร้อม impact, effort, risk, feasibility
- Top 3 ideas ทีควรทำก่อน
- Next action ชัดเจน
