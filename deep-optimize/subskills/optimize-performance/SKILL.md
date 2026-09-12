---
name: deep-optimize-optimize-performance
description: ปรับ runtime performance — profiling, algorithmic complexity, caching layers
argument-hint: "[scope]"
related:
  - review-performance
  - run-bench
  - run-profiler
  - check-bottlenecks
  - report-before-after
---

## Goal

ปรับ runtime performance ของ target — หา bottleneck จริงด้วย profiling, ลด algorithmic complexity, เพิ่ม caching ที่ถูกจุด — วัดผล before/after เสมอ

## Scope

- ครอบคลุม: CPU hot paths, event loop/main thread, memory allocations, I/O, caching, Big O complexity
- ไม่รวม bundle size (ทำ `/deep-optimize-optimize-bundle`) และ infra cost (ทำ `/deep-optimize-optimize-cost`)
- ใช้กับ frontend, backend, worker, CLI ตามที่ตรวจพบ

## Execute

### 1. Baseline And Profile

> Goal: หา bottleneck จาก measurement ไม่ใช่การเดา

1. ทำ `/run-bench` หรือ timing harness ที่มีอยู่เพื่อเก็บ baseline latency/throughput
2. ทำ `/run-profiler` เพื่อเก็บ flamegraph หรือ CPU profile บน critical path
3. ทำ `/check-bottlenecks` เพื่อหา sync blocking, unbounded loops, N+1 patterns
4. ระบุ top 3 hot paths ที่กินเวลาหรือ memory มากสุด

### 2. Reduce Complexity

> Goal: แก้ algorithmic problems ก่อน micro-optimizations

1. ลด Big O บน hot paths: nested loops → hash lookup, repeated scans → precompute, O(n²) → O(n log n) หรือดีกว่า
2. เปลี่ยน data structure ให้ตรง access pattern เช่น `Array.find` ใน loop → `Map`
3. batch หรือ stream งานชิ้นใหญ่แทน load ทั้งหมดเข้า memory
4. ย้าย sync work หนักออกจาก hot path — async, worker, หรือ lazy compute

### 3. Add Caching

> Goal: ตัดงานซ้ำด้วย cache ที่ถูกจุด

1. memoize pure functions ที่ถูกเรียกซ้ำด้วย input เดิม
2. เพิ่ม cache layer สำหรับ I/O ซ้ำ — HTTP cache headers, query cache, computed results
3. ออกแบบ cache key และ TTL ให้ชัด — invalidation ผิดแพงกว่าไม่มี cache
4. ระวัง cache stampede บน hot keys — ใช้ dedupe/locking ถ้าจำเป็น

### 4. Verify And Measure

> Goal: ยืนยันเร็วขึ้นจริงและไม่เปลี่ยน behavior

1. `/run-bench` ซ้ำ compare กับ baseline — ต้องดีขึ้นบน metric ที่วัด
2. รัน tests และ typecheck — correctness ต้องเหมือนเดิม
3. ทำ `/report-before-after`; ถ้าไม่ดีขึ้นหรือ regression → revert จุดนั้นแล้ว report

## Rules

- ห้าม optimize ก่อนมี profiling evidence — แก้เฉพาะ bottleneck ที่วัดได้
- algorithm/complexity ก่อนเสมอ micro-optimizations ทีหลัง
- แก้ทีละจุด แยก commit — ห้ามแก้หลายจุดพร้อมกันถ้าแยกผลไม่ได้
- preserve behavior ทุกครั้ง — ผลลัพธ์ต้องเหมือนเดิม
- ไม่เพิ่ม caching โดยไม่มี invalidation strategy

## Expected Outcome

- hot paths เร็วขึ้นตามตัวเลข before/after
- complexity ลดลงบน critical paths, cache ครอบคลุมงานซ้ำ
- tests ผ่าน ไม่มี correctness regression
