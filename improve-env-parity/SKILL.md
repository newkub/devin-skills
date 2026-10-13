---
name: improve-env-parity
description: หา environment parity improvements — dev/staging/prod drift — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-config
  - improve-iac
  - improve-delivery
  - check-secrets
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "environment parity improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-config + review-iac` (parity scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "dev/staging/prod ควรใกล้กันแค่ไหน/แก้อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-config` (parity scope) — env var inventory ครบทุก env, default ที่ต่างกันเงียบ ๆ, feature behavior ที่ gate ด้วย env แทน config จริง
- `review-iac` (parity scope) — runtime/image versions, infra sizing types, network policy ที่ env หนึ่งไม่มีอีก env มี, secrets ต่างกันแค่ค่าไม่ใช่ schema
- config file hygiene ทั่วไป → `/improve-config`; secret values → `/check-secrets` (ห้ามย้ายค่า secret ใน report); pipeline เรียงชั้น env → `/improve-delivery`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-config + review-iac` (parity scope) — ทำ diff matrix ของ env vars/runtime/infra ต่อ env
3. รวบรวม prioritized list พร้อม severity และ evidence — "works in staging, breaks in prod" cause เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm (รายงานเฉพาะ name/schema ของ env ไม่ใช่ values)

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. รวม source-of-truth ต่อชั้น: schema → เดียว, values → per-env secret store ผ่าน `/follow-secret-manager`
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้าม copy secret values ข้าม env files หรือ report — ใช้ name อ้างอิงเท่านั้น
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Env parity matrix + prioritized improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม single-schema config
