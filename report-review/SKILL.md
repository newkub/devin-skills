---
name: report-review
description: alias → /deep-review (รัน review-* ทุก domain แล้วรายงานใน .devin/reports)
argument-hint: "[path-or-target] [--diff] [--deep]"
related:
  - deep-review
  - run-review
---

## Goal

Alias ของ `/deep-review` — รัน `review-*` ทุก domain พร้อมรายงานรวมใน `.devin/reports/<workspace>/` (report only)

## Scope

ใช้เมื่อ user เรียก `/report-review` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `deep-review`; CLI run path อยู่ใน `/run-review`

## Execute

ทำ `/deep-review` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/deep-review` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `deep-review/SKILL.md` เสมอ
- Known Issues อยู่ใน `update-review-cli-then-run/references/known-issues.md` เท่านั้น (single source)

## Expected Outcome

- `/deep-review` ถูก execute ครบทุก step จนได้ report ครบทุก domain
