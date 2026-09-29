---
name: review-mobile-check-offline
description: Check lifecycle/offline — state persistence, resume, cache/queue/retry, connectivity
argument-hint: "[scope]"
related:
  - review-mobile
  - report
---

## Goal

Run the lifecycle/offline dimension of `/review-mobile` แบบ focused — app รอด process death และทำงานได้ตอน network หลุด

## Scope

- ใช้เมื่อ `/review-mobile` dispatch มาที่ `offline`/`lifecycle` หรือเรียก standalone
- ครอบคลุม: background/foreground transitions, process death, state restore, offline queue, connectivity handling

## Execute

### 1. Lifecycle Checks

> Goal: state ไม่หายตอน OS reclaim — parent Execute §3

ทำตาม `../../subagents/mobile-reviewer/lifecycle-offline.md`

1. state persistence — form drafts, scroll position, navigation state รอด process death
2. resume — app resume ที่ถูกจุด, stale data refresh policy
3. background tasks — OS constraints (doze, app refresh) respected

### 2. Offline Checks

> Goal: graceful degradation เมื่อ offline

1. connectivity detection — offline indicator + blocked-action messaging
2. queue/retry — mutations queue + sync เมื่อกลับมา online, conflict policy documented
3. cache — stale data shown with freshness indicator vs blank spinner

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Screen/Flow`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix` หรือ `../improve-offline/SKILL.md`
- ทุก finding มี file path + line
- data loss บน process death / silent failed mutation = High

## Expected Outcome

- Lifecycle/offline findings พร้อม affected flows
- offline UX gaps flagged แยกจาก correctness issues
