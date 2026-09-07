---
name: review-github-pr
description: Review pull request ทั้งหมดก่อน merge โดยตรวจสอบ diff, commits, PR metadata, CI และ code changes
argument-hint: "[pr-number]"
related:
  - open-github
  - list-github-pr
  - merge-github-pr
  - resolve-github-actions-fails
  - report
  - suggest-next-action
---

## Goal

Review pull request ทั้งหมดก่อน merge โดยตรวจสอบ diff, commits, PR metadata, CI และ code changes

## Scope

ใช้สำหรับ review pull request ก่อน merge — ทำงานบน PR จาก GitHub หรือ local branch diff — ไม่แก้ไข code โดยไม่ได้รับอนุญาต

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: deep-review-pr) — ถ้าต้อง deep review พร้อมตอบ comments, resolve conversations และถาม user ก่อน merge ดู `references/deep-pr-review.md`

## Execute

### 1. Fetch PR Context
> Goal: Fetch PR Context
ทำตาม [references/fetch-pr-context.md](references/fetch-pr-context.md)

### 2. Review PR Metadata
> Goal: review PR Metadata
ทำตาม [references/pr-metadata.md](references/pr-metadata.md)

### 3. Review Code Changes
> Goal: review Code Changes
ทำตาม [references/code-changes.md](references/code-changes.md)

### 4. Validate Findings
> Goal: ยื่นยัน Findings
ทำตาม [references/validate-findings.md](references/validate-findings.md)

### 5. Report And Recommend
> Goal: รายงาน And Recommend
ทำตาม [references/report-and-recommend.md](references/report-and-recommend.md)

### 6. Score And Report
> Goal: รายงาน Score And Report
คำนวณ score/grade ตาม [references/scoring.md](references/scoring.md) แล้วทำ `/report` และ `/suggest-next-action`

## Rules

- Review เท่านั้น ไม่แก้ source โดยไม่ได้รับอนุญาต
- Focus บน changed files ไม่ต้อง review ทั้ง codebase
- ถ้า PR ใหญ่ → แนะนำ split ก่อน review ละเอียด
- Title และ commits ต้องตาม conventional commits
- ทุก finding ต้องมี file path, line number หรือ commit reference
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis

- ใช้ /open-github ถ้าจำเป็น
- ใช้ /list-github-pr ถ้าจำเป็น
- ใช้ /merge-github-pr ถ้าจำเป็น
- ใช้ /resolve-github-actions-fails ถ้าจำเป็น

- ถ้า pass → ทำ `/merge-github-pr` ถ้า fail → แจ้ง author แก้ตาม findings

## Expected Outcome

- PR metadata review: title, description, size, commits, conflicts
- Findings จาก code, security, test, delivery, domain reviews
- Merge readiness verdict พร้อมเหตุผล
- Recommended actions ถัดไป

