---
name: review-bundle-report-size
description: สร้าง bundle size report — per-chunk delta table, budgets, asset inventory
argument-hint: "[app-or-package]"
related:
  - report
  - create-report-in-dot-devin
  - run-build
---

## Goal

แปลง bundle findings ของ `/review-bundle` เป็น size report — per-chunk breakdown + budget status + asset inventory ที่เทียบ before/after ได้

## Scope

- ใช้เมื่อ `/review-bundle` dispatch มาที่ `size`/`report-size` หรือเรียก standalone กับ build output ที่มีอยู่
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Collect Measurements

> Goal: numbers จริงจาก build output

1. ทำ `/run-build` พร้อม analyzer ถ้ายังไม่มี output — ห้ามเดา sizes
2. เก็บ per-chunk: name, raw size, gzip/brotli size, modules ที่ใหญ่สุด
3. เก็บ assets: images/fonts/media ตาม type กับ size

### 2. Build Size Tables

> Goal: tables ที่เห็น hotspots ทันที

1. Chunk table: `No.`, `Chunk`, `Raw`, `Gzip`, `Top Modules`, `Severity` — flag >500 kB
2. Asset table: `No.`, `Asset`, `Type`, `Size`, `Issue` — flag unoptimized format, missing dimensions
3. Budget status: เทียบกับ budget ที่ config ประกาศ (หรือ baseline ล่าสุดถ้ามี artifact เก่าใน `.devin/`)

### 3. Summarize

> Goal: verdict ในบรรทัดเดียว

1. total size + largest offender + budget pass/fail
2. fix route → parent `## Fix` (splitting, tree shaking, assets) หรือ `../optimize-bundle/SKILL.md` สำหรับ dedicated pass

## Rules

- ทุก size ต้องมาจาก build output/analyzer — ห้าม estimate
- รายงานทั้ง raw และ compressed size — raw alone หลอก
- persistent artifact อยู่ใน `.devin/` เท่านั้น เพื่อเทียบ delta รอบถัดไป

## Expected Outcome

- Per-chunk และ per-asset size tables พร้อม severity
- Budget status + next fix route ชัดเจน
