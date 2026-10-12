---
name: improve-iac
description: หา IaC improvements ใน scope — Terraform/K8s state, secrets, drift, modules — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-platform
  - improve-delivery
  - optimize-docker
  - deep-review
  - deep-review-then-fix
  - follow-create-docker
  - follow-deploy
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "IaC improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-iac` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "IaC/infra ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-iac` — Terraform/Pulumi/CDK/K8s manifests, state management, secrets handling, drift detection, module structure, resource tagging
- Docker image/layer optimization เจาะจง → `/optimize-docker`; deploy pipeline → `/improve-delivery`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-iac` — hardcoded secrets, missing state locking, unpinned versions, drift, over-permissive IAM
3. รวบรวม prioritized list พร้อม severity และ evidence — secrets/permission findings เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-iac`)
2. Changes ที่แตะ live infra ต้องมี plan/preview ก่อน apply — `terraform plan` หรือ equivalent เสมอ
3. Secrets ย้ายไป secret manager → `/follow-secret-manager`
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-iac`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้าม apply infra changes โดยไม่มี plan/preview — production-affecting ต้อง confirm ก่อน
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized IaC improvement list จาก `/deep-review`
- ไม่มี confirm gate สำหรับ config — แต่ live infra changes มี plan review เสมอ
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`
