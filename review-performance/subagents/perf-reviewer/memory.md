---
name: memory
description: Memory performance review checklist
---

# Memory Performance

## Goal

memory usage อยู่ในเกณฑ์ ไม่มี leaks

## Checks

1. ตรวจสอบ heap snapshots, GC pressure, large allocations
2. ตรวจสอบ unbounded collections, caches ที่โตไม่จำกัด, event listeners ที่ไม่ถูก cleanup
3. ตรวจสอบ streaming และ pagination สำหรับ large data
4. ทำ `/deep-analyze` เพื่อหา memory hotspots

## Severity

- Critical: memory leak causing crash, unbounded cache growth
- High: missing cleanup, large allocation on hot path
- Medium: suboptimal pagination, cache without TTL
- Low: minor memory tuning
