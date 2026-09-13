---
name: update-docs
description: สร้าง documentation สำหรับ project ด้วย VitePress + markdown ไม่ใช้ HTML/UX
argument-hint: "[scope]"
related:
  - check-should-update
  - check-monorepo
  - review-writing
  - update-references
  - run-docs
  - create-report-in-dot-devin
  - watch-browser
  - improve-uxui-and-features
---

## Goal

สร้าง documentation site ด้วย VitePress โดยเขียนเนื้อหาเป็น markdown ปกติ มี sidebar/nav ครบ ไม่ใช้ HTML หรือ UX ซับซ้อน

## Scope

- ตั้งค่า `docs/` สำหรับ single project และ monorepo
- สร้าง/อัปเดท markdown เนื้อหาจริงจาก source code
- ตั้งค่า `docs/.vitepress/config.ts` ให้มี nav และ sidebar
- รองรับ `update-docs features-md` (subskill `features-md`) โดยแยกหน้า `project/features`
- reuse raw findings ที่ skills persist ลง `.devin/reports/<workspace>/` ผ่าน `/create-report-in-dot-devin` — เช่น `/watch-browser-test`, `/improve-uxui-and-features` — เป็น input สำหรับอัปเดต docs

## Execute

### 1. Prepare

> Goal: ระบุ project type, distribution type, และ scope ของ docs

1. ทำ `/check-should-update` ถ้ามี git changes
2. ทำ `/check-monorepo` เพื่อระบุ monorepo
3. ระบุ docs type ตาม detection ใน `references/<type>.md`:
   - `product`: มี auth, `private: true`, license commercial — `references/product.md`
   - `open-source`: ไม่มี auth, license เปิด — `references/open-source.md`
   - `cli`: มี `bin` หรือ CLI framework ใน `package.json` — `references/cli.md`
4. อ่าน `package.json` ระบุ project type (CLI, Library, Web, Product) — ถ้า CLI ให้ใช้ `cli` docs type

### 2. Ensure Docs Structure

> Goal: มี directory structure พื้นฐานสำหรับ VitePress

1. สร้าง `docs/` ที่ root (เสมอ ไม่ใช่ `apps/docs/`)
2. สร้าง `docs/.vitepress/` ถ้ายังไม่มี
3. สร้างโครงสร้างหน้า:
   - `docs/index.md`
   - `docs/project/overview.md`
   - `docs/project/features.md`
   - `docs/getting-started/installation.md`
   - `docs/getting-started/usage.md`
   - `docs/development/setup.md`
   - `docs/development/architecture.md`
   - `docs/development/workflows.md`
   - `docs/development/testing.md`
   - `docs/references/`
   - `docs/roadmap/index.md`
4. ถ้า monorepo ให้เพิ่ม `docs/project/workspaces.md` และ `docs/workspaces/<name>.md`
5. เพิ่มหน้าเฉพาะ type จาก `references/<type>.md` เช่น `docs/commands/` สำหรับ `cli`, `docs/references/contributing.md` สำหรับ `open-source`, `docs/references/auth.md` สำหรับ `product`

### 3. Update VitePress Config

> Goal: ตั้งค่า nav และ sidebar ตาม docs type ที่ detect

1. อ่าน `references/<type>.md` (`open-source`, `product`, `cli`) สำหรับ nav, sidebar sections และ content focus
2. สร้าง/อัปเดท `docs/.vitepress/config.ts` — full structure จาก `references/vitepress-config.md`, nav จาก `templates/nav-config.md`, sidebar จาก `templates/sidebar-<type>.md`; ถ้า multi-language → `references/i18n.md`
3. ใช้ `templates/sidebar-development.md` สำหรับหมวด `/development/` ที่ share กันทุก type
4. ถ้า monorepo → เพิ่ม sidebar จาก `templates/sidebar-monorepo.md`
5. ใช้ `collapsed: true` เมื่อหมวดมีหลายหน้า
6. ไม่ต้องใช้ Vue components ซับซ้อน ใช้ markdown ธรรมดา
7. ดูรายการ templates ทั้งหมดใน `templates/index.md`

### 4. Write Content Pages

> Goal: เนื้อหาจากข้อมูลจริงใน project

1. `index.md`: ใช้ `templates/homepage.md` — title, tagline, features list, quick start link, actions
2. ทุกหน้าใช้ template เฉพาะจาก `templates/index.md` — fallback `templates/content-page.md` เฉพาะหน้าที่ไม่มี template เฉพาะ
3. `project/overview.md`: ใช้ `templates/overview.md` — สรุป project, architecture, tech stack, key concepts
4. `project/features.md`: ใช้ `templates/features.md` — รายการ features ทั้งหมดจาก `update-docs features-md` หรือ analyze
5. `getting-started/installation.md`: ใช้ `templates/installation.md` — ขั้นตอนติดตั้ง ตรวจ dependencies
6. `getting-started/usage.md`: ใช้ `templates/usage.md` — ตัวอย่างใช้งานจริง
7. `development/setup.md`: ตั้งค่า dev environment
8. `development/architecture.md`: ใช้ `templates/architecture.md` — สถาปัตยกรรม, conventions, boundaries
9. `development/workflows.md`: ใช้ `templates/workflows.md` — slash commands, scripts, CI/CD
10. `development/testing.md`: ใช้ `templates/testing.md` — วิธี run test, lint, typecheck + `## Latest Results` จาก runner artifacts จริงใน `.devin/reports/<workspace>/` (Vitest `vitest-*.json`/`unit-test-*.md`, Playwright `playwright-*.json`/`e2e-*.md`, `coverage-*`) — ห้ามใส่ exploratory results (`browser-test-*`, `e2e-exploratory-*`, `uxui-*`) ลง Latest Results; ถ้าไม่มี artifacts ให้เขียนเฉพาะส่วน commands/runners
11. `references/`: สรุป references ด้วย templates เฉพาะ — `api.md`/`configuration.md`/`changelog.md`/`faq.md`/`glossary.md` ใช้ template ชื่อเดียวกัน; open-source type เพิ่ม `contributing.md` ด้วย `templates/contributing.md`; product type เพิ่ม `auth.md` ด้วย `templates/auth.md`; cli type เพิ่ม `commands/<name>.md` ด้วย `templates/commands.md`; `development/deployment.md` ใช้ `templates/deployment.md`
12. `roadmap/index.md`: ใช้ `templates/roadmap.md` — สรุป roadmap (Now/Next/Later)
13. monorepo: `workspaces/<name>.md` ใช้ `templates/workspace.md`

