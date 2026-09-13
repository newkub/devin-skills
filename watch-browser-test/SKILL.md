---
name: watch-browser-test
description: Watch browser confirm server แล้ว subagents แยก route roleplay user test actions/flows จริง
argument-hint: "[url|report]"
related:
  - watch-browser
  - improve-uxui
  - use-agent-browser
  - use-subagents
  - resolve-errors
  - run-dev
  - run-test
  - update-tests
  - create-report-in-dot-devin
  - update-docs
  - report
  - suggest-next-action
---

## Goal

Watch หน้าเว็บผ่าน `agent-browser` เพื่อ confirm ว่า web server ทำงานได้ จากนั้น dispatch subagents แยกตาม route ให้ roleplay เป็น user ทดลองใช้งานจริง — กด buttons, links, forms ตาม flow — แล้วรวม report pass/fail พร้อมแก้สิ่งที่ไม่ผ่าน

## Scope

ใช้เมื่อต้องการ exploratory/functional testing ผ่าน browser จริงโดยครอบคลุมทุก route — ต่างจาก `/run-test` (e2e) ที่รัน test suite เขียนไว้ล่วงหน้า (skill นี้คือ manual-style exploration ผ่าน subagents)

- ถ้าต้องการ orchestrate ทั้ง functional + visual UX pass → `/improve-uxui`
- ถ้าต้องการ improve UX/UI → `/watch-browser-improve-uxui`
- ถ้าต้องการแก้ console/page errors → `/watch-browser-fix`
- ถ้ามี Playwright suite อยู่แล้ว → `/run-test` (e2e)
- ถ้าไม่มี `agent-browser` MCP server → fallback ไป `/use-agent-browser` (CLI)

## Execute

### 1. Verify Web Server

> Goal: confirm ว่า server ทำงานได้ก่อน test

1. ทำ `/watch-browser` — เปิด URL เป้าหมาย, capture screenshot, เช็ค console/errors
2. ถ้า server ไม่ตอบสนอง → ทำ `/run-dev` หรือ `/resolve-errors` แล้วกลับมา step นี้
3. ถ้า app ต้อง auth/seed data → เตรียม test credentials/fixtures ก่อน dispatch

### 2. Discover Routes

> Goal: รู้ routes ทั้งหมดที่ต้อง test — ห้ามข้าม route ใด

1. `agent-browser snapshot -i` เพื่อหา nav links
2. cross-check route definitions ใน codebase
3. สร้าง checklist ทุก route — รวม dynamic routes (sample params ต่อ pattern), nested routes, error routes, และ auth-gated routes (login ก่อน test — ยังต้อง cover)

### 3. Dispatch User-Roleplay Subagents

> Goal: ทดสอบจริงแบบ parallel ครบทุก route — ทุก route ต้องมี agent ดูแล

ทำตาม `/use-subagents` — spawn subagent ครอบคลุมทุก route ใน checklist (แบ่ง batch 3-5 routes ต่อ agent เพื่อ parallelism แต่ห้ามตัด route ทิ้ง) โดยแต่ละ agent roleplay เป็น user และต้อง:

1. `agent-browser open <route>` แล้ว `snapshot -i` เพื่อหา interactive elements ทั้งหมด
2. ทดลองทุก action ที่พบ: click buttons/links, submit forms (valid + invalid input), toggle controls, pagination, search, filters
3. follow flows ที่สมเหตุสมผล — เช่น list → detail → edit → save → back
4. เก็บ evidence ทุก step: screenshot ก่อน/หลัง action, console errors, network failures
5. บันทึกผลเป็น PASS/FAIL ต่อ action พร้อม repro steps เมื่อ FAIL

### 4. Aggregate Results

> Goal: รวมผล test จากทุก agent — ทุก route ใน checklist ต้องมีผล

1. ตรวจ checklist — route ที่ไม่มี report ให้ dispatch เพิ่ม (ห้ามปล่อย route untested)
2. รวม report: route → actions tested → PASS/FAIL + evidence
3. dedupe failures ที่มี root cause เดียวกัน (เช่น shared component, API endpoint)
4. จัด severity: Critical (flow หลักพัง), High (action ไม่ทำงาน), Medium (behavior ผิดเล็กน้อย), Low (cosmetic)

### 5. Fix Failures

> Goal: แก้ทุก FAIL ที่ root cause

