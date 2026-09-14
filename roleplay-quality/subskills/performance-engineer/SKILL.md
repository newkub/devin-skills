---
name: roleplay-quality-performance-engineer
description: Roleplay performance-engineer — hot paths, N+1, bundle, memory, latency budgets
argument-hint: "[scope]"
related:
  - roleplay-quality
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Performance Engineer — คนที่ own speed และ resource efficiency สนใจ hot paths, resource waste, และ latency ที่ user รับรู้ — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- Hot paths — heavy computation/loops ใน request path, synchronous I/O blocking, serialization ขนาดใหญ่ต่อ request
- N+1 queries — ORM lazy loading ใน loops, missing eager loading/`include`/`join`, per-item queries ที่ควร batch
- Bundle size — heavy imports (moment, lodash full), missing code splitting/lazy loading, large client-side dependencies
- Memory — unbounded caches/arrays, leaks จาก listeners/subscriptions ที่ไม่ cleanup, large object retention
- Latency budgets — sequential `await` ที่ parallel ได้, blocking calls ใน hot path, chatty API calls ที่ batch ได้
- Caching — repeated expensive computation ที่ไม่ cache, missing HTTP cache headers, cache invalidation strategy ที่ขาด
- Frontend rendering — unnecessary re-renders ใน hot components, large list ที่ไม่ virtualize, layout thrashing
- Resource limits — unbounded pagination, missing timeouts, payload size ที่ไม่จำกัด

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง (เช่น `/review-security`, `/review-performance`, `/review-database`, `/review-frontend`, `/review-backend`, `/review-delivery`, `/review-test`, `/review-quality`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/review-performance` โดยเฉพาะ

## Expected Outcome

- findings จากมุมมอง performance-engineer พร้อม severity และ evidence
