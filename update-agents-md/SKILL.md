---
name: update-agents-md
description: สร้างหรืออัปเดต AGENTS.md ให้ agents และ subagents สามารถอ่านแล้วลงมือได้
related:
  - follow-agents-md
  - update-devin-global-skills
  - follow-devin-global-subagents
  - consider-use-subagents
  - report-workspace-graph
  - follow-monorepo
  - review-rules
  - review-by-stakeholder
  - deep-validate
  - realize-implementation
  - run-verify
  - git-commit
  - resolve-cicd
  - create-github-pr
  - merge-github-pr
  - improve-review-cli
  - run-release
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
3. ทำ `/analyze-project` เพื่อวิเคราะห์ tech stack และ structure
4. ทำ `/all-workspace` ถ้าเป็น monorepo
5. อ่าน global rules จาก `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
6. ทำ `/ask-project-requirement` ถ้า context หรือ requirements ไม่ชัด
7. ระบุ platform และ target user จาก context และ dependencies
8. ถ้า project มี `tools/review-codebase` ทำ `/improve-review-cli`

### 2. Analyze Architecture

> Goal: วิเคราะห์ Architecture
1. อ่าน `package.json`, `Cargo.toml`, `pyproject.toml`, หรือ manifest ที่เกี่ยวข้อง
2. ระบุ libraries, frameworks, runtime, build tools ที่ใช้
3. map แต่ละ tech เป็น `tech: /follow-<tech>` ถ้ามี skill ตรง
4. ถ้าไม่มี skill ตรง ใช้ `tech: /learn-from-web` หรือ `tech: none`
5. อัปเดต `### Architecture` ใน root `AGENTS.md`

### 3. Define Platform And Target User

> Goal: Define Platform And Target User
1. ระบุ `platform` จาก runtime, OS, deployment target, environment
2. ระบุ `target user` จาก project domain และผู้ใช้งานสุดท้าย
3. อัปเดต `### Platform` และ `### Target User` ใน root `AGENTS.md`

### 4. Write AGENTS.md

> Goal: เขียน AGENTS md
1. ใช้ format ตาม `follow-create-devin-global-skills/SKILL.md` (frontmatter `name`, `description`, `related`)
2. เริ่มจาก `references/agents-template.md` สำหรับ root `AGENTS.md`
3. เขียน sections: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
4. เพิ่ม `### Architecture`, `### Platform`, `### Target User`, `### Skills`, `### Workspaces` ถ้าเกี่ยวข้อง
5. ใช้ `tech: /follow-<tech>` สำหรับ tech mapping
6. ใช้ `skill-name: /skill-name` สำหรับ skill mapping
7. ทุก step ใน `## Execute` ต้องเป็น actionable command ที่ agent รันได้
8. ถ้ามีหลาย workspace อิสระกัน ใช้ `/follow-devin-global-subagents` หรือ `/consider-use-subagents`
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
7. ทำ `/review-rules` เพื่อตรวจสอบทุก workspace `AGENTS.md`

### 6. Review By Stakeholder

> Goal: review By Stakeholder
1. ทำ `/review-by-stakeholder` เพื่อรับมุมมองจาก stakeholders ที่เหมาะสม
2. บันทึก findings พร้อม severity, stakeholder, recommendation
3. ถ้าพบ issues ที่มีผลต่อ `AGENTS.md` → แก้ไขก่อนดำเนินต่อ
4. สรุป stakeholder coverage map และ top findings

### 7. Validate

> Goal: ยื่นยัน Validate
1. ทำ `/review-rules` เพื่อ review `AGENTS.md`
2. แก้ไข issues ที่พบจนผ่าน
3. ทำ `/deep-validate` เพื่อตรวจสอบความถูกต้อง
4. ถ้าผ่าน → ดำเนิน `### 8. Ship` ต่อไป

### 8. Ship

> Goal: ship Ship
1. ทำ `/realize-implementation` เพื่อลบ TODO/MOCK/FAKE/STUB/placeholder
2. ตรวจสอบ `git status` และ state ของ repository ตาม project conventions
3. ทำ `/run-verify`, `/run-test-all` ถ้ามี
4. ทำ `/deep-validate`
5. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 รอบ
6. ทำ `/git-commit`
7. ทำ `git push` โดยไม่ force
8. ทำ `/resolve-cicd`
9. ถ้า fail → resolve, commit, push, re-watch สูงสุด 5 รอบ
10. ทำ `/create-github-pr` เป้าหมายหลักของ project
11. ทำ `/deep-review-pr`
12. ถาม user ก่อน merge
13. ถ้า user ตกลง → ทำ `/merge-github-pr`
14. ทำ `/resolve-cicd` บน production ก่อน release
15. ทำ `/run-release --dry-run` ก่อน release จริง
16. ถ้า dry-run ผ่านและ user ยืนยัน → ทำ `/run-release`
17. sync local state กับ remote ตาม project conventions
18. ทำ `/report-progress`, `/report`, `/suggest-next-action`

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

- ใช้ `/follow-devin-global-subagents` หรือ `/consider-use-subagents` เมื่อมีหลาย workspace หรือหลากหลาย architecture ที่ตรวจสอบได้อิสระกัน
- แต่ละ subagent ต้องได้รับ context: workspace path, manifest, และเป้าหมาย
- รวมผลจาก subagents ก่อนเขียน root `AGENTS.md`

### 4. Architecture Mapping

- ระบุ tech stack ด้วย `tech: /follow-<tech>`
- ถ้าไม่มี skill ตรง ใช้ `tech: /learn-from-web` หรือ `tech: none`
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

- ทำ `/review-rules` เพื่อ review AGENTS.md
- ทำ `/deep-validate` ก่อน ship
- ไม่ commit เองระหว่างเขียน `AGENTS.md` — ship workflow ดำเนินการต่อหลัง validate ผ่าน

## Expected Outcome

- root `AGENTS.md` สมบูรณ์ ติดตามได้ และอิงตาม project จริง
- `### Architecture` ระบุ `tech: /follow-<tech>` ครบ
- `### Platform` และ `### Target User` ถูกต้อง
- `### Skills` ระบุ skills หลักครบ
- ถ้าเป็น monorepo: ทุก workspace มี `AGENTS.md` พร้อม workspace rules
- ได้รับ review จาก stakeholders ที่เหมาะสมก่อน `/deep-validate`
- ผ่าน `/review-rules` และ `/deep-validate`
- subagents สามารถอ่าน `AGENTS.md` แล้วดำเนินการตามขั้นตอนได้
