---
name: follow-optimize
description: Convention การทำ optimization — route ผ่าน optimize-* domain skills หรือ /deep-optimize fan-out → prioritized plan → apply หลัง confirm
argument-hint: "[scope]"
related:
  - deep-optimize
  - optimize-build
  - optimize-cost
  - optimize-memory
  - optimize-perf
  - report
---

## Goal

กำหนดวิธีทำ optimization มาตรฐาน — ทุก optimization เริ่มจาก measurement/bottleneck evidence แล้ว apply ผ่าน path เดียวกัน ห้าม optimize แบบเดา

## Scope

ใช้เมื่อต้องการ optimize scope ใดๆ — route ไป `optimize-*` domain skill ที่ตรงกัน (`optimize-build`, `optimize-cost`, `optimize-memory`, `optimize-perf`) หรือ `/deep-optimize` เมื่อต้องการ fan-out ทุกมิติหรือไม่รู้ bottleneck

## Execute

### 1. Route To Domain

> Goal: เลือก optimize path ที่ตรง scope

1. scope ชัดเจน → ใช้ `optimize-{domain}` ตรงๆ (`build`, `cost`, `memory`, `perf`)
2. scope กว้างหรือ bottleneck ไม่รู้ → ใช้ `/deep-optimize` fan-out subagents ทุก dimension แล้วรวม prioritized plan
3. ถ้าเป็น bottleneck hunting เฉพาะจุด → `/deep-optimize`/`/run-profiler` ตาม AGENTS.md convention

### 2. Measure First

> Goal: มี baseline + evidence ก่อนแก้

1. เก็บ baseline metrics (build time, bundle size, memory, latency, cost) ก่อน optimize
2. ทุก optimization opportunity ต้องมี evidence จาก measurement — ห้าม optimize โดยไม่วัด
3. `/report` prioritized plan ให้ user confirm ก่อน apply

### 3. Apply And Re-Measure

> Goal: ผลลัพธ์วัดได้จริง

1. apply ทีละ finding — แยก commit/ขั้นให้ bisect ได้
2. re-measure เทียบ baseline ทุกครั้ง — ไม่ดีขึ้น → revert + report
3. fix loop สูงสุด 3 รอบ — ไม่ผ่าน → stop + report

## Rules

- Measure → optimize → re-measure เสมอ — ห้าม premature optimization
- ทุก plan ต้อง prioritized ด้วย impact/effort พร้อม evidence
- ยืนยันกับ user ก่อน apply — report-only โดย default

## Expected Outcome

- optimization ทุกข้อมี baseline, evidence, และผลวัดหลัง apply
- plan prioritized ชัดเจน — ไม่มีการแก้โดยไม่รู้ bottleneck