1. แก้ตามลำดับ Critical → Low — ใช้ evidence จาก agent (screenshot, console, repro steps)
2. failures จาก root cause เดียวกัน → แก้ครั้งเดียว ไม่ patch ทีละ route
3. ถ้า fix แตะหลายไฟล์ → `/resolve-errors` ตรวจ lint/typecheck หลังแก้
4. failures ที่เป็น environment/config → แยก report ไม่แก้ใน code

### 6. Retest

> Goal: ยืนยัน fixes ด้วยการ test ซ้ำ

1. `agent-browser reload` แล้ว replay เฉพาะ failed actions
2. FAIL กลายเป็น PASS ทั้งหมด → ไป Step 7; ยัง FAIL → loop Step 5 (สูงสุด 3 รอบ)

### 7. Codify Into Playwright

> Goal: exploratory pass ที่ผ่าน ถูก promote เป็น e2e suite จริง — suite results คือ authoritative

1. ถ้า PASS ครบ → ทำ `/update-tests` เขียน/อัปเดต Playwright specs จาก flows ที่เพิ่ง test
2. ทำ `/run-test` (e2e) รัน suite จริง — Playwright report คือ test result ของจริงสำหรับ `/update-docs`
3. ถ้า suite setup ไม่ได้ → skip แล้วระบุใน report ว่า results เป็น exploratory เท่านั้น

### 8. Report

> Goal: ส่งมอบผล test

1. ทำตาม `subskills/report-status/SKILL.md` — scenarios pass/fail, failure evidence, flaky signals
2. persist raw exploratory results → `.devin/reports/<workspace>/browser-test-<time>.md` ตาม format `/create-report-in-dot-devin` — ระบุชัดว่าเป็น exploratory (ไม่ใช่ suite result); authoritative e2e result = Playwright report จาก Step 7
3. ระบุ coverage gaps — actions ที่ยังไม่ได้ test (เช่น auth-gated, payment)
4. ปิด browser session ด้วย `agent-browser close`
5. ทำ `/suggest-next-action`

### Subskills

| Argument | Subskill |
|----------|----------|
| `report`, `status` | `subskills/report-status/SKILL.md` — test watch report (pass/fail, flaky, verdict) |

1. ถ้า argument เป็น `report`/`status` → อ่าน `subskills/report-status/SKILL.md` แล้วทำตาม flow — ใช้ session data ที่มีอยู่
2. ถ้าไม่ระบุ → ทำ Steps 1-8 ตามปกติ โดย Step 8 อ่าน subskill `report-status` มา execute

## Rules

### 1. Server Before Test

- ต้อง confirm server ผ่าน `/watch-browser` ก่อน dispatch — ห้ามข้าม
- route ที่ 404/error ตั้งแต่เปิด → FAIL ทันทีพร้อม screenshot evidence

### 2. Real Interactions Only

- agent ต้อง interact จริงผ่าน `agent-browser` (click, type, submit) — ห้าม "test" โดยอ่าน code
- screenshots/evidence save ไป OS temp dir (`$env:TEMP`/`os.tmpdir()`) — ห้าม commit เข้า repo
- ทุก FAIL ต้องมี repro steps + screenshot + console errors

### 3. Coverage Discipline

- test ทุก interactive element ที่พบใน snapshot — ไม่เลือกเฉพาะ happy path
- รวม negative cases: invalid form input, empty states, permission denied

### 4. Non-Destructive Testing

- ห้าม trigger destructive actions จริง (delete data, payments, emails) — mock หรือข้ามพร้อมบันทึกเป็น untested
- ใช้ test data/credentials เท่านั้น

### 5. Loop Limit

- fix-retest loop สูงสุด `3` รอบ — ถ้ายัง FAIL stop และ report
- `timeout` = `900` วินาทีต่อ batch, `maxRetries` = `3` ต่อ agent crash

## Expected Outcome

- ทุก route ถูก roleplay-test ครบ interactive elements พร้อม evidence
- report สรุป PASS/FAIL ต่อ action + fixes ที่ทำ + retest results
- raw exploratory results ถูก persist ใน `.devin/reports/<workspace>/` (ระบุ exploratory — ไม่ใช่ suite result)
- flows ที่ผ่านถูก codify เป็น Playwright specs และรันจริง — Playwright report เป็น authoritative e2e result
- failures ที่แก้แล้วถูก retest จนผ่าน หรือ report สิ่งที่ค้างชัดเจน
- coverage gaps และ untested areas ถูกระบุไว้

