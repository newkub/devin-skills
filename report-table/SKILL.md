---
name: report-table
description: จัดรูปแบบตาราง สรุปข้อมูล และ metrics สำหรับรายงาน
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - report-ansi
  - suggest-next-action
---

## Goal

จัดรูปแบบ structured data output (ตาราง, สรุป, metrics) ให้สอดคล้องและอ่านง่าย

## Scope

ใช้สำหรับการจัดรูปแบบ:
- ตารางข้อมูล (tables)
- สรุปข้อมูลกระชับ (summaries)
- สถิติและ metrics (statistics, coverage, performance)

## Execute

### 1. Define Table Structure

1. กำหนด columns ที่จำเป็นสำหรับตาราง
2. ใช้ numbered columns สำหรับลำดับที่ชัดเจน
3. กำหนด data types สำหรับแต่ละ column
4. จัดเรียง columns ตามความสำคัญ

### 2. Format Table Content

1. ใช้ markdown table format มาตรฐาน
2. ใช้ headers ชัดเจนสำหรับแต่ละ column
3. ใช้ alignment (left, center, right) ที่เหมาะสม
4. ใช้ symbols (✅, ❌, ⚠️) สำหรับ status indicators

### 3. Format Summary

1. ระบุ key metrics และ critical issues
2. ใช้ bullet points สำหรับ quick scanning
3. แสดง critical items ก่อน แล้วตามด้วย details
4. ใช้ action-oriented phrasing สำหรับ next steps

### 4. Format Metrics

1. จัดกลุ่ม metrics ตาม categories
2. ใช้ progress bars สำหรับ percentages (`████████░░░░ 50%`)
3. เพิ่ม baseline values สำหรับ comparison
4. เพิ่ม thresholds และ trends สำหรับ context

### 5. Group And Sort

1. จัดกลุ่มข้อมูลตาม category ที่เกี่ยวข้อง
2. ใช้ headers สำหรับ grouping
3. เรียงลำดับภายในกลุ่มตามความสำคัญ
4. ใช้ separators สำหรับแยกกลุ่ม

### 6. Validate Readability

1. ตรวจสอบว่าตารางอ่านง่ายบนทุก device
2. ตรวจสอบว่า columns ไม่กว้างเกินไป
3. ตรวจสอบว่า rows ไม่ยาวเกินไป
4. ตรวจสอบว่า formatting สอดคล้องกัน

## Rules


### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### Table Structure

- ใช้ numbered columns สำหรับลำดับที่ชัดเจน
- ใช้ headers ชัดเจนสำหรับแต่ละ column
- จัดเรียง columns ตามความสำคัญ
- ใช้ alignment ที่เหมาะสมกับ data types

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

## Expected Outcome

- ตารางที่มีโครงสร้างสอดคล้อง
- Summary ที่กระชับและ actionable
- Metrics ที่ชัดเจนพร้อม context
- Grouping และ sorting ที่เป็นระบบ
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน
