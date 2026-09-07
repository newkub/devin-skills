---
name: run-load-test
description: รัน load test กับ endpoints ด้วย k6 หรือ autocannon วัด throughput, latency และ breaking point
argument-hint: "[url-or-endpoints] [--vus N] [--duration Ns]"
related:
  - check-bottlenecks
  - run-profiler
  - check-open-ports
  - report-before-after
---

## Goal

รัน load test กับ app/API เพื่อวัด throughput, latency distribution และหา breaking point ก่อน deploy หรือหลัง performance changes

## Scope

- เครื่องมือ: `k6` (preferred, scriptable) หรือ `autocannon` (quick, zero-script) ตาม availability
- ตรวจ endpoints ที่ระบุ หรือ critical paths (health, hot endpoints, write paths)
- Load patterns: smoke (ต่ำ), load (ปกติ), stress (หา limit), spike
- ห้ามยิง production/external services โดยไม่ได้รับอนุญาตชัดเจน

## Execute

### 1. Prepare Target

> Goal: ให้ app พร้อมและเลือก endpoints

1. ตรวจว่า app รันอยู่ — ทำ `/check-open-ports` ยืนยัน port หรือ `/run-dev` ถ้ายังไม่รัน
2. เลือก endpoints: จาก argument, หรือ auto-pick (health, main reads, main writes)
3. เตรียม auth/data ที่จำเป็น (test tokens, seed data)
4. ยืนยัน target: ถ้าเป็น shared/staging/prod → ต้องถาม user ก่อนเสมอ

### 2. Select Tool And Scenario

> Goal: เลือก tool และ load pattern ตามเป้าหมาย

1. `k6` ถ้าต้องการ scenarios ซับซ้อน (stages, thresholds, checks) — เขียน script ชั่วคราวใน temp
2. `autocannon` ถ้าต้องการ quick benchmark: `autocannon -c <conn> -d <sec> <url>`
3. Default scenario: ramp 0→N VUs → sustain → ramp down
4. กำหนด thresholds ที่วัดผลได้: p95 latency, error rate, RPS ขั้นต่ำ

### 3. Run And Monitor

> Goal: เก็บ metrics ระหว่าง load

1. รัน load — เก็บ summary: RPS, latency p50/p95/p99, error rate, timeouts
2. สังเกต server ระหว่างทest: CPU/memory, error logs, queue buildup
3. ถ้า error rate พุ่ง → หยุดและบันทึกจุดที่พัง (breaking point)

### 4. Analyze And Report

> Goal: ตีความผลและแนะนำ

1. ใช้ `/report-before-after` หรือ table: `No.`, `Endpoint`, `RPS`, `p50`, `p95`, `p99`, `Errors`, `Verdict`
2. ระบุ bottleneck ที่เห็น (CPU-bound, connection limits, DB saturation) — ส่งต่อ `/check-bottlenecks` หรือ `/run-profiler` ถ้าต้อง drill down
3. เทียบ baseline ก่อนหน้าถ้ามี — flag regression
4. บันทึก k6 script ที่ใช้ไว้ใน `.devin/` ถ้า user ต้องการรันซ้ำ

## Rules

### 1. Target Consent

- ห้าม load test production หรือ third-party endpoints โดยไม่มี explicit user approval
- ระบุ target environment ชัดเจนในรายงาน

### 2. Realistic Load

- ใช้ payload และ auth จริง — ไม่ยิง endpoint เปล่าที่ไม่ represent traffic จริง
- ระบุ client limits (local machine bandwidth, connection caps) ที่อาจ bottleneck ฝั่ง client เอง

### 3. Clean Up

- ลบ test artifacts/data ที่ load test สร้าง (seeded records, test users) หลังจบ
- ไม่ทิ้ง load generator รันค้าง

## Expected Outcome

- Metrics ครบ: RPS, latency percentiles, error rate ต่อ endpoint
- Breaking point และ bottleneck hypothesis ที่ชัดเจน
- Reproducible script สำหรับรันซ้ำหลัง optimization
