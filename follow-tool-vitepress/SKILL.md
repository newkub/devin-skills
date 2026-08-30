---
name: follow-tool-vitepress
description: ตั้งค่า VitePress ด้วย UnoCSS, Shiki Twoslash, Group Icons และ Vue components สำหรับ project docs
related:
  - follow-gitignore
  - follow-lang-typescript
  - follow-lib-unocss
  - follow-tool-vite
  - follow-create-vite-plugins
---

## Goal

ตั้งค่า VitePress สำหรับ documentation site พร้อม UnoCSS, Shiki Twoslash, Group Icons และ Vue components สำหรับ project docs ที่ดึงข้อมูลจริงผ่าน Bun shell

## Scope

ใช้สำหรับทุก project ที่ต้องการ VitePress documentation site

## Execute

### 1. Project Initialization

> Goal: Project Initialization

1. สร้าง `docs/` directory ที่ root ของ project
2. สำหรับ monorepo ให้ `docs/` เป็น workspace โดยสร้าง `docs/package.json` ที่มี `vitepress` เป็น dependency และ scripts ของตัวเอง
3. เพิ่ม `docs` ใน `workspaces` ของ root `package.json`
4. สร้าง `.vitepress/` config directory ภายใน `docs/`
5. ทำ `/follow-gitignore` สร้าง `docs/.gitignore` สำหรับ VitePress build output และ cache
6. ทำ `/follow-lang-typescript` สร้าง `docs/tsconfig.json` สำหรับ type checking ของ `.vitepress/` config

### 2. VitePress Configuration

> Goal: VitePress Configuration

สร้าง `.vitepress/config.ts`:

```typescript
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'My Docs',
  description: 'Documentation site',
  lang: 'en-US',
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Docs', link: '/docs/' },
      { text: 'API Reference', link: '/api/' },
    ],
    sidebar: {
      '/docs/': [{ text: 'Getting Started', link: '/docs/getting-started' }]
    }
  },
  markdown: { deadLinks: 'ignore' }
})
```

สำหรับ monorepo ให้เพิ่ม nav สำหรับ workspace pages โดยใช้ dropdown nav (`items`) สำหรับจัดกลุ่ม workspaces ตาม category

### 3. UnoCSS Integration

> Goal: UnoCSS Integration
1. ทำ `/follow-lib-unocss` สำหรับ UnoCSS configuration แบบเต็ม
2. ติดตั้ง `unocss` ใน `docs/` workspace:
   ```bash
   bun add -d unocss
   ```
3. สร้าง `docs/uno.config.ts` พร้อม `presetWind4`, `presetIcons`, transformers:
   ```typescript
   import { defineConfig, presetWind4, presetIcons, transformerVariantGroup, transformerDirectives } from 'unocss'

   export default defineConfig({
     presets: [
       presetWind4(),
       presetIcons({
         collections: {
           mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
         },
       }),
     ],
     transformers: [
       transformerVariantGroup(),
       transformerDirectives(),
     ],
   })
   ```
4. เพิ่ม `UnoCSS()` plugin ใน `vite.plugins` ของ `.vitepress/config.ts`
5. เพิ่ม `import 'virtual:uno.css'` ใน `.vitepress/theme/index.ts`
6. ดูตัวอย่าง integration ที่ https://vp.yuy1n.io/

### 4. Theme Setup

> Goal: สร้าง `.vitepress/theme/index.ts`

```typescript
import DefaultTheme from 'vitepress/theme'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // register global components
  }
}
```

สร้าง `.vitepress/theme/style.css`:

```css
:root {
  --vp-c-brand: #3b82f6;
}
```

### 5. Package Scripts

> Goal: Package Scripts

สำหรับ monorepo ให้ใส่ scripts ใน `docs/package.json`:

```json
{
  "name": "@project/docs",
  "private": true,
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build",
    "preview": "vitepress preview"
  },
  "devDependencies": {
    "vitepress": "latest"
  }
}
```

สำหรับ single project ให้ใส่ scripts ใน root `package.json` โดยใช้ `dev:docs`, `build:docs`, `preview:docs`

### 6. Shiki Twoslash Integration

> Goal: Shiki Twoslash Integration
1. ติดตั้ง `@shikijs/vitepress-twoslash`
2. เพิ่ม `transformerTwoslash` ใน markdown config
3. เพิ่ม plugin ใน theme
4. import CSS สำหรับ twoslash styling

### 7. VitePress Plugin Group Icons

> Goal: VitePress Plugin Group Icons
1. ติดตั้ง `vitepress-plugin-group-icons`
2. เพิ่ม plugin ใน VitePress config

### 8. GitHub Actions Deployment

> Goal: GitHub Actions Deployment
1. สร้าง `.github/workflows/deploy.yml`
2. ตั้งค่า deploy ไปยัง GitHub Pages
3. ตั้งค่า triggers สำหรับ push และ pull request

### 9. Project Docs With Vue Components

