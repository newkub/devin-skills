---
name: update-agents-md
description: สร้างหรืออัปเดท AGENTS.md โดยไม่มี workflows และมี architecture พร้อม
  skills mapping
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
- analyze-project
- check-monorepo
- follow-write-devin-skills
- review-codebase
- git-commit
- ask-me
---

## Goal

สร้างหรืออัปเดท `AGENTS.md` ตาม project analysis, dependencies และ architecture สำหรับ root และทุก workspace ใน monorepo โดยไม่มี `## Workflows` และ map skills ในรูปแบบ `tech: /follow-<tech>`

## Scope

ใช้สำหรับเขียน `AGENTS.md` ใน workspace ตาม project จริง ถ้าเป็น monorepo ให้เขียนทั้ง root และ workspace level

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

> Goal: เข้าใจ tech stack, dependencies และ patterns

1. ทำ `/analyze-project` เพื่อวิเคราะห์ codebase
2. ทำ `/all-workspaces` เพื่อรวบรวมและจัดลำดับ workspaces
3. อ่าน `package.json` ทั้ง root และ target workspaces
4. ระบุ tech stack, frameworks, runtime, build tools ที่ใช้

### 3. Plan AGENTS.md

วางแผนรายละเอียดก่อนเขียน

> Goal: มีแผนครอบคลุมทุก workspace

1. ทำ `/deep-plan` ถ้างานซับซ้อนหรือหลาย workspace
2. ระบุรูปแบบ `AGENTS.md` ตาม `/follow-devin-skills-md`
3. ระบุ `## Architecture` จาก dependencies โดย map `tech: /follow-<tech>`
4. ระบุ `## Skills` จาก skills ที่เกี่ยวข้อง
5. จัดลำดับ: root → foundation packages → apps → integrations

### 4. Read References

อ่าน references ก่อนเขียน

> Goal: ใช้มาตรฐานที่ถูกต้องและไม่ซ้ำซ้อน

1. ทำ `/follow-devin-skills-md` เพื่อใช้ format มาตรฐาน
2. ทำ `/follow-write-devin-skills` เพื่อรักษา structure
3. อ่าน global rules จาก `c:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
4. ทำ `/read-related-skills` สำหรับ skills ที่เกี่ยวข้อง

### 5. Write Root AGENTS.md

สร้างหรืออัปเดท root `AGENTS.md`

> Goal: root AGENTS.md ครอบคลุมทุก workspace

1. สร้าง frontmatter ด้วย `name`, `description`, `related`
2. ระบุ `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
3. ใน `## Rules` เพิ่ม `### Architecture` ด้วย project-wide tech ในรูปแบบ `tech: /follow-<tech>`
4. เพิ่ม `### Skills` ด้วย skills หลักในรูปแบบ `skill-name: /skill-name`
5. เพิ่ม `### Workspaces` ที่บอกให้ทำตาม workspace `AGENTS.md`
6. ใช้ภาษาอังกฤษทั้งหมด ใช้ backticks สำหรับ paths/commands/skills

### 6. Write Workspace AGENTS.md

สร้างหรืออัปเดท workspace `AGENTS.md` แต่ละ target

> Goal: แต่ละ workspace มี AGENTS.md ที่สอดคล้องกับ dependencies

1. สำหรับแต่ละ target workspace สร้าง/อัปเดท `AGENTS.md`
2. สร้าง frontmatter ด้วย `name`, `description`, `related`
3. ระบุ sections Goal, Scope, Execute, Rules, Expected Outcome
4. ใน `### Architecture` ระบุ tech stack ของ workspace ด้วย `tech: /follow-<tech>`
5. ใน `### Skills` ระบุ skills ที่ใช้ใน workspace
6. รวม review จาก `/review-codebase` ตาม project characteristics
7. ทำซ้ำจนครบทุก target workspace

### 7. Validate And Finalize

ตรวจสอบและ finalize

> Goal: AGENTS.md ผ่าน validation

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
- ไม่มี `## Workflows` หรือ `### Workflows`

### 3. Architecture Section

- ระบุ tech stack ทีใช้ในรูปแบบ `tech: /follow-<tech>`
- ถ้าไม่มี skill ทีตรง ให้ระบุ `tech: none` หรือ `tech: /learn-from-web`
- map ตาม dependencies ใน `package.json`

### 4. Skills Section

- ระบุ skills ทีใช้ในรูปแบบ `skill-name: /skill-name`
- รวมทั้ง skills ทีเรียกโดยตรงและ skills ทีอ้างอิงบ่่อย

### 5. Root AGENTS.md

- ต้องมี `### Workspaces` ใน `## Rules`
- ระบุให้ทำตาม workspace `AGENTS.md` ของแต่ละ workspace
- ครอบคลุม project-wide conventions

### 6. Workspace AGENTS.md

- ระบุ `name` ใน frontmatter ตรงกับชื่อ workspace
- ระบุ `## Architecture` และ `### Skills` ตาม dependencies
- ไม่ duplicate เนื้อหาจาก root

## Expected Outcome

- ถ้าเป็น monorepo: root `AGENTS.md` และ workspace `AGENTS.md` ทุก target สมบูรณ์
- `AGENTS.md` มี frontmatter ตาม `/follow-devin-skills-md`
- `AGENTS.md` มี `## Architecture` ด้วย `tech: /follow-<tech>`
- `AGENTS.md` มี `### Skills` ด้วย `skill-name: /skill-name`
- ไม่มี `## Workflows` หรือ `### Workflows`
- ผ่าน `/check-reference` และ `/validate`
- มี commit พร้อม next action จาก `/ask-me`
