---
name: optimize-bundle
description: หา bundle+build optimization — size, chunks, tree-shaking, static assets, build speed, caching, toolchain — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - optimize-perf
  - deep-review
  - deep-review-then-fix
  - run-bench
  - report-bundle
  - report-before-after
  - follow-tool-sonda
  - follow-tool-vite
  - follow-tool-mr-boxington
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "bundle/build optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-bundle` ทั้ง output artifacts และ build pipeline (speed, caching, toolchain) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "bundle/build ควร optimize อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-bundle` (output scope) — bundle size, chunk splitting, tree-shaking effectiveness, duplicate modules, static asset weight, compression
- `review-bundle` (build scope — merged from `/optimize-build`) — build speed, caching, toolchain config
- CI pipeline speed → `/optimize-ci`; runtime perf → `/optimize-perf`

### Merged Details

- `optimize-build` (build speed, caching, toolchain) merged into this skill — use `/optimize-bundle` สำหรับทั้ง bundle size และ build speed

### Tools And Libraries

| Skill | ใช้เมื่อ |
|-------|----------|
| `/report-bundle` | bundle breakdown ต่อ chunk/dependency เป็น baseline |
| `/follow-tool-sonda` | source-map accurate bundle analysis |
| `/follow-tool-vite` | Vite config fixes — manualChunks, compression, assetsInlineLimit |

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-bundle` — oversize chunks, dead code, duplicate deps, uncompressed assets, missing code-split points, build speed/toolchain cache พัง
3. รวบรวม prioritized list พร้อม severity และ evidence — ใช้ `/report-bundle` เป็น baseline

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. วัด baseline ก่อนแก้เสมอ — bundle size per chunk ผ่าน `/report-bundle` หรือ `/follow-tool-sonda`; build time ผ่าน `/follow-tool-mr-boxington`
2. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง) — แก้ทีละจุด impact มาก→น้อย
3. วัดซ้ำแล้ว `/report-before-after` — bundle ไม่เล็กลง/build ไม่เร็วขึ้น → revert
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-bundle`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- optimize ≠ เปลี่ยน output — app behavior ต้อง identical; bundle ไม่เล็กลง → revert
- ห้าม manual chunk splits ที่ทำให้ critical path ช้าลง — เช็คด้วย real measurement
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized bundle optimization list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม before/after bundle metrics
