---
name: report-in-table
description: ตอบในแชทเป็นตารางพร้อมคอลัมน์ No. เรียงลำดับ
argument-hint: "[scope]"
related:
  - review-writing
---

## Goal

ตอบในแชทเป็นตารางที่มีคอลัมน์ `No.` เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ...

## Scope

ใช้สำหรับข้อมูลที่ต้องเปรียบเทียบหลาย columns หรือต้องการดูสถานะครบในตารางเดียว

## Execute

### 1. Prepare Data

> Goal: รวบรวมและจัดเตรียมข้อมูล

1. รวบรวมข้อมูลทีต้องรายงาน
2. จัดกลุ่มตาม category
3. กำหนดลำดับความสำคัญ
4. ตัดสินใจคอลัมน์ทีเหมาะสม

### 2. Build Table

> Goal: สร้างตารางทีอ่านง่าย

1. คอลัมน์แรกต้องเป็น `No.` เรียง 1, 2, 3, ...
2. ใช้ headers ชัดเจน
3. จัดเรียง columns ตามความสำคัญ
4. ใช้ alignment เหมาะสมกับ data types

### 3. Group And Sort

> Goal: จัดกลุ่มและเรียงลำดับ

1. จัดกลุ่มข้อมูลตาม category
2. ใช้ headers สำหรับแยกกลุ่ม
3. เรียงลำดับภายในกลุ่มตาม priority

### 4. Validate

> Goal: ตรวจคุณภาพก่อนส่ง

1. ตรวจ `No.` เรียงถูกต้อง
2. ตรวจ grouping และ sorting
3. ทำ `/review-writing` ถ้าจำเป็น

## Rules

- ทุกตารางต้องมีคอลัมน์ `No.` เป็นคอลัมน์แรก
- ใช้ backticks สำหรับ code, paths, skill names
- ใช้ symbols ✅ ❌ ⚠️ สำหรับ status
- ไม่ใช้ bold markers
- ตอบในแชทเท่านั้น

## Expected Outcome

- ตารางทีมีคอลัมน์ `No.` เรียงลำดับถูกต้อง
- Grouping และ sorting ชัดเจน
- ข้อมูลอ่านง่าย
