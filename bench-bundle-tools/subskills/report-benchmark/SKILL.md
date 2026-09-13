---
name: bench-bundle-tools-report-benchmark
description: สร้าง benchmark report ของ bundlers — build time, output size, feature matrix
argument-hint: "[results-path]"
related:
  - report
  - report-before-after
  - create-report-in-dot-devin
---

## Goal

แปลงผล benchmark ของ `/bench-bundle-tools` เป็น report — build time, bundle size, feature support เทียบข้าม tools

## Scope

- ใช้เมื่อ `/bench-bundle-tools` dispatch มาที่ `report` หรือเรียก standalone กับผลที่มีอยู่
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin` ถ้า user ขอ

## Execute

### 1. Collect Results

> Goal: รวม metrics ต่อ tool

1. รวมต่อ bundler: cold build time, warm/incremental build, output size (raw + gzip), dev-server start time
2. รวม feature support: HMR, code splitting, tree shaking, plugins ที่ใช้ใน project นี้
3. ระบุ project + config ที่ใช้วัด เป็น methodology note

### 2. Build Comparison Matrix

> Goal: เทียบหลายมิติในตารางเดียว

1. ตาราง metrics: `No.`, `Tool`, `Build (cold)`, `Build (warm)`, `Size`, `Size (gzip)`, `Notes`
2. ตาราง features: `No.`, `Feature`, `Tool A`, `Tool B`, ... (✓/✗/partial)
3. highlight best-in-class ต่อ metric

### 3. Summarize Recommendation

> Goal: แนะนำ tool จาก numbers + features

1. Verdict: winner ต่อ dimension (speed, size, features, DX)
2. ระบุ trade-offs ที่ numbers ไม่บอก (ecosystem, migration cost)
3. ถ้าต้องเก็บถาวร → ทำ `/create-report-in-dot-devin`

## Rules

- ทุก number มี unit + run count — medians ไม่ใช่ single run
- feature claims ต้องเช็คจริงใน project นี้ ไม่ใช่ marketing docs
- แยก "วัดได้" จาก "ประเมิน" (ecosystem, DX)

## Expected Outcome

- Benchmark report พร้อม metrics matrix + feature matrix + recommendation
