---
name: improve-desktop-app
description: หา desktop app improvements ใน scope — window, tray, IPC security, packaging, auto-update — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - deep-review
  - deep-review-then-fix
  - follow-lib-native-sdk
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "desktop app improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-desktop-app` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "desktop app ควร improve อะไร" (Tauri/Electron/native) — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-desktop-app` — window management/lifecycle, system tray, IPC validation + security boundaries, packaging/signing, auto-update + rollback, offline/local persistence
- update channel/failure paths → `/improve-auto-update`
- app ที่เป็น Native SDK (`src/core.ts` + `.native`, `app.json`) — fix ตาม findings ให้ทำตาม `/follow-lib-native-sdk` (automation/assert, Cmd/Sub, capability declarations)

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-desktop-app`
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-desktop-app`)
2. IPC/security boundary fixes มี priority สูงสุดเสมอ
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-desktop-app`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized desktop app improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`
