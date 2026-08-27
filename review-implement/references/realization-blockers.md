---
title: Realization Blockers
description: ระบุ blockers ก่อน `realize-implementation`
related:
  - review-implement
---

## Goal

ระบุ blockers ก่อน `realize-implementation` เพื่อให้ infrastructure, type flow, และ dependencies พร้อม

## Checks

1. ทำ `/review-realize-implementation` เพื่อหา implementation gaps
2. ตรวจ infrastructure readiness: database, API server, environment variables, external services
3. ตรวจ type flow: schema → validation → API types → UI types
4. ระบุ blockers ที่ต้องแก้ก่อนเริ่ม implementation
5. ถ้า infrastructure ไม่พร้อม → flag เป็น critical blocker

## Severity

- Critical: infrastructure ไม่พร้อม, core dependency ขาด
- High: type flow ขาด, missing environment variables
- Medium: partial mock, incomplete schema
- Low: documentation gap
