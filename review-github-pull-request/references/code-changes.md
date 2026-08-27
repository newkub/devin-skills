---
title: Code Changes Review
description: ตรวจ code changes, verify, coverage, security, docs, และ domain-specific reviews
related:
  - review-github-pull-request
---

## Goal

ตรวจสอบ code changes ของ pull request ก่อน merge

## Checks

1. ทำ `/run-verify-fast` เพื่อรัน lint, typecheck, scan — ถ้า fail ให้รายงานก่อน continue
2. ทำ `/update-review-codebase-cli-and-run` บน files ที่เปลี่ยนแปลง
3. ทำ `/update-review-codebase-cli-and-run` สำหรับ security-sensitive changes
4. ทำ `/update-review-codebase-cli-and-run` สำหรับ test coverage และ test quality
5. ทำ `/update-review-codebase-cli-and-run` สำหรับ docs, changelog, versioning, git hygiene
6. ถ้า PR เป็น frontend → ทำ `/update-review-codebase-cli-and-run`
7. ถ้า PR เป็น backend → ทำ `/update-review-codebase-cli-and-run`
8. ถ้า PR เป็น API → ทำ `/update-review-codebase-cli-and-run`
9. ถ้า PR เป็น auth → ทำ `/update-review-codebase-cli-and-run`

## Severity

- Critical: build fail, security risk, breaking change โดยไม่ migration
- High: missing tests, lint fail, unreviewed auth change
- Medium: missing docs/changelog, minor coverage drop
- Low: formatting, cosmetic
