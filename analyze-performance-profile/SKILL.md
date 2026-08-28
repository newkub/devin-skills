---
name: analyze-performance-profile
description: วิเคราะห์ performance profile ลึกซึ้งหา runtime hotspots
argument-hint: "[target]"
related:
  - check-bottlenecks
  - analyze-codebase-quality
  - improve
  - watch-test
---

## Goal
วิเคราะห์ runtime profile เพื่อหา hotspots, memory leak, และ inefficient paths

## Scope
- รองรับ Node.js, Python, Rust, Go, JVM
- สร้าง flamegraph และ timeline
- รองรับ CPU, memory, event loop profiling

## Execute
### 1. Choose Profiler

> Goal: Choose Profiler

1. Node.js: `clinic doctor`, `0x`, `clinic flame`
2. Python: `py-spy`, `scalene`
3. Rust/Go: `perf`, `flamegraph`
4. JVM: `async-profiler`

### 2. Collect Profile

> Goal: Collect Profile

1. รัน app หรือ test ภายใต้ profiler
2. ทำ scenario ทีต้องการ measure
3. เก็บ profile data และ flamegraph

### 3. Analyze

> Goal: Analyze

1. ดู top functions ตาม CPU time
2. หา memory allocations สูง
3. ตรวจสอบ event loop latency ถ้าเป็น Node.js
4. หา I/O blocking หรือ synchronous calls ใน async path

### 4. Report

> Goal: Report

1. สรุป hotspots หลัก
2. แนะนำ optimization แบบ prioritized
3. บันทึก flamegraph หรือ profile file

## Rules
### 1. Reproduction

- ต้อง reproduce บน production-like data
- รันหลายรอบเพื่อความน่าเชื่อถือ
- บันทึก conditions ทีใช้

### 2. Scope

- focus เป้น analysis ไม่ใช่แก้ไข
- แยก CPU vs memory vs I/O
- ไม่ hardcode path ของ profiler output

## Expected Outcome
- flamegraph หรือ profile summary
- top hotspots พร้อม recommendation
- ข้อมูล conditions ทีใช้ measure
