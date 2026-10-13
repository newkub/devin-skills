---
name: improve-features-flags
description: หา feature flag improvements — stale flags, targeting hygiene, kill switch — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-features
  - improve-release
  - improve-config
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "feature flags improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-config + review-code-quality` (flag scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "feature flags ควร improve/ล้างอะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-config` (flag scope) — flag registry ครบ (owner, purpose, expiry), targeting rules ซ้อนทับ/conflict, default values เมื่อ flag provider ล่ม, kill switch ที่ทดสอบแล้ว
- `review-code-quality` (flag scope) — stale/100%-on flags ที่ควรถอด, dead branches from flags เก่า, flag checks กระจัดกระจายควร centralize
- ตัดสินว่าจะตั้ง flag สำหรับ feature ใหม่ → `/improve-features`; rollout pipeline → `/improve-release`; ล้าง flag ที่ decayed แล้ว → `/cleanup` flow ของ flag ที่ map ไว้
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-config + review-code-quality` (flag scope) — สแกน flag usage ทั้งหมด เทียบ provider state
3. รวบรวม prioritized list พร้อม severity และ evidence — flag ที่คุม authz path โดยไม่มี tested kill switch เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. flag removal = behavior change → รัน `/update-tests` + `/run-test all` ก่อน merge ทุกครั้ง
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm — ห้ามลบ flag โดยไม่มี test evidence ว่า default ใหม่คือ what เรามุ่งให้ permanent
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized feature-flag improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม registry ที่ owner/expiry ครบ
