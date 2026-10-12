---
name: run-load-test
description: alias → /test-load (รัน load test ด้วย k6/autocannon วัด throughput, latency, breaking point)
argument-hint: "[url-or-endpoints] [--vus N] [--duration Ns]"
related:
  - test-load
  - run-test
---

## Goal

Alias ของ `/test-load` — รัน load test กับ app/API วัด throughput, latency distribution และ breaking point

## Scope

ใช้เมื่อ user เรียก `/run-load-test` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `test-load`

## Execute

ทำ `/test-load` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/test-load` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `test-load/SKILL.md` เสมอ
