---
title: Code Changes Review
description: ตรวจ code changes, verify, coverage, security, docs, และ domain-specific reviews
related:
  - review-github-pr
---

## Goal

ตรวจสอบ code changes ของ pull request ก่อน merge

## Checks

1. ทำ `/run-verify` เพื่อรัน lint, typecheck, scan — ถ้า fail ให้รายงานก่อน continue
2. ทำ `/deep-review-codebase` บน files ที่เปลี่ยนแปลง
3. ทำ `/deep-review-codebase` สำหรับ security-sensitive changes
4. ทำ `/deep-review-codebase` สำหรับ test coverage และ test quality
5. ทำ `/deep-review-codebase` สำหรับ docs, changelog, versioning, git hygiene
6. ถ้า PR เป็น frontend → ทำ `/deep-review-codebase`
7. ถ้า PR เป็น backend → ทำ `/deep-review-codebase`
8. ถ้า PR เป็น API → ทำ `/deep-review-codebase`
9. ถ้า PR เป็น auth → ทำ `/deep-review-codebase`

## Severity

- Critical: build fail, security risk, breaking change โดยไม่ migration
- High: missing tests, lint fail, unreviewed auth change
- Medium: missing docs/changelog, minor coverage drop
- Low: formatting, cosmetic
