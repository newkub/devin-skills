---
name: improve
description: หาสิ่งที่ improve ใน scope — ส่งไป /deep-review-codebase แล้วแก้ทุก finding ผ่าน /deep-review-codebase-then-fix ทันที
argument-hint: "[scope]"
related:
  - deep-review-codebase
  - deep-review-codebase-then-fix
  - optimize
  - improve-usage-md
  - improve-writing
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — เป็น thin entry ที่ส่งต่อให้ `/deep-review-codebase` เก็บ findings ทั้งหมด แล้ว route ไปแก้ที่ `/deep-review-codebase-then-fix` ต่อ domain ทันที ไม่ทำ review เอง ไม่แก้เองใน skill นี้

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "ควร improve อะไร" โดยไม่เจาะ domain — หรือเมื่อ domain `improve-*` เดิมถูกยุบมาที่นี่ (scope คำใดก็ใช้เป็น domain ได้ เช่น `/improve a11y`, `/improve security`)

- `/deep-review-codebase` เป็นผู้ review เดียว — ทุกมิติที่เข้ากับ scope ดูจาก `references/scope-map.md` (SSOT: scope → review domain + boundary) ไม่ copy ตารางไปไว้ที่อื่น
- scope เป็น metric-driven (bundle, latency, cost, cache hit...) → ใช้ `/optimize` แทน ไม่แก้ perf แบบ ad-hoc ใน improve path
- ต้องการแก้พร้อม confirm ทีละข้อ → `/deep-review-codebase-then-fix` ตรงๆ

## References

- `references/scope-map.md` — ตาราง SSOT: ทุก scope → review domain(s) + ownership/boundary (รวมจาก `/follow-improve` เดียวที่ถูกยุบเข้า skill นี้)

## Execute

### 1. Review

> Goal: ได้ prioritized findings จาก deep-review-codebase

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. Lookup scope ใน `references/scope-map.md` เพื่อระบุ review domain ที่ตรง (boundary cluster events/stability/data ตามตาราง)
3. ทำ `/deep-review-codebase` กับ scope นั้น — report ผ่าน `/report-review` ห้าม scan เองซ้ำ

### 2. Present And Fix

> Goal: แก้ทุก finding ทันทีโดยไม่รอ confirm

1. แสดง improvements เป็นตารางผ่าน `/report`: No., Finding, Severity, Fix domain
2. ส่งแต่ละ finding ไป `/deep-review-codebase-then-fix` per domain —แก้ root cause, loop สูงสุด 3 รอบ/finding
3. ถ้าพบ metric-driven finding → ส่งต่อไป `/optimize` ตาม `optimize/references/scope-map.md`
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review-codebase` เท่านั้น — thin entry ไม่ hold domain logic
- ทุก improvement ต้องเริ่มจาก review finding + evidence ก่อนเสมอ — no guess-fixes
- แก้ทุก finding ทันทีโดยไม่รอ confirm (unless user สั่ง confirm ก่อน → ใช้ `/deep-review-codebase-then-fix`)
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง — ไม่มี owner = report เป็น residual

## Expected Outcome

- Prioritized improvement list จาก `/deep-review-codebase` พร้อม coverage matrix
- Findings ทั้งหมดถูก route ไป `/deep-review-codebase-then-fix` per domain และแก้ครบหรือระบุเหตุที่ไม่แก้
- Metric-driven findings ถูกส่งต่อ `/optimize` — ไม่นำมาแก้ปนใน improve path
