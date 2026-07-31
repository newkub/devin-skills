---
name: update-docs
description: Write high-quality documentation with VitePress
---

## Goal

Write high-quality documentation using real data from source code and VitePress

## Scope

Cover comprehensive documentation writing including features, examples, API docs, and references

## Execute

### 1. Check Should Update And Project Type

ตรวจ git changes และ project type เพื่อกำหนด documentation strategy

> Goal: ยืนยันว่า docs ต้องอัปเดท และระบุว่า project เป็น monorepo หรือ single project

1. ทำ `/check-should-update` เพื่อตรวจ git changes ว่า docs ต้องอัปเดทหรือไม่ — ถ้าไม่ต้องอัปเดท → stop
2. Run `/check-monorepo` to verify if project is a monorepo
3. If monorepo, follow Monorepo section
4. If not monorepo, follow Single Project section

### 2. Update Documentation For Single Project

For non-monorepo projects:

> Goal: สร้าง documentation สำหรับ single project ตาม template

1. `/deep-review`, `/analyze-project` เพื่อ analyze project
2. Select template based on project type (Library, Product, CLI, Web)
3. Create `docs/` folder and structure according to template
4. Write real content in main files:
   - `project/overview.md` - Project overview with features and architecture
   - `project/features.md` - Detailed features with examples
   - `getting-started/installation.md` - Installation guide with examples
   - `getting-started/usage.md` - Usage examples that work
5. Write `index.md` according to `/update-readme` template (Features table, Key Concepts, Tech Stack, Quick Start)
6. Use frontmatter for all files

### 3. Update Documentation For Monorepo

For monorepos with many workspaces:

> Goal: สร้าง documentation สำหรับ monorepo ที่รวมทุก workspaces ใน docs/ เดียว

1. `/deep-review`, `/analyze-project` เพื่อ analyze entire project
2. Run `/all-workspaces` to discover and prioritize workspaces
3. Create single `docs/` folder in root directory only
4. ห้ามสร้าง `docs/` ในแต่ละ workspace ภายใต้ `packages/`, `apps/`, หรือ `framework/`
5. Write real content in main files:
   - `project/overview.md` - Entire monorepo overview with features and architecture
   - `project/features.md` - Detailed features of all workspaces with examples
   - `project/workspaces.md` - Details of each workspace (summary + link ไปยัง workspace page)
   - `getting-started/installation.md` - Installation guide with examples
   - `getting-started/usage.md` - Usage examples that work
6. สร้างหน้า documentation สำหรับแต่ละ workspace ภายใต้ `docs/workspaces/` เช่น `docs/workspaces/core-shared.md`, `docs/workspaces/cli-release.md`
7. ใช้ VitePress nav ลิงก์ไปยัง workspace pages แทนการเขียนเนื้อหาซ้ำในหลายไฟล์
8. Write `index.md` according to `/update-readme` template (Features table, Key Concepts, Tech Stack, Quick Start)
9. Use frontmatter for all files

### 4. Setup Project Docs Site

ตั้งค่า docs site โดยทำตาม `/follow-project-docs` ซึ่งรวม VitePress setup, Vue components, และ Bun shell data scripts

> Goal: ตั้งค่า VitePress site พร้อม Vue components และ Bun shell scripts — reminder: workflow นี้ทำ documentation ที่รวมทุก workspaces ใน docs/ เดียว

1. ทำ `/follow-project-docs` เพื่อ setup docs site ทั้งหมด (VitePress + Vue components + Bun shell)
2. สำหรับ monorepo ให้สร้าง `docs/` ที่ root และตั้งค่าที่นั่น (ไม่ใช่ `apps/docs/`)
3. สำหรับ single project ให้สร้าง `docs/` ที่ root เช่นกัน
4. `/follow-project-docs` จะตั้งค่า VitePress, UnoCSS, Vue components, และ Bun shell scripts ให้อัตโนมัติ
5. สร้าง nav 4 sections: Project, Features, Review, Release ตาม `/follow-project-docs`
6. สำหรับ monorepo ให้ nav ลิงก์ไปยัง workspace pages ใน `docs/workspaces/` เพิ่มเติม
7. Add scripts in `package.json`: `dev:docs`, `build:docs`, `preview:docs`

