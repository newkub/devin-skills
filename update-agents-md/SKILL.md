---
name: update-agents-md
description: สร้างหรืออัปเดท AGENTS.md ตาม project analysis และ dependencies
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - follow-devin-skills-md
  - follow-monorepo
  - all-workspaces
  - deep-plan
  - improve-config
  - analyze-project
  - check-monorepo
  - follow-write-devin-skills
  - review-codebase-everything
  - git-commit
  - ask-me
---

## Goal

สร้างหรืออัปเดท `AGENTS.md` ตาม project analysis, dependencies และ best practices สำหรับ root และทุก workspace ใน monorepo

## Scope

ใช้สำหรับเขียน `AGENTS.md` ใน workspace ตาม project จริง ถ้าเป็น monorepo ให้เขียนทั้ง root และ workspace level สามารถรับ argument เป็น workspace หรือ file path ถ้าต้องการทำเฉพาะ workspace

## Execute

### 1. Determine Target

ระบุ target ที่จะสร้าง/อัปเดท AGENTS.md

> Goal: ทราบ scope ว่าทำ root, workspace เดียว หรือทุก workspace

1. ถ้ามี argument ชื่อ workspace หรือ path → ทำเฉพาะ workspace นั้น
2. ถ้าไม่มี argument → ทำ root และทุก workspace ใน monorepo
3. ทำ `/check-monorepo` เพื่อตรวจสอบว่า project เป็น monorepo หรือไม่
4. ถ้าเป็น monorepo ให้ทำ `/follow-monorepo` ก่อน

### 2. Analyze Project

วิเคราะห์ project เพื่อเข้าใจ requirements

> Goal: เข้าใจ tech stack, dependencies และ patterns ของ project

1. ทำ `/analyze-project` เพื่อวิเคราะห์ codebase
2. ทำ `/all-workspaces` เพื่อรวบรวมและจัดลำดับ workspaces
3. อ่าน `package.json` ทั้ง root และ target workspaces
4. ระบุ tech stack และ frameworks ที่ใช้

### 3. Plan AGENTS.md

วางแผนรายละเอียดก่อนเขียน

> Goal: มีแผนครอบคลุมทุก workspace ก่อนลงมือ

1. ทำ `/deep-plan` ถ้างานซับซ้อนสูงหรือหลาย workspace
2. ระบุรูปแบบ `AGENTS.md` ตาม `/follow-devin-skills-md` (frontmatter + Goal/Scope/Execute/Rules/Expected Outcome)
3. ระบุ skills และ review-* workflows ที่เกี่ยวข้องจาก dependencies
4. จัดลำดับ: root → foundation packages → apps

### 4. Read References

อ่าน references ก่อนเขียน

> Goal: ใช้มาตรฐานที่ถูกต้องและไม่ซ้ำซ้อน

1. ทำ `/follow-devin-skills-md` เพื่อใช้ format มาตรฐานสำหรับ `AGENTS.md`
2. ทำ `/follow-write-devin-skills` เพื่อรักษา workflow structure
3. อ่าน global rules จาก `c:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
4. ทำ `/read-related-skills` สำหรับ skills ที่เกี่ยวข้อง

### 5. Write Root AGENTS.md

สร้างหรืออัปเดท root `AGENTS.md`

> Goal: root AGENTS.md ครอบคลุมทุก workspace และสอดคล้อง project

1. สร้าง frontmatter ด้วย `name`, `description`, `related`
2. ระบุ `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
3. ใน `## Rules` เพิ่ม `### Workspaces` ที่บอกให้ทำตาม workspace `AGENTS.md` ของแต่ละ workspace
4. รวม sections: Project, Workflows, Skills, Review
5. ใช้ภาษาอังกฤษทั้งหมด ใช้ backticks สำหรับ tools/commands

### 6. Write Workspace AGENTS.md

สร้างหรืออัปเดท workspace `AGENTS.md` แต่ละ target

> Goal: แต่ละ workspace มี AGENTS.md ที่สอดคล้องกับ dependencies ของตัวเอง

1. สำหรับแต่ละ target workspace สร้าง/อัปเดท `AGENTS.md`
2. สร้าง frontmatter ด้วย `name`, `description`, `related`
3. ระบุ sections Goal, Scope, Execute, Rules, Expected Outcome
4. อ้างอิง dependencies ใน `package.json` ของ workspace นั้น
5. รวม review-* workflows จาก `/review-codebase-everything` ตาม project characteristics
6. ทำซ้ำจนครบทุก target workspace

### 7. Improve Configuration

ปรับปรุง config ให้สอดคล้องกับ AGENTS.md

> Goal: project config รองรับ workflows ที่ระบุใน AGENTS.md

1. ทำ `/improve-config` เพื่อ sync config, scripts, build ทั่ว project
2. ตรวจสอบว่า scripts ใน `package.json` สอดคล้องกับ AGENTS.md
3. ตรวจสอบว่า config files รองรับ workflows ที่ระบุ

### 8. Validate And Finalize

ตรวจสอบและ finalize

> Goal: AGENTS.md ผ่าน validation และพร้อมใช้งาน

1. ทำ `/check-reference` เพื่อตรวจสอบ references
2. ตรวจสอบว่าไฟล์ไม่เกิน 250 บรรทัด
3. ทำ `/validate`
4. ทำ `/git-commit` เพื่อ commit การเปลี่ยนแปลง
5. ทำ `/ask-me` เพื่อถามว่าจะ `/git-push` หรือ `/run-release` ต่อไหม

## Rules

### 1. Target And Monorepo

- ถ้ามี argument workspace/file path → ทำเฉพาะ target นั้น
- ถ้าไม่มี argument → ทำ root และทุก workspace
- ทำ `/follow-monorepo` ก่อนเสมอถ้าเป็น monorepo
- ทำ `/all-workspaces` เพื่อรวบรวมและจัดลำดับ workspaces

### 2. AGENTS.md Format

- ใช้ format ตาม `/follow-devin-skills-md` (frontmatter `name`, `description`, `related`)
- มี sections: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
- เนื้อหาภาษาอังกฤษทั้งหมด
- ไฟล์ไม่เกิน 250 บรรทัด
- ใช้ backticks สำหรับ tools, commands, file paths, skill-name

### 3. Root AGENTS.md

- ต้องมี `### Workspaces` ใน `## Rules`
- ระบุให้ทำตาม workspace `AGENTS.md` ของแต่ละ workspace
- ครอบคลุม project-wide conventions

### 4. Workspace AGENTS.md

- ระบุ `name` ใน frontmatter ตรงกับชื่อ workspace
- ระบุ tech stack, workflows, skills, reviews ตาม dependencies ของ workspace
- ไม่ duplicate เนื้อหาจาก root

### 5. Planning And Safety

- ทำ `/deep-plan` ถ้างานซับซ้อนสูง
- ทำ `/improve-config` หลังเขียน AGENTS.md เพื่อ sync config
- ทำ `/git-commit` หลังเสร็จ
- ทำ `/ask-me` ก่อน `/git-push` หรือ `/run-release`

## Expected Outcome

- ถ้าเป็น monorepo: root `AGENTS.md` และ workspace `AGENTS.md` ทุก target สมบูรณ์
- `AGENTS.md` มี frontmatter ตาม `/follow-devin-skills-md`
- `AGENTS.md` มี Goal, Scope, Execute, Rules, Expected Outcome ครบถ้วน
- Workflows, Skills, Review sections อิงจาก dependencies จริง
- ผ่าน `/check-reference` และ `/validate`
- มี commit พร้อม next action จาก `/ask-me`
