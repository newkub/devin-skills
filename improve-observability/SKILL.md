---
name: improve-observability
description: หา observability improvements ใน scope — metrics, tracing, logging, alerting — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-platform
  - improve-stability
  - deep-review
  - deep-review-then-fix
  - follow-service-signoz
  - watch-deploy
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "observability improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-observability` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "observability ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-observability` — metrics coverage, distributed tracing, structured logging, log levels, alerting rules, dashboards, error tracking, SLO/SLI
- infra capabilities กว้าง → `/improve-platform`; crash/recovery paths → `/improve-stability`
- alert noise/routing/escalation → `/improve-alerting`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-observability` — metrics/tracing/logging/alerting coverage, blind spots, missing correlation IDs
3. รวบรวม prioritized list พร้อม severity และ evidence — blind spots บน critical paths เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-observability`)
2. OpenTelemetry/tracing setup → `/follow-service-signoz`; deploy health checks → `/watch-deploy`
3. ห้าม log secrets/PII — ตรวจใน fix ทุกครั้ง
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-observability`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้ามเพิ่ม logging ที่ leak secrets/PII หรือสร้าง noise — signal > volume
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized observability improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` — critical paths มี metrics/tracing/logging ครบ
