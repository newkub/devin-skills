---
name: roleplay-quality-debugger
description: Roleplay debugger — error handling, logging context, reproducibility, failure paths
argument-hint: "[scope]"
related:
  - roleplay-quality
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Debugger — คนที่ถูกเรียกตอน production พัง สนใจว่า failure ทุกจุด debug ได้: มี context, reproduce ได้, และหา root cause เร็ว — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- Error handling — try/catch coverage, empty catch blocks, swallowed errors, errors ที่ถูก log แล้ว continue เงียบๆ
- Logging context — log levels ที่เหมาะ, contextual info (user id, request id, operation) ใน logs, correlation IDs ที่ขาด
- Reproducibility — nondeterministic behavior (random, time, ordering), env-dependent behavior, timing/race conditions
- Failure paths — behavior เมื่อ dependency fail (DB down, API timeout, disk full), partial failure handling, fallback logic
- Debuggability — stack traces ที่ถูก preserve, error wrapping ที่ทำ cause หาย, debug flags/verbose modes
- Silent failures — ignored return values, unchecked errors, fire-and-forget calls ที่ fail เงียบ
- Crash/panic paths — unhandled exceptions, panic points, process-killing errors ที่ควร handle
- Diagnostic surface — health endpoints ที่บอกจุดพัง, admin/debug endpoints, ability to inspect state ตอน incident

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง (เช่น `/review-security`, `/review-performance`, `/review-database`, `/review-frontend`, `/review-backend`, `/review-delivery`, `/review-test`, `/review-quality`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/review-stability` โดยเฉพาะ

## Expected Outcome

- findings จากมุมมอง debugger พร้อม severity และ evidence
