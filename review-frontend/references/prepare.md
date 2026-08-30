---
title: Frontend Prepare And Scan
description: เตรียม context, scan codebase, และ pull latest review metrics
related:
  - review-frontend
---

## Goal

สแกน codebase เพื่อเข้าใจ frontend stack และ structure

## Checks

1. ทำ `/scan-codebase` เพื่อเข้าใจ frontend structure และ stack
2. ระบุ frontend framework, state management library, styling system, form library, testing framework
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/review-codebase-everything` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
5. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
6. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
7. ถ้าสแกนไม่ได้ → stop และ report

## Severity

- Critical: สแกนไม่ได้, ไม่ระบุ frontend stack
- High: missing review metrics, outdated analyzer rules
- Medium: missing form/testing framework info
- Low: documentation gap
