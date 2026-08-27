---
name: review-docs
description: ตรวจสอบ docs structure ก่อน update-docs แก้ไข ครอบคลุม VitePress config และ content
---

## Goal

Review documentation structure ก่อนเรียก `update-docs` เพื่อยืนยันว่า `docs/` directory, VitePress config, nav/sidebar, content pages, frontmatter และ links ครบถ้วนและถูกต้อง

## Scope

ใช้ก่อนเรียก `update-docs` — ตรวจ `docs/` structure, VitePress config, content quality และ link integrity ทำ review เท่านั้น ไม่แก้ไข docs ระหว่าง review ไม่ตรวจ features coverage (scope ของ `review-features`)

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project structure และ docs target

1. ทำ `/scan-codebase` เพื่อดู project structure
2. ทำ `/check-monorepo` เพื่อยืนยัน monorepo status
3. ตรวจว่า `docs/` directory มีอยู่ที่ root ถ้าไม่ → flag เป็น critical
4. บันทึก workspace list ถ้าเป็น monorepo

### 2. Check Docs Structure

> Goal: ตรวจ `docs/` directory structure ครบถ้วน

ดู `references/structure.md` สำหรับ required directories และ pages

1. ตรวจว่า `docs/` อยู่ที่ root (ไม่ใช่ `apps/docs/`)
2. ตรวจว่า `docs/.vitepress/` มีอยู่
3. ตรวจ required pages: `index.md`, `project/overview.md`, `project/features.md`, `getting-started/installation.md`, `getting-started/usage.md`, `development/setup.md`, `development/architecture.md`, `development/workflows.md`, `development/testing.md`, `references/index.md`, `roadmap/index.md`
4. ถ้า monorepo ตรวจ `docs/project/workspaces.md` และ `docs/workspaces/<name>.md`
5. บันทึก findings พร้อม evidence

### 3. Check VitePress Config

> Goal: ตรวจ nav และ sidebar ครบถ้วน

ดู `references/vitepress-config.md` สำหรับ nav/sidebar validation rules

1. ตรวจว่า `docs/.vitepress/config.ts` มีอยู่และเป็น valid TypeScript
2. ตรวจ nav มีอย่างน้อย: Project, Features, Getting Started, Roadmap, Development, References
3. ตรวจ sidebar มีอย่างน้อย 5 หมวด: Project, Getting Started, Roadmap, Development, References
4. ตรวจว่าหมวดที่มี >5 หน้าใช้ `collapsed: true`
5. ตรวจว่าใช้ relative path เริ่มต้นด้วย `/`
6. บันทึก findings พร้อม evidence

### 4. Check Frontmatter

> Goal: ตรวจ frontmatter ในทุก markdown ไฟล์

ดู `references/frontmatter.md` สำหรับ frontmatter validation rules

1. ตรวจว่าทุก markdown ไฟล์มี frontmatter `title` และ `description`
2. ตรวจว่า `title` ใช้ Title Case
3. ตรวจว่า `description` ไม่เกิน 120 ตัวอักษร
4. บันทึก findings พร้อม evidence

### 5. Check Content Quality

> Goal: ตรวจ content quality และ real data

ดู `references/content-quality.md` สำหรับ content validation rules

1. ตรวจว่าเนื้อหามาจาก source code จริง ไม่ใช่ placeholder หรือ lorem ipsum
2. ตรวจว่า examples รันได้จริง
3. ตรวจว่าไม่มี HTML หรือ UX ซับซ้อน — markdown only
4. ตรวจว่าไม่ผสมภาษาในย่อหน้าเดียวกัน
5. บันทึก findings พร้อม evidence

### 6. Check No Workspace Duplicates

> Goal: ตรวจไม่มี duplicated docs ใน monorepo

1. ตรวจว่าไม่มี `docs/` ในแต่ละ workspace
2. ตรวจว่า workspace pages อยู่ใน `docs/workspaces/<name>.md`
3. บันทึก findings พร้อม evidence

### 7. Check Links

> Goal: ตรวจ internal links และ references

1. ทำ `/check-reference` เพื่อยืนยัน internal links ไม่เสีย
2. ตรวจ nav และ sidebar paths ชี้ไปยังไฟล์ที่มีอยู่จริง
3. ตรวจว่า README ลิงก์ไป docs
4. บันทึก findings พร้อม evidence

### 8. Score And Report

> Goal: สรุป review score และ findings

ดู `references/scoring.md` สำหรับ severity weights และ grade mapping

1. คำนวณ review score = weighted average (Critical=0, High=25, Medium=50, Low=75, Info=100)
2. กำหนด grade: A (90+), B (80+), C (70+), D (60+), F (<60)
3. ทำ `/report-table` พร้อม findings: Category, Severity, Finding, Evidence, Action
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข docs ระหว่าง review
- ถ้าต้องแก้ไข ให้เรียก `update-docs` หลัง review
- ทุก finding ต้องมี file path และ evidence

### 2. Scope Coordination

- ตรวจ `docs/` structure, VitePress config, content quality, links
- ไม่ตรวจ features coverage — ใช้ `review-features` แทน
- ไม่ตรวจ README format — ใช้ `review-readme-md` แทน
- ถ้า findings ซ้อนทับกับ `review-features` หรือ `review-readme-md` → อ้างอิงแทน ไม่ทำซ้ำ

### 3. Severity Ratings

- `Critical`: ไม่มี `docs/`, ไม่มี VitePress config, ไม่มี required pages
- `High`: nav/sidebar ขาด, frontmatter ขาด, placeholder แทนข้อมูลจริง
- `Medium`: collapsed ขาด, description เกิน 120, HTML แทน markdown
- `Low`: workspace duplicates, ผสมภาษา, links ไม่ตรง
- `Info`: ข้อเสนอแนะ ไม่กระทบการทำงาน

### 4. Scoring

- review score = weighted average ของ findings ทั้งหมด
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำให้เรียก `update-docs` ก่อนดำเนินการ

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Docs Review พร้อม score และ grade
- รายงาน findings พร้อม severity, evidence และ action required
- ยืนยัน docs structure, VitePress config, frontmatter ครบถ้วน
- ยืนยัน content quality และ links ถูกต้อง
- ยืนยันไม่มี workspace duplicates
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
