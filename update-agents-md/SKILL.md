---
name: update-agents-md
description: Write AGENTS.md according to project analysis and dependencies
---

## Goal

เขียน `AGENTS.md` ตาม project analysis, dependencies และ best practices

## Scope

ใช้สำหรับเขียน `AGENTS.md` ใน workspace ตาม project จริง ถ้าเป็น monorepo ให้เขียนทั้ง root และ workspace level

## Execute

### 1. Check Project Type

ตรวจสอบประเภท project

> Goal: รู้ประเภท project เพื่อเลือก flow ที่ถูกต้อง

1. ทำ `/check-monorepo` เพื่อตรวจสอบว่า project เป็น monorepo หรือไม่
2. ถ้าเป็น monorepo ให้ทำตาม Monorepo section
3. ถ้าไม่ใช่ monorepo ให้ทำตาม Single Project section

### 2. Read Global Workflows

เข้าใจมาตรฐานและป้องกันการซ้ำซ้อน

> Goal: เข้าใจมาตรฐานและไม่ซ้ำซ้อนกับ workflows ที่มีอยู่

1. อ่าน global rules จาก `c:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
2. อ่าน workflows ที่คล้ายกันหรือเกี่ยวข้อง
3. ดูตัวอย่างจาก workflows ที่มีอยู่ใน `global_workflows`

### 3. Analyze Project

วิเคราะห์ project เพื่อเข้าใจ requirements

> Goal: เข้าใจ tech stack, dependencies และ patterns ของ project

1. ทำ `/analyze-project` เพื่อวิเคราะห์ codebase
2. อ่าน `package.json` ทั้ง root และ workspace เพื่อดู dependencies
3. ระบุ tech stack และ frameworks ที่ใช้
4. วิเคราะห์ patterns และ conventions ที่มีอยู่

### 4. Identify Workflows And Skills

ระบุ workflows และ skills ที่ควร follow จาก dependencies

> Goal: รู้ workflows และ skills ที่ต้องเขียนใน AGENTS.md

1. ดู dependencies ใน `package.json` ทั้ง root และ workspace
2. ทำ `/list-global-workflows` เพื่อดู workflows ที่มีอยู่ทั้งหมด
3. ทำ `/list-skills` เพื่อดู skills ในเครื่องทั้งหมด
4. ถ้าไม่มี skills ที่เกี่ยวข้องในเครื่อง ให้ทำ `/search-skills` เพื่อค้นหา skills จาก external registry ที่เกี่ยวข้องกับ dependencies
5. ระบุ workflows ที่ควร follow สำหรับแต่ละ dependency
6. ระบุ skills ที่ควร follow จากผลลัพธ์ของ `/list-skills` และ `/search-skills` (ถ้ามี)
7. ถ้า project ต้องการ refactor หรือ restructure บ่อย ให้ระบุ `/refactor-codebase`

### 5. Identify Reviews

ระบุ review-* workflows ที่ควรใช้จาก project characteristics

> Goal: รู้ review-* workflows ที่เกี่ยวข้องกับ workspace

1. ทำ `/review-codebase-everything` เพื่อดู review dimensions ทั้งหมดที่มี
2. เลือก review-* workflows ที่เกี่ยวข้องกับ workspace ตาม dependencies และ project type
3. ข้าม review-* workflows ที่ไม่เกี่ยวข้องตาม skip conditions ใน `/review-codebase-everything`

### 6. Write AGENTS.md

เขียน `AGENTS.md` ตาม Rules section โดยทำตาม `/follow-write-devin-skills`

> Goal: `AGENTS.md` ที่เขียนตามมาตรฐาน `/follow-write-devin-skills` และ Rules section

1. ทำ `/follow-write-devin-skills` เพื่อเขียนตามมาตรฐาน structure, clarity และ high impact content
2. ทำ `/follow-write-devin-skills` เพื่อเขียนตามมาตรฐาน workflow structure
3. ทำ `/follow-principles-engineering` เพื่อเขียนเป็นหลักการ
4. ตรวจสอบความสม่ำเสมอของ terminology และ format ทั่วทั้งเอกสาร
5. เขียน `AGENTS.md` ตาม Rules section

### 7. Validate And Finalize

ตรวจสอบและ finalize

> Goal: AGENTS.md ผ่าน validation และพร้อมใช้งาน

1. ทำ `/review-delivery` สำหรับปรับปรุงคุณภาพ
2. ตรวจสอบว่าไฟล์ไม่เกิน 250 บรรทัด
3. ตรวจสอบ references ว่ามีอยู่จริง

## Rules

### 1. Monorepo Handling

ถ้าเป็น monorepo ต้องเขียน `AGENTS.md` ทั้ง root และ workspace level

- Root `AGENTS.md` ต้องมี `### Workspaces` ใน `## Rules` ที่ระบุว่าให้ทำตาม `AGENTS.md` ของแต่ละ workspace
- แต่ละ workspace ต้องมี `AGENTS.md` ของตัวเองที่เขียนตาม Rules section ด้านล่าง
- Root `AGENTS.md` ต้องมี `## Goal`, `## Scope`, `## Execute`, `## Rules` (พร้อม `### Workspaces`), `## Expected Outcome`
- Workspace `AGENTS.md` ต้องมี `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`

### 2. Section Structure

โครงสร้าง sections ตาม `/follow-write-devin-skills` format (เรียงลำดับจากบนลงล่าง):

- `## Goal`: อธิบายว่า workspace ทำอะไรและสอดคล้องกับ workspace name
- `## Scope`: ระบุขอบเขตว่าใช้กับอะไรและไม่ทับซ้อนกับ workspaces อื่น
- `## Execute`: steps ที่ต้องทำใน workspace แต่ละ step มี heading → description → `> Goal:` → numbered list
- `## Rules`: จัดกลุ่มเป็นหัวข้อ single concern รวม Project, Architecture, Commands, Workflows, Skills, Review
- `## Expected Outcome`: ผลลัพธ์ที่คาดหวังหลังทำงานใน workspace

Root `AGENTS.md` เพิ่ม `### Workspaces` ใน `## Rules` ที่ระบุว่าให้ทำตาม `AGENTS.md` ของแต่ละ workspace

### 3. Content Language

เนื้อหาใน `AGENTS.md` ที่สร้างต้องเป็นภาษาอังกฤษทั้งหมด

- `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome` ต้องเป็นภาษาอังกฤษทั้งหมด
- `## Execute` descriptions และ `> Goal:` ต้องเป็นภาษาอังกฤษ
- ใช้ backticks สำหรับ `concepts`, `tools`, `terms`, และ `commands`
- ห้ามใช้ภาษาไทยใน `AGENTS.md` ที่สร้างขึ้น

### 4. Execute Format

รูปแบบ `## Execute` ตาม `/follow-write-devin-skills`:

- แต่ละ step ใช้ format: `### N. Step Name` → description → `> Goal:` → numbered list
- ทุก step ต้องมี `> Goal:` ก่อน numbered list
- Steps ไม่เกิน 10
- รวม validation step และ ship step เป็น step สุดท้าย

### 5. Rules Format

รูปแบบ `## Rules` ตาม `/follow-write-devin-skills`:

- จัดกลุ่มเป็นหัวข้อ single concern: `### N. Rule Name`
- แต่ละ rule รวม Project Configuration, Architecture, Commands, Workflows, Skills, Review
- ใช้ bullet points พร้อม colon separator สำหรับ Project Configuration
- ตัวอย่าง: `Project Type: \`cli\``
- ไม่ใช้ตาราง

### 6. Workflow Format

รูปแบบ `## Workflows`:

