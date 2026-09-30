---
name: review-github-issue
description: Review GitHub issue — metadata, clarity, completeness, readiness ก่อน implementation
argument-hint: "[issue-number-or-url]"
related:
  - deep-review
  - list-github-issue
  - create-github-issue
  - update-github-issue
  - cleanup-github-issue
  - resolve-github-issue-by-me
  - follow-github-issue-templates
  - implement-to-production
  - use-subagents
  - report
  - suggest-next-action

---

## Goal

Review GitHub issue ก่อน implement — ตรวจ metadata (title, labels, assignee, milestone, linked PRs) และ content quality (clarity, completeness, acceptance criteria, scope) แล้วให้ readiness verdict — report-only ไม่แก้ issue เว้นแต่ user confirm

## Scope

ใช้สำหรับ review GitHub issue รายการเดียวหรือหลายรายการ — issue อยู่บน GitHub repo (ใช้ `gh` CLI หรือ github-mcp tools) — ถ้าเป็น issue ทั่วไป (ไฟล์, chat, tracker อื่น) → ใช้ `/deep-review`

- quality dimensions (completeness, quality, rating) reuse checklists ของ `/deep-review` → `deep-review` — ห้าม duplicate checklists ใน skill นี้

## Execute

### 1. Fetch Issue Context

> Goal: ดึง issue พร้อม context ครบ

1. รับ issue number หรือ URL จาก argument — ไม่ระบุ → `/list-github-issue` ให้ user เลือก
2. ดึง issue ด้วย `gh issue view <n> --json title,body,state,labels,assignees,milestone,comments,projectItems` หรือ github-mcp `get_issue`
3. ดึง linked PRs/branches: `gh issue view <n> --json closedByPullRequestsReferences` (หรือ `gh issue develop --list`)
4. ถ้า repo มี issue templates → ทำ `/follow-github-issue-templates` เทียบ required fields

### 2. Review Issue Metadata

> Goal: metadata ถูกต้องและจัดการได้

1. title — สื่อ scope/type ชัดเจน (bug/feat/chore prefix ตาม conventions)
2. labels — มี type + area + priority ตาม repo conventions; missing → finding
3. assignee/milestone — assigned หรือ triaged หรือยัง
4. state — open/closed consistency (closed แต่ยังมี work → finding)
5. linked PRs — issue ที่มี PR แล้วตรวจว่า link ถูกต้อง

### 3. Review Content Quality

> Goal: issue ชัดพอให้ implement ได้ — ทำตาม checklists ของ `/deep-review`

1. dispatch `deep-review` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions` (`completeness`, `quality`, `rating`), `findings-file` = issue content จาก Step 1
2. ตรวจเพิ่มเติมเฉพาะ GitHub: reproduction steps/expected vs actual (bug), acceptance criteria checklist, linked context (discussions/PRs), screenshots/logs ที่ referenced ยังเข้าถึงได้
3. findings ≤ 2 → parent วิเคราะห์เอง ไม่ต้อง spawn

### 4. Rate Readiness

> Goal: readiness verdict ที่ actionable

1. classify: `ready` (implement ได้ทันที), `needs-clarification` (ระบุ missing fields), `blocked` (dependency/conflict), `not-ready` (scope ไม่ชัด)
2. scoring — ทำตาม `deep-review`
3. ระบุ missing info ที่ต้องถาม (ผ่าน comment บน issue เมื่อ user confirm)

### 5. Score And Report

> Goal: รายงานผลพร้อม next actions

1. ทำ `/report` — ตาราง `No.`, `Dimension`, `Severity`, `Finding`, `Evidence`, `Fix` + score/readiness verdict
2. ระบุ recommended actions: update issue (`/update-github-issue`), implement (`/resolve-github-issue-by-me` → `/implement-to-production`), หรือ cleanup (`/cleanup-github-issue`)
3. ทำ `/suggest-next-action`

## Rules

- Review เท่านั้น — ห้ามแก้ issue title/body/labels หรือ comment โดยไม่มี user confirm
- Focus เฉพาะ issue ที่ระบุ — ไม่ sweep ทั้ง tracker
- ทุก finding ต้องมี evidence: quote จาก body/comments หรือ field ที่ขาด
- issue ที่ already closed → review เฉพาะ closure quality (close reason, resolution reference)
- ใช้ /list-github-issue ถ้าจำเป็น
- ใช้ /follow-github-issue-templates ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น (generic issue นอก GitHub)

## Fix

> เมื่อ user confirm ให้แก้ findings บน issue จริง

1. แก้ metadata (title, labels, milestone) → ทำ `/update-github-issue`
2. เพิ่ม missing context → comment ผ่าน `gh issue comment` เมื่อ confirm แล้ว
3. issue พร้อมแล้ว → `/resolve-github-issue-by-me` หรือ `/implement-to-production`
4. issue ซ้ำ/ไม่ใช้แล้ว → `/cleanup-github-issue`

## Expected Outcome

- Issue metadata review: title, labels, assignee, milestone, linked PRs
- Content quality findings ตาม completeness/quality/rating dimensions พร้อม evidence
- Readiness verdict (`ready`/`needs-clarification`/`blocked`/`not-ready`) พร้อม missing info
- Recommended actions ถัดไปชัดเจน
