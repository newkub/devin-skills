---
name: improve-auto-update
description: หา auto-update improvements — updater, delta update, staged rollout — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-desktop-app
  - improve-mobile-app
  - improve-release
  - follow-tool-capgo
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "auto-update improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-desktop-app + review-mobile + review-release` (update scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "updater/update flow ของ app ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-desktop-app` (update scope) — updater lifecycle (check/download/install/restart), code signing ต่อ platform, delta updates, install-path permissions, update failure recovery
- `review-mobile` (update scope) — store review latency, phased rollout %, forced-update floor version, in-app update prompts
- `review-release` (update scope) — artifact/channel wiring (beta/stable), rollback path เมื่อ release ใหม่พัง
- ออก version/release pipeline → `/improve-release`; packaging ตัว app → `/improve-desktop-app`; Tauri updater/capgo specifics → `/follow-tool-capgo` + skill framework ที่ตรง
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-desktop-app + review-mobile + review-release` (update scope) — updater ไม่ verify signature, ไม่มี rollback, rollout กระแทก 100%
3. รวบรวม prioritized list พร้อม severity และ evidence — update ที่ brick user ได้ (no recovery) เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ทุก updater fix ต้องทดสอบ flow ล้มเหลว (download ตัด, signature ผิด, disk เต็ม) ไม่ใช่แค่ happy path — ใช้ `/test-e2e`
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้ามปิด signature verification เพื่อแก้ install fail — หา root cause ผ่าน `/deep-debug`
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized auto-update improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม failure-path update tests