- ใช้ bullet points พร้อมคำว่า "Follow" และ backticks
- เพิ่มข้อความนำหน้า section: "Workflows used in this project:"
- ตัวอย่าง: `- Follow \`/follow-biome\``
- ไม่ใช้ตาราง
- รวมรายการ workflows ทั้งหมดที่เกี่ยวข้องจาก dependencies ใน `package.json`
- ตรวจสอบทั้ง root และ workspace `package.json`
- รวม workflows สำหรับ: runtime, framework, build tool, linter, formatter, test runner, database, ORM, validation, styling, router, state management, auth, payment, API layer, monorepo, git hooks, deployment, code analysis, unused code detection

### 7. Skills Format

รูปแบบ `## Skills`:

- ใช้ bullet points พร้อมคำว่า "Follow" และ backticks
- เพิ่มข้อความนำหน้า section: "Skills used in this project:"
- ตัวอย่าง: `- Follow \`context7-mcp\``
- ไม่ใช้ตาราง
- รวมรายการ skills ทั้งหมดที่เกี่ยวข้องจาก dependencies ใน `package.json`
- Skills ไม่ใช่ optional - ต้องมี section นี้เสมอ
- ตรวจสอบทั้ง root และ workspace `package.json` สำหรับ dependencies ที่เกี่ยวข้องกับ skills
- รวม skills สำหรับ MCP servers, AI integrations, หรือ specialized tooling
- Skills ที่ควรตรวจสอบ: `mcp-builder`, `frontend-design`, `shadcn-vue`, `vueuse`
- ถ้าไม่มี skills ให้เขียน: `- (No skills needed for this project)`

### 8. Review Format

รูปแบบ `## Review`:

- ใช้ bullet points พร้อมคำว่า "Follow" และ backticks
- เพิ่มข้อความนำหน้า section: "Review workflows for this project:"
- ตัวอย่าง: `- Follow \`/review-code-quality\``
- ไม่ใช้ตาราง
- เลือก review-* workflows จาก `/review-codebase-everything` ตาม project characteristics
- ข้าม review-* workflows ที่ไม่เกี่ยวข้องตาม skip conditions ใน `/review-codebase-everything`
- Root `AGENTS.md` ใน monorepo ให้ระบุว่าให้ดู review-* workflows จาก `/review-codebase-everything` และทำตาม workspace `AGENTS.md` ของแต่ละ workspace
- ถ้าไม่มี reviews ที่เกี่ยวข้อง ให้เขียน: `- (No reviews needed for this project)`

### 9. Write Workflows Compliance

`AGENTS.md` ที่สร้างต้องทำตาม `/follow-write-devin-skills`

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder, generic filler หรือคำสวยแต่ไม่ actionable
- ใช้ active voice ระบุ subject/object ชัดเจน ทุกบรรทัดตีความได้ทางเดียว
- ลำดับ sections ต้อง fixed และ consistent ทุก workspace
- ถ้าแก้ไข `AGENTS.md` เดิม → ต้องไม่ทำลาย references เดิม

## Expected Outcome

- ถ้าเป็น monorepo: root `AGENTS.md` มี `### Workspaces` ใน `## Rules` ที่บอกให้ทำตาม workspace `AGENTS.md`
- ถ้าเป็น monorepo: แต่ละ workspace มี `AGENTS.md` ของตัวเอง
- `AGENTS.md` มี `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome` ครบถ้วนตาม `/follow-write-devin-skills`
- `## Execute` ทุก step มี `> Goal:` ก่อน numbered list
- `## Rules` จัดกลุ่มเป็นหัวข้อ single concern รวม Project, Workflows, Skills, Review
- `## Workflows` เป็น bullet points พร้อม "Follow" และ backticks
- `## Skills` เป็น bullet points พร้อม "Follow" และ backticks - ห้ามว่างหรือหาย
- Workflows อิงจาก dependencies ใน `package.json`
- Skills อิงจาก dependencies ใน `package.json`
- `## Review` อิงจาก `/review-codebase-everything` และ project characteristics
- ไฟล์ไม่เกิน 250 บรรทัด
- เนื้อหาทั้งหมดใน `AGENTS.md` ที่สร้างเป็นภาษาอังกฤษ
