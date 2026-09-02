---
name: update-agents-md
description: สร้างหรืออัปเดต AGENTS.md ด้วย architecture, platform, target user, lib mapping และ workspace rules
related:
  - follow-agents-md
  - update-devin-global-skills
  - report-workspace-graph
  - follow-monorepo
  - review-rules
  - review-by-stakeholder
  - deep-validate
  - ship
---

## Goal

สร้างหรืออัปเดท `AGENTS.md` ใน root และทุก workspace ด้วย architecture, platform, target user, library mapping, ship readiness และ monorepo workspace rules

## Scope

ใช้สำหรับเขียน `AGENTS.md` ใน root และทุก workspace ตาม project จริง ไม่รวมการ modify source code หรือ ship

## Execute

### 1. Analyze Project

> Goal: วิเคราะห์ project และสร้าง/อัปเดท root `AGENTS.md`

1. ทำ `/check-monorepo` เพื่อตรวจสอบ monorepo
2. ทำ `/analyze-project` เพื่อวิเคราะห์ tech stack และ structure
3. ทำ `/all-workspace` ถ้าเป็น monorepo เพื่อรวบรวม workspaces
4. อ่าน global rules จาก `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
5. ทำ `/ask-project-requirement` ถ้า context หรือ requirements ไม่ชัด
6. ระบุ `platform` และ `target user` จาก context และ dependencies

### 2. Define Architecture

> Goal: ระบุ architecture, tech stack และ libraries

1. อ่าน `package.json`, `Cargo.toml`, `pyproject.toml`, หรือ manifest ที่เกี่ยวข้อง
2. ระบุ libraries, frameworks, runtime, build tools ที่ใช้
3. map แต่ละ tech ไปยัง `tech: /follow-<tech>` ถ้ามี skill ตรง
4. ถ้าไม่มี skill ตรง ให้ใช้ `tech: /learn-from-web` หรือ `tech: none`
5. อัปเดท `### Architecture` ใน root `AGENTS.md`

### 3. Define Platform And Target User

> Goal: ระบุ platform และ target user ใน `AGENTS.md`

1. ระบุ `platform` จาก runtime, OS, deployment target, หรือ environment
2. ระบุ `target user` จาก project domain และผู้ใช้งานสุดท้าย
3. อัปเดท `### Platform` และ `### Target User` ใน root `AGENTS.md`

### 4. Write AGENTS.md

> Goal: เขียน `AGENTS.md` ตามมาตรฐาน

1. ใช้ format ตาม `update-devin-global-skills/SKILL.md` (frontmatter `name`, `description`, `related`)
2. สร้าง sections: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
3. เพิ่ม `### Architecture`, `### Platform`, `### Target User`, `### Skills`, `### Workspaces` ถ้าเกี่ยวข้อง
4. ใช้ `tech: /follow-<tech>` สำหรับ tech mapping
5. ถ้า context ไม่ชัด → stop และ report

### 5. Monorepo Workspace Rules

> Goal: สร้าง/อัปเดท `AGENTS.md` สำหรับแต่ละ workspace ถ้าเป็น monorepo

1. ทำ `/report-workspace-graph` เพื่อวิเคราะห์ dependencies ระหว่าง workspaces ก่อน
2. ทำ `/follow-monorepo` เพื่อเข้าใจ workspace structure
3. สำหรับแต่ละ workspace ระบุ:
   - `name` ใน frontmatter ตรงกับชื่อ workspace
   - `### Architecture` ด้วย `tech: /follow-<tech>` ของ workspace
   - `### Platform` และ `### Target User` ของ workspace
   - `### Skills` ด้วย `skill-name: /skill-name` ที่ใช้
   - `### Workspaces` หรือ `uses:` ระบุ workspace อื่นที่ใช้ ด้วยรูปแบบ `<package> use <other-package>` เช่น `core: use db, web`
4. ระบุ dependencies ระหว่าง workspaces จาก `package.json` หรือ source imports
5. ไม่ duplicate เนื้อหาจาก root `AGENTS.md`
6. ทำ `/review-rules` เพื่อตรวจสอบทุก workspace `AGENTS.md`

