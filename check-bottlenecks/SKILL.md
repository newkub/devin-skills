---
name: check-bottlenecks
description: ตรวจหา performance bottlenecks ใน app, API, หรือ build
argument-hint: "[target]"
related:
  - watch-build
  - run-check
  - review-performance
  - improve
---

## Goal
ตรวจหาส่วนทีทำให้ระบบช้า เช่น API, database query, build, runtime

## Scope
- รองรับ backend, frontend, build pipeline
- ใช้ load test, profiling, หรือ Lighthouse
- รายงาน bottleneck พร้อม metric

## Execute
### 1. Choose Method

> Goal: Choose Method

1. ถ้าเป็น API → ใช้ `k6`, `wrk`, หรือ `autocannon`
2. ถ้าเป็น frontend → ใช้ Lighthouse หรือ Chrome DevTools
3. ถ้าเป็น build → ใช้ `vite-bundle-visualizer` หรือ `webpack-bundle-analyzer`
4. ถ้าเป็น runtime → ใช้ `0x`, `clinic`, หรือ `perf`

### 2. Run Benchmark

> Goal: Run Benchmark

1. กำหนด scenario ที่สมจริง
2. รันหลายรอบเพื่อความเสถียร
3. บันทึกผล latency, throughput, memory, CPU

### 3. Profile

> Goal: Profile

1. ใช้ profiler จับ hotspots
2. หา slow functions หรือ heavy queries
3. บันทึก flamegraph ถ้ามี

### 4. Report

> Goal: Report

1. สรุป top 5 bottlenecks
2. ระบุ impact และ root cause
3. แนะนำ next action เช่น `/review-performance`

## Rules
### 1. Baseline

- บันทึก baseline ก่อน optimization
- รันหลายครั้งเพื่อลด noise
- แยก env เดียวกันกับ production ถ้าได้

### 2. Scope

- ไม่เปลี่ยน code ใน step นี้
- focus หา bottleneck ไม่ใช่แก้ไข
- ระบุ metric ทีวัดได้

- ใช้ /watch-build ถ้าจำเป็น
- ใช้ /run-check ถ้าจำเป็น
- ใช้ /improve ถ้าจำเป็น

## Expected Outcome
- รายการ bottlenecks พร้อม metric
- baseline และเป้าหมายทีวัดได้
- แนวทางการ optimize ถัดไป
