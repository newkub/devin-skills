---
name: review-performance-optimize-performance
description: Apply performance findings — แก้ bundle, runtime, memory, I/O issues ตาม severity
argument-hint: "[scope]"
related:
  - review-performance
  - run-bench
  - run-profiler
  - report-before-after
  - resolve-errors
  - deep-review-then-fix
---

## Goal

แก้ findings จาก `/review-performance` จริง — runtime hot paths, memory, I/O, caching, web vitals — เรียงตาม severity และวัดผล before/after

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้ — review/report-only โดย default
- ครอบคลุม: bundle-related perf, CPU/runtime, memory leaks, I/O bottlenecks, caching gaps, LCP/INP/CLS
- multi-domain fix ที่กระทบหลาย review areas → `/deep-review-then-fix`

## Execute

### 1. Baseline

> Goal: เก็บตัวเลขเดิมก่อนแก้

1. ทำ `/run-bench` หรือ profiler baseline บน critical paths ที่มี findings
2. map findings → severity (Critical → High → Medium → Low) จาก review report
3. วางแผนแก้เรียง severity มาก → น้อย แยก commit ต่อกลุ่ม

### 2. Fix By Severity

> Goal: แก้ bottleneck ที่ impact สูงสุดก่อน

1. Critical/High ก่อนเสมอ: N+1 queries, missing cache บน hot path, missing code splitting, complexity เกิน budget
2. runtime: memoize hot functions, ลด complexity, ย้าย sync work ออกจาก hot path, batch I/O
3. memory: ลด allocations ใน loops, แก้ leaks (listeners, timers, closures), unbounded growth → bounds
4. I/O: parallelize independent calls, stream แทน load-all, เพิ่ม cache ที่ missing TTL/invalidation
5. web vitals: LCP image preload, defer third-party scripts, แก้ layout shifts สำหรับ CLS

### 3. Verify Each Fix

> Goal: ทุก fix วัดผลได้และไม่ regression

1. benchmark before/after ต่อ fix — ต้องดีขึ้นบน metric ที่ finding ระบุ
2. รัน tests/typecheck — correctness ต้องเหมือนเดิม
3. ถ้าไม่ดีขึ้นหรือพัง → revert จุดนั้นแล้วบันทึกใน report

### 4. Report

> Goal: สรุป fixes พร้อมตัวเลข

1. ทำ `/report-before-after` ต่อ finding — metric เดิม vs ใหม่
2. ระบุ findings ที่ยังไม่ได้แก้และเหตุผล

## Rules

- แก้เฉพาะ findings ที่มี evidence จาก review — ห้าม optimize เพิ่มโดยไม่มีปัญหา
- preserve behavior — optimize ≠ เปลี่ยน output หรือ correctness
- ทีละ fix แยก commit — ห้ามรวมหลาย fixes ถ้าแยกผลไม่ได้
- ไม่ลด security หรือ accessibility เพื่อ performance
- fix-verify loop สูงสุด 3 รอบต่อ finding → ถ้าไม่ผ่าน stop และ report

## Expected Outcome

- findings ตาม severity ถูกแก้พร้อมตัวเลข before/after
- ไม่มี regression — tests, typecheck ผ่าน
- report ชี้ชัดว่า fix ไหนเสร็จ fix ไหนค้าง
