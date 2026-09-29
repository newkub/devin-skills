---
name: review-iac-check-drift
description: Check IaC drift + pinning — state vs reality, unpinned providers/modules/images
argument-hint: "[stack-or-scope]"
related:
  - review-iac
  - review-release
  - report
---

## Goal

Run the drift/pinning dimension of `/review-iac` แบบ focused — code ตรง deployed state และ versions locked

## Scope

- ใช้เมื่อ `/review-iac` dispatch มาที่ `drift`/`pinning` หรือเรียก standalone
- ครอบคลุม: state drift, unpinned versions, lock files, manual changes

## Execute

### 1. Drift Checks

> Goal: IaC ตรง reality — parent Execute §3

1. state vs deployed — `plan`/`refresh` output มี unexpected diff หรือไม่ (run dry เท่านั้น)
2. manual changes — resources ที่แก้นอก IaC (console edits ที่ drift กลับมา)
3. import gaps — resources จริงที่ยังไม่อยู่ใน state/code

### 2. Pinning Checks

> Goal: versions reproducible

1. providers/modules — version constraints pinned (ไม่ใช่ `latest`/unbounded)
2. images — tags pinned ไม่ใช่ `latest`; digests บน critical workloads
3. lock files — `.terraform.lock.hcl`/equivalent committed

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Resource/Stack`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — ห้าม `apply`, fix ใน parent `## Fix`
- ทุก finding มี evidence: plan output, lock file, หรือ config line
- drift บน production state / unpinned critical provider = High

## Expected Outcome

- Drift findings พร้อม unexpected-diff evidence
- Unpinned versions list พร้อม affected resources
