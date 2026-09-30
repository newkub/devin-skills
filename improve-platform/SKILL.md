---
name: improve-platform
description: หา platform improvements ใน scope — observability, release, IaC, infra capabilities — แก้หลัง user confirm
argument-hint: "[scope]"
related:
  - improve
  - improve-stability
  - improve-delivery
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "platform/infra capabilities improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-observability` + `review-release` + `review-iac` เป็น prioritized list แล้วส่งต่อไปแก้หลัง user confirm

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "platform/infrastructure layer ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-observability` — metrics, tracing, logging, alerting, debuggability
- `review-release` — release/deploy readiness, versioning, rollout safety, rollback
- `review-iac` — Terraform/Pulumi/CDK/K8s manifests, state, secrets, drift
- error handling/recovery เฉพาะทาง → `/improve-stability`; CI/CD pipeline → `/improve-delivery`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-observability` + `review-release` + `review-iac` ตาม context
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present And Confirm

> Goal: แสดงผลและให้ user เลือกสิ่งที่จะแก้

1. ทำ `/report` แสดง improvements: No., Domain, Finding, Severity, Fix Skill
2. ถาม user ว่าจะแก้ข้อไหน — รอการยืนยันก่อนลงมือ

### 3. Fix Confirmed Items

> Goal: แก้เฉพาะสิ่งที่ user เลือก

1. ส่งแต่ละ finding ที่ confirm ไป `/deep-review-then-fix` (domain ที่ตรง)
2. IaC/infra changes ต้อง plan/dry-run ก่อน apply — ห้าม apply blind บน shared infra
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- ไม่แก้ไขโดยไม่ได้ user confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized platform improvement list จาก `/deep-review`
- User เลือกสิ่งที่จะแก้
- Findings ที่ confirm ถูกแก้ผ่าน `/deep-review-then-fix`; IaC ผ่าน plan/dry-run
