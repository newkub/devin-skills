---
name: review-observability-report-slos
description: สร้าง SLO/SLI report — objectives เทียบ actual, error budget burn
argument-hint: "[service-or-scope]"
related:
  - review-observability
  - report
  - create-report-in-dot-devin
---

## Goal

แปลง observability findings ของ `/review-observability` เป็น SLO report — objectives เทียบ actual + error budget status ต่อ service

## Scope

- ใช้เมื่อ `/review-observability` dispatch มาที่ `slos`/`report-slos` หรือเรียก standalone
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Inventory SLOs

> Goal: รู้ว่ามี SLO อะไรและวัดยังไง

ทำตาม `../../references/slo-sli.md`

1. list SLOs/SLIs ที่ declared — availability, latency, error rate
2. map ไป metrics ที่ measure จริง — flag SLO ที่ไม่มี SLI วัด

### 2. Build SLO Table

> Goal: ตารางเทียบ target vs actual

1. `No.`, `Service`, `SLI`, `Target`, `Actual`, `Budget Left`, `Status`
2. `Status` = ผ่าน/warning/ไม่ผ่าน เทียบ error budget
3. flag: SLO ขาด measurement, unrealistic targets, missing burn-rate alerts

### 3. Summarize

> Goal: reliability posture + gaps

1. services ที่ไม่มี SLO เลย — prioritized list
2. budget-at-risk services + fix route → `../improve-observability/SKILL.md`
3. ถ้าต้องเก็บถาวร → `/create-report-in-dot-devin`

## Rules

- actual ต้องมาจาก metrics จริง — ไม่มี data → ระบุ `not-measured` ห้ามเดา
- ทุก SLO ระบุ measurement source
- artifact อยู่ใน `.devin/` เท่านั้น

## Expected Outcome

- SLO table พร้อม target/actual/budget ต่อ service
- Missing/unmeasured SLOs flagged พร้อม priority
