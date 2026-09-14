---
name: review-dx
description: Review DX — dev loop speed, onboarding, error messages, scripts ergonomics
argument-hint: "[scope]"
related:
  - scan-codebase
  - review-delivery
  - review-docs
  - review-cli
  - follow-tasks
  - check-open-ports
  - run-profiler
  - deep-review-then-fix
  - report
  - suggest-next-action
---

## Goal

Review developer experience (DX) แบบเจาะลึก — dev loop speed, scripts ergonomics, onboarding friction, error message quality, API/CLI ergonomics, debugging experience — report-only

## Scope

ใช้เมื่อต้องการ DX review เฉพาะทางและละเอียด — `review-delivery` มี DX summary pass (`references/dx.md`); skill นี้คือ dedicated deep review ที่วัดจริงและให้ findings ละเอียดกว่า ตรวจและรายงาน ไม่แก้ไข; แก้ findings → `/deep-review-then-fix`

## Execute

### 1. Detect Dev Environment

> Goal: รู้ stack และ dev workflow จริง

1. ทำ `/scan-codebase` — runtime, package manager, build tool, test runner
2. อ่าน manifest scripts (`package.json`, `Cargo.toml`, `mise.toml`, `moon.yml`) ผ่าน `/follow-tasks`
3. ระบุ target dev: contributor ใหม่, library consumer, หรือ app developer

### 2. Measure Dev Loop

> Goal: feedback loop เร็วพอสำหรับงานจริง

1. clean install time — `bun install`/`pnpm install`/`cargo build` จาก lockfile — วัดด้วย `hyperfine` (เช่น `hyperfine 'bun install --frozen-lockfile'`)
2. dev server startup + HMR/reload latency
3. incremental build time, test watch feedback, lint/typecheck runtime — ถ้าต้อง trace bottleneck ให้ทำ `/run-profiler`
4. ทำ `/check-open-ports` ถ้า dev server ชน port บ่อย

### 3. Check Scripts Ergonomics

> Goal: commands ค้นหาง่าย ทำนายได้

1. scripts naming สม่ำเสมอ (`dev`, `build`, `test`, `lint`, `typecheck`, `check`) ตาม `/follow-tasks`
2. one-command setup ทำงานจริง (`install && dev`) บน clean state
3. ไม่มี hidden commands — ทุก workflow สำคัญมี script/alias/ documented command
4. monorepo: run command ของ monorepo (`moon run`, `turbo run`, `pnpm -r`) ไม่บังคับ cd เข้า workspace

### 4. Check Onboarding

> Goal: คนใหม่ setup ได้โดยไม่ต้องถาม

1. README/prerequisites/env vars ครบ — ตาม `review-delivery/references/dx.md`
2. `.env.example` ครบทุก var ที่ code อ่านจริง
3. setup guide verify ได้บน clean environment — ไม่พึ่ง global state ที่ไม่ได้เขียนไว้
4. troubleshooting section ครอบ error ที่เจอจริง (port ชน, version mismatch, missing secrets)

### 5. Check Error Messages And Debuggability

> Goal: error บอกสาเหตุ วิธีแก้ ตำแหน่ง

1. error messages มี cause + actionable fix + location — ไม่ใช่ generic `Error: failed`
2. source maps ทำงานใน dev — stack trace ชี้ source จริง
3. debug path ชัดเจน — `DEBUG=` env, `--verbose` flag, log levels
4. validation errors (zod/schema/CLI args) บอก expected vs received

### 6. Check Consumer Ergonomics (library/CLI only)

> Goal: API/CLI ใช้ง่ายสำหรับ consumer

1. exports map ครบ, types ติดมาด้วย, ไม่บังคับ deep imports
2. CLI: `--help` ครบทุก command, output parse ได้, exit codes ถูก — deep-dive → `/review-cli`
3. upgrade path: changelog, migration guide, deprecation warnings

### 7. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — findings ต่อ dimension (loop speed, scripts, onboarding, errors, ergonomics) พร้อม severity + evidence + เวลาที่วัดจริง
2. ทำ `/suggest-next-action`

## Severity

- `Critical`: dev/build run ไม่ได้, setup broken, error แก้ไม่ได้ — onboarding ตาย
- `High`: build >1min, test feedback >30s, ไม่มี HMR, error messages ไม่บอกวิธีแก้, ไม่มี one-command setup
- `Medium`: scripts naming ไม่สม่ำเสมอ, `.env.example` ไม่ครบ, source maps พัง, docs ขาด troubleshooting
- `Low`: cosmetic — alias, help text, formatting

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence — file path, command output, หรือเวลาที่วัดจริง (ห้ามเดาว่า "น่าจะช้า")
- วัดจริงด้วย commands ไม่ใช่ประมาณ — clean install/dev/build/test ต้องรัน
- ใช้ /use-subagents ถ้า scope ใหญ่
- ใช้ /review-delivery สำหรับ delivery-wide aggregation
- ใช้ /review-docs สำหรับ docs structure deep-dive
- ใช้ /review-cli สำหรับ CLI ergonomics deep-dive

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. dev loop → incremental build config, lazy loading, cache, ลด watch scope
2. scripts → rename ให้สม่ำเสมอตาม `/follow-tasks`, เพิ่ม one-command setup
3. onboarding → แก้ README/env example ตาม `/update-readme-md`
4. error messages → เพิ่ม cause/fix/location ตาม findings
5. verify: clean install + dev loop timing หลังแก้ ดีขึ้นจริง

## Expected Outcome

- DX findings ครบทุก dimension พร้อม severity + เวลาที่วัดจริง
- onboarding friction points ระบุชัด (steps ที่ต้องถามคนอื่น)
- report ส่งมอบพร้อม actionable recommendations