### 5. Content Quality

> Goal: ตรวจสอบและปรับปรุงคุณภาพเนื้อหาครบวงจร

1. ทำ `/follow-content-quality` เพื่อตรวจสอบและปรับปรุงคุณภาพเนื้อหาครบวงจร
2. ตรวจสอบความสม่ำเสมอของ formatting, heading structure, และ style
3. ตรวจสอบว่าเนื้อหาอ่านง่าย สอดคล้องกัน และไม่ซ้ำซ้อน

### 6. Document Workflow Reports

เอกสารต้องอธิบาย report output ของ workflows ที่ใช้ใน project

> Goal: บันทึก report output format ของ analyze-* และ review-* workflows

1. ตรวจสอบว่า `analyze-*` workflows มี report step (เช่น `/report-format-table`) และบันทึกใน docs ว่าผลลัพธ์อยู่ในรูปแบบใด
2. ตรวจสอบว่า `review-*` workflows มี report step (เช่น `/report-review` หรือ `/report-format-table`) และบันทึกใน docs
3. บันทึกตัวอย่าง report output ใน docs ถ้าจำเป็น

### 7. Update References

เมื่อแก้ไขไฟล์ ให้อัปเดท references ทั้งหมด

> Goal: อัปเดท references ทั้งหมดเพื่อป้องกัน broken links

1. `/update-reference`, `/update-reference` เพื่ออัปเดท references ใน project, workflows, skills และไฟล์ที่เกี่ยวข้อง
2. ตรวจสอบว่าไม่มี references ที่เสียหาย

## Rules

### 1. Documentation Principles

- เขียนจากข้อมูลจริงใน codebase ไม่ใช่สมมติ
- ใช้ examples ที่ทำงานได้จริง ไม่ใช่ placeholder
- ทุกไฟล์ต้องมี frontmatter
- `index.md` เขียนตาม template ของ `/update-readme`
- ถ้า project มี `analyze-*` หรือ `review-*` workflows ต้องบันทึก report output format ใน docs

### 2. Directory Structure

ใช้ structure ตามประเภท project (Library, Product, CLI, Web, Monorepo):

- Required Files: `index.md`, `.vitepress/config.ts`
- Required Directories: `project/`, `getting-started/`, `.vitepress/`
- Optional Directories: `workspaces/` (monorepo only), `guides/`, `key-concepts/`, `principles/`, `api/`, `examples/`, `reference/`, `templates/`, `workflows/`, `development/`

### 3. Monorepo Rules

- มี `docs/` เดียวใน root directory เท่านั้น
- ห้ามสร้าง `docs/` ในแต่ละ workspace
- จัดลำดับ workspaces ตามความสำคัญ (foundation packages ก่อน)
- ใน `project/workspaces.md` เขียนเพียง summary และ link ไปยัง workspace page

### 4. Project Docs Site Rules

- ทำ `/follow-project-docs` สำหรับ setup ทั้งหมด ไม่ต้องเรียก `/follow-vitepress` แยก
- สำหรับ monorepo สร้าง `docs/` ที่ root ไม่ใช่ `apps/docs/`
- ใช้ Vue components แทน markdown ธรรมดา
- ใช้ Bun shell scripts ดึงข้อมูลจริง
- ตั้งค่า nav 4 sections: Project, Features, Review, Release

## Expected Outcome

- Documentation ตามมาตรฐาน มี structure สอดคล้องกับ template
- Content คุณภาพสูง เขียนจากข้อมูลจริงใน codebase
- ไฟล์ทั้งหมดมี frontmatter
- `index.md` เขียนตาม template ของ `/update-readme`
- สำหรับ monorepo: มี `docs/` เดียวใน root ที่รวมทุก workspaces
- สำหรับ monorepo: workspace pages อยู่ใน `docs/workspaces/` และ nav ลิงก์ไปยังแต่ละ page
- Docs site พร้อมใช้งานตาม `/follow-project-docs` (VitePress + Vue components + Bun shell)
- Nav 4 sections: Project, Features, Review, Release
- Report output ของ `analyze-*` และ `review-*` workflows บันทึกใน docs
- References ใน project, workflows, และ skills ถูกอัพเดททั้งหมด
