---
name: review-algorithm
description: ตรวจสอบ algorithms — time/space complexity, data structures, correctness, hot paths, numeric safety
argument-hint: "[function-or-module]"
related:
  - follow-algorithms
  - scan-codebase
  - run-profiler
  - run-bench
  - report
  - run-review

  - use-subagents
---

## Goal

ตรวจสอบ algorithms ใน project ว่ามี time/space complexity, data structure choice, correctness, memory/allocation patterns, numeric safety และ hot paths ที่เหมาะสมหรือไม่ ก่อนส่งต่อไปยัง section `## Fix`

## Scope

- ใช้กับ functions/modules ที่มี performance bottleneck หรือ suspect inefficient algorithmic complexity
- ครอบคลุม hot paths, data structures, recursion, numeric/string processing, concurrency hazards
- deep checklists ตาม `subagents/algorithm-reviewer/` ด้านล่าง

## Execute

### 1. Identify Hot Paths

> Goal: หา functions ที่ถูกเรียกบ่อยหรือช้า

1. ใช้ `/scan-codebase`, `/run-profiler` หรือ `/run-bench` หา hot paths
2. ระบุ functions ที่ call บ่อยหรือ slow
3. หา nested loops, O(n^2) patterns, repeated calculations

### 2. Review Complexity

> Goal: ประเมิน big-O — ทำตาม `subagents/algorithm-reviewer/complexity.md`

1. วิเคราะห์ time complexity ของ key functions — best/average/worst
2. วิเคราะห์ space complexity และ allocation patterns
3. เปรียบเทียบกับ lower-bound ที่เป็นไปได้
4. hidden complexity — library calls ที่ซ่อน O(n) (`includes` ใน loop, `splice` ต่อ element)

### 3. Review Data Structures

> Goal: structure choice เหมาะกับ access pattern — ทำตาม `subagents/algorithm-reviewer/data-structure-checklist.md`

1. lookup patterns — `Map`/`Set` vs `Object`/array `find`/`includes`
2. ordering needs — sorted structures, heaps, deques vs re-sort ทุกครั้ง
3. memory layout — contiguous arrays vs linked structures, cache locality
4. immutability cost — spread/copy chains ใน hot paths (`[...arr, x]` ใน loop = O(n²))

### 4. Review Correctness

> Goal: ตรวจ correctness และ edge cases — ทำตาม `subagents/algorithm-reviewer/correctness.md`

1. ตรวจ edge cases (empty, single, large, duplicate, cycle, negative, unicode)
2. ตรวจ termination conditions และ invariants
3. recursion — depth bounds, stack overflow risk, memoization ครบ
4. ระบุ bugs ที่อาจเกิดจาก optimization ผิด (premature caching, stale memo)

### 5. Review Memory And Allocation

> Goal: allocation patterns ไม่ก่อ GC pressure — ทำตาม `subagents/algorithm-reviewer/memory.md`

1. allocation ใน loops — temp objects/arrays/closures ต่อ iteration
2. string building — concat ใน loop vs join/builder
3. large copies — slice/clone/serialize ของ structures ใหญ่
4. unbounded growth — caches/buffers ที่ไม่มี cap

### 6. Review Numeric And String Safety

> Goal: numeric/string ops ถูกต้อง — ทำตาม `subagents/algorithm-reviewer/numeric-strings.md`

1. floating point — equality checks, accumulation error, `Number.EPSILON`
2. integer bounds — overflow, `BigInt` needs, signed/unsigned
3. regex — catastrophic backtracking, ReDoS patterns
4. unicode — grapheme vs codepoint vs byte lengths, sorting/locale

### 7. Review Concurrency Hazards

> Goal: shared state ปลอดภัย — ทำตาม `subagents/algorithm-reviewer/concurrency.md`

1. shared mutable state ข้าม async boundaries
2. parallel algorithms — race conditions, ordering assumptions
3. async iteration — sequential vs parallel semantics (`for await`, `Promise.all` order)

### 8. Rate And Report

> Goal: สรุป findings พร้อม fix direction

1. ทำ `/report` ด้วย columns: No., Function, Complexity, Hot Path, Severity, Fix
2. ชี้ไป section `## Fix` สำหรับการแก้ไข

## Rules

### 1. Read Only

- ห้ามแก้ไข code หรือ refactor ระหว่าง review
- ใช้ profiling และ static analysis เท่านั้น

### 2. Evidence Required

- ทุก finding ต้องมี line, call frequency, และ complexity analysis
- ไม่เดาว่า function ควร optimize โดยไม่มี benchmark

- ใช้ /review-code-quality ถ้าจำเป็น
- ใช้ /review-performance ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. จัดลำดับ findings ตาม severity — canonical steps ที่ `../shared/review-fix.md`
2. แก้ตาม finding — time/space complexity, data structures, hot paths (algorithm)
3. preserve behavior + verify + report — canonical ที่ `../shared/review-fix.md`

## References

- [Full-dimension checklist](subagents/algorithm-reviewer/checklist.md)
- [Complexity checklist](subagents/algorithm-reviewer/complexity.md)
- [Data structure checklist](subagents/algorithm-reviewer/data-structure-checklist.md)
- [Correctness checklist](subagents/algorithm-reviewer/correctness.md)
- [Memory and allocation checklist](subagents/algorithm-reviewer/memory.md)
- [Numeric and strings checklist](subagents/algorithm-reviewer/numeric-strings.md)
- [Concurrency checklist](subagents/algorithm-reviewer/concurrency.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /follow-algorithms ถ้าจำเป็น
- ใช้ /use-subagents ถ้าจำเป็น

## Expected Outcome

- รายงาน findings ครอบคลุม complexity, data structures, correctness, memory, numeric, concurrency
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน section `## Fix`
