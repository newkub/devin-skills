---
name: report-before
description: รายงานสถานะปัจจุบันตาม context ก่อนเริ่มทำอะไร
argument-hint: "[scope]"
related:
  - report-ansi
  - report-progress
  - suggest-next-action
---

## Goal

ตอบในแชทเป็นตารางที่มีคอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ... พร้อม grouping, sorting เพื่อความชัดเจน โดยยังไม่ดำเนินการใดๆ

## Scope

ใช้สำหรับการรายงานข้อมูลทุกประเภทในรูปแบบตารางและ numbered list ในแชทเท่านั้น ก่อนการตัดสินใจหรือลงมือทำงาน

## Execute

### 1. Prepare Data

> Goal: รวบรวมและจัดเตรียมข้อมูลก่อนจัดรูปแบบ

1. รวบรวมข้อมูลตาม context ที user ให้มา
2. ระบุ scope และสิ่งทีเกี่ยวข้อง
3. จัดกลุ่มข้อมูลตาม category
4. กำหนดลำดับความสำคัญของแต่ละ item

### 2. Choose Format

> Goal: เลือกรูปแบบทีเหมาะสม

1. ถ้าข้อมูลมีหลาย columns ทีต้องเปรียบเทียบ → ใช้ตาราง
2. ถ้าต้องการเน้นลำดับความสำคัญ → ใช้ numbered list
3. ถ้าเหมาะสม → ผสมทั้งสองรูปแบบ
4. ถ้าเป็นรายงานความคืบหน้า → อ้างอิง `/report-ansi`
5. ถ้าเป็นรายงานสถานะ → อ้างอิง `/report-progress`

### 3. Format Output

> Goal: จัดรูปแบบข้อมูลให้อ่านง่าย

1. ใช้ markdown table format มาตรฐาน
2. ทุกตารางต้องมีคอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ...
3. ใช้ headers ชัดเจนสำหรับแต่ละ column
4. ใช้ alignment ทีเหมาะสม
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status
6. ใช้ backticks สำหรับ `commands`, paths, keywords

### 4. Apply Grouping And Sorting

> Goal: จัดกลุ่มและเรียงลำดับ

1. จัดกลุ่มข้อมูลตาม category
2. ใช้ headers สำหรับแยกกลุ่ม
3. เรียงลำดับภายในกลุ่มตามความสำคัญ
4. ถ้ากลุ่มซับซ้อน ใช้ separators สำหรับแยกกลุ่ม

### 5. Validate Output

> Goal: ตรวจสอบคุณภาพก่อนส่ง

1. ตรวจสอบว่าทุกตารางมีคอลัมน์ "No." เป็นคอลัมน์แรกและเรียงลำดับถูกต้อง
2. ตรวจสอบ grouping และ sorting
3. ตรวจสอบความอ่านง่ายบนทุก device
4. ทำ `/suggest-next-action`

## Rules

### 1. No Changes

- ห้ามแก้ไข ลบ สร้าง หรือ overwrite ไฟล์
- ห้ามรัน command ทีมี side effects
- ใช้ read-only commands เท่านั้น

### 2. Format Selection

- ใช้ตารางเมื่อมีข้อมูลหลาย columns
- ใช้ numbered list เมื่อต้องการเน้นลำดับ
- สามารถผสมทั้งสองรูปแบบได้
- เลือกรูปแบบทีอ่านง่ายทีสุด

### 3. Table Structure

- ทุกตารางต้องมีคอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ...
- ใช้ headers ชัดเจน
- จัดเรียง columns ตามความสำคัญ
- ใช้ alignment ทีเหมาะสมกับ data types

### 4. Grouping And Sorting

- จัดกลุ่มตาม category
- ใช้ headers สำหรับ grouping
- เรียงลำดับภายในกลุ่มตามความสำคัญ
- ใช้ separators ถ้ากลุ่มซับซ้อน

### 5. Output Channel

- ตอบกลับในแชทเท่านั้น
- ไม่สร้างไฟล์แยกสำหรับรายงาน
- ใช้ markdown table format
- ตารางต้องอ่านง่ายบนทุก device

### 6. Readability

- แต่ละข้อกระชับ ตรงประเด็น
- หลีกเลี่ยงข้อความยาว
- ใช้ภาษาเข้าใจง่าย
- จัดรูปแบบสอดคล้องกัน

## Expected Outcome

- ตารางทีมีคอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ...
- Grouping และ sorting ชัดเจน
- ข้อมูลอ่านง่าย
- รูปแบบเหมาะสมกับ context
- ยังไม่มีการแก้ไขใดๆ
- ระบุ next action ชัดเจน
