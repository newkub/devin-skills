---
name: improve-observability
description: เพิ่ม logging, metrics, tracing และ alerting ตาม findings จาก review-observability
argument-hint: "[service-or-scope]"
related:
  - review-observability
  - follow-my-tech-stack
  - follow-best-practice
  - resolve-errors
  - run-check
  - deep-validate
  - report-table
  - ask-me
---

## Goal

เพิ่มและปรับปรุง logging, metrics, tracing, alerting และ dashboards ตาม findings จาก `/review-observability`

## Scope

ใช้หลัง `/review-observability` เมื่อต้องเพิ่มหรือแก้ instrumentation: structured logs, metrics, traces, health checks, alerts, SLO/SLI — ไม่ครอบคลุมการเปลี่ยน observability platform

## Execute

### 1. Collect Gaps

> Goal: รวบรวม observability gaps

1. รัน `/review-observability` ถ้ายังไม่มี findings
2. จัดกลุ่ม gaps: logging, metrics, tracing, alerting, dashboards, SLO
3. ทำ `/follow-my-tech-stack` เพื่อยืนยัน observability stack ของ project

### 2. Plan Instrumentation

> Goal: กำหนดสัญญาณที่ต้องเพิ่มตาม criticality

1. ระบุ critical paths ที่ขาด observability
2. เลือก signals: logs สำหรับ events, metrics สำหรับ trends, traces สำหรับ latency
3. ถ้าเพิ่ม dependency ใหม่ → `/follow-best-practice` และยืนยันกับ stack

### 3. Add Logging

> Goal: logs เป็น structured และมี context เพียงพอ

1. แปลง log statements เป็น structured format (JSON หรือตาม convention)
2. เพิ่ม correlation IDs, request context และ error details
3. ลบ sensitive data จาก logs

### 4. Add Metrics And Tracing

> Goal: วัด RED/USE metrics และ trace request flow

1. เพิ่ม metrics สำหรับ rate, errors, duration ที่ endpoints สำคัญ
2. เพิ่ม tracing spans สำหรับ external calls และ slow paths
3. ตั้งค่า sampling และ cardinality ให้เหมาะสม

### 5. Add Alerts And Health Checks

> Goal: ตรวจจับปัญหาก่อน user impact

1. เพิ่ม/ปรับ alerts ตาม symptoms ไม่ใช่ causes
2. เพิ่ม health/readiness endpoints ถ้าขาด
3. กำหนด SLO/SLI สำหรับ critical services

### 6. Validate And Report

> Goal: ยืนยัน instrumentation ทำงานและไม่เสีย performance

1. รัน `/run-check` และ `/deep-validate`
2. ตรวจว่า logs/metrics/traces ออกจริงใน environment ทดสอบ
3. ทำ `/report-table` สรุป signals ที่เพิ่มและ gaps ที่เหลือ

## Rules

### 1. No Sensitive Data

- ห้าม log secrets, tokens, PII หรือ credentials
- ใช้ redaction/sanitization สำหรับข้อมูล sensitive

### 2. Signal Quality

- เพิ่มเฉพาะ signals ที่ actionable — ไม่เพิ่ม noise
- alerts ต้องมี threshold และ owner ที่ชัดเจน
- ใช้ naming conventions ตาม stack ที่มีอยู่

### 3. Performance Aware

- instrumentation ต้องไม่ทำให้ latency เพิ่มอย่างมีนัยสำคัญ
- ใช้ sampling และ batching สำหรับ high-volume paths

- ใช้ /resolve-errors ถ้าจำเป็น
- ใช้ /ask-me ถ้าจำเป็น

## Expected Outcome

- Critical paths มี logs, metrics, traces ครบ
- Alerts และ health checks ครอบคลุม failure modes หลัก
- Validation ผ่านไม่มี sensitive data leak ใน logs
- รายงาน signals ที่เพิ่มและ gaps ที่เหลือ
