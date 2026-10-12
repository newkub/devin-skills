---
name: ship-run
description: Verify ก่อนรัน — /ship-verify ผ่านครบแล้ว /run-dev เปิด dev server ค้างไว้ใช้งานจริง
argument-hint: "[scope] [dont-ask-me]"
triggers:
  - user
  - model
related:
  - ship-verify
  - run-dev
  - ship-to-dev-branch
  - test-usage
  - watch-browser-and-fix
  - resolve-errors
  - report
  - suggest-next-action
  - dont-ask-me
---

## Goal

Ship-quality run ในสองขั้น — `/ship-verify` เป็น gate ก่อนเสมอ ผ่านครบแล้วค่อย `/run-dev` เปิด dev server ค้างไว้ให้ใช้งานจริงพร้อม watch ต่อเนื่อง

## Scope

- ใช้เมื่อต้องการ verify งานก่อนแล้วรัน dev server ทิ้งไว้ใช้งานต่อในคำสั่งเดียว — ต่างจาก `/ship-verify` ที่ `/run-dev` เป็นแค่ health-check gate แล้วจบ (skill นี้ server ค้างไว้ + watch ยาว)
- **ไม่ push ไม่ ship** — verify + run เท่านั้น; ship เข้า `dev` ทำผ่าน `/ship-to-dev-branch`
- Verify workflow ทั้งหมดอยู่ใน `/ship-verify` (canonical) และ run workflow อยู่ใน `/run-dev` (canonical) — skill นี้ไม่ duplicate
- argument `dont-ask-me` หรือ session ที่ `/dont-ask-me` active → ส่งต่อ mode เดิมให้ทุก step

## Execute

### 1. Ship Verify

> Goal: งานผ่าน verification gate ครบทุก gate ก่อนรัน

1. ทำ `/ship-verify` พร้อม arguments เดิมทั้งหมด — verify ทุก gate (AGENTS.md, review, validate, tests, dev run health check, usage)
2. ถ้า `/ship-verify` ไม่ผ่าน → แก้ blockers แล้ว verify ใหม่ — ห้ามข้ามไป run

### 2. Run Dev

> Goal: dev server รันค้างไว้พร้อมใช้งานจริงและถูก watch

1. ทำ `/run-dev` พร้อม scope เดิม — dev server ต้อง healthy และค้างไว้ ไม่หยุดหลัง health check
2. web project → browser เปิดที่ dev URL และ `/watch-browser-and-fix` ต่อเนื่องตาม `/run-dev` workflow
3. พบ errors ระหว่าง watch → `/resolve-errors` ทันทีตาม `/run-dev` rules

### 3. Report

> Goal: สรุปผล verify + run status

1. ทำ `/report` — table: `No. | Gate | Result | Evidence` + dev server status (URL, port, watch state)
2. ผ่านครบ → แนะนำ `/ship-to-dev-branch` เป็น next action เมื่อพร้อม push
3. ทำ `/suggest-next-action`

## Rules

- `/ship-verify` ต้องผ่านก่อนเสมอ — ห้ามรัน dev server บนงานที่ verify ไม่ผ่าน
- ห้าม duplicate verify/run workflow ที่นี่ — canonical อยู่ใน `/ship-verify` และ `/run-dev` เท่านั้น
- ห้าม `git commit`, `git push`, merge หรือ release ใน skill นี้ — ship ทำผ่าน `/ship-to-dev-branch`
- project ไม่มี dev server → run `/ship-verify` อย่างเดียวแล้ว report พร้อมเหตุผล — `/ship-run` ไม่ apply

## Expected Outcome

- `/ship-verify` ผ่านครบทุก gate
- dev server รันค้างไว้ healthy ไม่มี critical errors พร้อม watch terminal/browser ต่อเนื่อง
- report ชัดเจนว่า ready-to-use พร้อม dev URL และ next action
