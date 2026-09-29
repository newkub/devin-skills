---
name: review-mobile-check-platform
description: Check platform conventions — HIG/Material, permissions, navigation, store readiness
argument-hint: "[scope]"
related:
  - review-mobile
  - report
---

## Goal

Run the platform conventions dimension of `/review-mobile` แบบ focused — app ตาม iOS/Android conventions และพร้อม store review

## Scope

- ใช้เมื่อ `/review-mobile` dispatch มาที่ `platform`/`conventions`/`store` หรือเรียก standalone
- ครอบคลุม: HIG/Material compliance, permissions, navigation patterns, touch targets, store requirements

## Execute

### 1. Convention Checks

> Goal: app รู้สึก native บนแต่ละ platform — parent Execute §4 + §2

ทำตาม `../../subagents/mobile-reviewer/conventions.md` + `../../subagents/mobile-reviewer/touch-layout.md`

1. navigation — back gesture/button semantics, deep links, tab/stack patterns ตาม platform
2. touch/layout — targets ≥44pt/48dp, safe areas, keyboard avoidance
3. permissions — runtime requests, justification strings, graceful denial handling
4. platform idioms — haptics, share sheet, pull-to-refresh ตาม convention

### 2. Store Readiness Signals

> Goal: ไม่มี obvious store rejection risks — parent Execute §6

1. permission usage ตรง declared purpose
2. privacy manifest/data labels ครบ
3. crash-on-launch, placeholder content, missing icons/screenshots

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Screen/Component`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`
- ทุก finding มี evidence พร้อม platform-specific guideline reference
- store-rejection risk = High; cosmetic convention drift = Low

## Expected Outcome

- Convention findings แยก iOS vs Android
- Store-readiness gaps flagged ก่อน submit
