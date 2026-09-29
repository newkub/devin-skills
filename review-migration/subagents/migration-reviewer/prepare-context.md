---
title: Migration Prepare Context
description: เตรียม context, identify migration type, และ verify migration plan
related:
  - review-migration
---

## Goal

เข้าใจ migration scope และ project context ก่อน review

## Checks

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ dependencies
2. ระบุ migration type: dependency, framework, database, API, infrastructure
3. ตรวจ migration plan หรือ migration scripts ที่มีอยู่
4. ถ้า project มี `AGENTS.md` ให้อ่านและทำตาม
5. ถ้าไม่พบ migration plan → stop และ report

## Severity

- Critical: ไม่พบ migration plan หรือ migration targets
- High: migration type ไม่ชัด, ขาด AGENTS.md context
- Medium: missing migration scripts
- Low: documentation gap
