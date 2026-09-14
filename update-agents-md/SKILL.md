---
name: update-agents-md
description: สร้างหรืออัปเดต AGENTS.md ให้ agents และ subagents สามารถอ่านแล้วลงมือได้
argument-hint: "[scope]"
related:
  - deep-review-then-fix
  - follow-agents-md
  - update-devin
  - use-subagents
  - report-workspace-graph
  - follow-monorepo
  - review-dot-devin
  - review-by-stakeholder
  - deep-validate
  - implement-to-production
  - run-verify
  - git-commit
  - create-github
  - update-review-cli
  - report
---

## Goal

สร้างหรืออัปเดท `AGENTS.md` ใน root และทุก workspace ให้ทำตามได้จริง โดย agents และ subagents สามารถอ่านแล้วดำเนินการตามลำดับขั้นตอน

## Scope

ใช้สำหรับเขียน/ปรับปรุง `AGENTS.md` ใน root และ workspace ของ project ตามข้อมูลจริง ไม่รวมการแก้ไข source code นอก scope ของ `AGENTS.md`

## Execute

### 1. Prepare

> Goal: เตรียม Prepare
1. ทำ `/follow-agents-md` ถ้ามี `AGENTS.md` อยู่แล้ว
2. ทำ `/check-monorepo` เพื่อตรวจ monorepo status
3. ทำ `/deep-analyze` เพื่อวิเคราะห์ tech stack และ structure
4. ทำ `/all-workspace` ถ้าเป็น monorepo
5. อ่าน global rules จาก `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
6. ทำ `/ask-project-requirement` ถ้า context หรือ requirements ไม่ชัด
7. ระบุ platform และ target user จาก context และ dependencies
8. ถ้า project มี `tools/review-codebase` ทำ `/update-review-cli`

### 2. Analyze Architecture

> Goal: วิเคราะห์ Architecture
1. อ่าน `package.json`, `Cargo.toml`, `pyproject.toml`, หรือ manifest ที่เกี่ยวข้อง
2. ระบุ libraries, frameworks, runtime, build tools ที่ใช้
3. map แต่ละ tech เป็น `tech: /follow-<tech>` ถ้ามี skill ตรง
4. ถ้าไม่มี skill ตรง ใช้ `tech: /learn-web` หรือ `tech: none`
5. อัปเดต `### Architecture` ใน root `AGENTS.md`

### 3. Define Platform And Target User

> Goal: Define Platform And Target User
1. ระบุ `platform` จาก runtime, OS, deployment target, environment
2. ระบุ `target user` จาก project domain และผู้ใช้งานสุดท้าย
3. อัปเดต `### Platform` และ `### Target User` ใน root `AGENTS.md`

### 4. Write AGENTS.md

> Goal: เขียน AGENTS md
1. ใช้ format ตาม `update-devin-global-skills/SKILL.md` และ `update-devin-global-skills/references/frontmatter.md`
2. เริ่มจาก `references/agents-template.md` สำหรับ root `AGENTS.md`
3. เขียน sections: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
4. เพิ่ม `### Architecture`, `### Platform`, `### Target User`, `### Skills`, `### Workspaces` ถ้าเกี่ยวข้อง
5. ใช้ `tech: /follow-<tech>` สำหรับ tech mapping
6. ใช้ `skill-name: /skill-name` สำหรับ skill mapping
7. ทุก step ใน `## Execute` ต้องเป็น actionable command ที่ agent รันได้
8. ถ้ามีหลาย workspace อิสระกัน ใช้ `/update-devin-global-subagents` หรือ `/use-subagents`
9. ถ้า context ไม่ชัด → stop และ report

### 5. Workspace AGENTS.md

> Goal: Workspace AGENTS.md
1. ทำ `/report-workspace-graph` เพื่อวิเคราะห์ dependencies ระหว่าง workspaces
2. ทำ `/follow-monorepo` เพื่อเข้าใจ workspace structure
3. เริ่มจาก `references/workspace-agents-template.md` สำหรับแต่ละ workspace `AGENTS.md`
4. สำหรับแต่ละ workspace ระบุ:
   - `name` ใน frontmatter ตรงกับชื่อ workspace
   - `### Architecture` ด้วย `tech: /follow-<tech>` ของ workspace
   - `### Platform` และ `### Target User`
   - `### Skills` ด้วย `skill-name: /skill-name` ที่ใช้
   - `### Workspaces` หรือ `uses:` ระบุ workspace อื่นที่ใช้
5. ระบุ dependencies ระหว่าง workspaces จาก `package.json` หรือ source imports
6. ไม่ duplicate เนื้อหาจาก root `AGENTS.md`
7. ทำ `/review-dot-devin` เพื่อตรวจสอบทุก workspace `AGENTS.md`

### 6. Review By Stakeholder

> Goal: review By Stakeholder
1. ทำ `/review-by-stakeholder` เพื่อรับมุมมองจาก stakeholders ที่เหมาะสม
2. บันทึก findings พร้อม severity, stakeholder, recommendation
3. ถ้าพบ issues ที่มีผลต่อ `AGENTS.md` → แก้ไขก่อนดำเนินต่อ
4. สรุป stakeholder coverage map และ top findings

### 7. Validate

> Goal: ยื่นยัน Validate
1. ทำ `/review-dot-devin` เพื่อ review `AGENTS.md`
2. แก้ไข issues ที่พบจนผ่าน
3. ทำ `/deep-validate` เพื่อตรวจสอบความถูกต้อง
4. ถ้าผ่าน → ดำเนิน `### 8. Ship` ต่อไป

### 8. Ship

> Goal: ship ผ่าน feature branch → validate → staging → merge → production พร้อม rollback path (merged from: ship, ship-to-staging, ship-to-production)

#### Branch Hygiene

1. ตรวจ `git status` — uncommitted changes → commit ด้วย `/git-commit` หรือ `git stash`
2. `git switch main` + `git pull` — main ล่าสุด
3. switch/สร้าง feature branch ด้วย `/create-git-branch` — ห้ามทำงานต่อบน main
4. ถ้า step ก่อนหน้าทำบน main → commit ย้ายไป feature branch

#### Validate

1. ถ้า scope ใหญ่หลาย workspace → `/ship` swarm mode (Step 4); diff เล็ก (typo/docs/config) → ข้าม step 2-8 ไป step 9 ได้
2. ทำ `/deep-review-then-fix` — review + fix issues ก่อน ship (canonical fix path)
3. ทำ `/deep-optimize` — optimize ทุก layer ที่เกี่ยวข้อง
4. ทำ `/review-test`, `/review-dependencies` + `/update-version-to-latest`, `/review-architecture`, `/review-docs` ตาม scope
5. ทำ `/follow-monorepo` ถ้า monorepo
6. ทำ `/run-verify` + `/run-test-all`
7. ถ้ามี TODO/MOCK/placeholder → `/implement-to-production`; structural issues → `/refactor`
8. ทำ `/update-project` sync project files/docs; `/deep-validate` เป็น final gate
9. ถ้า fail → `/resolve-errors` retry สูงสุด 3 รอบ แล้ว `/loop-until-complete`

#### Stage

1. `git pull --rebase origin main` — feature branch sync กับ main
2. ทำ `/git-commit-and-push` push changes ที่ผ่าน validation
3. deploy staging ด้วย `/run-deploy` ตาม AGENTS.md/package.json — บันทึก deploy URL, commit hash
4. ทำ `/watch-deploy` + smoke tests (critical flows, API health); e2e ผ่าน `/run-test` ถ้ามี
5. ถ้า staging fail → fix code กลับ Validate — retry สูงสุด 3 รอบ; ผ่าน = `ready-for-production`

#### Merge

1. repo ที่มี remote + PR workflow → `/create-github-pr` + `/review-github-pr`
2. ถ้า `/deep-review` ยังไม่ได้ทำ → ทำก่อน merge อย่างน้อย 1 รอบ
3. CI gate — `/resolve-cicd` (watch + resolve PR checks) หรือ `gh pr checks <n> --watch`; ห้าม merge ตอน check fail/pending
4. CI ผ่าน → `/open-diff pr <n>` เปิด diff UI ให้ user review + กด `Merge ▼`; AI ห้าม merge เองโดยไม่มี user confirm (`/merge-github-pr` เมื่อ user ยืนยัน)

#### Production

1. user confirm ก่อน deploy production — แสดง commit hash, changes, staging result; breaking change → `/ask-me`
2. บันทึก version ก่อน deploy (rollback target)
3. deploy production ด้วย `/run-deploy`; `/watch-deploy` + health checks + smoke tests
4. health check fail → rollback: `git revert <merge-commit>` + redeploy version ก่อนหน้า — ห้าม force-push
5. ทำ `/resolve-cicd` บน production branch; กลับ `git switch main` + sync local/remote

#### Wrap Up

1. ทำ `/report-progress`, `/report`
2. ทำ `/report-scan-todo` — pending items ไป `TODO.md`
3. ถ้าต้อง release → `/run-release --dry-run` ก่อน → `/run-release` เมื่อ user ยืนยัน
4. ถ้ามี stash → `git stash pop`; ปิด issue/task ที่เกี่ยวข้อง
5. ทำ `/suggest-next-action`

## Rules

### 1. AGENTS.md Format

- frontmatter `name`, `description` ≤100 ตัวอักษร, `related`
- sections: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
- ไม่มี `## Workflows` หรือ `### Workflows`
- ไฟล์ไม่เกิน 250 บรรทัด
- `AGENTS.md` เขียนเป็นภาษาอังกฤษทั้งหมด (project-local)
- ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`

### 2. Followable Content

- ทุก step ใน `## Execute` ต้องเป็น action ที่ agent รันได้
- ระบุ skill ที่ต้อง invoke ด้วย `/<skill-name>`
- ระบุ command ที่ต้องรันด้วย backticks
- ทุก `###` ต้องมี bullet หรือ numbered list ที่ชัดเจน
- ถ้าต้องใช้ subagents ระบุชัดเจนว่า subtask ใดที่เป็นอิสระ

### 3. Subagent Discipline

- ใช้ `/update-devin-global-subagents` หรือ `/use-subagents` เมื่อมีหลาย workspace หรือหลากหลาย architecture ที่ตรวจสอบได้อิสระกัน
- แต่ละ subagent ต้องได้รับ context: workspace path, manifest, และเป้าหมาย
- รวมผลจาก subagents ก่อนเขียน root `AGENTS.md`

### 4. Architecture Mapping

- ระบุ tech stack ด้วย `tech: /follow-<tech>`
- ถ้าไม่มี skill ตรง ใช้ `tech: /learn-web` หรือ `tech: none`
- map ตาม dependencies ใน manifest

### 5. Skills Mapping

- ระบุ skills ด้วย `skill-name: /skill-name`
- รวมทั้ง skills ที่เรียกโดยตรงและอ้างอิงบ่อย
- ไม่ใส่ skills ที่ไม่เกี่ยวข้อง

### 6. Workspace Rules

- root `AGENTS.md` ต้องมี `### Workspaces` ระบุทุก workspace
- workspace `AGENTS.md` ต้องระบุ `uses:` หรือ `### Workspaces`
- ใช้รูปแบบ `<package> use <other-package>` เช่น `core: use db, web`
- ก่อนเขียน workspace section ใน monorepo ต้องทำ `/report-workspace-graph`
- ไม่ duplicate root conventions

### 7. Validation

- ทำ `/review-dot-devin` เพื่อ review AGENTS.md
- ทำ `/deep-validate` ก่อน ship
- ไม่ commit เองระหว่างเขียน `AGENTS.md` — ship workflow ดำเนินการต่อหลัง validate ผ่าน

## Expected Outcome

- root `AGENTS.md` สมบูรณ์ ติดตามได้ และอิงตาม project จริง
- `### Architecture` ระบุ `tech: /follow-<tech>` ครบ
- `### Platform` และ `### Target User` ถูกต้อง
- `### Skills` ระบุ skills หลักครบ
- ถ้าเป็น monorepo: ทุก workspace มี `AGENTS.md` พร้อม workspace rules
- ได้รับ review จาก stakeholders ที่เหมาะสมก่อน `/deep-validate`
- ผ่าน `/review-dot-devin` และ `/deep-validate`
- subagents สามารถอ่าน `AGENTS.md` แล้วดำเนินการตามขั้นตอนได้

