---
name: optimize-ci
description: Optimize CI/CD pipelines — cache, matrix, parallelism, flakiness ตาม review-delivery findings
argument-hint: "[scope]"
related:
  - review-delivery
  - follow-tool-github-actions
  - run-check
  - report
  - suggest-next-action
---

## Goal

แก้ CI/CD pipeline issues ที่ `/review-delivery` พบ — build ช้า, cache misses, matrix ฟู่, flaky jobs, secrets/config ผิด — พร้อมวัด duration before/after

## Scope

ใช้หลัง `/review-delivery` มี findings หรือเมื่อ pipeline ช้า/flaky — apply fixes ไม่ใช่ report-only

- ถ้า deploy config → `/review-delivery` scope deploy; skill นี้เน้น CI efficiency + correctness
- GitHub Actions เป็นหลัก — ปรับตาม provider ที่ตรวจพบตาม `/follow-tool-github-actions`

## Execute

### 1. Collect Findings And Baseline

> Goal: รู้ปัญหาและมีตัวเลข baseline

1. ทำ `/review-delivery` หรืออ่าน findings เดิม
2. เก็บ baseline จาก run history จริง: duration ต่อ job, cache hit rate, failure/flake rate
3. จัดกลุ่ม: speed, caching, reliability, cost (minutes), security

### 2. Fix Caching And Install

> Goal: install/build steps เร็ว

1. dependency caching ถูกต้องตาม ecosystem — lockfile key, restore-keys สำหรับ partial hits
2. build caching (turborepo/nx/gradle/go build cache) ถ้า monorepo
3. ลด install surface — `--frozen-lockfile`, skip docs, minimal toolchains

### 3. Fix Parallelism And Matrix

> Goal: jobs ขนานกันอย่างมีเหตุผล

1. split test shards / matrix เฉพาะ axes ที่จำเป็น — ไม่ explode combinations
2. `concurrency` groups cancel งานเก่าบน branch เดียวกัน
3. `needs:` graph ถูกต้อง — ไม่ serialize เกินจำเป็น; fail-fast order (lint → unit → heavy)

### 4. Fix Reliability

> Goal: ไม่มี flaky/wasted runs

1. flaky steps → retries ที่จำเป็น + root cause fix (timeouts, network, ordering)
2. path filters — skip jobs เมื่อไม่เกี่ยว (docs-only changes)
3. timeouts ครบทุก job — ห้าม job ค้างกิน minutes

### 5. Fix Security And Config

> Goal: pipeline ปลอดภัย

1. actions pin เป็น SHA/version จริง — ห้าม `@main`/`@master`
2. least-privilege `permissions:` ต่อ job; secrets ไม่ echo/expose
3. OIDC federation แทน long-lived cloud keys ถ้าใช้ได้

### 6. Verify

> Goal: pipeline ยังทำงานและเร็วขึ้น

1. `/run-check` — workflow syntax valid (actionlint ถ้ามี)
2. trigger/dry-run run เดียวเทียบ duration กับ baseline
3. ถ้าแก้ไม่ได้ทันที → report blockers

### 7. Report

> Goal: ส่งมอบ

1. ทำ `/report` — duration delta, cache hit improvement, jobs changed
2. ทำ `/suggest-next-action`

## Rules

### 1. Measure Runs

- ทุก fix มี run evidence ก่อน/หลัง — ห้ามเดาจาก config อย่างเดียว
- baseline จาก run history จริงไม่ใช่การเดา

### 2. No Coverage Loss

- optimization ห้ามตัด checks/tests ที่มีค่า — ตัดได้เฉพาะ redundancy จริง
- path filters ต้องไม่ skip งานที่ควรรัน

### 3. Deterministic

- pin versions/SHAs — ไม่ floating refs
- matrix axes ต้องมีเหตุผล — ห้ามเพิ่ม combos โดยไม่จำเป็น

## Expected Outcome

- pipeline เร็วขึ้นและเสถียรขึ้นพร้อม run evidence
- caching/parallelism/path filters ถูกต้อง
- security posture ดีขึ้น (pinned actions, least-privilege)
