---
name: review-cli-report-ux
description: สร้าง CLI UX report — command surface table + UX findings พร้อม fix direction
argument-hint: "[cli-or-command]"
related:
  - review-cli
  - report
  - create-report-in-dot-devin
---

## Goal

แปลง CLI findings ของ `/review-cli` เป็น UX report — command surface + issues ที่ใช้กับ users โดยตรง

## Scope

- ใช้เมื่อ `/review-cli` dispatch มาที่ `ux`/`report` หรือเรียก standalone
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Command Surface

> Goal: inventory คำสั่งทั้งหมดพร้อม UX posture

1. list commands/subcommands/flags — inventory จาก entrypoint
2. ตาราง: `No.`, `Command`, `Has Help`, `Errors Clear`, `Exit Codes`, `Output Mode`, `Severity`
3. flag commands ที่ขาด `--help`, ขาด `--json`/machine output, error messages cryptic

### 2. UX Findings

> Goal: issues ที่ทำ CLI ใช้ยาก

1. discoverability — no-args → help?, naming consistent, examples ใน help
2. errors — messages บอก cause + next action, exit codes meaningful, stderr vs stdout แยก
3. UX signals — TTY-only spinners/colors, destructive ops มี confirm+dry-run, progress on long ops

### 3. Summarize

> Goal: priorities + verdict

1. counts per UX category + top offenders
2. verdict: polished / usable / rough / hostile
3. fix route → `../improve-cli-ux/SKILL.md` หรือ parent `## Fix`

## Rules

- ทุก finding มี evidence — command + flag, actual output, หรือ help text
- run commands จริงเพื่อ verify (TTY + non-TTY) — ห้ามเดาจาก code อย่างเดียว
- verdict ต้อง conservative — broken `--help` บน main command = rough

## Expected Outcome

- Command surface table พร้อม per-command UX posture
- UX findings grouped: discoverability/errors/feedback
