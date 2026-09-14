---
name: bench-apis
description: Benchmark เทียบ API performance ข้าม versions, implementations หรือ environments
argument-hint: "[baseline-vs-candidate|report]"
related:
  - run-load-test
  - check-bottlenecks
  - report-before-after
  - run-bench
---

## Goal

Benchmark เทียบ API endpoints แบบ side-by-side — เช่น implementation เก่า vs ใหม่, version ก่อน vs หลัง optimize หรือ environment A vs B — ด้วย load profile เดียวกัน

## Scope

- ใช้ `/run-load-test` เป็น engine — skill นี้เน้นการเทียบแบบ apples-to-apples
- ครอบคลุม: throughput, latency percentiles, error rates ข้ามสอง (หรือหลาย) targets
- ต้องมี baseline ที่วัดได้ — ไม่ใช่เปรียบเทียบกับตัวเลขในหัว

## Execute

### Subskills

| Argument | Subskill |
|----------|----------|
| `report`, `report-benchmark` | `subskills/report-benchmark/SKILL.md` — latency/throughput matrix, %delta, verdict |

1. ถ้า argument เป็น `report` → อ่าน `subskills/report-benchmark/SKILL.md` แล้วทำตาม flow — ใช้ผล bench เดิม ไม่รันใหม่
2. ถ้าไม่ระบุ → ทำ Steps 1-4 ตามปกติ โดย Step 4 อ่าน subskill `report-benchmark` มา execute

### 1. Define Comparison

> Goal: ระบุสิ่งที่เทียบและ hypotheses

1. ระบุ targets: เช่น `main` vs `feature` branch, impl A vs impl B, staging vs prod-like
2. เลือก endpoints ที่ represent workload จริง (reads, writes, mixed)
3. กำหนดสิ่งที่ตัดสิน: p95 latency, RPS, error rate — และเกณฑ์ชนะ (เช่น p95 ดีขึ้น >10%)

### 2. Equalize Conditions

> Goal: ให้การเทียบยุติธรรม

1. Load profile เดียวกันแน่นอน: same VUs, duration, payload, endpoints
2. Environment เทียบเท่า: same machine/resources, warm-up runs ก่อนเก็บตัวเลข
3. Data state เท่ากัน: same dataset/seed — ไม่มี target ที่ data น้อยกว่าได้เปรียบ
4. ตัวแปรอื่นคงที่: DB เดียวกัน, cache state เดียวกัน

### 3. Run Benchmarks

> Goal: เก็บ metrics จากทุก target

1. รัน `/run-load-test` กับแต่ละ target ด้วย config เดียวกัน
2. รันอย่างน้อย 3 ครั้งต่อ target — ใช้ median กัน noise
3. เก็บผลดิบทั้งหมดพร้อม timestamp และ conditions

### 4. Analyze And Report

> Goal: เทียบผลอย่างมีนัยสำคัญ

1. ทำตาม `subskills/report-benchmark/SKILL.md` — comparison matrix + %delta + verdict
2. ถ้า candidate แพ้ → ส่งต่อ `/check-bottlenecks` หา root cause

## Rules

### 1. Fair Comparison

- เงื่อนไขต้องเท่ากันทุกประการยกเว้นตัวแปรที่ตั้งใจเทียบ
- เปิดเผยความต่างของ environment ที่ควบคุมไม่ได้

### 2. Statistical Honesty

- ใช้ median/percentiles ไม่ใช่ mean อย่างเดียว — ระบุ variance
- delta < run-to-run variance → verdict = `same` ไม่ใช่เดาชนะ

### 3. Reproducible

- เก็บ configs/scripts ที่ใช้ไว้รันซ้ำ — ผลที่ reproduce ไม่ได้ไม่นับ
- ระบุ tool versions, payload, dataset ใน report
- ใช้ /run-bench ถ้าจำเป็น
- ใช้ /report-before-after ถ้าจำเป็น


## Expected Outcome

- ตารางเทียบ metrics ครบต่อ endpoint พร้อม delta และ verdict
- Conclusion ที่ honest รวมถึง "ไม่ต่างกัน" ถ้าเป็นจริง
- Evidence สำหรับตัดสินใจ adopt/rollback
