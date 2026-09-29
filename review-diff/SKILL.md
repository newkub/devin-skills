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
---

## Goal

รีวิว git diff อย่างรวดเร็ว สรุปสิ่งที่เปลี่ยนแปลง ตรวจหาปัญหาทีอาจเกิด และถาม user ก่อนตัดสินใจ keep, revert หรือดำเนินการต่อ

## Scope

ใช้ก่อน `git-commit`, `/ship`, `/follow-enter-dot` หรือทุกครั้งที่ working tree มีการเปลี่ยนแปลงจำนวนมากและต้องการ user confirmation ก่อนลงมือ

## Execute

### 1. Capture Diff State
> Goal: อ่าน diff state ปัจจุบัน
ทำตาม [references/diff-review-checklist.md](references/diff-review-checklist.md)

### 2. Summarize Changes
> Goal: สรุป changes ทั้งหมด
สรุป changes ตาม [references/diff-review-checklist.md](references/diff-review-checklist.md)

### 3. Check Risks
> Goal: ตรวจหา risks
ตรวจหา risks ตาม [references/diff-review-checklist.md](references/diff-review-checklist.md)

### 4. Check Diff Quality

> Goal: ไม่มี junk/secrets/leftovers หลุดใน diff — ทำตาม `references/diff-quality.md`

1. secrets/credentials — API keys, tokens, passwords, private keys, `.env` contents
2. debug leftovers — `console.log`/`debugger`/`println!`/`fmt.Println`, commented-out blocks, `TODO` ใหม่
3. accidental files — editor swap, `node_modules`, build output, `.DS_Store`, personal notes
4. formatting noise — whitespace-only changes, line-ending flips, unrelated refactors ปน
5. scope creep — changes นอกเหนือ task scope ที่ไม่ได้ตั้งใจ

### 5. Present Options
> Goal: เสนอตัวเลือกถัดไป
เสนอตัวเลือกถัดไปตาม [references/diff-review-checklist.md](references/diff-review-checklist.md)

### 6. Act On Decision
> Goal: ดำเนินการตาม decision
ดำเนินการตาม decision ของ user ตาม [references/diff-review-checklist.md](references/diff-review-checklist.md)

### 7. Score And Report
> Goal: รายงาน score และสรุปผล
คำนวณ score/grade ตาม [references/scoring.md](references/scoring.md) แล้วทำ `/report` และ `/suggest-next-action` (diff)

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

- [Diff review checklist](references/diff-review-checklist.md)
- [Diff quality checklist](references/diff-quality.md)
- [Scoring](references/scoring.md)

## Expected Outcome

- ตารางสรุป diff ทั้ง tracked และ untracked
- รายการ risks หรือ side effects ทีพบ
- ตัวเลือกทัดไปที user เลือกได้ชัดเจน
- ไม่มีการ commit/ship/revert โดยไม่ได้รับ user confirmation
