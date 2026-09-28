---
name: review-frontend-check-fetching
description: Check data fetching — waterfalls, caching, race conditions, loading/error states
argument-hint: "[scope]"
related:
  - review-frontend
  - use-astgrep
  - report
---

## Goal

Run the data fetching dimension of `/review-frontend` แบบ focused — fetching patterns มีประสิทธิภาพและ states ครบ

## Scope

- ใช้เมื่อ `/review-frontend` dispatch มาที่ `fetching`/`async`/`data` หรือเรียก standalone
- ครอบคลุม: fetch waterfalls, caching/dedup, race conditions, abort handling, loading/error/empty states

## Execute

### 1. Fetching Checks

> Goal: data layer มีประสิทธิภาพ

ทำตาม `../../references/data-fetching.md`

1. waterfalls — serial awaits ที่ parallel ได้, fetch-in-render vs prefetch/loader
2. caching — dedup, stale-while-revalidate, cache keys ถูก, over/under-fetching
3. race conditions — rapid successive calls ขาด abort/stale check
4. states — loading/error/empty/success ครบทุก async surface

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Component/Hook`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`
- ทุก finding มี file path + line — call site + data hook
- race condition ที่ corrupt UI state = High; missing skeleton = Low

## Expected Outcome

- Fetching findings แยก waterfalls/caching/races/states
- แต่ละ finding มี evidence พร้อม pattern ที่แนะนำ
