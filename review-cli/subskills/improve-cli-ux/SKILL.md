---
name: review-cli-improve-cli-ux
description: Apply CLI UX findings — help, errors, exit codes, output modes, confirmations
argument-hint: "[cli-or-findings]"
related:
  - review-cli
  - run-test
  - report-before-after
  - resolve-errors
---

## Goal

แก้ UX findings จาก `/review-cli` จริง — CLI ใช้ง่าย errors ชัด และปลอดภัยสำหรับ scripting

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้
- ครอบคลุม: help text, error messages, exit codes, output modes (`--json`, quiet), destructive confirmations — behavior changes อยู่ใน scope เพราะ UX คือ contract

## Execute

### 1. Baseline

> Goal: รู้ UX state จริงก่อนแก้

1. run every command/flag จริง — capture help output, errors, exit codes
2. list findings จาก `../report-ux/SKILL.md` หรือ review report
3. TTY vs non-TTY differences — colors/spinners off ใน non-TTY

### 2. Fix Help And Errors

> Goal: discoverable + actionable errors

1. help — ครบทุก command, examples, flag descriptions; no-args → help not crash
2. errors — cause + fix + exit code ตาม convention; stderr สำหรับ errors, stdout สำหรับ data
3. consistent verbs/naming — command patterns เหมือนกัน

### 3. Fix Output + Safety

> Goal: scriptable + safe

1. `--json`/structured output mode บน data commands, `--quiet`/`--verbose` levels
2. destructive ops — confirm prompt + `--force`/`--yes` + `--dry-run` เมื่อเหมาะ
3. progress indicators — long ops มี feedback, ปิดใน non-TTY

### 4. Verify

> Goal: UX behavior พิสูจน์ได้

1. run test matrix: each command × TTY/non-TTY × help/error/success paths
2. exit codes correct, stderr clean
3. `/run-test` ผ่าน + `/report-before-after` — UX score เทียบก่อน

## Rules

- UX เป็น contract — breaking flag/behavior changes ต้อง document + version
- preserve functionality — UX fixes ไม่เปลี่ยน semantics
- exit codes ต้อง deterministic — non-zero เฉพาะ failure จริง
- แยก commit: help/errors → output modes → safety prompts

## Expected Outcome

- Help/errors consistent พร้อม examples + clear next-actions
- Scriptable output + safe destructive flows verified
