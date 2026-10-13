---
name: optimize-ci
description: หา CI optimization — pipeline time, caching, parallelism — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-delivery
  - improve-dx
  - optimize-bundle
  - setup-cicd
  - resolve-cicd
  - deep-review
  - deep-review-then-fix
  - follow-tool-github-actions
  - follow-tool-act
  - report-before-after
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "CI optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-workflow` เฉพาะ CI pipelines เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "CI pipeline ควร optimize อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-workflow` (CI scope) — pipeline duration, job parallelism, cache usage, redundant jobs, matrix strategy, artifact handling, trigger efficiency
- CI setup/correctness → `/setup-cicd` หรือ `/improve-delivery`; failing runs → `/resolve-cicd`; local build speed → `/optimize-bundle`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-workflow` scope CI — serial jobs ที่ควร parallel, missing/stale caches, redundant checkouts, oversized matrices, unneeded triggers
3. รวบรวม prioritized list พร้อม severity และ evidence — ดู timing จาก `gh run view` ล่าสุดเป็น baseline

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. วัด baseline ก่อนแก้เสมอ — total pipeline duration + per-job time จาก run ล่าสุด
2. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-workflow`) — verify workflow ใหม่ด้วย `/follow-tool-act` local ก่อน push ถ้าแก้ logic ซับซ้อน
3. Push แล้ววัด run ถัดไป → `/report-before-after` — ถ้าไม่เร็วขึ้น → revert
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-workflow` (CI scope)
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- optimize ≠ ลด coverage — ห้ามตัด jobs/checks ที่จำเป็นเพื่อความเร็ว
- Cache keys ต้อง deterministic — ห้าม cache ที่ทำให้ stale deps หลุดไป production
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized CI optimization list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม before/after pipeline timing
