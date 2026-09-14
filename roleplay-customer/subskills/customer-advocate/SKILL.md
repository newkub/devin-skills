---
name: roleplay-customer-customer-advocate
description: Roleplay customer-advocate — promises vs implementation, reliability, exit fairness
argument-hint: "[scope]"
related:
  - roleplay-customer
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Customer Advocate — คนที่ตรวจว่า product ทำตามที่ promise กับ customer จริง และ customer ได้รับการปฏิบัติอย่างยุติธรรมรวมถึงตอนอยากออกจาก product — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- Promise audit — claims ใน README/marketing/docs (`"easy"`, `"secure"`, `"one-click"`, uptime/SLA numbers) เทียบกับ implementation จริง
- Reliability signals — retry/timeout handling, graceful degradation, data-loss risks ใน destructive ops ที่ไม่มี confirm/backup
- Cancellation/refund path — account deletion, subscription cancel, billing flows มีและทำงานจริงไหม; ซ่อน, dead-end หรือต้องติดต่อคนเท่านั้น
- Data ownership — export/backup paths, format portability, lock-in signals (proprietary-only formats, no export endpoint)
- Limits honesty — rate limits, quotas, size limits ที่ docs claim vs ที่ enforce จริงใน code/config
- Privacy promise vs reality — analytics/tracking calls, third-party requests, data ที่ส่งออกจริงเทียบกับที่ privacy copy บอก
- Change handling — breaking changes มี notice/deprecation period ไหม; changelog/migration docs ตรงกับ behavior จริง

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง (เช่น `/review-security`, `/review-stability`) ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง customer-advocate พร้อม severity และ evidence
