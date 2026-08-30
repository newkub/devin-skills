---
name: report-table
description: จัดรูปแบบตาราง, bullet, numbered list, และ metrics สำหรับรายงาน
related:
  - follow-best-practice
  - suggest-next-action
  - resolve-errors
  - report-ansi
---

## Goal

จัดรูปแบบ structured data output (ตาราง, bullet points, numbered list, metrics) ให้สอดคล้องและอ่านง่าย

## Scope

ใช้สำหรับการจัดรูปแบบ:
- ตารางข้อมูล (tables)
- bullet/numbered lists
- สรุปข้อมูลกระชับ (summaries)
- สถิติและ metrics (statistics, coverage, performance)

## Execute

### 1. Define Table Structure

> Goal: กำหนดโครงสร้างตาราง

1. กำหนด columns ที่จำเป็น
2. ทุกตารางต้องมีคอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ... ตามลำดับของแถว
3. กำหนด data types สำหรับแต่ละ column
4. จัดเรียง columns ตามความสำคัญ

### 2. Format Table Content

> Goal: จัดรูปแบบข้อมูลในตาราง

1. ใช้ markdown table format มาตรฐาน
2. ใช้ headers ชัดเจน
3. ใช้ alignment ที่เหมาะสม
4. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status

### 3. Format Summary

> Goal: สรุปข้อมูลกระชับ

1. ระบุ key metrics และ critical issues ก่อน
2. ใช้ bullet points สำหรับ quick scanning
3. ใช้ action-oriented phrasing
4. แยก critical items ก่อน details

### 4. Format As Bullet Or Numbered List

> Goal: สรุปเนื้อหาเป็น bullet หรือ numbered list

1. อ่านเนื้อหาต้นฉบับ
2. ระบุ main points และ key takeaways
3. ลบรายละเอียดทีไม่จำเป็น
4. เลือกรูปแบบ: bullet (`-`) หรือ numbered (`1.`)
5. หนึ่ง bullet/number = หนึ่ง idea
6. จัดกลุ่มทีเกี่ยวข้องและเรียงตาม priority
7. ตรวจสอบว่าไม่ missing information

### 5. Format Metrics

> Goal: จัดรูปแบบ metrics

1. จัดกลุ่ม metrics ตาม categories
2. ใช้ progress bars สำหรับ percentages (`████████░░░░ 50%`)
3. เพิ่ม baseline values
4. เพิ่ม thresholds และ trends

### 6. Group And Sort

> Goal: จัดกลุ่มและเรียงลำดับ

1. จัดกลุ่มตาม category
2. ใช้ headers สำหรับ grouping
3. เรียงลำดับภายในกลุ่มตามความสำคัญ
4. ใช้ separators สำหรับแยกกลุ่ม

### 7. Validate Readability

> Goal: ตรวจสอบความอ่านง่าย

1. ตรวจสอบว่าตารางอ่านง่ายบนทุก device
2. ตรวจสอบ columns/rows ไม่กว้าง/ยาวเกินไป
3. ตรวจสอบ formatting สอดคล้องกัน
4. ทำ suggest-next-action ท้าย report

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ bullet หรือ numbered list สำหรับสรุป points
4. ใช้ `report-ansi` สำหรับรายงานสถานะ/progress/logs
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ suggest-next-action ท้าย report เสมอ

### Table Structure

- ทุกตารางต้องมีคอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ... ตามลำดับของแถว
- ใช้ headers ชัดเจนสำหรับแต่ละ column
- จัดเรียง columns ตามความสำคัญ
- ใช้ alignment ที่เหมาะสมกับ data types

### Bullet And Numbered Format

- หนึ่ง bullet/number = หนึ่ง idea
- ใช้ภาษากระชับ
- จัดกลุ่มที่เหมาะสม
- ใช้ hierarchy ถ้าจำเป็น
- ไม่ distort ความหมาย
- รักษา context

### Summary Format

- ใช้ short sentences และ bullet points
- หลีกเลี่ยง unnecessary details
- ใช้ active voice และ clear language
- ระบุ owners และ deadlines ถ้ามี

### Metrics Format

- ใช้ tables สำหรับ structured metrics
- ใช้ progress bars สำหรับ percentages
- เพิ่ม baseline และ thresholds สำหรับ context
- ใช้ symbols สำหรับ status indicators

### Readability

- ตารางต้องอ่านง่ายบนทุก device
- Columns ไม่กว้างเกินไป
- Rows ไม่ยาวเกินไป
- Formatting สอดคล้องกันทั้งตาราง

- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## Expected Outcome

- ตารางที่มีโครงสร้างสอดคล้อง
- bullet/numbered list ที่กระชับและครบถ้วน
- Summary ที่กระชับและ actionable
- Metrics ที่ชัดเจนพร้อม context
- Grouping และ sorting ที่เป็นระบบ
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน
