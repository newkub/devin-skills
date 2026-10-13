---
name: use-subagents
description: แบ่งงานซับซ้อนและ spawn subagents ตาม roles
argument-hint: "[task]"
allowed-tools:
  - run_subagent
  - read_subagent
  - kill_shell
  - skill
  - read
  - ask_user_question
  - todo_write
  - exec
related:
  - follow-agents-md
  - update-devin
  - follow-deep
  - deep-analyze
  - deep-analyze-by-use-scripts
  - use-scripts
  - transform
  - follow-math-concepts
  - deep-validate
  - ship-to-dev-branch
  - report
  - ask-me
---

## Goal

แบ่งงานออกเป็น subtasks แล้ว spawn subagents ตาม roles พร้อมกัน โดยรวบรวม deep context ก่อนส่งงาน

## Scope

ใช้เมื่องานมีหลายไฟล์/หลาย package/หลายด้าน ต้องการมุมมองจากหลาย roles หรือทำงานขนานเพื่อเร็วขึ้น

ดูเพิ่มเติม: /follow-agents-md

## Execute

### 1. Deep Context First

> Goal: รวบรวม context ลึกก่อน spawn subagents

1. ทำ `/follow-deep` + `/deep-analyze` เพื่อวิเคราะห์ root cause, impact, consumers และ dependencies (`/deep-analyze-by-use-scripts` forward → `/deep-analyze`)
2. scope กว้าง → ใช้ `/use-scripts` เก็บ context แบบ async/parallel (file lists, import graph, grep counts, git log) แทน sequential reads
3. บันทึก context สำคัญ: paths, conventions, ไฟล์ที่เกี่ยวข้อง, ข้อจำกัด
4. ถ้าไม่แน่ใจ scope → ทำ `/ask-me` ก่อน

### 2. Decompose Task

> Goal: แบ่งงานออกเป็น subtasks ที่ชัดเจน

1. อ่านผลจาก `/follow-deep`/`/deep-analyze`
2. แบ่ง subtasks ตาม package, layer, หรือ role
3. แต่ละ subtask ต้องมี: input, expected output, success criteria, files ที่ต้องแก้
4. Partition ด้วย `/follow-math-concepts` (set-theory, graph-theory) เพื่อให้ขนานได้โดยไม่ชนกัน:
   - file sets ของทุก subtask ต้อง disjoint: `∪Sᵢ = scope` และ `Sᵢ ∩ Sⱼ = ∅` (i≠j) — ไฟล์ที่ถูกแก้ร่วมกันอยู่ subtask เดียว
   - dependency ระหว่าง subtasks ต้องเป็น DAG → topological order เป็น waves: wave เดียวกัน spawn พร้อมกัน, wave ถัดไปรอ wave ก่อนเสร็จ
   - ไม่มี dependency เลย → embarrassingly parallel: spawn ทั้งหมด `is_background=true` ในครั้งเดียว
   - เจอ cycle ใน dep graph → merge subtasks ที่ติด cycle เข้าด้วยกัน

### 3. Select Subagents

> Goal: เลือก role ที่ตรงกับแต่ละ subtask

1. เลือก profile จาก subagent profiles ทีมีใน system prompt
2. เลือก profile เช่น fixer, debugger, refactor, qa, security, architect
3. ถ้าไม่มี role ที่ต้องการ → ใช้ `subagent_general` หรือ `subagent_explore`
4. ถ้าไม่แน่ใจ → ทำ `/ask-me` ก่อน
5. ระบุ context ให้ครบใน prompt

### 4. Spawn Subagents

> Goal: ส่งงานให้ subagents ทำขนานกัน

1. ใช้ `run_subagent` แบบ `is_background=true` เพื่อรัน parallel — spawn ทีละ wave ตาม DAG (step 2)
2. ห้ามส่ง subtasks ซ้ำซ้อนหรือทับซ้อนกัน — file sets ต้อง disjoint เสมอ
3. รอผลด้วย `read_subagent` (non-blocking) หรือ continue ทำงานอื่นไป — เช็ค async ไม่ poll loop
4. subtask ที่แก้หลายไฟล์ตาม pattern → สั่งใน prompt ให้ใช้ `/use-scripts` (edit workflow) หรือ `/use-astgrep rewrite` — บังคับ dry-run ก่อนเสมอเพื่อ audit trail
5. ถ้า subagent ติด error → ทำ `resolve-errors` ก่อน spawn ตัวใหม่

