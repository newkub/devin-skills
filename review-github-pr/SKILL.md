---
name: review-github-pr
description: Review pull request ทั้งหมดก่อน merge โดยตรวจสอบ diff, commits, PR metadata, CI และ code changes
argument-hint: "[pr-number]"
related:
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

- ถ้าต้อง deep review พร้อมตอบ comments, resolve conversations และถาม user ก่อน merge ดู `references/deep-pr-review.md`

## Execute

### 1. Fetch PR Context
> Goal: ดึง PR context
ทำตาม [references/fetch-pr-context.md](references/fetch-pr-context.md)

### 2. Review PR Metadata
> Goal: ตรวจ PR metadata
ทำตาม [references/pr-metadata.md](references/pr-metadata.md)

### 3. Review Code Changes
> Goal: ตรวจ code changes
ทำตาม [references/code-changes.md](references/code-changes.md)

### 4. Validate Findings
> Goal: ยืนยัน findings
ทำตาม [references/validate-findings.md](references/validate-findings.md)

### 5. Governance

> Goal: PR governance ถูกบังคับ — ทำตาม `references/governance.md`

1. CODEOWNERS enforcement — required reviewers ถูกต้อง
2. PR size limits — oversized PRs flagged
3. branch protection — required checks ผ่าน, reviews ครบตาม policy
4. draft/WIP state — ไม่ merge PR ที่ยัง draft หรือมี unresolved comments

### 6. Check Gate (Blocking)

> Goal: ทุก gate ผ่านก่อน approve/recommend merge — ห้ามข้าม

1. CI checks ผ่านทั้งหมด: `gh pr checks <n>` — ห้ามมี `fail`/`pending` เหลือ; pending → `gh pr checks <n> --watch` หรือ `/resolve-cicd` จนเขียว
2. ทำ `/deep-validate` บน merge result (frontmatter, types, contract) — fail → ห้าม recommend merge
3. ทำ `/deep-review` ตาม scope ของ PR (domain ที่ diff แตะ) — blocker findings → fix ก่อน ห้าม merge
4. เฉพาะเมื่อ 3 ข้อผ่านครบ → verdict `ready-to-merge`; ไม่งั้น `blocked` พร้อมระบุ gate ที่ค้าง

### 7. Score And Report
> Goal: รายงาน score และสรุปผล
คำนวณ score/grade ตาม [references/scoring.md](references/scoring.md) แล้วทำ `/report` และ `/suggest-next-action` (github pr)

### 8. Report And Recommend
> Goal: รายงานและแนะนำ
ทำตาม [references/report-and-recommend.md](references/report-and-recommend.md)

### Workflows

> Goal: dispatch report formatting ไปยัง workflow เมื่อต้องการ review comments พร้อม submit

| Topic | Workflow |
|-------|----------|
| `comments`, `report-comments` — inline comment drafts + summary verdict | `workflows/report-comments/SKILL.md` |

## Subagents

> Goal: งาน review ที่ spawn ทำขนานได้ — profile สั้นอยู่ใน section นี้ รายละเอียดเต็มอยู่ใน links; spawn ผ่าน `/use-subagents` ด้วย profile ข้างล่างนี้ (แทนการอ่าน profile เป็นไฟล์แยกแบบเดิม)

### pr-reviewer — review PR slice เดียว (per-domain/per-file-group) แล้วคืน findings พร้อม severity

- **Inputs**: `pr-diff-scope` (file list หรือ diff range ที่รับผิดชอบ เช่น `src/api/**`, commits `a..b`, หรือ domain เช่น `security`); `conventions` (project conventions เช่น `AGENTS.md`, style guide, PR checklist); `pr-context` (optional: PR number, base/head branch, title, description)
- **Tools**: model `sonnet` — `read`, `grep`, `find_file_by_name`; `exec` เฉพาะ read-only (`gh pr diff`, `gh pr view`, `git diff`, `git log`); ห้าม `edit`/`write` บน source (เป็น read-only reviewer)
- **Execute**:
  - อ่าน diff เฉพาะ scope (`gh pr diff <pr>` หรือ `git diff`) — ไม่อ่าน files นอก scope
  - อ่าน surrounding code ของแต่ละ hunk เพื่อเข้าใจ context ก่อนตัดสิน
  - ตรวจตาม domain checklist ที่ได้รับ เช่น security → injection/auth/secrets, tests → coverage/assertions
  - จัด severity ให้ทุก finding ด้วย evidence จริงจาก diff ห้ามเดา
  - สรุป verdict ของ slice: `approve` / `comment` / `request-changes`
