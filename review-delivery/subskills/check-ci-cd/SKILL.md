---
name: review-delivery-check-ci-cd
description: Check CI/CD pipeline — build times, caching, parallelism, reliability, security
argument-hint: "[pipeline-or-workflow]"
related:
  - scan-codebase
  - report
  - run-review
---

## Goal

Run the CI/CD pipeline dimension of `/review-delivery` แบบ focused — pipeline เร็ว เชื่อถือได้ และปลอดภัย

## Scope

- ใช้เมื่อ `/review-delivery` dispatch มาที่ `ci-cd`/`pipeline`/`ci` หรือเรียก standalone บน workflow files
- ครอบคลุม: GitHub Actions/GitLab CI/CircleCI workflows, caching, parallelism, secrets handling

## Execute

### 1. Pipeline Checks

> Goal: ครอบคลุมทุก CI/CD dimension

ทำตาม `../../references/ci-cd.md`

1. duration — job times, slow steps, ไม่มี timeout
2. caching — lockfile keys, build cache, `--frozen-lockfile`
3. parallelism — matrix axes, `needs:` graph, concurrency cancel
4. reliability — path filters, flaky jobs, retry policy
5. security — pinned action SHAs, least-privilege `permissions:`, OIDC vs long-lived secrets

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Workflow/Job`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น ไม่แก้ไข workflow — fix ใน parent `## Fix`
- ทุก finding มี evidence: workflow file line หรือ run history metrics
- unpinned actions ที่มี write perms / secrets ใน logs = Critical-High

## Expected Outcome

- CI/CD findings พร้อม severity และ evidence ต่อ workflow
- แยก speed vs reliability vs security issues ชัดเจน
