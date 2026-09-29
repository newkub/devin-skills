---
name: review-delivery-check-efficiency
description: Check build/dev efficiency — build times, dev loop speed, tooling overhead
argument-hint: "[scope]"
related:
  - review-bundle
  - scan-codebase
  - report
---

## Goal

Run the build efficiency dimension of `/review-delivery` แบบ focused — dev loop และ build pipeline ไม่เสียเวลา

## Scope

- ใช้เมื่อ `/review-delivery` dispatch มาที่ `efficiency`/`build` หรือเรียก standalone
- ครอบคลุม: build time, incremental builds, dev server speed, task runner config — bundle output details → `/review-bundle`

## Execute

### 1. Efficiency Checks

> Goal: ครอบคลุมทุก efficiency dimension

ทำตาม `../../subagents/delivery-reviewer/efficiency.md`

1. build time — incremental config, cache strategy, unnecessary work ใน pipeline
2. dev loop — HMR/watch performance, slow transpile steps
3. tooling — duplicate tools, redundant checks ที่รันซ้ำหลายจุด

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Area`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น ไม่แก้ไข build config — fix ใน parent `## Fix`
- ทุก finding มี evidence: measured time, config line, หรือ duplicated tooling
- ไม่ซ้ำ `/review-bundle` — skill นี้ดู process efficiency ไม่ใช่ output size

## Expected Outcome

- Efficiency findings แยก build vs dev-loop vs tooling
- Measured evidence ไม่ใช่ความรู้สึก
