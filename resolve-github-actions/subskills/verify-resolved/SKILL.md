---
name: resolve-github-actions-verify-resolved
description: ยืนยัน GitHub Actions runs กลับมา success หลัง resolve — watch run ใหม่จนจบ
argument-hint: "[--repo <owner/repo> | --run-id <id>]"
related:
  - use-gh-cli
  - report
---

## Goal

ยืนยันหลัง `/resolve-github-actions` ว่า workflow runs กลับมา success จริงบน GitHub

## Scope

- ใช้เมื่อ parent dispatch มาที่ `verify` หรือเรียกหลัง resolve workflow failures
- Read-only: watch/ตรวจสอบ — ไม่แก้ไข

## Execute

### 1. Watch Latest Run

> Goal: ได้ผล run ที่มี fix

1. `gh run list --limit 5` — หา run ล่าสุดที่มี fix commit
2. `gh run watch <run-id> --exit-status` — รอจนจบพร้อม exit code
3. ถ้าไม่มี run ใหม่ → `gh run rerun <run-id>` หรือ `gh workflow run` ตาม trigger

### 2. Verify Success

> Goal: run ผ่านทั้ง workflow

1. `gh run view <run-id>` — conclusion = `success` ทุก job
2. flag jobs ที่ fail ใหม่หรือ skipped unexpectedly
3. เทียบ failure เดิมกับผลใหม่ — root cause เดิมต้องไม่กลับมา

### 3. Report

> Goal: สรุปผล

1. ใช้ `/report` คอลัมน์: `No.`, `Run/Job`, `Result`, `Evidence`
2. Verdict: `resolved` / `not-resolved` พร้อม run URL

## Rules

- verdict จาก `--exit-status` หรือ run conclusion จริงเท่านั้น
- ถ้า fail → report กลับให้ parent loop — ไม่แก้เอง
- ระบุ run URL เสมอ

## Expected Outcome

- Verdict จาก run จริงพร้อม URL
- รายการ jobs ที่ยัง fail ถ้ามี
