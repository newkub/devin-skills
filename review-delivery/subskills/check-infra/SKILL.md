---
name: review-delivery-check-infra
description: Check infrastructure — provisioning, environments, containers, deploy surface
argument-hint: "[scope]"
related:
  - check-infra
  - scan-codebase
  - report
---

## Goal

Run the infrastructure dimension of `/review-delivery` แบบ focused — infra config, containers และ deploy surface ถูกต้อง

## Scope

- ใช้เมื่อ `/review-delivery` dispatch มาที่ `infra`/`infrastructure`/`docker` หรือเรียก standalone
- ครอบคลุม: IaC config, Dockerfiles, environment parity, deploy config — live infra probing (DNS/SSL/ports) → `/check-infra`

## Execute

### 1. Infrastructure Checks

> Goal: ครอบคลุมทุก infra dimension

ทำตาม `../../references/infrastructure.md`

1. containers — multi-stage builds, layer cache, minimal base, non-root user
2. environments — dev/staging/prod parity, config per env ไม่ hardcode
3. deploy — rollback strategy, health checks, zero-downtime readiness

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Area`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น ไม่แก้ไข infra config — fix ใน parent `## Fix`
- ทุก finding มี evidence: Dockerfile line, IaC file, deploy config
- live infra probing (DNS, SSL, open ports) → delegate `/check-infra` แล้วรวม findings

## Expected Outcome

- Infra findings แยกตาม containers/environments/deploy
- Clear handoff: config issues fix ที่นี่, live issues → `/check-infra`
