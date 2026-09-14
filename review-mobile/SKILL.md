---
name: review-mobile
description: Review mobile app — touch targets, safe areas, gestures, offline, lifecycle, platform conventions
argument-hint: "[scope]"
related:
  - review-frontend
  - review-desktop-app
  - review-accessibility
  - review-performance
  - follow-create-mobile
  - deep-review
  - deep-review-then-fix
  - use-subagents
  - report
  - suggest-next-action
---

## Goal

Review mobile app (native/React Native/Flutter/PWA mobile) — touch targets, safe areas, gestures, offline behavior, app lifecycle, platform conventions (HIG/Material), battery/data usage — report-only

## Scope

ใช้เมื่อ project เป็น mobile app หรือ responsive web ที่ต้องผ่าน mobile — ตรวจและรายงาน ไม่แก้ไข; แก้ findings → `/deep-review-then-fix`

## Execute

### 1. Detect Mobile Stack

> Goal: รู้ platform และ framework

1. ตรวจ manifest: React Native, Flutter, native (Android/iOS), Tauri mobile, PWA
2. อ่าน platform conventions — HIG (iOS) / Material (Android) — ดู `references/` ของ deep-review (`platform-mobile-desktop.md`) ถ้าต้องการ

### 2. Check Touch And Layout

> Goal: UI ใช้งานได้บนหน้าจอสัมผัส

1. touch targets ≥44x44pt (iOS) / 48x48dp (Android)
2. safe areas — notch, home indicator, status bar insets
3. gestures ไม่ชน system gestures; scroll/overscroll behavior ถูก

### 3. Check Lifecycle And Offline

> Goal: app รอด lifecycle จริง

1. background/foreground transitions — state ไม่หาย, tasks resume ถูก
2. offline behavior — network loss handling, queued ops, cache strategy
3. deep links / app links / push notification entry points

### 4. Check Platform Conventions

> Goal: ตาม HIG/Material

1. navigation patterns ตรง platform (tab bar, back behavior)
2. permissions — requested เมื่อจำเป็น + rationale
3. keyboard handling, input accessories, orientation support

### 5. Check Performance And Resources

> Goal: ไม่กิน battery/data เกิน

1. bundle/startup time, image sizes, list virtualization
2. background work ที่เหมาะสม, network batching
3. memory pressure handling

### 6. Store And Health

> Goal: coverage เพิ่มเติมของ domain

1. store compliance — permissions declarations, privacy labels, review guidelines
2. app size budget + crash-free sessions rate

### 7. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — findings ต่อ dimension พร้อม severity + evidence
2. ทำ `/suggest-next-action`

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence
- ใช้ /use-subagents ถ้า scope ใหญ่
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /review-frontend สำหรับ shared UI code
- ใช้ /review-accessibility สำหรับ a11y deep-dive
- ใช้ /review-performance สำหรับ perf deep-dive
- ใช้ /follow-create-mobile (android) หรือ /follow-create-mobile (ios) เป็น platform guide ตอนแก้ conventions

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. touch targets/safe areas → sizing + insets fixes
2. lifecycle → state persistence, resume logic
3. offline → cache/queue/retry strategy
4. platform conventions → navigation/permissions fixes ตาม HIG/Material
5. verify: run บน device/simulator จริง + `/run-test` ผ่าน

## Expected Outcome

- mobile findings ครบทุก dimension พร้อม severity
- platform convention gaps ระบุชัด
- report ส่งมอบพร้อม actionable recommendations
