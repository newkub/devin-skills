---
name: review-algorithm
description: "ตรวจสอบ algorithms: time/space complexity, correctness และ hot paths"
argument-hint: "[function-or-module]"
related:  - follow-algorithms
  - scan-codebase
  - run-profiler
  - run-bench
  - report
---

## Goal

ตรวจสอบ algorithms ใน project ว่ามี time/space complexity, correctness และ hot paths ที่เหมาะสมหรือไม่ ก่อนส่งต่อไปยัง section `## Fix`

## Scope

ใช้กับ functions/modules ที่มี performance bottleneck หรือ suspect inefficient algorithmic complexity

## Execute

### 1. Identify Hot Paths

> Goal: หา functions ที่ถูกเรียกบ่อยหรือช้า

1. ใช้ `/scan-codebase`, `/run-profiler` หรือ `/run-bench` หา hot paths
2. ระบุ functions ที่ call บ่อยหรือ slow
3. หา nested loops, O(n^2) patterns, repeated calculations

### 2. Review Complexity

> Goal: ประเมิน big-O

1. วิเคราะห์ time complexity ของ key functions
2. วิเคราะห์ space complexity และ allocation patterns
3. เปรียบเทียบกับ lower-bound ที่เป็นไปได้

### 3. Review Correctness

> Goal: ตรวจ correctness และ edge cases

1. ตรวจ edge cases (empty, single, large, duplicate, cycle)
2. ตรวจ termination conditions และ invariants
3. ระบุ bugs ที่อาจเกิดจาก optimization ผิด

### 4. Rate And Report

> Goal: สรุป findings พร้อม fix direction

1. ทำ `/report` ด้วย columns: No., Function, Complexity, Hot Path, Severity, Fix
2. ชี้ไป section `## Fix` สำหรับการแก้ไข
3. ถ้ามี data structure ปัญหา → เชื่อม `/review-data-structure`

## Rules

### 1. Read Only

- ห้ามแก้ไข code หรือ refactor ระหว่าง review
- ใช้ profiling และ static analysis เท่านั้น

### 2. Evidence Required

- ทุก finding ต้องมี line, call frequency, และ complexity analysis
- ไม่เดาว่า function ควร optimize โดยไม่มี benchmark

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/review` (algorithm)

Merged from: optimize-algorithm

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้ (algorithm)
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง (algorithm)
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test-unit` ถ้ามี แล้วสรุปผลด้วย `/report-before-after` (algorithm)

- `references/fix-optimize-algorithm.md` — ปรับปรุง algorithms: time complexity, space complexity, data structures, hot paths
## Expected Outcome

- รายงาน findings ครอบคลุม complexity, hot paths, correctness
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน section `## Fix`
