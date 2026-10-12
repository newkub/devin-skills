---
name: optimize-web-vitals
description: optimize Core Web Vitals — LCP, CLS, INP — baseline, fix, re-measure
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

ตอบคำถาม "Core Web Vitals optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — baseline ก่อนเสมอ, รวม findings จาก `/deep-review` domains `review-performance + review-frontend` แล้วแก้และวัดซ้ำ

## Scope

ใช้เมื่อต้องการ optimize Core Web Vitals — thin entry point ที่ delegate การ review ไป `/deep-review`; optimization ต้องวัดได้ ห้ามเดา

- `review-performance` — LCP/INP bottlenecks, render blocking
- `review-frontend` — layout shifts, hydration cost, component render

### Tools And Libraries

| Skill | ใช้เมื่อ |
|---|---|
| `follow-tool-lighthouse` | Lighthouse audits — CWV metrics per page |
| `follow-tool-unlighthouse` | site-wide Lighthouse sweep ทุก route |


## Execute

### 1. Baseline

1. รับ `<scope>` จาก argument หรือ conversation — ไม่ชัด → `/ask-me`
2. เก็บ baseline ก่อนเสมอ — LCP/CLS/INP ต่อ route — วัดผ่าน Lighthouse/unlighthouse; ใช้ `/run-bench` หรือ tool ของ domain
3. ทำ `/deep-review` domains `review-performance + review-frontend` หา optimization findings — LCP elements, CLS sources, INP long tasks, render-blocking resources

### 2. Fix And Re-Measure

1. `/report` prioritized findings — แก้ impact มาก → น้อย ผ่าน `/deep-review-then-fix`; preserve behavior (optimize ≠ เปลี่ยน output)
2. วัดซ้ำหลังทุก fix — metric ไม่ดีขึ้น → revert; สรุปด้วย `/report-before-after`
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-performance + review-frontend`
- มี baseline ก่อนเสมอ — ห้าม optimize ตาบอด
- preserve behavior — public API/output เหมือนเดิม (ยกเว้น perf fix ที่จงใจ)
- ทุก fix ต้องมี measurement evidence

## Expected Outcome

- Baseline + prioritized optimization list จาก `/deep-review`
- Fixes วัด improvement ได้จริง — regressions ถูก revert
- `/report-before-after` ครบ metrics ที่เปลี่ยน