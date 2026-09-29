---
name: review-diff
description: รีวิว git diff ก่อนตัดสินใจ keep, revert หรือดำเนินการต่อ
argument-hint: "[scope]"
related:
  - report-git-diff
  - report
  - deep-validate
  - ask-me
  - ship
  - follow-enter-dot
  - run-review
  - check-git-logs
  - deep-debug
  - search-in-git
  - delete
  - resolve-errors
  - suggest-next-action
  - use-subagents
---

## Goal

รีวิว git diff อย่างรวดเร็ว สรุปสิ่งที่เปลี่ยนแปลง ตรวจหาปัญหาทีอาจเกิด และถาม user ก่อนตัดสินใจ keep, revert หรือดำเนินการต่อ — domain checklist อยู่ใน `subagents/diff-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

ใช้ก่อน `git-commit`, `/ship`, `/follow-enter-dot` หรือทุกครั้งที่ working tree มีการเปลี่ยนแปลงจำนวนมากและต้องการ user confirmation ก่อนลงมือ

| Dimension | Checklist |
|-----------|-----------|
| `summary`/`risks` — capture state, summarize, risks | `subagents/diff-reviewer/diff-review-checklist.md` |
| `quality` — secrets, junk, leftovers, noise | `subagents/diff-reviewer/diff-quality.md` |
| `scoring` — score/grade | `subagents/diff-reviewer/scoring.md` |

## Execute

### 1. Capture Diff State
> Goal: อ่าน diff state ปัจจุบัน — baseline สำหรับ subagent
ทำตาม [subagents/diff-reviewer/diff-review-checklist.md](subagents/diff-reviewer/diff-review-checklist.md) — ระบุ refs/paths (`HEAD`, `HEAD~1`, `staged`, `unstaged` — ไม่ระบุ → `HEAD` กับ `HEAD~1`; ไม่ชัด → `/ask-me`)

### 2. Dispatch Diff-Reviewer
> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. Spawn `subagents/diff-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions` (`summary`, `risks`, `quality` — default ทั้งหมด), `findings-file` (diff state จาก step 1)
2. subagent สรุป changes, ตรวจ risks และ diff quality ตาม checklist — secrets/credentials, debug leftovers, accidental files, formatting noise, scope creep

### 3. Aggregate And Score
> Goal: รวม findings พร้อม severity + score

1. รวม findings — dedup ตาม file:hunk + issue type; สรุปให้พอตัดสินใจ ไม่ dump diff ทั้งหมด
2. คำนวณ score/grade ตาม [subagents/diff-reviewer/scoring.md](subagents/diff-reviewer/scoring.md)
3. ถ้า diff มีการลบ/ย้าย/overwrite ต้อง flag และถาม user ก่อนเสมอ

### 4. Present Options And Report
> Goal: เสนอตัวเลือกและดำเนินการตาม decision ของ user

1. เสนอตัวเลือกถัดไป (keep / revert / fix-then-continue) — ตัวเลือกต้องชัดเจนให้ user เลือกได้
2. ดำเนินการตาม decision ของ user — ไม่ commit หรือ ship ถ้ายังไม่ได้ user confirmation
3. ทำ `/report` และ `/suggest-next-action` (diff)

### Subagents

> Goal: dispatch domain review ไปยัง subagent

| Topic | Subagent |
|-------|----------|
| diff dimensions — summary, risks, quality พร้อม severity | `subagents/diff-reviewer/AGENT.md` |

## Check: Git Diff

### Goal

ตรวจสอบความแตกต่างระหว่าง git refs, branches, หรือ working tree ด้วย `git diff` และสรุปผล

### Scope

ใช้เมื่อต้องเปรียบเทียบ code ใน git history หรือระหว่าง working tree กับ index ไม่แก้ไข source

### Execute

#### 1. Identify Refs

> Goal: ระบุ refs ที่ต้องเปรียบเทียบ

1. รับ target paths และ refs จาก user เช่น `HEAD`, `HEAD~1`, `<branch>`, `staged`, `unstaged`
2. ถ้าไม่ระบุ → ใช้ `HEAD` กับ `HEAD~1`
3. ถ้าไม่ชัด → `/ask-me`

#### 2. Run Git Diff

> Goal: รัน `git diff` ตามรูปแบบที่ต้องการ

1. ถ้าเปรียบเทียบสอง refs → `git diff <from>..<to> -- <paths>`
2. ถ้าเฉพาะ working tree กับ index → `git diff -- <paths>`
3. ถ้า staged → `git diff --staged -- <paths>`
4. ถ้าต้องการสถิติ → `git diff --stat` หรือ `git diff --name-only`

#### 3. Analyze Diff

> Goal: วิเคราะห์ changes

1. ดู `--stat` เพื่อรู้จำนวน file/insert/delete
2. อ่าน hunks ของแต่ละ file เพื่อหา nature of changes
3. ระบุไฟล์ที่มี breaking changes, new features, หรือ test impact

#### 4. Report

> Goal: สรุปผล

1. สรุปจำนวน files, insertions, deletions
2. รายการไฟล์ที่เปลี่ยนแยกตามประเภท: added, modified, deleted
3. ถ้ามี critical changes → แนะนำ `/review-*` หรือ `/resolve-errors`
4. ทำ `/suggest-next-action`

### Rules

#### 1. Read-Only

- ไม่ commit, ไม่ reset, ไม่แก้ไข source
- ใช้เฉพาะ `git diff`, `git diff --stat`, `git diff --name-only`

#### 2. Scope

- ถ้า path หลายรายการให้รวมเป็น space-separated list
- ถ้า repo มี submodules → ระบุ `--submodule` ถ้าจำเป็น

#### 3. Output

- ใช้ `/report` สำหรับสรุป stat
- ระบุ file paths เป็น relative จาก repo root

- ใช้ /check-git-logs ถ้าจำเป็น
- ใช้ /deep-debug ถ้าจำเป็น
- ใช้ /search-in-git ถ้าจำเป็น

### Expected Outcome

- สรุป diff: files changed, insertions, deletions, ประเภทการเปลี่ยนแปลง
- ระบุ critical changes
- มี next action

## Domain Checks

> Goal: เลือกทำเฉพาะ dimension ที่ตรง scope arg

| Scope | Section |
|-------|---------|
| `git-diff` | `## Check: Git Diff` |