> Goal: สร้าง project docs 4 sections ด้วย Vue components และ Bun shell data

1. ตั้งค่า nav 4 sections ใน `.vitepress/config.ts`: Project, Features, Review, Release
2. สร้าง `.vitepress/scripts/data/` สำหรับ Bun shell data scripts:
   - `project.ts` — ดึง project info ด้วย `Bun.$` (`package.json`, workspaces, tech stack)
   - `features.ts` — ดึง features จาก source code (route files, modules)
   - `test-results.ts` — ดึง test results จาก vitest output
   - `releases.ts` — ดึง git tags, GitHub releases, commit history ด้วย `Bun.$`
3. สร้าง Vue components ใน `.vitepress/theme/components/`:
   - Project: `ProjectOverview.vue`, `ProjectArchitecture.vue`, `WorkspaceCards.vue`
   - Features: `FeaturesTable.vue` — interactive table พร้อม sorting, filtering, search
   - Review: `TestResults.vue`, `CodeReview.vue` พร้อม sidebar layout
   - Release: `ReleaseTimeline.vue`, `ChangelogViewer.vue`, `CommitHistory.vue`
4. ลงทะเบียน components ใน `.vitepress/theme/index.ts`
5. ใช้ UnoCSS utilities สำหรับ card layout, table styling, timeline, progress bars, badges

## Rules

### 1. Configuration Standards

- ใช้ `defineConfig` จาก `vitepress` สำหรับ type safety
- ตั้งค่า `lang: 'en-US'` หรือตาม project requirement
- ใช้ `deadLinks: 'ignore'` ใน markdown config
- ตั้งค่า nav และ sidebar ใน `themeConfig`
- สำหรับ monorepo ให้ `docs/` เป็น workspace ที่ root พร้อม `docs/package.json` ของตัวเอง
- สำหรับ monorepo ให้เพิ่ม `docs` ใน `workspaces` array ของ root `package.json`
- สำหรับ monorepo ให้ nav ลิงก์ไปยัง workspace pages ใน `docs/workspaces/`
- ใช้ dropdown nav (`items`) สำหรับจัดกลุ่ม workspaces ตาม category

### 2. Theme Customization

- extend DefaultTheme จาก `vitepress/theme`
- ใช้ `enhanceApp` hook สำหรับ register components
- ตั้งค่า CSS variables ใน `:root`

### 3. Package Scripts

- สำหรับ monorepo ให้ใส่ scripts ใน `docs/package.json` โดยใช้ `dev`, `build`, `preview`
- สำหรับ single project ให้ใช้ `dev:docs`, `build:docs`, `preview:docs` ใน root `package.json`
- ใช้ `vitepress dev` สำหรับ development (เมื่ออยู่ใน `docs/` workspace)
- ใช้ `vitepress build` สำหรับ production
- ใช้ `vitepress preview` สำหรับ preview

### 4. Plugin Integration

- ใช้ `@shikijs/vitepress-twoslash` สำหรับ type hover
- ใช้ `vitepress-plugin-group-icons` สำหรับ icons
- เพิ่ม plugins ใน config หรือ theme ตาม requirement

### 5. Content Standards

- ใช้ frontmatter สำหรับ metadata
- ใช้ `layout: home` สำหรับ landing page
- ตั้งค่า hero และ features ตาม VitePress default
- ใช้ Vue components (`.vue`) แทน markdown ธรรมดา สำหรับ interactive content
- หน้า markdown (`.md`) ใช้เฉพาะสำหรับ frontmatter และ import Vue components
- ใช้ `Bun.$` template literals สำหรับดึงข้อมูลจาก project จริง ไม่ hardcoded
- Export data scripts เป็น async functions ที่ Vue components เรียกใช้ได้

### 6. Gitignore And TypeScript Config

- ทำ `/follow-gitignore` สร้าง `docs/.gitignore` ครอบคลุม `node_modules/`, `.vitepress/dist/`, `.vitepress/cache/`
- ทำ `/follow-lang-typescript` สร้าง `docs/tsconfig.json` extends จาก root พร้อม `noEmit: true`, `types: ["vitepress"]`
- สำหรับ monorepo ให้เพิ่ม `docs` ใน `exclude` ของ root `tsconfig.json`

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- VitePress config พร้อมใช้งาน
- UnoCSS integrated พร้อม presetWind4
- Theme custom พร้อมใช้งาน
- Package scripts พร้อมใช้งาน
- Shiki Twoslash integrated พร้อม type hover
- VitePress Plugin Group Icons integrated
- GitHub Actions deployment พร้อมใช้งาน
- Home page พร้อม frontmatter ตาม VitePress default
- `.gitignore` ครอบคลุม VitePress build output และ cache
- `tsconfig.json` สำหรับ type checking ของ `.vitepress/` config
- Project docs 4 sections (Project, Features, Review, Release) ด้วย Vue components
- ข้อมูลจริงจาก project ผ่าน Bun shell scripts ไม่ hardcoded