### 5. Merge And Fix

> Goal: รวมผลและแก้ conflicts

1. รวบรวม output จากทุก subagent
2. ตรวจ conflicts ระหว่างการแก้ไข
3. ใช้ `/resolve-errors` สูงสุด 3 รอบ
4. ถ้ายังไม่ผ่าน → ทำ `/ask-me`

### 6. Validate And Ship

> Goal: ส่งมอบงานทีผ่าน check

1. รัน `run-check` ตาม ecosystem ทีตรวจพบ
2. ถ้าผ่าน → ทำ `/ship-to-dev-branch`
3. ถ้าไม่ผ่าน → report สถานะและขั้นตอนถัดไป
4. ทำ `/report` สรุปสิ่งทีแต่ละ subagent ทำ

## Rules

### 1. Discipline

1. `Always /follow-deep first` — ห้าม spawn subagents โดยไม่มี deep context
2. `One role per subtask` — ไม่ผสมหลาย roles ใน subagent เดียว
3. `No overlapping edits` — แต่ละ subagent ต้องทำงานคนละชุดไฟล์ เว้นเสียแต่กำหนดชัดเจน
4. `Merge before ship` — ต้องรวบรวม results, ตรวจ conflicts, และ merge ก่อน push หรือ final report
5. `Run checks after merge` — ไม่ส่งมอบโดยไม่ validate
6. `Stop on 3 failures` — ถ้า resolve errors เกิน 3 รอบ ให้ stop และ report
7. ใช้ `/update-devin-global-subagents` เพื่อ sync subagent catalog ถ้าจำเป็น

### 2. Independence

- แต่ละ subtask ต้องไม่พึ่งพากัน — ถ้าพึ่งพาให้เข้า wave ถัดไปตาม DAG ไม่ใช่ spawn พร้อมกัน
- ไม่ให้หลาย agent แก้ไขไฟล์เดียวกัน — file sets ต้อง disjoint (`∩ = ∅`) ตาม partition ใน step 2
- ใช้ `/follow-parallel` + `/follow-math-concepts` สำหรับ parallelization — ไม่มี shared mutable state ระหว่าง agents

### 3. Clear Prompts

- แต่ละ agent ต้องได้รับ context ทีเพียงพอ
- ระบุ deliverable, constraints, success criteria

### 4. Merge Safely

- ตรวจสอบ conflicts ก่อน merge
- รักษา consistency ของ codebase
- ทำ `/deep-validate` หลัง merge

## Subagent Profiles

Skills เหล่านี้มี subagent profiles สำหรับ parallel independent work — profile อยู่ใน `SKILL.md` ของ parent skill ใต้ section `## Subagents` (ไม่มี `subagents/` folder แล้ว) อ่าน section นั้นแล้วส่งเป็น prompt ให้ subagent ผ่าน `run_subagent`; profile ที่มีรายละเอียดเกินกว่าจะ inline ได้ เก็บเต็มไว้ที่ `<skill>/references/subagent-<name>.md` และ link ไว้จาก block นั้น:

