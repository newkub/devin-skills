---
name: review-github-pr-report-comments
description: สร้าง PR review comment set — inline comments พร้อม file/line + summary comment
argument-hint: "[pr-number]"
related:
  - report
  - open
  - merge
---

## Goal

แปลง findings ของ `/review-github-pr` เป็น review comments — inline comment format พร้อม file/line + suggestion ที่ paste หรือ submit ผ่าน GitHub ได้

## Scope

- ใช้เมื่อ `/review-github-pr` dispatch มาที่ `comments`/`report-comments` หรือเรียก standalone กับ findings ที่มีอยู่
- Output: comment set ในแชท (draft) — ห้าม submit ไป GitHub โดยไม่มี user confirm

## Execute

### 1. Format Inline Comments

> Goal: แต่ละ finding เป็น comment ที่ actionable

1. ต่อ finding: `file:line`, comment body — ปัญหา + เหตุผล + suggestion (code block เมื่อ fix สั้น)
2. tone: reviewer มืออาชีพ — ระบุปัญหาและทางแก้ ไม่ nitpick ที่ไม่มีผล
3. severity tag หัว comment: `[critical]`/`[suggestion]`/`[nit]` — nit แยกท้าย

### 2. Build Summary Comment

> Goal: overview ที่ author อ่านก่อน

1. verdict: approve / request-changes / comment-only พร้อมเหตุผล
2. findings summary table: `No.`, `File`, `Severity`, `Issue`
3. สิ่งที่ทำดี — acknowledge งานที่ถูกต้อง ไม่ใช่แค่ complaints

### 3. Order And Output

> Goal: comments เรียงตามความสำคัญ

1. Critical/High inline comments ก่อน → suggestions → nits
2. จำกัด nit comments — เกิน ~3 ให้รวมเป็น single style note
3. รายงาน draft ในแชท — submit เฉพาะเมื่อ user confirm (`/open` หรือ gh CLI ตามที่ user เลือก)

## Rules

- ทุก inline comment มี file path + line ที่ถูกต้องใน diff เท่านั้น — comment บน line ที่ไม่ได้แก้จะ attach ไม่ได้
- ไม่สร้าง findings ใหม่ — report นี้ format จาก findings ที่มีเท่านั้น
- ห้าม submit อัตโนมัติ — draft first, confirm ก่อน

## Expected Outcome

- Inline comment drafts พร้อม file/line + suggestion
- Summary comment พร้อม verdict — พร้อม submit หลัง confirm
