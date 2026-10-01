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
  - refactor-workspace
  - follow-architecture
  - ship-verify
  - update-tests
  - run-dev
  - test-usage
  - implement-to-production
  - update-review-cli-then-run
  - ship-to-dev-branch
  - git-commit-and-push
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
8. ถ้า project มี `tools/review-codebase` ทำ `/update-review-cli-then-run`

### 2. Analyze Techstack

> Goal: map dependencies → global skills

1. อ่าน `package.json`, `Cargo.toml`, `pyproject.toml`, หรือ manifest ที่เกี่ยวข้อง
2. ระบุ libraries, frameworks, runtime, build tools ที่ใช้
3. map แต่ละ dep เป็น `dep: /follow-<skill>` ถ้ามี skill ตรง — ไม่มี → `/learn-from-web` หรือข้าม row นั้น
4. ผลลัพธ์คือ Techstack Skills table สำหรับ template

### 3. Write AGENTS.md

> Goal: เขียน AGENTS md จาก canonical templates

1. ใช้ format ตาม `update-devin-global-skills` (`## Conventions → Frontmatter Spec`)
2. Root `AGENTS.md` → เริ่มจาก `templates/agents-md-monorepo.md`
3. Workspace `AGENTS.md` → เริ่มจาก `templates/agents-md-workspace.md` ต่อ workspace
4. เขียน sections: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
5. `## Execute` ตาม template — workspace มี `### Follow Techstack Skills` (table 3 col: Dependency / Use For / Global Skill) + `### Follow Architecture` (เลือก pattern ผ่าน `/follow-architecture`) + `### Ship Verify`; monorepo มี follow-monorepo → subagents follow workspace AGENTS.md → `/refactor-workspace` workspace-usage table (Workspace / Use Workspace / Purpose) → `/ship-verify`
6. ทุก step ใน `## Execute` ต้องเป็น actionable command ที่ agent รันได้
7. ถ้ามีหลาย workspace อิสระกัน ใช้ `/use-subagents` — 1 workspace = 1 subagent (workspace path, manifest, deliverable)
8. ถ้า context ไม่ชัด → stop และ report

### 4. Validate And Ship

> Goal: verify ผ่าน canonical gate แล้วค่อย ship

1. ทำ `/ship-verify` — canonical gate ครอบ `/deep-review` (AGENTS.md), `/deep-validate`, `/run-check`, `/update-tests` + `/run-test-all`, `/run-dev`, `/test-usage` — ไม่ duplicate verify steps ที่นี่
2. ผ่านครบแล้ว → `/ship-to-dev-branch` เพื่อ release
3. ทำ `/report` สรุป

## Rules

### 1. AGENTS.md Format

- frontmatter `name`, `description` ≤100 ตัวอักษร, `related`
- sections: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
- ไฟล์ไม่เกิน 250 บรรทัด
- `AGENTS.md` เขียนเป็นภาษาอังกฤษทั้งหมด (project-local)
- ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`

### 2. Followable Content

- ทุก step ใน `## Execute` ต้องเป็น action ที่ agent รันได้
- ระบุ skill ด้วย `/<skill-name>` และ command ด้วย backticks
- ถ้าต้องใช้ subagents ระบุชัดเจนว่า subtask ใด independent

### 3. Subagent Discipline

- ใช้ `/use-subagents` เมื่อมีหลาย workspace หรือหลาย architecture ที่ตรวจสอบได้อิสระกัน
- แต่ละ subagent ต้องได้รับ context: workspace path, manifest, และเป้าหมาย
- รวมผลจาก subagents ก่อนเขียน root `AGENTS.md` — subagent ห้าม commit

### 4. Techstack Mapping

- workspace `AGENTS.md` มี Techstack Skills table 3 columns: `Dependency | Use For | Global Skill`
- map ตาม dependencies ใน manifest เท่านั้น — ไม่มี skill ตรงให้ข้าม row (หรือ `/learn-from-web`)

### 5. Skills Mapping

- `### Skills` ใน generated `AGENTS.md` เรียบง่าย — core: `/dont-ask-me`, `/ship-verify`, `/ship-to-dev-branch`, `/report-progress`, `/save-to-todo-md`, `/suggest-next-action`, `/follow-your-suggestion`, `/git-commit-and-push`
- Quality/improvement group (ตาม project): `/deep-review`, `/deep-validate`, `/deep-test`, `/review-test` + `/improve-*`/`/optimize-*` variants ที่ตรง
- เพิ่มเฉพาะ project-specific skills ที่จำเป็นจริง

### 6. Workspace Rules

- root `AGENTS.md` ต้องมี `### Workspaces` ระบุทุก workspace + usage table (`Workspace | Use Workspace | Purpose` จาก `/refactor-workspace`)
- workspace `AGENTS.md` ต้องระบุ `uses:` `<package> use <other-package>`
- ก่อนเขียน workspace section ใน monorepo ต้องทำ `/report-workspace-graph`
- ไม่ duplicate root conventions

### 7. Validation

- verify ทั้งหมดอยู่ใน `/ship-verify` (canonical) — skill นี้เรียกใช้เท่านั้น ห้าม duplicate
- ไม่ commit เองระหว่างเขียน `AGENTS.md` — หลัง `/ship-verify` ผ่าน ship ต่อด้วย `/ship-to-dev-branch`

## Expected Outcome

- root `AGENTS.md` สมบูรณ์ ติดตามได้ และอิงตาม project จริง
- Techstack Skills table ครบทุก dependency ที่มี skill ตรง
- `### Platform` และ `### Target User` ถูกต้อง
- ถ้าเป็น monorepo: ทุก workspace มี `AGENTS.md` + workspace usage table
- ผ่าน `/ship-verify` — stakeholder review อยู่ใน `/ship-to-dev-branch` merge gate (`/review-by-all-stakeholder`)
- subagents สามารถอ่าน `AGENTS.md` แล้วดำเนินการตามขั้นตอนได้
