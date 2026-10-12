---
name: improve-platform
description: หา platform improvements ใน scope — observability, release, IaC, infra capabilities — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-observability
  - improve-iac
  - improve-release
  - improve-stability
  - improve-delivery
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "platform/infra capabilities improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-observability` + `review-release` + `review-iac` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "platform/infrastructure layer ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-observability` — metrics, tracing, logging, alerting, debuggability
- `review-release` — release/deploy readiness, versioning, rollout safety, rollback
- `review-iac` — Terraform/Pulumi/CDK/K8s manifests, state, secrets, drift
- error handling/recovery เฉพาะทาง → `/improve-stability`; CI/CD pipeline → `/improve-delivery`; domain เดียวเจาะจง → `/improve-observability` (metrics/tracing/logging/alerting), `/improve-release` (readiness/rollback), `/improve-iac` (Terraform/K8s state/secrets/drift)

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-observability` + `review-release` + `review-iac` ตาม context
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Domain, Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. IaC/infra changes ต้อง plan/dry-run ก่อน apply — ห้าม apply blind บน shared infra
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized platform improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`; IaC ผ่าน plan/dry-run
