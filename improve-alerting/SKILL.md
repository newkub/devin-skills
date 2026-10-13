---
name: improve-alerting
description: หา alerting improvements — noise, routing, escalation, actionability — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-observability
  - improve-error-handling
  - follow-incident-triage
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "alerting improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-observability` (alert scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "alerts/on-call ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-observability` (alert scope) — alert noise/duplication, threshold quality, alert routing, severity levels, escalation paths, actionability (ทุก alert มี runbook หรือไม่), burn-rate แบบ window
- signals/metrics/tracing/logging coverage → `/improve-observability`; recovery paths ของ app → `/improve-stability`; triage กระบวนการ → `/follow-incident-triage`; error UI → `/improve-error-handling`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-observability` (alert scope) — alerts ที่ไม่มี owner, thresholds ที่ไฟกะพริบ, ไม่มี dedup/grouping
3. รวบรวม prioritized list พร้อม severity และ evidence — alert ที่ page ผิดคน/เงียบตอนวิกฤต เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-observability`)
2. ทุก alert fix ต้องแนบ runbook/link ถึง owner — alert ที่ action ไม่ได้ ห้ามคงไว้ (silence+delete ได้เมื่อไม่มีความเสี่ยง)
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-observability`
- แก้ทุก finding ทันทีโดยไม่รอ confirm — แต่ห้ามลบ alert ปลายทางเดียวโดยไม่มี evidence ว่า noise จริง
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized alerting improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม runbook ครบทุก alert
