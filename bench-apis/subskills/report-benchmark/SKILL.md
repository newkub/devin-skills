---
name: bench-apis-report-benchmark
description: สร้าง benchmark report ของ API — latency/throughput matrix, %delta, verdict
argument-hint: "[results-path]"
related:
  - report
  - report-before-after
  - create-report-in-dot-devin
---

## Goal

แปลงผล benchmark ของ `/bench-apis` เป็น report ที่เปรียบเทียบได้ — numbers matrix, %delta, verdict — regenerate ได้จากผล bench เดิมโดยไม่ต้องรันใหม่

## Scope

- ใช้เมื่อ `/bench-apis` dispatch มาที่ `report` หรือเรียก standalone กับผล bench ที่มีอยู่
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin` ถ้า user ขอ

## Execute

### 1. Collect Results

> Goal: รวม numbers จาก bench run

1. รวมผลต่อ endpoint/implementation: p50/p95/p99 latency, throughput (req/s), error rate
2. ถ้าไม่มีผลใหม่ → หา results ล่าสุดที่เก็บไว้ หรือ `/ask-me` ว่าจะรัน bench ก่อนไหม
3. ระบุ environment + tool ที่ใช้วัด (hyperfine, k6, autocannon) เป็น methodology note

### 2. Build Comparison Matrix

> Goal: ตารางเทียบฝั่งต่อฝั่ง

1. ตาราง: `No.`, `Endpoint`, `Baseline`, `Candidate`, `Delta`, `%Delta`, `Verdict`
2. Verdict ต่อแถว: `better` / `worse` / `same` (ภายใน noise threshold ~5%)
3. เรียงตาม %Delta — regression ขึ้นก่อน

### 3. Summarize Verdict

> Goal: ข้อสรุปเดียวอ่านจบ

1. Overall verdict: `faster` / `slower` / `mixed` พร้อมสถิติหลัก
2. ระบุ regressions ที่เกิน threshold ชัดเจน
3. ถ้าต้องเก็บถาวร → ทำ `/create-report-in-dot-devin`

## Rules

- ทุก number ต้องมี unit และ sample size — ห้ามเทียบค่าจาก run ที่ methodology ต่างกัน
- %Delta = (candidate - baseline) / baseline — ระบุ sign convention ชัดเจน (ลบ = เร็วขึ้น)
- แยก signal จาก noise — ระบุ threshold ที่ใช้

## Expected Outcome

- Benchmark report พร้อม matrix + verdict + methodology note
