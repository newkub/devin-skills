---
name: review-github-pr
description: Review pull request ทั้งหมดก่อน merge โดยตรวจสอบ diff, commits, PR metadata, CI และ code changes
argument-hint: "[pr-number]"
related:
  - open
  - list-github
  - merge
  - resolve-errors
  - report
  - suggest-next-action
  - run-review

---

## Goal

Review pull request ทั้งหมดก่อน merge โดยตรวจสอบ diff, commits, PR metadata, CI และ code changes

## Scope

ใช้สำหรับ review pull request ก่อน merge — ทำงานบน PR จาก GitHub หรือ local branch diff — ไม่แก้ไข code โดยไม่ได้รับอนุญาต

- ถ้าต้อง deep review พร้อมตอบ comments, resolve conversations และถาม user ก่อน merge ดู `subagents/pr-checklist-reviewer/deep-pr-review.md`

## Execute

### 1. Fetch PR Context
> Goal: ดึง PR context
ทำตาม [subagents/pr-checklist-reviewer/fetch-pr-context.md](subagents/pr-checklist-reviewer/fetch-pr-context.md)

### 2. Review PR Metadata
> Goal: ตรวจ PR metadata
ทำตาม [subagents/pr-checklist-reviewer/pr-metadata.md](subagents/pr-checklist-reviewer/pr-metadata.md)

### 3. Review Code Changes
> Goal: ตรวจ code changes
ทำตาม [subagents/pr-checklist-reviewer/code-changes.md](subagents/pr-checklist-reviewer/code-changes.md)

### 4. Validate Findings
> Goal: ยืนยัน findings
ทำตาม [subagents/pr-checklist-reviewer/validate-findings.md](subagents/pr-checklist-reviewer/validate-findings.md)

### 5. Governance

> Goal: PR governance ถูกบังคับ — ทำตาม `subagents/pr-checklist-reviewer/governance.md`

1. CODEOWNERS enforcement — required reviewers ถูกต้อง
2. PR size limits — oversized PRs flagged
3. branch protection — required checks ผ่าน, reviews ครบตาม policy
4. draft/WIP state — ไม่ merge PR ที่ยัง draft หรือมี unresolved comments

### 6. Score And Report
> Goal: รายงาน score และสรุปผล
คำนวณ score/grade ตาม [subagents/pr-checklist-reviewer/scoring.md](subagents/pr-checklist-reviewer/scoring.md) แล้วทำ `/report` และ `/suggest-next-action` (github pr)

### 7. Report And Recommend
> Goal: รายงานและแนะนำ
ทำตาม [subagents/pr-checklist-reviewer/report-and-recommend.md](subagents/pr-checklist-reviewer/report-and-recommend.md)

### Subagents

> Goal: parallelize review เมื่อ PR ใหญ่

- ใช้ `subagents/pr-reviewer.md` เมื่อ PR ใหญ่และแบ่งเป็น slices ที่ independent กันได้ (per-domain เช่น security/tests/api หรือ per-file-group) — spawn ผ่าน `/use-subagents` แล้ว merge findings ทุก slice ก่อน score/report

### Subskills

> Goal: dispatch report formatting ไปยัง subskill เมื่อต้องการ review comments พร้อม submit

| Topic | Subskill |
|-------|----------|
| `comments`, `report-comments` — inline comment drafts + summary verdict | `subskills/report-comments/SKILL.md` |

## Rules

- Review เท่านั้น ไม่แก้ source โดยไม่ได้รับอนุญาต
- Focus บน changed files ไม่ต้อง review ทั้ง codebase
- ถ้า PR ใหญ่ → แนะนำ split ก่อน review ละเอียด
- Title และ commits ต้องตาม conventional commits
- ทุก finding ต้องมี file path, line number หรือ commit reference
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis (github pr)

- ใช้ /open-github ถ้าจำเป็น
- ใช้ /list-github-pr ถ้าจำเป็น
- ใช้ /merge-github-pr ถ้าจำเป็น
- ใช้ /resolve-github-actions-fails ถ้าจำเป็น

- ถ้า pass → ทำ `/merge-github-pr` ถ้า fail → แจ้ง author แก้ตาม findings

- ใช้ /review-code-quality ถ้าจำเป็น
- ใช้ /review-test ถ้าจำเป็น
- ใช้ /review-security ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

## References

- [Full-dimension checklist](subagents/pr-checklist-reviewer/checklist.md)
- [Fetch PR context](subagents/pr-checklist-reviewer/fetch-pr-context.md)
- [PR metadata](subagents/pr-checklist-reviewer/pr-metadata.md)
- [Code changes](subagents/pr-checklist-reviewer/code-changes.md)
- [Governance](subagents/pr-checklist-reviewer/governance.md)
- [Deep PR review](subagents/pr-checklist-reviewer/deep-pr-review.md)
- [Scoring](subagents/pr-checklist-reviewer/scoring.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## Expected Outcome

- PR metadata review: title, description, size, commits, conflicts
- Findings จาก code, security, test, delivery, domain reviews
- Merge readiness verdict พร้อมเหตุผล
- Recommended actions ถัดไป
