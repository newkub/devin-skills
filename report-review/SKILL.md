---
name: report-review
description: รายงานผล review ครบทุกมิติอย่างละเอียดที่สุด พร้อม severity และ recommendations
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
  - report-format-table
  - suggest-next-action
---

## Goal

รายงานผล review ครบทุกมิติอย่างละเอียดที่สุด สรุป findings ทุก dimension พร้อม severity ratings และ actionable recommendations

## Scope

ใช้สำหรับรายงานผลหลังทำ `/deep-review` หรือ `/resolve-errors` เสร็จ ครอบคลุมทุกมิติ: code quality, architecture, security, performance, testing, documentation, configuration, dependencies

## Execute

### 1. Collect Review Results

รวบรวมผลลัพธ์จากการ review ทุกมิติ

1. รวบรวม findings จากทุก dimension (code quality, architecture, security, performance, testing, documentation, configuration, dependencies)
2. ระบุ severity ของแต่ละ finding: Critical, High, Medium, Low
3. รวบรวม evidence ของแต่ละ finding (file path, line number, code snippet)
4. ระบุ issues ที่แก้ไขแล้วและยังเหลืออยู่

### 2. Format Review Report

จัดรูปแบบรายงานตามประเภทข้อมูล

1. ใช้ `/report-format-table` สำหรับตาราง findings แยกตาม dimension
2. ใช้ `/report-format-table` สำหรับสรุปภาพรวม
3. ใช้ `/report-format-terminal` สำหรับความคืบหน้ารวม

### 3. Report Dimension Findings

แสดง findings ของแต่ละมิติอย่างละเอียด

1. แสดงตาราง findings แยกตาม dimension: Dimension, Finding, Severity, Location, Evidence, Recommendation
2. จัดกลุ่ม findings ตาม dimension และ severity
3. ระบุ root cause ของแต่ละ finding
4. ให้ recommendations ที่ actionable และ concrete

### 4. Report Executive Summary

แสดงสรุปภาพรวมของการ review

1. แสดง overall review score (0-100)
2. แสดงสรุป findings ตาม severity: Critical, High, Medium, Low
3. แสดงสรุป findings ตาม dimension
4. ระบุ critical issues ที่ต้องแก้ก่อน production
5. ระบุ confidence level ของการ review

### 5. Report Fix Status

แสดงสถานะการแก้ไข issues

1. แสดงตารางสถานะ: Issue, Dimension, Severity, Status, Fix Applied
2. ใช้ symbols: ✅ แก้แล้ว, ❌ ยังไม่แก้, 🔄 กำลังแก้, ⏭️ ข้าม
3. ระบุ issues ที่เหลือและความรุนแรง
4. จัดลำดับ issues ที่เหลือตาม priority

### 6. Report Recommendations

แสดงคำแนะนำและ action ถัดไป

1. จัดลำดับ recommendations ตาม impact และ effort
2. ระบุ quick wins และ strategic fixes
3. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป
4. ระบุ steps ที่ต้องทำซ้ำถ้ามี issues ที่ยังไม่ผ่าน

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-format-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-format-terminal` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. Report Structure

- เริ่มด้วย executive summary (overall review score, สรุป severity)
- แสดงตาราง findings แยกตาม dimension
- แสดงสถานะการแก้ไข
- จบด้วย recommendations และ action ถัดไป

### 2. Severity Symbols

- 🔴 Critical: blocking production, security vulnerability, data loss risk
- 🟠 High: core functionality at risk, significant performance issue
- 🟡 Medium: code quality issue, minor performance, documentation gap
- 🟢 Low: cosmetic, naming convention, minor improvement

### 3. Status Symbols

- ✅ แก้แล้ว
- ❌ ยังไม่แก้
- 🔄 กำลังแก้
- ⏭️ ข้าม (optional หรือไม่เกี่ยวข้อง)

### 4. Output Channel

- ตอบกลับในแชทเท่านั้น
- ไม่สร้างไฟล์แยก
- ใช้ `markdown` format มาตรฐาน

### 5. Completeness

- รายงานทุก dimension ที่ review
- ไม่ข้าม findings ที่ fail
- ระบุ root cause ของ failures ถ้าเป็นไปได้
- ทุก finding ต้องมี evidence และ recommendation

### 6. Detail Level

- เขียน review ให้ละเอียดมากที่สุด
- ครอบคลุมทุกมิติอย่างสมบูรณ์
- ระบุทั้งปัญหาและสิ่งที่ทำได้ดี
- อ้างอิง best practices และ standards ที่ตรวจสอบได้

## Expected Outcome

- Executive summary พร้อม overall review score
- ตาราง findings ทุก dimension พร้อม severity และ evidence
- ตารางสถานะการแก้ไข issues
- Recommendations ที่ actionable และจัดลำดับตาม priority
- ทำตาม `/report`
- ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน
