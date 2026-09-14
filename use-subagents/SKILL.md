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
  - deep-validate
  - ship
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

1. ทำ `/follow-deep` เพื่อวิเคราะห์ root cause, impact, consumers และ dependencies
2. บันทึก context สำคัญ: paths, conventions, ไฟล์ที่เกี่ยวข้อง, ข้อจำกัด
3. ถ้าไม่แน่ใจ scope → ทำ `/ask-me` ก่อน

### 2. Decompose Task

> Goal: แบ่งงานออกเป็น subtasks ที่ชัดเจน

1. อ่านผลจาก `/follow-deep`
2. แบ่ง subtasks ตาม package, layer, หรือ role
3. แต่ละ subtask ต้องมี: input, expected output, success criteria, files ที่ต้องแก้
4. ระบุ dependencies ระหว่าง subtasks ถ้ามี

### 3. Select Subagents

> Goal: เลือก role ที่ตรงกับแต่ละ subtask

1. เลือก profile จาก subagent profiles ทีมีใน system prompt
2. เลือก profile เช่น fixer, debugger, refactor, qa, security, architect
3. ถ้าไม่มี role ที่ต้องการ → ใช้ `subagent_general` หรือ `subagent_explore`
4. ถ้าไม่แน่ใจ → ทำ `/ask-me` ก่อน
5. ระบุ context ให้ครบใน prompt

### 4. Spawn Subagents

> Goal: ส่งงานให้ subagents ทำขนานกัน

1. ใช้ `run_subagent` แบบ `is_background=true` เพื่อรัน parallel
2. ห้ามส่ง subtasks ซ้ำซ้อนหรือทับซ้อนกัน
3. รอผลด้วย `read_subagent` หรือ continue ทำงานอื่นไป
4. ถ้า subagent ติด error → ทำ `resolve-errors` ก่อน spawn ตัวใหม่

### 5. Merge And Fix

> Goal: รวมผลและแก้ conflicts

1. รวบรวม output จากทุก subagent
2. ตรวจ conflicts ระหว่างการแก้ไข
3. ใช้ `/resolve-errors` สูงสุด 3 รอบ
4. ถ้ายังไม่ผ่าน → ทำ `/ask-me`

### 6. Validate And Ship

> Goal: ส่งมอบงานทีผ่าน check

1. รัน `run-check` ตาม ecosystem ทีตรวจพบ
2. ถ้าผ่าน → ทำ `/ship`
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

- แต่ละ subtask ต้องไม่พึ่งพากัน
- ไม่ให้หลาย agent แก้ไขไฟล์เดียวกัน
- ใช้ `/follow-parallel` สำหรับ parallelization

### 3. Clear Prompts

- แต่ละ agent ต้องได้รับ context ทีเพียงพอ
- ระบุ deliverable, constraints, success criteria

### 4. Merge Safely

- ตรวจสอบ conflicts ก่อน merge
- รักษา consistency ของ codebase
- ทำ `/deep-validate` หลัง merge

## Subagent Profiles

Skills เหล่านี้มี subagent profiles สำหรับ parallel independent work — อ่าน `<skill>/subagents/<name>.md` เพื่อดู inputs/tools/output contract แล้ว spawn ผ่าน `run_subagent`:

| No. | Parent Skill | Profile | Use For |
|-----|--------------|---------|---------|
| 1 | `review-github-pr` | `review-github-pr/subagents/pr-reviewer.md` | review PR slice per-domain/file-group |
| 2 | `deep-review` | `deep-review/subagents/domain-reviewer.md` | run review-* domain เดียว |
| 3 | `capture-all-components-all-routes` | `capture-all-components-all-routes/subagents/route-capturer.md` | capture route เดียวทุก device |
| 4 | `deep-test api` | `deep-test/subagents/route-checker.md` | test API route group เดียว |
| 5 | `check-all-routes` | `check-all-routes/subagents/route-checker.md` | verify docs routes ต่อ site section |
| 6 | `update-tests` | `update-tests/subagents/suite-updater.md` | update test suite เดียว (unit/e2e/snapshot) |
| 7 | `morning-briefing` | `morning-briefing/subagents/signal-collector.md` | collect signal type เดียว |
| 8 | `update-project-all-drive-d` | `update-project-all-drive-d/subagents/project-updater.md` | update project dir เดียวใน drive D |
| 9 | `update-all-program-in-computer` | `update-all-program-in-computer/subagents/program-updater.md` | update program เดียวผ่าน package manager |
| 10 | `implement-features-to-mvp` | `implement-features-to-mvp/subagents/feature-implementer.md` | implement feature เดียว end-to-end |
| 11 | `implement-github-issue-by-me` | `implement-github-issue-by-me/subagents/issue-implementer.md` | implement issue เดียวจน PR-ready |
| 12 | `deep-research` | `deep-research/subagents/source-researcher.md` | research source/topic เดียวเชิงลึก |
| 13 | `deep-validate` | `deep-validate/subagents/dimension-validator.md` | validate dimension เดียว pass/fail + evidence |
| 14 | `review-workspace` | `review-workspace/subagents/area-reviewer.md` | review workspace area เดียวเทียบ conventions |
| 15 | `deep-review-then-fix` | `deep-review-then-fix/subagents/fix-worker.md` | apply approved fixes ของ module/domain เดียว |
| 16 | `sync-drive-d-submodules` | `sync-drive-d-submodules/subagents/submodule-syncer.md` | sync submodule เดียวบน drive D |
| 17 | `merge` | `merge-all-branch-by-me-to-main/subagents/branch-merger.md` | merge branch เดียวเข้า main |
| 18 | `bench-apis` | `bench-apis/subagents/benchmarker.md` | benchmark target เดียวด้วย load profile เดียวกัน |
| 19 | `update-project` | `update-project/subagents/project-updater.md` | update sub-project เดียว (deps/checks) |

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