### 5. Integrate `update-docs features-md`

> Goal: หน้า existing features ถูกต้อง

1. ถ้า `/update-docs-features-md` เรียกมา จะมีข้อมูล features จาก routes/modules/schemas/API
2. เขียน `docs/project/features.md` ด้วยตาราง markdown
3. แต่ละ row มี name, description, module, status
4. จัดกลุ่มตาม domain ด้วย heading หรือ sub-section
5. ไม่ต้องมี dropdown ใช้ heading และ bullet ธรรมดา

### 6. Content Quality

> Goal: เนื้อหาอ่านง่าย สม่ำเสมอ ไม่ซ้ำ

1. ทำ `/review-writing`
2. ตรวจ heading structure, frontmatter, links
3. แก้ไขซ้ำซ้อนหรือ placeholder

### 7. Update References

> Goal: links ไม่เสีย

1. ทำ `/update-references`
2. ตรวจ internal links, nav, sidebar paths
3. อัปเดท README ให้ลิงก์ไป docs

### Doc Skills

> Goal: dispatch งาน markdown docs เฉพาะไฟล์ไปยัง skill ที่ละเอียดกว่า

| Domain | Topic | Skill |
|--------|-------|-------|
| `agents-md` | สร้าง/อัปเดต `AGENTS.md` root + workspaces | `/update-docs-agents-md` |
| `contributing-md` | สร้าง/อัปเดต `CONTRIBUTING.md` | `/update-docs-contributing-md` |
| `features-md` | วิเคราะห์ features เขียน `FEATURES.md` | `/update-docs-features-md` |
| `readme-md` | สร้าง `README.md` + `LICENSE.md` จาก template | `/update-docs-readme-md` |
| `todo-md` | จัดการ `TODO.md` (add/read/enhance prompt) | `/update-docs-todo-md` |
| `usage-md` | สร้าง/อัปเดต `USAGE.md` จาก code จริง | `/update-docs-usage-md` |

## Rules

### 1. Markdown Only

- เขียนเนื้อหาด้วย markdown ธรรมดา
- ห้ามสร้าง HTML report, interactive table, หรือ UX ซับซ้อน
- ตารางใช้ markdown table ได้
- ไม่ใช้ Vue components ยกเว้น `:::` ของ VitePress เมื่อจำเป็น

### 2. Sidebar And Nav

- `docs/.vitepress/config.ts` ต้องมี nav และ sidebar ตาม `references/<type>.md` และ `templates/sidebar-<type>.md`
- sidebar มีหมวดหลัก: Project, Getting Started, Roadmap, Development, References — เพิ่ม Commands สำหรับ `cli` และ Workspaces สำหรับ monorepo
- แต่ละหมวด `collapsed: true` ถ้ามี >5 หน้า
- ใช้ relative path เริ่มต้นด้วย `/`
- nav กำหนดจาก `templates/nav-config.md` เท่านั้น ไม่ซ้ำกำหนด nav ใน sidebar templates
- ดู official resources ใน `references/website.md`

### 3. Frontmatter

- ทุก markdown ไฟล์ต้องมี frontmatter:
  ```yaml
  ---
  title: Page Title
  description: Short description
  ---
  ```
- title ใช้ Title Case
- description ≤ 120 ตัวอักษร

### 4. Feature Tables

- `docs/project/features.md` ใช้ table `| Feature | Description | Module | Status |`

### 5. Language

- เนื้อหา markdown ใช้ภาษาของ project หรือภาษาอังกฤษ
- ห้ามผสมภาษาในย่อหน้าเดียวกัน

### 6. No Workspace Duplicates

- monorepo สร้าง `docs/` เดียวที่ root
- ห้ามสร้าง `docs/` ในแต่ละ workspace
- workspace pages อยู่ `docs/workspaces/<name>.md`

### 7. Real Data

- เนื้อหาต้องมาจาก source code จริง
- examples ต้องรันได้
- ไม่ใช้ placeholder หรือ lorem ipsum
- ใช้ /run-docs ถ้าจำเป็น

## Expected Outcome

- `docs/` directory ที่ root มี VitePress config, nav, sidebar
- Markdown files สมบูรณ์: index, project, features, getting-started, roadmap, development, references
- `docs/project/features.md` มีตาราง features จาก `update-docs features-md`
- `docs/roadmap/index.md` มี Now/Next/Later จาก `templates/roadmap.md`
- ทุกไฟล์มี frontmatter
- ไม่มี HTML/UX ซับซ้อน
- Links ถูกต้อง ไม่เสีย
- README อัปเดทลิงก์ไป docs