### 6. Review By Stakeholder

> Goal: ตรวจสอบ `AGENTS.md` และ project context จากหลายมุมมอง stakeholder ก่อน validate

1. ทำ `/review-by-stakeholder` เพื่อรับมุมมองจาก roleplay stakeholders ทีเหมาะสมกับ project
2. บันทึก findings พร้อม severity, stakeholder, และ recommendation
3. ถ้าพบ issues ทีมีผลต่อ `AGENTS.md` → แก้ไข `AGENTS.md` ก่อนดำเนินต่อ
4. ถ้า findings สำคัญ → ทำ `/ask-me` เพื่อ confirm trade-offs ก่อนเปลี่ยนแปลงขนาดใหญ่
5. สรุป stakeholder coverage map และ top findings ในรายงาน

### 7. Validate

> Goal: ตรวจสอบ `AGENTS.md` ก่อนส่งต่อให้ ship

1. ทำ `/review-rules` เพื่อ review `AGENTS.md`
2. แก้ไข issues ที่พบจนผ่าน
3. ทำ `/deep-validate` เพื่อตรวจสอบความถูกต้อง
4. ถ้าผ่าน → รอ `/ship` หรือ `/git-commit` เพื่อ commit ต่อไป

## Rules

### 1. AGENTS.md Format

- ใช้ format ตาม `update-devin-global-skills/SKILL.md` (frontmatter `name`, `description`, `related`)
- มี sections: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
- ไม่มี `## Workflows` หรือ `### Workflows`
- ไฟล์ไม่เกิน 250 บรรทัด
- `AGENTS.md` ต้องเขียนเป็นภาษาอังกฤษทั้งหมด ไม่มีภาษาอื่นปน

### 2. Architecture Mapping

- ระบุ tech stack ด้วย `tech: /follow-<tech>`
- ถ้าไม่มี skill ตรง ให้ใช้ `tech: /learn-from-web` หรือ `tech: none`
- map ตาม dependencies ใน manifest

### 3. Platform And Target User

- `### Platform` ระบุ runtime, OS, deployment target หรือ environment
- `### Target User` ระบุผู้ใช้งานสุดท้ายหรือ persona
- ไม่ให้ทิ้ง blank ถ้ามีข้อมูลพอระบุ

### 4. Skills Mapping

- ระบุ skills ด้วย `skill-name: /skill-name`
- รวมทั้ง skills ที่เรียกโดยตรงและอ้างอิงบ่อย

### 5. Workspace Rules

- root `AGENTS.md` ต้องมี `### Workspaces` ระบุทุก workspace
- workspace `AGENTS.md` ต้องระบุ `uses:` หรือ `### Workspaces` ว่าใช้ workspace อื่นใดบ้าง
- ใช้รูปแบบ `<package> use <other-package>` เช่น `core: use db, web`
- ก่อนเขียน workspace section ใน monorepo ต้องทำ `/report-workspace-graph` ก่อน
- ไม่ duplicate root conventions

### 6. Stakeholder Review

- ทำ `/review-by-stakeholder` หลังจากเขียน `AGENTS.md` ทั้ง root และ workspace แล้ว
- เลือก stakeholders ตาม context ของ project
- ไม่ต้องรอผลจากทุก roleplay ถ้า findings ชัดเจน
- ถ้า `AGENTS.md` ขาด perspective สำคัญ ให้อัปเดตก่อน `/deep-validate`

- ใช้ /follow-agents-md ถ้าจำเป็น

## Expected Outcome

- root `AGENTS.md` สมบูรณ์
- `### Architecture` ระบุ `tech: /follow-<tech>` ครบ
- `### Platform` และ `### Target User` ถูกต้อง
- `### Skills` ระบุ skills หลักครบ
- ถ้าเป็น monorepo: ทุก workspace มี `AGENTS.md` พร้อม workspace rules
- ได้รับ review จาก stakeholders ทีเหมาะสมก่อน `/deep-validate`
- ผ่าน `/review-rules` และ `/deep-validate`
- ไม่ commit เอง — รอ `/ship` หรือ `/git-commit` ดำเนินการต่อ

