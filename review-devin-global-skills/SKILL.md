---
name: review-devin-global-skills
description: Review global Devin skill packages for structure, references, and content
allowed-tools:
  - read
  - edit
  - find_file_by_name
  - grep
  - exec
  - skill
  - ask_user_question
triggers:
  - user
  - model
related:
  - follow-devin-skills-md
  - follow-write-devin-skills
  - review-issue
  - check-circular-dependencies
  - validate
  - report
  - suggest-next-action
---

## Goal

Review all `SKILL.md` packages under the global Devin skills repository for structural, reference, and content issues, then deliver actionable findings or create review issues.

## Scope

All skill directories under the target skills root. Covers frontmatter, section order, file length, directory naming, `related` references, duplicate names, placeholder content, and overall clarity. Does not modify skills unless explicitly asked.

## Execute

### 1. Discover Skills
> Goal: Build the inventory of skill packages to review

1. run `find_file_by_name **/SKILL.md` in the target skills directory
2. record `name`, `description`, `related`, and `source` of each `SKILL.md`
3. flag duplicate `name` values or mismatched directory names

### 2. Validate Structure
> Goal: Find structural and frontmatter violations

1. ทำตาม `validate` เพื่อตรวจ frontmatter `name`, `description`, `allowed-tools`, `related`
2. run `exec` to count lines with `grep -c . <path>` or `wc -l <path>` and flag files over 250 lines
3. run `grep` to verify required sections: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
4. run `grep` to detect `TODO`, `MOCK`, `STUB`, `FAKE`, `PLACEHOLDER`, or `FIXME`
5. collect findings with format `file:line: message`

### 3. Check References
> Goal: Detect missing or circular skill references

1. ทำตาม `check-circular-dependencies`
2. for each `related` skill, run `find_file_by_name <skill-name>/SKILL.md` to confirm it exists
3. flag `related` entries that are not used in the prompt body
4. record any `related` skill with mismatched `name` in its frontmatter

### 4. Review Content
> Goal: Catch quality gaps that require human judgment

1. ทำตาม `follow-devin-skills-md` เพื่อเปรียบเทียบ structure กับ spec
2. ทำตาม `follow-write-devin-skills` เพื่อตรวจ package structure
3. read a representative sample or every `SKILL.md`
4. identify unclear `## Execute` steps, vague `description`, duplicates, or inconsistent terminology
5. flag `improve-*` or `optimize-*` skills that should be merged or removed

### 5. Report Findings
> Goal: Deliver actionable review results

1. group findings by severity: Critical, High, Medium, Low
2. ทำตาม `report` เพื่อสรุป findings เป็นตาราง
3. include `file:line: message` for every finding
4. ทำตาม `review-issue` เพื่อสร้าง issue สำหรับ high-risk หรือ judgment-based findings
5. ทำตาม `suggest-next-action` เพื่อแนะนำ step ถัดไป

## Rules

### 1. Review Focus
- ตรวจ structure, frontmatter, references, content clarity
- ไม่แก้ source โดยไม่ได้รับอนุญาตจาก user
- เก็บ `SKILL.md` ไม่เกิน 250 บรรทัด

### 2. Deterministic Output
- รัน check ซ้ำด้วย input เดิมต้องได้ output เดิม
- เก็บ findings ด้วย format `file:line: message`

### 3. Safety
- ถ้าจะลบหรือแก้ไฟล์ skill → ถาม user ก่อน
- ไม่เปลี่ยน `improve-*` หรือ `optimize-*` skills โดยไม่มีคำสั่งเฉพาะ

## Expected Outcome

- รายงาน findings แบ่งตาม severity
- ระบุ `file:line` ทีละ issue
- สร้าง `review-issue` สำหรับ findings ทีต้องตัดสินใจโดยคน
- คำแนะนำถัดไปผ่าน `suggest-next-action`
