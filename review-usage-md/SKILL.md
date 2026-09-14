---
name: review-usage-md
description: Review usage surface ของ project — refresh usage docs ก่อน แล้วตรวจ API/CLI/web parity
argument-hint: "[scope]"
related:
  - update-usage-md
  - review-api
  - review-cli
  - review-sdk
  - review-frontend
  - review-docs
  - report
  - suggest-next-action
  - deep-review-then-fix
---

## Goal

Review usage surface ของ project จากมุมผู้ใช้ — refresh usage docs ก่อนเสมอ แล้วตรวจว่า public API, CLI, และ web flows ใช้งานได้จริงตามที่เอกสารสัญญา (promise vs reality)

## Scope

- public API usage — exports, signatures, examples ใช้ได้จริง → deep dive `/review-api` หรือ `/review-sdk`
- CLI usage — commands, flags, help text, exit codes → deep dive `/review-cli`
- web usage — user-facing flows ทำงานครบ → deep dive `/review-frontend`/`/review-uxui`
- usage parity — `USAGE.md`, `README.md`, `--help` สัญญาอะไร vs surface จริง
- doc quality ภายใน → `/review-docs` (ไม่ซ้ำ — skill นี้ดู parity เท่านั้น)

## Execute

### 1. Refresh Usage Docs

> Goal: usage docs สดก่อน review เสมอ

1. ทำ `/update-usage-md` ก่อนเสมอ — `USAGE.md` ต้องสะท้อน code ปัจจุบัน
2. ถ้า project ไม่มี usage docs → สร้างผ่าน step นี้ก่อน (หรือ draft กับ `/design-usage-md-with-me-first`)
3. บันทึก snapshot ของ documented surface: commands, API items, flows ที่ docs อ้างถึง

### 2. Usage Parity Check

> Goal: ทุกอย่างที่ docs สัญญามีจริงและใช้ได้

1. documented CLI commands → มีจริงใน bin/entry points ไหม (หาย = Critical)
2. documented API exports → มีจริงใน public surface ไหม
3. documented flags/config → ยังรองรับไหม (renamed/removed = breaking)
4. documented examples → run ได้จริงหรือมี signature ตรง
5. surface จริงที่ไม่มีใน docs → undocumented features (Medium)

### 3. Surface Reviews

> Goal: แต่ละ surface ใช้งานดีจริงในมุมผู้ใช้

1. API: naming consistency, ergonomics, error surface → ถ้าต้องลงลึก delegate `/review-api`/`/review-sdk`
2. CLI: help quality, flag consistency, scripting-friendliness → delegate `/review-cli`
3. Web: critical usage flows complete ครบ (signup → core action → result) → delegate `/review-frontend`
4. เก็บ findings จาก delegated reviews มารวมใน report เดียว

### 4. Report

> Goal: รายงาน usage review รวม

1. ทำ `/report table` — columns: `No.`, `Surface`, `Finding`, `Severity`, `Location`, `Recommendation`
2. แยกกลุ่ม: parity findings (docs สัญญาแต่ไม่มีจริง) vs surface quality findings
3. สรุป usage coverage %: documented items ที่ verify ผ่าน / ทั้งหมด
4. ทำ `/suggest-next-action`

## Rules

- `/update-usage-md` ก่อนเสมอ — ห้าม review บน docs ที่ stale
- review/report-only โดย default — ไม่แก้ code หรือ docs ระหว่าง review
- ทุก parity finding ต้องมีทั้งสองฝั่ง: doc reference + surface evidence
- deep domain issues ส่งต่อ `review-*` ตรง domain — skill นี้ aggregate เท่านั้น

## Fix

> ทำเฉพาะเมื่อ user confirm — review-only โดย default

- parity gaps (docs ผิด/ขาด) → `/update-usage-md` หรือ `/update-docs`
- API/CLI/web surface issues → `## Fix` ของ `review-api`/`review-cli`/`review-frontend` ตาม domain
- multi-domain → `/deep-review-then-fix`

## Expected Outcome

- `USAGE.md` สดก่อน review
- ตาราง parity findings + surface findings พร้อม severity
- usage coverage % ชัดเจน
- next action ผ่าน `/suggest-next-action`
