---
name: update-docs
description: Write high-quality product or open-source docs with VitePress
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - find_file_by_name
  - exec
triggers:
  - user
  - model
related:
  - follow-project-docs
  - update-readme
  - follow-content-quality
  - check-should-update
  - check-monorepo
  - follow-vitepress
  - report-table
---

## Goal

Write high-quality documentation using real data from source code and VitePress

## Scope

Cover comprehensive documentation writing including features, examples, API docs, references, and development guides for both open-source and product projects

## Execute

### 1. Check Should Update, Project Type, And Distribution Type

ตรวจ git changes, project type, และ distribution type เพื่อกำหนด documentation strategy

> Goal: ยืนยันว่า docs ต้องอัปเดท, ระบุ monorepo/single, และ open-source/product

1. ทำ `/check-should-update` เพื่อตรวจ git changes ว่า docs ต้องอัปเดทหรือไม่ — ถ้าไม่ต้องอัปเดท → stop
2. Run `/check-monorepo` to verify if project is a monorepo
3. Determine distribution type (`open-source` vs `product`):
   - ค้นหา auth signals: `package.json` deps เช่น `next-auth`, `clerk`, `supabase-auth`, `lucia`, `passport`, `firebase-auth`
   - ค้นหาไฟล์ `auth.config.*`, `src/auth/`, `middleware.ts`, `routes/login.*`, `app/login.*`
   - ตรวจ `.env` หรือ `process.env` keys: `AUTH_`, `JWT_`, `CLERK_`, `NEXTAUTH_`, `SUPABASE_`, `FIREBASE_`, `OAUTH_`
   - ถ้าพบ auth → `product`; ถ้าไม่พบ → `open-source`
   - ถ้า `package.json` มี `private: true` หรือ license เป็น commercial → `product`
4. If monorepo, follow Monorepo section
5. If not monorepo, follow Single Project section

### 2. Update Documentation For Single Project

For non-monorepo projects:

> Goal: สร้าง documentation สำหรับ single project ตาม template และ distribution type

1. `/deep-review`, `/analyze-project` เพื่อ analyze project
2. Select template based on project type (Library, Product, CLI, Web) and distribution type
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

> Goal: ตั้งค่า VitePress site พร้อม Vue components, Bun shell scripts, และ nav/sidebar ที่ถูกต้อง

1. ทำ `/follow-project-docs` เพื่อ setup docs site ทั้งหมด (VitePress + Vue components + Bun shell)
2. สำหรับ monorepo ให้สร้าง `docs/` ที่ root และตั้งค่าที่นั่น (ไม่ใช่ `apps/docs/`)
3. สำหรับ single project ให้สร้าง `docs/` ที่ root เช่นกัน
4. เลือก nav/sidebar ตาม distribution type:
   - `product` nav: `Project`, `Features`, `Auth`, `Admin`, `Review`, `Release`, `Development`
   - `open-source` nav: `Project`, `Features`, `Contributing`, `Review`, `Release`, `Development`
   - development sidebar ใช้ร่วมกันใน `development/`
5. กำหนด `docs/.vitepress/config.ts` sidebar ตาม template ใน `update-docs/templates/sidebar-<type>.md`
6. `/follow-project-docs` จะตั้งค่า VitePress, UnoCSS, Vue components, และ Bun shell scripts ให้อัตโนมัติ
7. Add scripts in `package.json`: `dev:docs`, `build:docs`, `preview:docs`

### 5. Content Quality

> Goal: ตรวจสอบและปรับปรุงคุณภาพเนื้อหาครบวงจร

1. ทำ `/follow-content-quality` เพื่อตรวจสอบและปรับปรุงคุณภาพเนื้อหาครบวงจร
2. ตรวจสอบความสม่ำเสมอของ formatting, heading structure, และ style
3. ตรวจสอบว่าเนื้อหาอ่านง่าย สอดคล้องกัน และไม่ซ้ำซ้อน

### 6. Document Workflow Reports

เอกสารต้องอธิบาย report output ของ workflows ที่ใช้ใน project

> Goal: บันทึก report output format ของ analyze-* และ review-* workflows

1. ตรวจสอบว่า `analyze-*` workflows มี report step (เช่น `/report-table`) และบันทึกใน docs ว่าผลลัพธ์อยู่ในรูปแบบใด
2. ตรวจสอบว่า `review-*` workflows มี report step (เช่น `/report-review` หรือ `/report-table`) และบันทึกใน docs
3. บันทึกตัวอย่าง report output ใน docs ถ้าจำเป็น

