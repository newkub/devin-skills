---
name: edit-by-astgrep
description: alias → /use-astgrep rewrite (batch refactor หลายไฟล์ด้วย ast-grep — dry-run + confirm ก่อนเขียนทับเสมอ)
argument-hint: "<pattern> <replacement> [path|glob]"
related:
  - use-astgrep
---

## Goal

Alias ของ `/use-astgrep rewrite` — batch refactor หลายไฟล์ด้วย ast-grep AST patterns, preview matches + diff ก่อน, confirm แล้วค่อย `--rewrite`, verify หลัง apply

## Scope

ใช้เมื่อ user เรียก `/edit-by-astgrep` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `use-astgrep/workflows/rewrite/` (pattern catalog: `use-astgrep/workflows/rewrite/references/patterns.md`, transform/rewriters: `use-astgrep/workflows/transform/`)

## Execute

ทำ `/use-astgrep rewrite` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/use-astgrep rewrite` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `use-astgrep/workflows/rewrite/SKILL.md` เสมอ

## Expected Outcome

- `/use-astgrep rewrite` ถูก execute ครบทุก step — matches + diff preview ก่อนเขียนทับเสมอ, verify ผ่าน