## Rules

- สรุปให้พอตัดสินใจ ไม่ dump diff ทั้งหมด
- ถ้าตารางยาวเกิน 20 แถว ให้ group ตาม status หรือ directory
- ถ้า diff มีการลบ/ย้าย/overwrite ต้องระบุและถามก่อน
- ไม่ commit หรือ ship ถ้ายังไม่ได้ user confirmation
- ทุกสรุปต้องมาจาก `git status`, `git diff` หรือการอ่านไฟล์จริง
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis (diff)
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/diff-reviewer/` เท่านั้น

- ใช้ /report-git-diff ถ้าจำเป็น
- ใช้ /deep-validate ถ้าจำเป็น
- ใช้ /ask-me ถ้าจำเป็น

- ตัดสินใจ keep/revert ตาม findings เท่านั้น
- ใช้ /run-review ถ้าจำเป็น

- ใช้ /review-code-quality ถ้าจำเป็น
- ใช้ /review-risk ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. decision `keep` → ทำ `/git-commit` หรือ `/ship` ตาม workflow
2. decision `revert` → revert เฉพาะ hunks ที่ user confirm (git checkout/restore หรือ edit กลับ) — ไม่ revert ทั้งไฟล์ถ้ามีส่วนที่ keep
3. findings ที่ต้องแก้ใน diff → แก้ตาม `review-*` domain ที่ตรง แล้ว re-diff เทียบ

## References

- [Diff review checklist](subagents/diff-reviewer/diff-review-checklist.md)
- [Diff quality checklist](subagents/diff-reviewer/diff-quality.md)
- [Scoring](subagents/diff-reviewer/scoring.md)

## Expected Outcome

- ตารางสรุป diff ทั้ง tracked และ untracked
- รายการ risks หรือ side effects ทีพบ
- ตัวเลือกทัดไปที user เลือกได้ชัดเจน
- ไม่มีการ commit/ship/revert โดยไม่ได้รับ user confirmation
