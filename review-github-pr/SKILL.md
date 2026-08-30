---
name: review-github-pr
description: Review pull request ทั้งหมดก่อน merge โดยตรวจสอบ diff, commits, PR metadata, CI และ code changes
argument-hint: "[pr-number]"
related:
  - open-github-pr
  - list-github-pr
  - merge-github-pr
  - list-github-action-fail
  - report-table
  - suggest-next-action
---

## Goal

Review pull request ทั้งหมดก่อน merge โดยตรวจสอบ diff, commits, PR metadata, CI และ code changes

## Scope

ใช้สำหรับ review pull request ก่อน merge — ทำงานบน PR จาก GitHub หรือ local branch diff — ไม่แก้ไข code โดยไม่ได้รับอนุญาต

## Execute

### 1. Fetch PR Context
ทำตาม [references/fetch-pr-context.md](references/fetch-pr-context.md)

### 2. Review PR Metadata
ทำตาม [references/pr-metadata.md](references/pr-metadata.md)

### 3. Review Code Changes
ทำตาม [references/code-changes.md](references/code-changes.md)

### 4. Validate Findings
ทำตาม [references/validate-findings.md](references/validate-findings.md)

### 5. Report And Recommend
ทำตาม [references/report-and-recommend.md](references/report-and-recommend.md)

### 6. Score And Report
คำนวณ score/grade ตาม [references/scoring.md](references/scoring.md) แล้วทำ `/report-table` และ `/suggest-next-action`

## Rules

- Review เท่านั้น ไม่แก้ source โดยไม่ได้รับอนุญาต
- Focus บน changed files ไม่ต้อง review ทั้ง codebase
- ถ้า PR ใหญ่ → แนะนำ split ก่อน review ละเอียด
- Title และ commits ต้องตาม conventional commits
- ทุก finding ต้องมี file path, line number หรือ commit reference
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis

## Expected Outcome

- PR metadata review: title, description, size, commits, conflicts
- Findings จาก code, security, test, delivery, domain reviews
- Merge readiness verdict พร้อมเหตุผล
- Recommended actions ถัดไป