### 7. Update References

เมื่อแก้ไขไฟล์ ให้อัปเดท references ทั้งหมด

> Goal: อัปเดท references ทั้งหมดเพื่อป้องกัน broken links

1. `/update-reference` เพื่ออัปเดท references ใน project, workflows, skills และไฟล์ที่เกี่ยวข้อง
2. ตรวจสอบว่าไม่มี references ที่เสียหาย

### 8. Build Development Sidebar

สร้าง sidebar สำหรับ developers ทั้ง open-source และ product

> Goal: มี development guide ที่ครอบคลุมสำหรับทั้งสอง distribution type

1. สร้าง directory `docs/development/`
2. สร้างไฟล์:
   - `development/setup.md` - ตั้งค่า environment และ install
   - `development/architecture.md` - Architecture, conventions, และ project structure
   - `development/workflows.md` - Development workflows และ slash commands
   - `development/testing.md` - Testing strategy และ commands
   - `development/ci-cd.md` - CI/CD pipeline และ release process
   - `development/scripts.md` - Bun shell scripts และ common commands
   - `development/troubleshooting.md` - Common issues และ debug tips
3. ใส่ทุกหน้าใน sidebar `development` ตาม `update-docs/templates/sidebar-development.md`

### 9. Build References Section

สร้าง references ตาม distribution type

> Goal: มี references สำหรับ product และ open-source แยกกัน

1. สร้าง `docs/references/` (หรือ `docs/project/references/`)
2. สำหรับ `product` สร้าง:
   - `references/auth.md` - Auth flows, roles, และ endpoints
   - `references/admin.md` - Admin features และ permissions
   - `references/pricing.md` - Plans, limits, และ billing (ถ้ามี)
3. สำหรับ `open-source` สร้าง:
   - `references/contributing.md` - Contribution guidelines, code of conduct, และ PR process
   - `references/license.md` - License summary และ attribution
   - `references/roadmap.md` - Roadmap และ issue labels
4. ใช้ template ใน `update-docs/templates/content-page.md` เขียนเนื้อหาแต่ละหน้า

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
- Required Directories: `project/`, `getting-started/`, `.vitepress/`, `development/`
- Optional Directories: `workspaces/` (monorepo only), `guides/`, `key-concepts/`, `principles/`, `api/`, `examples/`, `reference/`, `templates/`, `workflows/`, `references/`

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
- ตั้งค่า nav ตาม distribution type:
  - `product`: Project, Features, Auth, Admin, Review, Release, Development
  - `open-source`: Project, Features, Contributing, Review, Release, Development

### 5. Distribution Type Detection

- ถ้ามี auth หรือ `private: true` → `product`
- ถ้าไม่มี auth และ license เปิดเผย → `open-source`
- ตรวจสอบ `package.json`, `.env`, `src/auth/`, `auth.config.*`, `middleware.ts`, `routes/login.*`, `app/login.*`
- ไม่สรุป distribution type จากชื่อ repo หรือ description อย่างเดียว

### 6. References Rules

- `product` references: เน้น auth, admin, pricing, API usage
- `open-source` references: เน้น contributing, license, roadmap, community
- references ไม่ซ้ำกับ `development/`
- ทุก reference page ใช้ frontmatter และตาม `update-docs/templates/content-page.md`

## Expected Outcome

- Documentation ตามมาตรฐาน มี structure สอดคล้องกับ template
- Content คุณภาพสูง เขียนจากข้อมูลจริงใน codebase
- ไฟล์ทั้งหมดมี frontmatter
- `index.md` เขียนตาม template ของ `/update-readme`
- สำหรับ monorepo: มี `docs/` เดียวใน root ที่รวมทุก workspaces
- สำหรับ monorepo: workspace pages อยู่ใน `docs/workspaces/` และ nav ลิงก์ไปยังแต่ละ page
- Docs site พร้อมใช้งานตาม `/follow-project-docs` (VitePress + Vue components + Bun shell)
- Nav ถูกต้องตาม distribution type (`product` หรือ `open-source`)
- มี `development/` sidebar สำหรับทั้งสอง distribution type
- มี `references/` แยกสำหรับ product และ open-source
- Report output ของ `analyze-*` และ `review-*` workflows บันทึกใน docs
- References ใน project, workflows, และ skills ถูกอัพเดททั้งหมด
