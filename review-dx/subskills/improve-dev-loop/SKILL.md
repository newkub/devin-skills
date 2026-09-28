---
name: review-dx-improve-dev-loop
description: Apply DX findings — faster dev loop, consistent scripts, better onboarding/errors
argument-hint: "[scope-or-findings]"
related:
  - review-dx
  - follow-tasks
  - update-readme-md
  - no-hard-code
  - run-check
  - report-before-after
---

## Goal

แก้ DX findings จาก `/review-dx` จริง — dev loop เร็วขึ้น onboarding ลื่นขึ้น error messages ช่วยจริง

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้
- ครอบคลุม: build/dev loop speed, script naming, onboarding docs, error messages, env setup

## Execute

### 1. Baseline

> Goal: ตัวเลข + friction points ก่อนแก้

1. dev loop timing — cold start, incremental build, HMR reload, watch scope
2. onboarding walkthrough — new dev setup steps, failure modes พร้อม screenshots/logs
3. error messages — เก็บตัวอย่างจริงที่ cryptic

### 2. Fix Dev Loop

> Goal: iteration เร็วขึ้น

1. incremental build — lazy compilation, dev-mode optimizations
2. watch scope — ลด file watching ที่ไม่จำเป็น, cache strategy
3. HMR — preserve component state, fast refresh config

### 3. Fix Scripts And Onboarding

> Goal: setup + commands predictable

1. scripts — consistent verbs, `/follow-tasks` conventions, one-command setup script
2. onboarding — README/env example เทียบจริง (`/update-readme-md`), `.env.example` ครบ (`/no-hard-code`)
3. error messages — cause + fix + location ที่ actionable

### 4. Verify

> Goal: DX ดีขึ้นวัดได้

1. clean install + dev loop timing เทียบ baseline
2. walkthrough ผ่านจบ — new dev ใช้งานได้จริง
3. `/run-check` + `/report-before-after` — timings + friction points

## Rules

- preserve behavior — DX fixes ไม่เปลี่ยน production output
- docs ที่แก้ต้องตรง reality — test walkthrough จริงไม่ใช่แค่อ่าน
- แยก commit: dev loop → scripts → onboarding → error messages

## Expected Outcome

- Dev loop timings ดีขึ้นพร้อม numbers
- Onboarding walkthrough ผ่านจบโดยไม่มี blockers
