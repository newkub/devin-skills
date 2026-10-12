---
name: optimize-cache
description: optimize caching — hit rates, TTL, invalidation layers — baseline, fix, re-measure
argument-hint: "[scope]"
related:
  - optimize-perf
  - deep-review
  - deep-review-then-fix
  - deep-optimize
  - run-bench
  - report-before-after
  - report
  - suggest-next-action
  - ask-me
  - optimize-perf
---

## Goal

ตอบคำถาม "caching optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — baseline ก่อนเสมอ, รวม findings จาก `/deep-review` domains `review-performance + review-backend` แล้วแก้และวัดซ้ำ

## Scope

ใช้เมื่อต้องการ optimize caching — thin entry point ที่ delegate การ review ไป `/deep-review`; optimization ต้องวัดได้ ห้ามเดา

- `review-performance` — cache hit rates, miss cost, stale reads
- `review-backend` — cache layers, invalidation strategy, key design

### Tools And Libraries

| Skill | ใช้เมื่อ |
|---|---|
| `f` | o |
| `i` | o |


## Execute

### 1. Baseline

1. รับ `<scope>` จาก argument หรือ conversation — ไม่ชัด → `/ask-me`
2. เก็บ baseline ก่อนเสมอ — hit rate + latency delta — before/after per layer; ใช้ `/run-bench` หรือ tool ของ domain
3. ทำ `/deep-review` domains `review-performance + review-backend` หา optimization findings — miss-heavy keys, wrong TTL, missing layers, thundering herd

### 2. Fix And Re-Measure

1. `/report` prioritized findings — แก้ impact มาก → น้อย ผ่าน `/deep-review-then-fix`; preserve behavior (optimize ≠ เปลี่ยน output)
2. วัดซ้ำหลังทุก fix — metric ไม่ดีขึ้น → revert; สรุปด้วย `/report-before-after`
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-performance + review-backend`
- มี baseline ก่อนเสมอ — ห้าม optimize ตาบอด
- preserve behavior — public API/output เหมือนเดิม (ยกเว้น perf fix ที่จงใจ)
- ทุก fix ต้องมี measurement evidence

## Expected Outcome

- Baseline + prioritized optimization list จาก `/deep-review`
- Fixes วัด improvement ได้จริง — regressions ถูก revert
- `/report-before-after` ครบ metrics ที่เปลี่ยน