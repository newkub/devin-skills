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

Review mobile app (native/React Native/Flutter/PWA mobile) — touch targets, safe areas, gestures, offline behavior, app lifecycle, platform conventions (HIG/Material), battery/data usage — report-only — domain checklist อยู่ใน `subagents/mobile-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

ใช้เมื่อ project เป็น mobile app หรือ responsive web ที่ต้องผ่าน mobile — ตรวจและรายงาน ไม่แก้ไข; แก้ findings → `/deep-review-then-fix`

| Dimension | Checklist |
|-----------|-----------|
| `touch-layout` — targets, safe areas, gestures | `subagents/mobile-reviewer/touch-layout.md` |
| `lifecycle-offline` — transitions, state restore, offline queue | `subagents/mobile-reviewer/lifecycle-offline.md` |
| `conventions` — HIG/Material, permissions, navigation | `subagents/mobile-reviewer/conventions.md` |
| `performance` — startup, memory, battery/data | `subagents/mobile-reviewer/performance.md` |

## Execute

### 1. Prepare And Baseline

> Goal: รู้ platform และ framework

1. ตรวจ manifest: React Native, Flutter, native (Android/iOS), Tauri mobile, PWA
2. อ่าน platform conventions — HIG (iOS) / Material (Android) — ดู `../shared/platform-mobile-desktop.md` ถ้าต้องการ
3. ทำ `/run-review` เก็บ analyzer baseline (ใช้เป็น findings-file ให้ subagent cross-check)

### 2. Dispatch Mobile-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — ไม่ระบุ → ทุก dimension ที่ apply
2. Spawn `subagents/mobile-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (baseline จาก step 1)
3. scope ใหญ่/หลาย platform → spawn หลาย instance ทีละ scope/platform ขนานกัน

### 3. Aggregate And Score

> Goal: findings รวมกันพร้อม severity + score ต่อ dimension

1. รวม findings จากทุก instance — dedup ตาม file:line + issue type
2. แยก findings ตาม platform (iOS/Android/shared) เมื่อ convention ต่างกัน
3. findings ที่เป็น a11y/perf deep-dive → ระบุเป็น info + route ไป `/review-accessibility` หรือ `/review-performance`

### 4. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — ตาราง No./Dimension/Severity/File/Finding/Suggestion + score ต่อ dimension และ overall
2. ทำ `/suggest-next-action`


### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| `offline`, `lifecycle` — state persistence, queue/retry | `subskills/check-offline/SKILL.md` |
| `platform`, `conventions`, `store` — HIG/Material + store readiness | `subskills/check-platform/SKILL.md` |
| `report-store` — per-platform go/no-go checklist | `subskills/report-store/SKILL.md` |
| Apply offline findings — cache/queue/sync (user confirm) | `subskills/improve-offline/SKILL.md` |

### Subagents

> Goal: domain reviewer ที่ถือ checklist ทั้งหมด — spawn ผ่าน `/use-subagents`

| Agent | Path |
|-------|------|
| `mobile-reviewer` — mobile dimensions พร้อม severity + evidence | `subagents/mobile-reviewer/AGENT.md` |

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/mobile-reviewer/` เท่านั้น
- ใช้ /use-subagents ถ้า scope ใหญ่
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /review-frontend สำหรับ shared UI code
- ใช้ /review-accessibility สำหรับ a11y deep-dive
- ใช้ /review-performance สำหรับ perf deep-dive
- ใช้ /follow-create-mobile (android) หรือ /follow-create-mobile (ios) เป็น platform guide ตอนแก้ conventions
- ใช้ `/review-desktop-app` ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

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
