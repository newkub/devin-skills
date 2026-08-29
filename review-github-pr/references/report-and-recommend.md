---
title: Report And Recommend
description: สรุปผล PR review, merge readiness, และแนะนำ action ถัดไป
related:
  - review-github-pr
---

## Goal

สร้างรายงานและแนะนำ action สำหรับ pull request

## Checks

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง PR Checklist: Title, Description, Size, Conflicts, Conventional Commits, Tests, CI
3. สร้างตาราง Findings: Category, Severity, Location, Recommendation
4. ระบุ merge readiness: ready, needs changes, needs discussion
5. ทำ `/suggest-next-action`

## Severity

- Critical: merge blocked เนื่องจาก CI fail หรือ security risk
- High: changes required ก่อน merge
- Medium: needs discussion
- Low: cosmetic, nit
