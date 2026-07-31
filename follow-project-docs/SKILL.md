---
name: follow-project-docs
description: สร้าง project docs site ด้วย VitePress + Vue components + Bun shell ดึงข้อมูลจริง
---

## Goal

สร้าง project documentation site ที่ใช้ Vue components และ Bun shell ดึงข้อมูลจริงจาก project แทนการเขียน markdown ธรรมดา

## Scope

ใช้สำหรับสร้าง docs site ที่มี 4 nav sections: Project, Features, Review, Release — แต่ละ section ใช้ Vue components สำหรับ visual UX/UI และ Bun shell scripts สำหรับดึงข้อมูลจริง

## Execute

### 1. Setup VitePress And Vue Components

1. ทำ `/follow-vitepress` เพื่อตั้งค่า VitePress พื้นฐาน
2. ทำ `/follow-unocss` เพื่อตั้งค่า UnoCSS สำหรับ styling
3. สร้าง `.vitepress/theme/components/` สำหรับ Vue components
4. ลงทะเบียน components ใน `.vitepress/theme/index.ts`
5. สร้าง home page ด้วย VitePress `layout: home`

### 2. Configure Nav And Sidebar

ตั้งค่า nav 4 sections ใน `.vitepress/config.ts`:

```ts
nav: [
  { text: 'Project', link: '/project/' },
  { text: 'Features', link: '/features/' },
  { text: 'Review', link: '/review/' },
  { text: 'Release', link: '/release/' },
]
```

### 3. Create Bun Shell Data Scripts

สร้าง scripts ดึงข้อมูลจริงจาก project ใน `.vitepress/scripts/`:

1. สร้าง `data/project.ts` — ดึง project info ด้วย `Bun.$` (package.json, workspaces, tech stack)
2. สร้าง `data/features.ts` — ดึง features จาก source code (route files, modules)
3. สร้าง `data/test-results.ts` — ดึง test results จาก vitest output
4. สร้าง `data/releases.ts` — ดึง git tags, GitHub releases, commit history ด้วย `Bun.$`
5. ใช้ `Bun.$` template literals สำหรับ shell commands
6. Export เป็น functions ที่ Vue components เรียกใช้ได้

### 4. Project Section (Vue Components)

1. สร้าง `ProjectOverview.vue` — แสดง project info จาก `data/project.ts`
2. สร้าง `ProjectArchitecture.vue` — แสดง architecture diagram และ tech stack
3. สร้าง `WorkspaceCards.vue` — แสดง workspaces เป็น card grid (monorepo only)
4. ใช้ UnoCSS utilities สำหรับ card layout, spacing, colors

### 5. Features Section (Vue Components)

1. สร้าง `FeaturesTable.vue` — แสดง features แบบ interactive table
2. ดึงข้อมูลจาก `data/features.ts` ที่ scan source code จริง
3. Features ของ table:
   - Column sorting (by name, status, category)
   - Column filtering (by category, status)
   - Search box สำหรับ filter by keyword
   - Row expansion สำหรับดูรายละเอียด
4. ใช้ UnoCSS สำหรับ table styling, hover states, zebra stripes

### 6. Review Section (Vue Components)

1. สร้าง `ReviewSidebar.vue` — sidebar navigation สำหรับ review categories
2. สร้าง `TestResults.vue` — แสดง test results จาก `data/test-results.ts`:
   - Pass/fail counts พร้อม progress bars
   - Coverage metrics พร้อม visual indicators
   - Test suite breakdown ตาม workspace
   - Failed test details พร้อม expand/collapse
3. สร้าง `CodeReview.vue` — แสดง code review findings พร้อม severity badges
4. ใช้ sidebar layout สำหรับ navigation ระหว่าง review categories

### 7. Release Section (Vue Components)

1. สร้าง `ReleaseTimeline.vue` — แสดง release history แบบ timeline
2. สร้าง `ChangelogViewer.vue` — แสดง changelog จาก `data/releases.ts`
3. สร้าง `CommitHistory.vue` — แสดง commit history พร้อม:
   - Filter sidebar สำหรับ filter by type (feat, fix, refactor)
   - Commit timeline แสดง date, author, message
   - File history สำหรับแต่ละ commit (expand/collapse)
4. ดึงข้อมูลจาก `Bun.$`:
   - `git tag --list --sort=-version:refname` สำหรับ version history
   - `gh release list` สำหรับ GitHub releases
   - `git log --oneline --format=...` สำหรับ commit history

### 8. UX/UI Design

1. ใช้ VitePress `layout: home` สำหรับ home page พร้อม hero และ feature cards
2. ออกแบบ card components สำหรับ project และ release sections
3. ออกแบบ table components สำหรับ features section
4. ออกแบบ sidebar layout สำหรับ review section
5. ออกแบบ timeline component สำหรับ release history
6. ใช้ UnoCSS utilities สำหรับ styling ทั้งหมด
7. ตรวจสอบ responsive behavior บน mobile และ tablet
8. ใช้ transitions และ animations สำหรับ interactive elements

## Rules

### 1. Vue Components Over Markdown

- ใช้ Vue components (`.vue`) แทนการเขียน markdown ธรรมดา
- หน้า markdown (`.md`) ใช้เฉพาะสำหรับ frontmatter และ import Vue components
- ลงทะเบียน components ใน `.vitepress/theme/index.ts`

### 2. Bun Shell For Real Data

- ใช้ `Bun.$` template literals สำหรับดึงข้อมูลจาก project จริง
- ไม่เขียน content แบบ hardcoded — ดึงจาก source code, git, และ CI
- สร้าง data scripts ใน `.vitepress/scripts/data/`
- Export เป็น async functions ที่ Vue components เรียกใช้

### 3. VitePress Configuration

- ทำ `/follow-vitepress` สำหรับ VitePress setup
- ใช้ UnoCSS สำหรับ styling
- ใช้ `layout: home` สำหรับ home page
- 4 nav sections: Project, Features, Review, Release

### 4. Visual UX/UI

- ใช้ card layout สำหรับ project และ release sections
- ใช้ interactive table สำหรับ features section
- ใช้ sidebar layout สำหรับ review section
- ใช้ timeline สำหรับ release history
- ใช้ progress bars สำหรับ test coverage
- ใช้ badges สำหรับ severity levels
- ตรวจสอบ responsive behavior บนทุก screen size

## Expected Outcome

- Project docs site ที่ใช้ Vue components สำหรับ visual UX/UI
- ข้อมูลจริงจาก project ผ่าน Bun shell scripts
- 4 nav sections ครบถ้วน: Project, Features, Review, Release
- ไม่ใช้ markdown ธรรมดา แต่ใช้ Vue components สำหรับ interactive content
- UX/UI ที่ออกแบบมาเฉพาะสำหรับแต่ละ section
