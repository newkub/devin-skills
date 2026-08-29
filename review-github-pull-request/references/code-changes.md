---
title: Code Changes Review
description: ตรวจ code changes, verify, coverage, security, docs, และ domain-specific reviews
related:
  - review-github-pull-request
---

## Goal

ตรวจสอบ code changes ของ pull request ก่อน merge

## Checks

1. ทำ `/run-verify-on-local` เพื่อรัน lint, typecheck, scan — ถ้า fail ให้รายงานก่อน continue
2. ทำ `/review-codebase-everythink` บน files ที่เปลี่ยนแปลง
3. ทำ `/review-codebase-everythink` สำหรับ security-sensitive changes
4. ทำ `/review-codebase-everythink` สำหรับ test coverage และ test quality
5. ทำ `/review-codebase-everythink` สำหรับ docs, changelog, versioning, git hygiene
6. ถ้า PR เป็น frontend → ทำ `/review-codebase-everythink`
7. ถ้า PR เป็น backend → ทำ `/review-codebase-everythink`
8. ถ้า PR เป็น API → ทำ `/review-codebase-everythink`
9. ถ้า PR เป็น auth → ทำ `/review-codebase-everythink`

## Severity

- Critical: build fail, security risk, breaking change โดยไม่ migration
- High: missing tests, lint fail, unreviewed auth change
- Medium: missing docs/changelog, minor coverage drop
- Low: formatting, cosmetic
