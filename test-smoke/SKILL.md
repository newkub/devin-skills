---
name: test-smoke
description: รัน smoke tests — sanity check เฉพาะ critical paths หลัง build/deploy ว่าระบบตอบสนอง (fast gate)
argument-hint: "[scope|url]"
related:
  - run-test
  - test-all
  - test-load
  - test-api
  - deep-review
  - deep-test
  - check-open-ports
  - run-dev
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

รัน smoke tests — minimal critical-path checks หลัง build/deploy เพื่อยืนยันว่าระบบ alive และ core flows ตอบสนอง — signals: `smoke` scripts/tags, `*.smoke.*`, health endpoints, deploy hooks

## Scope

ใช้เมื่อต้องรัน smoke/sanity tests — run-only ไม่แก้ tests (analysis ลึก → `/deep-test`)

- Full functional coverage → `/test-unit` / `/test-e2e`; performance under load → `/test-load`
- Smoke = quick gate ไม่ใช่ correctness suite — เลือกเฉพาะ critical paths (boot, health, auth, main flow)

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### 1. Detect

`test:smoke`/`smoke` ใน package.json scripts, `*.smoke.*` files, tagged tests (`@smoke`, `-t smoke`), health endpoint (`/health`, `/healthz`, `/api/health`); ถ้าไม่มี suite → ad-hoc smoke: app responds + health 200 + critical route/endpoint OK

### 2. Run

runner tags → `--grep smoke` / `-t @smoke`; ad-hoc → `curl -sf <base>/health` + critical endpoints, หรือ `autocannon -c 1 -d 5` สำหรับ response check; target <2 นาที — ถ้านานกว่านั้นไม่ใช่ smoke; ถ้า app ยังไม่รัน → `/check-open-ports` หรือ `/run-dev`

### 3. Classify

app ไม่ขึ้น/port ชน → environment; health 5xx หรือ boot crash → source → `/resolve-errors`; smoke check outdated → test → `/update-tests`; ซ้ำ ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/smoke-test-<time>.md` — checklist แต่ละ check pass/fail + latency; ผ่านหมด → `/run-verify` หรือส่งต่อ deploy gate

## Rules

- run-only (analysis ลึก → `/deep-test`)
- Smoke ต้องเร็วและเล็ก — critical paths เท่านั้น ห้ามรัน full suite ในนาม smoke
- ห้ามยิง production โดยไม่มี explicit user approval — ระบุ target env ในรายงานเสมอ
- ห้าม `.skip`/retry mask — fail = fail

## Expected Outcome

- Smoke checklist ผ่าน/ไม่ผ่านชัดเจนแบบ fast gate
- Failures ถูก classify เป็น source/test/environment
- Report persist ใน `.devin/temp/report/`
