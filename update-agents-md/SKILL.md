---
name: update-agents-md
description: Create or update AGENTS.md with architecture, lib mapping, ship readiness, and workspace rules
---

## Goal

สร้างหรืออัปเดท `AGENTS.md` ด้วย architecture, library mapping, ship readiness และ monorepo workspace rules

## Scope

ใช้สำหรับเขียน `AGENTS.md` ใน root และทุก workspace ตาม project จริง ไม่รวมการ modify source code

## Execute

### 1. Update Project

> Goal: วิเคราะห์ project และสร้าง/อัปเดท root `AGENTS.md`
> Goal: root `AGENTS.md` ครอบคลุม project

1. ทำ `/check-monorepo` เพื่อตรวจสอบ monorepo
2. ทำ `/analyze-project` เพื่อวิเคราะห์ tech stack และ structure
3. ทำ `/all-workspaces` ถ้าเป็น monorepo เพื่อรวบรวม workspaces
4. ทำ `follow-write-devin-skills/references/skill-md.md` และ `/follow-write-devin-skills` เพื่อใช้ format มาตรฐาน
5. อ่าน global rules จาก `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
6. สร้าง/อัปเดท root `AGENTS.md` ด้วย `name`, `description`, `related`
7. ทำ `/follow-skills-map` เพื่อระบุ skills ทีควรใส่ใน `### Skills`
8. เพิ่ม `/improve-codebase` และ `/ask-requirement` ใน `### Skills` ของ `AGENTS.md`
9. ถ้า `context` ไม่ชัดหรือไม่แน่ใจ → ทำ `/ask-requirement` ก่อน
8. เขียน sections `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`

### 2. Follow Lib

> Goal: Map libraries และ dependencies ไปยัง follow skills
> Goal: `### Architecture` ใน `AGENTS.md` ระบุ `tech: /follow-<tech>` ครบถ้วน

1. อ่าน `package.json`, `Cargo.toml`, `pyproject.toml`, หรือ manifest ที่เกี่ยวข้อง
2. ระบุ libraries, frameworks, runtime, build tools ทีใช้
3. map แต่ละ tech ไปยัง `tech: /follow-<tech>` ถ้ามี skill ตรง
4. ถ้าไม่มี skill ตรง ให้ใช้ `tech: /learn-from-web` หรือ `tech: none`
5. อัปเดท `### Architecture` ใน root `AGENTS.md`

### 3. Ship

> Goal: Validate และ commit การเปลี่ยนแปลง `AGENTS.md`
> Goal: `AGENTS.md` ผ่าน validation และถูก commit

1. ทำ `/review-agents-md` เพื่อ review `AGENTS.md`
2. แก้ไข issues ที่พบจนผ่าน
3. ทำ `/validate` เพื่อตรวจสอบความถูกต้อง
4. ทำ `/git-commit` เพื่อ commit การเปลี่ยนแปลง
5. ทำ `/ask-me` เพื่อถามว่าจะ push หรือทำต่อไหม

### 4. Monorepo Workspace Rules

> Goal: สร้าง/อัปเดท `AGENTS.md` สำหรับแต่ละ workspace ถ้าเป็น monorepo
> Goal: ทุก workspace มี `AGENTS.md` ที่ระบุ dependencies ระหว่าง workspaces

1. ทำ `/follow-monorepo` เพื่อเข้าใจ workspace structure
2. สำหรับแต่ละ workspace ระบุ:
   - `name` ใน frontmatter ตรงกับชื่อ workspace
   - `### Architecture` ด้วย `tech: /follow-<tech>` ของ workspace
   - `### Skills` ด้วย `skill-name: /skill-name` ทีใช้
   - `### Workspaces` หรือ `uses:` ระบุ workspace อื่นทีใช้
3. ระบุ dependencies ระหว่าง workspaces จาก `package.json` หรือ source imports
4. ไม่ duplicate เนื้อหาจาก root `AGENTS.md`
5. ทำ `/review-agents-md` เพื่อตรวจสอบทุก workspace `AGENTS.md`

## Rules

### 1. AGENTS.md Format

- ใช้ format ตาม `follow-write-devin-skills/references/skill-md.md` (frontmatter `name`, `description`, `related`)
- มี sections: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
- ไม่มี `## Workflows` หรือ `### Workflows`
- ไฟล์ไม่เกิน 250 บรรทัด

### 2. Architecture Mapping

- ระบุ tech stack ด้วย `tech: /follow-<tech>`
- ถ้าไม่มี skill ตรง ให้ใช้ `tech: /learn-from-web` หรือ `tech: none`
- map ตาม dependencies ใน manifest

### 3. Skills Mapping

- ระบุ skills ด้วย `skill-name: /skill-name`
- รวมทั้ง skills ทีเรียกโดยตรงและอ้างอิงบ่อย

### 4. Workspace Rules

- root `AGENTS.md` ต้องมี `### Workspaces` ระบุทุก workspace
- workspace `AGENTS.md` ต้องระบุ `uses:` หรือ `### Workspaces` ว่าใช้ workspace อื่นใดบ้าง
- ไม่ duplicate root conventions

## Expected Outcome

- root `AGENTS.md` สมบูรณ์
- `### Architecture` ระบุ `tech: /follow-<tech>` ครบ
- `### Skills` ระบุ skills หลักครบ
- ถ้าเป็น monorepo: ทุก workspace มี `AGENTS.md` พร้อม workspace rules
- ผ่าน `/review-agents-md` และ `/validate`
- มี commit พร้อม next action