| No. | Parent Skill | Profile | Use For |
|-----|--------------|---------|---------|
| 1 | `review-github-pr` | `SKILL.md ## Subagents` → `pr-reviewer`, `pr-checklist-reviewer` (+ full detail ใน `references/`) | review PR slice per-domain/file-group |
| 2 | `capture` | `SKILL.md ## Subagents` → `route-capturer` | capture route เดียวทุก device |
| 3 | `deep-test` | `SKILL.md ## Subagents` → `route-checker` | test API route group เดียว |
| 4 | `deep-review` | `SKILL.md` (inline dispatch contract ไม่มี profile file) | review workspace area / docs routes ต่อ section |
| 5 | `update-tests` | `SKILL.md ## Subagents` → `suite-updater` | update test suite เดียว (unit/e2e/snapshot) |
| 6 | `update-project-all-drive-d` | `SKILL.md ## Subagents` → `project-updater` | update project dir เดียวใน drive D |
| 7 | `update-all-program-in-computer` | `SKILL.md ## Subagents` → `program-updater` | update program เดียวผ่าน package manager |
| 8 | `implement-features-to-mvp` | `SKILL.md ## Subagents` → `feature-implementer` | implement feature เดียว end-to-end |
| 9 | `resolve-github-issue-by-me` | `SKILL.md ## Subagents` → `issue-implementer` | implement issue เดียวจน PR-ready |
| 10 | `deep-research` | `SKILL.md ## Subagents` → `source-researcher` | research source/topic เดียวเชิงลึก |
| 11 | `deep-validate` | `SKILL.md ## Subagents` → `dimension-validator` | validate dimension เดียว pass/fail + evidence |
| 12 | `deep-review-then-fix` | `SKILL.md ## Subagents` → `fix-worker` | apply approved fixes ของ module/domain เดียว |
| 13 | `sync-drive-d-submodules` | `SKILL.md ## Subagents` → `submodule-syncer` | sync submodule เดียวบน drive D |
| 14 | `merge-all-branch-by-me-to-main` | `SKILL.md ## Subagents` → `branch-merger` | merge branch เดียวเข้า main |
| 15 | `update-project` | `SKILL.md ## Subagents` → `project-updater`, `git-log-collector`, `project-files-updater`, `project-skills-updater`, `github-metadata-updater` | update sub-project และ collect inputs ต่อ domain |
| 16 | `follow-tool-moonrepo` | `SKILL.md ## Subagents` → `project-configurator` | configure/verify `moon.yml` ของ project เดียว |
| 17 | `refactor` | `SKILL.md ## Subagents` → `hotspot-scout`, `file-worker` | เก็บ baseline evidence (read-only) และ refactor ทีละไฟล์ขนานกัน |
| 18 | `implement-to-production` | `SKILL.md ## Subagents` → `gap-scanner`, `feature-implementer`, `review-sweeper` | inventory gaps, implement ต่อ item, review ต่อ domain |
| 19 | `review` | `SKILL.md ## Subagents` → `codebase-reviewer` (+ checklist/scoring/report ใน `references/`) | codebase-wide review ต่อ dimension |
| 20 | `update-devin-global-skills` | `SKILL.md` (`## Conventions → Workflows And Subagents`, profile `skill-updater`) | update skill เดียวตาม instructions ใน bulk update |

## CLI — `subagents` (mission control)

CLI ใน `src/` (Bun/TypeScript, entry `src/presentation/cli.ts`) — ClickUp-style task table สำหรับงานขนานของ subagents/shell jobs:

```sh
bun src/presentation/cli.ts run "fix-lint" --role fixer --pri high -- "bunx biome check --write src"
bun src/presentation/cli.ts add "deploy" --dep build -- "..."           # blocked จน dep done
bun src/presentation/cli.ts add "tests" --parent ship-feature -- "..."  # subtask (rollup 2/3)
bun src/presentation/cli.ts pump      # start queued ทุกตัวที่ dep ครบ
bun src/presentation/cli.ts list [--status failed] [--role fixer] [--q lint]
bun src/presentation/cli.ts watch     # TUI: ↑↓ · / search · f filter · s sort · p pump · r retry · k kill · d del · q
bun src/presentation/cli.ts logs|note|retry|kill|rm <id>
bun src/presentation/cli.ts prune     # ล้าง tasks ที่จบแล้ว
```

- Columns: `STATUS · PRI · ID · SRC · ROLE · ELAPSED · SUB · NAME` — SUB แสดง rollup `2/3` บน parent / `└─` บน child; detail pane แสดง cmd + deps ที่รอ + last 3 log lines
- Lifecycle: `queued → (blocked ถ้า dep ยัง) → running → done|failed|killed` — reconcile อัปเดต blocked↔queued อัตโนมัติ
- State: `~/.config/devin/subagents/tasks.json` + `logs/<id>.log`; reconcile pid จริงทุกวิ

`Devin subagent bridge` — ปิด gap ที่ `run_subagent` เป็น in-process: หลัง spawn agent ให้ register เข้า registry:

```sh
bun src/presentation/cli.ts register "<title>" --role fixer --id <agent-id> --note "<task summary>"
bun src/presentation/cli.ts mark <id> done --note "<result>"   # เมื่อ read_subagent เสร็จ
```

- ใช้ประกอบ Step 4 (Spawn Subagents): `run_subagent` → `register` ทันที; `read_subagent` เสร็จ → `mark done|failed` — `watch` เห็นทั้ง shell jobs และ Devin agents ในตารางเดียว

## Expected Outcome

- งานถูกแบ่งและทำขนานกันโดย subagents
- มี deep context ก่อนเริ่มแก้
- ผลลัพธ์ถูก merge ไม่มี conflicts และผ่าน `run-check`
- มีรายงานสรุปสั้นและชัดเจน

