---
name: runtime-and-cpu
description: Runtime and CPU performance review checklist
---

# Runtime And CPU Performance

## Goal

runtime execution ไม่มี hot paths หรือ bottlenecks

## Checks

1. ตรวจสอบ hot paths ด้วย profiling: `run-profiler`, `bun profile`, Chrome DevTools
2. ตรวจสอบ event loop blocking, synchronous operations ที่ยาว
3. ตรวจสอบ main thread work, expensive computations, render bottlenecks
4. ทำ `/run-profiler` สำหรับ critical user flows
5. ถ้าเป็น frontend ให้ทำ `/review-frontend` สำหรับ rendering performance

## Severity

- Critical: main thread blocked > 1s, infinite loop, CPU 100% on hot path
- High: long task > 50ms, missing async on I/O, render bottleneck
- Medium: suboptimal algorithm, unnecessary computation
- Low: minor micro-optimization
