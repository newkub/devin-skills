---
name: report-repo-health
description: สร้าง health scorecard ต่อ repo — hygiene, deps, CI, activity และ risks รวมตารางเดียว
argument-hint: "[repo-or-all]"
related:
  - check-repo-hygiene
  - list-github-actions-fails
  - check-git-logs
  - list-dependencies
  - run-audit
  - check-uncommit
  - report-table
---

## Goal

สร้าง health scorecard ของ repository — รวม signals จากหลาย checks (hygiene, dependencies, CI, activity, security) เป็นคะแนน/grade เดียวที่เทียบข้าม repos ได้

## Scope

- Composite read-only: เรียก check/list skills ที่มีแล้ว aggregate เป็น scorecard
- ครอบคลุม: repo essentials, dependency health, CI status, commit activity, security signals, open issues/PRs
- ใช้ต่อ repo เดียวหรือ sweep ทุก repos (เช่น ใน drive D)

## Execute

### 1. Collect Signals

> Goal: เก็บ health signals ต่อ repo

1. Hygiene: `/check-repo-hygiene` — LICENSE, README, SECURITY, CODEOWNERS
2. Dependencies: `/list-dependencies` + `/run-audit` — outdated/vulnerable counts
3. CI: `/list-github-actions-fails` — latest run status, failure rate
4. Activity: `/check-git-logs` — last commit, commit frequency, staleness
5. Working state: `/check-uncommit` — dirty working tree?

### 2. Score Dimensions

> Goal: ให้คะแนนแต่ละมิติ

| Dimension | Weight | Signal |
|---|---|---|
| Hygiene | 20% | essential files ครบ |
| Dependencies | 20% | vulns + outdated % |
| CI Health | 20% | latest status + fail rate |
| Activity | 15% | recency + consistency |
| Security | 15% | secrets leak, audit, branch protection |
| Cleanliness | 10% | uncommitted work, stale branches |

3. คะแนน 0-100 ต่อ dimension → overall grade A-F

### 3. Report Scorecard

> Goal: ตารางเทียบข้าม repos

1. ใช้ `/report-table`: `No.`, `Repo`, `Hygiene`, `Deps`, `CI`, `Activity`, `Security`, `Clean`, `Grade`
2. Per-repo detail: top issues ที่กดคะแนน
3. สรุป: repos ที่ต้อง attention เรียงตาม grade

### 4. Recommend

> Goal: actions ต่อ repo

1. ระบุ quick wins ต่อ repo (เช่น เพิ่ม LICENSE, enable CI, ลบ stale branches)
2. flag repos ที่ควร archive หรือ revive
3. เชื่อมไป skills ที่เกี่ยว: `/check-repo-hygiene`, `/review-dependencies`, `/review-delivery`

## Rules

### 1. Evidence-Based

- ทุกคะแนนมี signal จริงรองรับ — ไม่ให้คะแนนจากความรู้สึก
- ถ้า signal ไม่มี (ไม่มี CI) → `n/a` ไม่ใช่ 0

### 2. Comparable

- scoring rubric เดียวกันทุก repo — เทียบข้ามได้
- weights ระบุชัดเจนและปรับได้

### 3. Read-Only

- ไม่แก้อะไร — รายงาน+แนะนำเท่านั้น
- ไม่รัน checks ที่หนัก (audit ใหญ่) ถ้าไม่จำเป็นต่อ scorecard

## Expected Outcome

- Scorecard ต่อ repo พร้อม grades ที่เทียบกันได้
- Top issues และ quick wins ต่อ repo
- ภาพรวมว่า repos ไหนต้อง attention
