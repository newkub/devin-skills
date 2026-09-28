---
name: review-performance-report-vitals
description: สร้าง Web Vitals report — LCP/INP/CLS + metrics table เทียบ thresholds
argument-hint: "[url-or-scope]"
related:
  - report
  - create-report-in-dot-devin
  - run-profiler
---

## Goal

แปลง performance findings ของ `/review-performance` เป็น vitals report — LCP/INP/CLS และ key metrics เทียบ thresholds ที่ทีมใช้ตัดสินใจได้

## Scope

- ใช้เมื่อ `/review-performance` dispatch มาที่ `vitals`/`report-vitals` หรือเรียก standalone กับ measurements ที่มีอยู่
- ครอบคลุม web vitals; non-web metrics (API latency, memory) ใส่ตารางเดียวกันแยก section
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Collect Metrics

> Goal: numbers จริงจาก measurement เท่านั้น

1. lab metrics: Lighthouse/`/run-profiler` — LCP, INP (หรือ TBT proxy), CLS, TTFB, FCP
2. field metrics: RUM data ถ้ามี — อย่าเดา ถ้าไม่มีให้ระบุ `lab-only`
3. non-web: p50/p95 latency, memory, query times ตาม scope ที่ review ไว้

### 2. Build Vitals Table

> Goal: ตารางเทียบ thresholds

1. `No.`, `Metric`, `Value`, `Threshold`, `Status`, `Top Cause`, `Fix`
2. thresholds: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 — flag `ผ่าน`/`warning`/`ไม่ผ่าน`
3. `Top Cause` จาก findings — LCP image, third-party block, layout shift source

### 3. Summarize

> Goal: verdict + fix route

1. CWV verdict: pass / needs-improvement / fail ต่อ metric
2. fix route → parent `## Fix` (web vitals step) หรือ `../optimize-performance/SKILL.md`

## Rules

- ทุก metric ต้องมี measurement source (lab/field) — ห้ามเดา
- lab-only report ต้องระบุว่าไม่มี field data
- persistent artifact อยู่ใน `.devin/` เท่านั้น

## Expected Outcome

- Vitals table พร้อม pass/fail ต่อ metric และ top cause
- Verdict + fix route ชัดเจน
