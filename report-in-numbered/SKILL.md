---
name: report-in-numbered
description: ตอบในแชทเป็น numbered list เรียงลำดับความสำคัญ
argument-hint: "[scope]"
related:
  - report
  - report-in-table
  - report-in-codeblock
  - suggest-next-action
---

## Goal

ตอบในแชทเป็น numbered list เพื่อเน้นลำดับความสำคัญหรือ steps

## Scope

ใช้สำหรับข้อมูลที่ต้องการเน้นลำดับ ขั้นตอน หรือ priority มากกวา comparison

## Execute

### 1. Prepare Items

> Goal: รวบรวม items ทีจะรายงาน

1. รวบรวมข้อมูล
2. แยกแต่ละ item ให้มี single responsibility
3. กำหนด priority

### 2. Number And Group

> Goal: จัดลำดับและกลุ่ม

1. ใช้เลข 1, 2, 3, ... ตาม priority
2. ถ้ามีหลายหมวด ใช้ `##` headers แยกกลุ่ม
3. ภายในกลุ่มเรียงตาม priority

### 3. Format

> Goal: ทำให้อ่านง่าย

1. เริ่มด้วย summary 2-3 ข้อก่อน numbered list
2. ใช้ emoji ตาม status: `✅` `⏳` `❌` `⚠️`
3. ใช้ bullet ย่อยภายใต้แต่ละหมายเลขถ้าจำเป็น
4. ใช้ backticks สำหรับ code, paths, skill names
5. ใช้ `/report-in-table` ถ้าข้อมูลเหมาะกับตารางมากกวา
6. ใช้ `/report-in-codeblock` ถ้ามี commands หรือ code snippets

### 4. Validate

> Goal: ตรวจคุณภาพ

1. ตรวจลำดับเลขถูกต้อง
2. ตรวจแต่ละข้อมี single responsibility
3. ทำ `/suggest-next-action` ถ้ามี next steps

## Rules

- หนึ่งเลข = หนึ่ง idea/step
- เรียงตาม priority หรือ status ให้ `completed` อยู่ก่อน
- ใช้ backticks สำหรับ paths, commands, skill names
- ใช้ emoji ตาม legend ของ `/report`
- ไม่ใช้ bold markers
- ตอบในแชทเท่านั้น

## Expected Outcome

- Numbered list เรียงลำดับถูกต้อง
- แต่ละข้อกระชับ ชัดเจน
- ระบุ next action ถ้ามี
