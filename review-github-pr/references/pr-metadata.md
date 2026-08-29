---
title: PR Metadata Checks
description: ตรวจ PR title, description, size, commits, conflicts, และ draft status
related:
  - review-github-pr
---

## Goal

ตรวจสอบ metadata ของ pull request ก่อน review code changes

## Checks

1. ตรวจ title ตาม conventional commit format (`<type>: <subject>`)
2. ตรวจ description มี context, linked issue, และ changes summary
3. ตรวจ base branch ถูกต้อง
4. ตรวจขนาด PR: small (<10 files), medium (<30 files), large (>30 files) — แนะนำ split ถ้าใหญ่
5. ตรวจ merge conflicts, draft status, required reviews
6. ตรวจ commits messages ตาม conventional commits และไม่มี WIP หรือ fixup commits

## Severity

- Critical: base branch ผิด, PR เป็น draft แต่ต้อง merge, merge conflicts
- High: title ไม่ตาม conventional commit, missing description, large PR ที่ไม่ split
- Medium: missing linked issue, WIP commits
- Low: minor commit message issue, missing labels
