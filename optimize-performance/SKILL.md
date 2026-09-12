---
name: optimize-performance
description: Apply runtime perf fixes — hot paths, memory, re-renders, complexity พร้อม benchmark before/after
argument-hint: "[scope]"
related:
  - review-performance
  - review-algorithm
  - optimize-web-vitals
  - optimize-database
  - deep-analyze
  - use-subagents
  - run-bench
  - run-check
  - report
  - suggest-next-action
---

## Goal

แก้ performance issues ที่ `/review-performance` พบ — hot paths ช้า, memory leaks, unnecessary work, bad complexity — พร้อม benchmark before/after

## Scope

ใช้หลัง `/review-performance` มี findings — apply fixes แบบ profile-guided ไม่ใช่ report-only

- web vitals/metrics (LCP/CLS/INP) → `/optimize-web-vitals`; DB queries → `/optimize-database`
- algorithm complexity ลึก → `/review-algorithm` ร่วม
- scope ใหญ่ → dispatch ผ่าน `/use-subagents`

## Execute

### 1. Collect Findings And Profile

> Goal: รู้ bottleneck จริงด้วย measurement

1. ทำ `/review-performance` หรืออ่าน findings เดิม
2. profile/benchmark baseline — `/run-bench` หรือ profiler ตาม ecosystem (flamegraph, `node --prof`, benchmarks)
3. จัดกลุ่ม: CPU hot paths, memory, I/O, rendering, startup

### 2. Fix Hot Paths

> Goal: work น้อยลงบน paths ที่รันบ่อย

1. redundant computation → memoize/cache, hoist ออกจาก loops
2. bad complexity (O(n²) ที่เป็น O(n) ได้) → restructure ตาม `/review-algorithm`
3. sync work ที่ block → async/batch/stream

### 3. Fix Memory

> Goal: allocations ลด ไม่มี leaks

1. unnecessary allocations บน hot paths → reuse/pool/avoid copies
2. leaks: unbounded growth, lingering references, missing cleanup → fix retention
3. large object churn → stream/chunk

### 4. Fix Rendering And UI

> Goal: UI work ต่อ interaction น้อยลง

1. unnecessary re-renders → memoization, stable references, selective subscriptions
2. expensive renders → virtualization, `content-visibility`, defer
3. layout thrashing → batch DOM reads/writes

### 5. Fix I/O And Startup

> Goal: wait time น้อยลง

1. sequential awaits → parallel `Promise.all`; N+1 calls → batch
2. lazy-load heavy modules/assets; warm caches strategically
3. startup → defer non-critical init, trim imports

### 6. Verify With Benchmarks

> Goal: improvement วัดได้ ไม่ใช่รู้สึกได้

1. re-run benchmarks — เทียบ before/after พร้อม variance
2. `/run-check` + tests ผ่าน — optimization ห้ามเปลี่ยน correctness
3. ถ้าไม่เห็นผล → revert และลอง bottleneck ถัดไป (`/deep-analyze` ถ้าต้องการ)

### 7. Report

> Goal: ส่งมอบ

1. ทำ `/report` — optimizations applied, measured deltas, regressions checked
2. ทำ `/suggest-next-action`

## Rules

### 1. Profile First

- ห้าม optimize โดยไม่มี measurement — แก้ bottleneck ที่ profile บอกเท่านั้น
- ทุก fix มี before/after numbers — ถ้าวัดไม่ได้ให้ระบุชัด

### 2. No Correctness Trade

- optimization ห้ามเปลี่ยน behavior — tests ต้องผ่านเหมือนเดิม
- caching/memoization ต้อง invalidate ถูก — stale data คือ bug

### 3. Simplest Win First

- เลือก fixes ที่ impact สูง/ความซับซ้อนต่ำก่อน — ห้าม rewrite ทั้งระบบเพื่อ 2%
- เก็บ code readable — clever optimization ต้องมีคอมเมนต์เหตุผล (เฉพาะเมื่อจำเป็น)

## Expected Outcome

- hot paths/memory/rendering/I-O optimized พร้อม benchmark deltas
- ไม่มี correctness regressions — tests ผ่าน
- report ระบุ measured improvements และ residual bottlenecks
