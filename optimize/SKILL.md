---
name: optimize
description: หา optimization opportunities — route ไป optimize-* ตาม scope-map — baseline, fix, re-measure
argument-hint: "[scope]"
related:
  - follow-optimize
  - deep-optimize
  - optimize-perf
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — route scope ไป `optimize-*` domain skill เดียวที่ตรงที่สุด ตามตาราง `follow-optimize/references/scope-map.md` แล้วทำตาม convention measure → optimize → re-measure

## Scope

ใช้เมื่อ user สั่ง optimize ทั้ง scope โดยยังไม่เจาะ domain — เป็น thin entry point ที่ route ผ่าน scope-map ไม่ทำ optimization เอง

- scope ชัด (latency, bundle, cost, ...) → ส่งต่อ `optimize-*` ตัวตรงตาม `follow-optimize/references/scope-map.md` (18 domains)
- scope กว้าง หรือ bottleneck ไม่ชัด → `/deep-optimize` fan-out ทุกมิติ แล้วรวม prioritized plan
- ต้องการ "improve" คุณภาพทั่วไป ไม่ใช่ performance/cost → `/improve` แทน
- ทุกรายการต้องผ่าน `/follow-optimize` convention: ห้าม optimize แบบไม่วัด baseline

## Execute

### 1. Route

> Goal: เลือก optimize path ที่ตรง scope

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. Lookup signal ใน scope จาก `follow-optimize/references/scope-map.md` → ได้ `optimize-*` skill + `/deep-review` domain ที่ตรง
3. ถ้า match หลาย domain หรือ bottleneck ไม่ชัด → ใช้ `/deep-optimize` แทน

### 2. Baseline And Findings

> Goal: มี evidence ก่อนแก้

1. เก็บ baseline metrics ตาม domain นั้น (เวลา, size, cost, hit rate) — ห้ามข้าม
2. ทำ `/deep-review` กับ scope นั้นใน domains จาก scope-map แล้วรวบรวม prioritized list พร้อม evidence

### 3. Fix And Re-Measure

> Goal: ผลลัพธ์วัดได้จริง

1. ทำ `/report` แสดง improvements: No., Finding, Metric ก่อน/หลัง, Fix Skill แล้วดำเนินการแก้ต่อทันที
2. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง) ผ่าน `optimize-*` skill นั้น
3. re-measure เทียบ baseline ทุก fix — ไม่ดีขึ้น → revert; ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ optimization เอง — route ผ่าน scope-map ไป `optimize-*` หรือ `/deep-optimize`
- Measure → optimize → re-measure เสมอ — ห้าม premature optimization
- ทุก finding ต้องมี baseline metric รองรับ — ไม่มี evidence = ไม่แก้
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized optimization list พร้อม baseline/หลังแก้เปรียบเทียบ
- Fixes ทั้งหมด route ผ่าน `optimize-*` domains ตาม scope-map
- Metric ไม่ดีขึ้นถูก revert — จบด้วย `/suggest-next-action`
