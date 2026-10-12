---
name: improve-release
description: หา release readiness improvements ใน scope — versioning, changelog, breaking, rollback — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-delivery
  - follow-release
  - run-release
  - report-release-readiness
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "release improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-release` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "release/readiness ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-release` — version/semver correctness, changelog completeness, breaking changes, migration paths, rollback plan, release notes, license, platform targets
- release strategy/tooling setup → `/follow-release`; รัน release จริง → `/run-release`; CI/CD pipeline → `/improve-delivery`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-release` — version drift, missing changelog, undocumented breaking changes, no rollback path
3. รวบรวม prioritized list พร้อม severity และ evidence — อาจเริ่มจาก `/report-release-readiness` เป็น baseline

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-release`)
2. Version/changelog updates → ตาม strategy ของ project (`/follow-release`); semver calls ต้อง conservative — ถ้าไม่แน่ → minor ไม่ใช่ patch
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-release`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้าม rewrite published versions/changelog — เพิ่ม errata entry แทน
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized release improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` — release พร้อม version+changelog+rollback ครบ