- **Output**: ตาราง findings `| No. | File | Line | Severity | Finding | Recommendation |`; `severity` = `critical`/`high`/`medium`/`low`/`info`; ปิดท้ายด้วย slice verdict และจำนวน findings ต่อ severity; ถ้าไม่มี findings → คืน `approve` พร้อมเหตุผลสั้น
- **Constraints**: review เท่านั้น ห้ามแก้ source หรือ push commits; focus เฉพาะ scope ที่ได้รับ ห้าม review ทั้ง PR หรือ files นอก slice; ทุก finding ต้องมี `file path` + `line` หรือ `commit reference`; ไม่ duplicate findings ที่อยู่นอก scope (slice อื่นมี agent ของตัวเอง); ถ้า diff ใน scope ไม่มี changes → คืน `approve` ทันทีพร้อมระบุว่า scope ว่าง
- **Full detail**: `references/subagent-pr-reviewer.md`

### pr-checklist-reviewer — ตรวจ PR ตาม dimensions โดยใช้ checklist ใน `references/` เป็น criteria (report-only)

- **Inputs**: `scope` (path/directory เป้าหมาย review); `dimensions` (optional: subset ของ checklist dimensions — default ทั้งหมด); `findings-file` (optional: baseline output เพื่อ cross-check)
- **Tools**: model `sonnet` — `read`, `exec`, `grep`, `glob`, `find_file_by_name`; ห้าม `edit`/`write` (read-only reviewer)
- **Execute**:
  - อ่าน checklist file ของแต่ละ `dimensions` แล้วตรวจจริง (read/grep/glob) — ทุก finding ต้องมี `file:line` + evidence
  - Classify severity: `Critical` / `High` / `Medium` / `Low` / `Info`
  - False positive → ทิ้ง; นอก scope → `info` เท่านั้น
  - dimension → file: `checklist`→`references/checklist.md`, `code-changes`→`references/code-changes.md`, `deep-pr-review`→`references/deep-pr-review.md`, `fetch-pr-context`→`references/fetch-pr-context.md`, `governance`→`references/governance.md`, `pr-metadata`→`references/pr-metadata.md`, `report-and-recommend`→`references/report-and-recommend.md`, `scoring`→`references/scoring.md`, `validate-findings`→`references/validate-findings.md`, `website`→`references/website.md`
- **Output**: ตาราง `| No. | Dimension | Severity | File | Finding | Suggestion |`; เรียง `Critical`→`Info`; ปิดท้ายด้วย score ต่อ dimension + overall; รายงานทั้ง strengths และ weaknesses
- **Constraints**: read-only — ห้ามแก้ไขไฟล์ใดๆ (fix เป็นหน้าที่ของ `## Fix` ใน parent); ห้ามเดา — ไม่มี evidence ไม่มี finding; รับผิดชอบเฉพาะ `dimensions` ที่ได้รับ ไม่ข้ามไปมิติอื่น
- **Full detail**: checklist files ตาม dimension map ในข้อ Execute ข้างบน (`references/*.md`)

## Rules

- Review เท่านั้น ไม่แก้ source โดยไม่ได้รับอนุญาต
- ห้าม verdict `ready-to-merge` ถ้า Step 6 (Check Gate) ไม่ผ่านครบ — CI + `/deep-validate` + `/deep-review` เป็น blocking gates
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

- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น

## Fix

> ทำตาม `deep-review/SKILL.md` เมื่อ user confirm ให้แก้ findings

## References

- [Full-dimension checklist](references/checklist.md)
- [Fetch PR context](references/fetch-pr-context.md)
- [PR metadata](references/pr-metadata.md)
- [Code changes](references/code-changes.md)
- [Governance](references/governance.md)
- [Deep PR review](references/deep-pr-review.md)
- [Validate findings](references/validate-findings.md)
- [Scoring](references/scoring.md)
- [Report and recommend](references/report-and-recommend.md)
- [Official resources](references/website.md)
- [pr-reviewer profile (full original)](references/subagent-pr-reviewer.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## Expected Outcome

- PR metadata review: title, description, size, commits, conflicts
- Findings จาก code, security, test, delivery, domain reviews
- Merge readiness verdict พร้อมเหตุผล
- Recommended actions ถัดไป
