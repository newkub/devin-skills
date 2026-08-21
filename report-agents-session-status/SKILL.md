---
name: report-agents-session-status
description: รายงานสถานะปัจจุบันของระบบหรือโปรเจกต์
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
  - report-table
  - suggest-next-action
---

## Goal

รายงานสถานะปัจจุบันของระบบหรือโปรเจกต์อย่างครบถ้วนและเป็นปัจจุบัน

## Scope

ใช้สำหรับการรายงานสถานะของ services, database, หรือ overall system health

## Execute

### 1. Check System Health

ตรวจสอบสุขภาพของระบบ

1. ตรวจสอบ services ที่ทำงานอยู่
2. ตรวจสอบ database connectivity
3. ตรวจสอบ API endpoints
4. ตรวจสอบ external services

### 2. Collect Metrics

รวบรวม metrics ที่สำคัญ

1. รวบรวม performance metrics (response time, throughput)
2. รวบรวม error rates และ error types
3. รวบรวม resource usage (CPU, memory, disk)
4. รวบรวม business metrics (active users, bookings)

### 3. Analyze Trends

วิเคราะห์แนวโนค์ของ metrics

1. เปรียบเทียบกับช่วงเวลาก่อนหน้า
2. ระบุ anomalies หรือ spikes
3. ระบุ patterns ที่น่ากังวล
4. คาดการณ์ future trends

### 4. Report Findings

รายงานผลการวิเคราะห์

1. สรุปสถานะโดยรวม
2. ระบุ issues ที่ต้องให้ความสำคัญ
3. แนะนำ actions ที่ต้องทำ
4. ระบุ SLA compliance

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. Real-Time Monitoring

ต้องตรวจสอบสถานะแบบ real-time

- ใช้ monitoring tools ที่เหมาะสม
- ตั้งค่า alerts สำหรับ critical metrics
- ตรวจสอบ dashboard อย่างสม่ำเสมอ
- รับ notifications สำหรับ critical issues

### 2. Data Accuracy

ต้องรับประกันความถูกต้องของข้อมูล

- ใช้ data sources ที่เชื่อถือได้
- ตรวจสอบ data freshness
- ระบุ data gaps หรือ inconsistencies
- ใช้ sampling ที่เหมาะสมสำหรับ large datasets

### 3. Contextual Analysis

ต้องวิเคราะห์ในบริบทที่เหมาะสม

- เปรียบเทียบกับ baseline ที่เหมาะสม
- พิจารณา seasonality และ patterns
- ระบุ external factors ที่มีผลกระทบ
- ใช้ statistical analysis ถ้าจำเป็น

### 4. Actionable Insights

ต้องให้ข้อมูลที่นำไปปฏิบัติได้

- ระบุ root causes ของ issues
- แนะนำ specific actions ที่ต้องทำ
- ระบุ priority ของแต่ละ action
- ระบุ owner สำหรับแต่ละ action

## Expected Outcome

- สถานะของระบบชัดเจนและเป็นปัจจุบัน
- รู้ว่า issues ที่ต้องให้ความสำคัญ
- มีข้อมูลสำหรับการตัดสินใจ
- สามารถจัดการ incidents ได้อย่างรวดเร็ว
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน

## Common Mistakes (optional)

ข้อผิดพลาดที่พบบ่อย:

- ไม่มี context ในการวิเคราะห์ metrics
- รายงาน metrics โดยไม่มี insights
- ไม่ระบุ root causes ของ issues
- ไม่ให้ recommendations ที่ actionable
