---
name: follow-vitepress
description: ตั้งค่า VitePress ด้วย UnoCSS, Shiki Twoslash, Group Icons
---

## Goal

ตั้งค่า VitePress สำหรับ documentation site พร้อม UnoCSS, Shiki Twoslash, Group Icons

## Scope

ใช้สำหรับทุก project ที่ต้องการ VitePress documentation site

## Execute

### 1. Project Initialization

1. สร้าง `docs/` directory ที่ root ของ project
2. สำหรับ monorepo ให้ `docs/` เป็น workspace โดยสร้าง `docs/package.json` ที่มี `vitepress` เป็น dependency และ scripts ของตัวเอง
3. เพิ่ม `docs` ใน `workspaces` ของ root `package.json`
4. สร้าง `.vitepress/` config directory ภายใน `docs/`
5. ทำ `/follow-gitignore` สร้าง `docs/.gitignore` สำหรับ VitePress build output และ cache
6. ทำ `/follow-tsconfig-json` สร้าง `docs/tsconfig.json` สำหรับ type checking ของ `.vitepress/` config

### 2. VitePress Configuration

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
      { text: 'Examples', link: '/examples/' },
      { text: 'Playground', link: '/playground/' },
      { text: 'Resources', link: '/resources/' }
    ],
    sidebar: {
      '/docs/': [
        { text: 'Getting Started', link: '/docs/getting-started' }
      ]
    }
  },
  markdown: {
    deadLinks: 'ignore'
  }
})
```

สำหรับ monorepo ให้เพิ่ม nav สำหรับ workspace pages:

```typescript
nav: [
  { text: 'Docs', link: '/' },
  { text: 'Workspaces', items: [
    { text: 'Core Shared', link: '/workspaces/core-shared' },
    { text: 'CLI Release', link: '/workspaces/cli-release' },
    // เพิ่ม workspace ตามลำดับความสำคัญ
  ]},
  { text: 'Getting Started', link: '/getting-started/installation' }
]
```

### 3. UnoCSS Integration

1. ทำ `/follow-unocss` สำหรับ UnoCSS configuration แบบเต็ม
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

สร้าง `.vitepress/theme/index.ts`:

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

1. ติดตั้ง `@shikijs/vitepress-twoslash`
2. เพิ่ม `transformerTwoslash` ใน markdown config
3. เพิ่ม plugin ใน theme
4. import CSS สำหรับ twoslash styling

### 7. VitePress Plugin Group Icons

1. ติดตั้ง `vitepress-plugin-group-icons`
2. เพิ่ม plugin ใน VitePress config

### 8. GitHub Actions Deployment

1. สร้าง `.github/workflows/deploy.yml`
2. ตั้งค่า deploy ไปยัง GitHub Pages
3. ตั้งค่า triggers สำหรับ push และ pull request

### 9. Home Page

สร้าง `index.md` พร้อม frontmatter ตาม VitePress default:

```yaml
---
layout: home

hero:
  name: My Docs
  text: Documentation site
  tagline: Beautiful documentation powered by VitePress
  actions:
    - theme: brand
      text: Get Started
      link: /docs/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/your-repo

features:
  - title: Feature A
    details: Description for feature A
  - title: Feature B
    details: Description for feature B
  - title: Feature C
    details: Description for feature C
---
```

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

### 6. Gitignore And TypeScript Config

- ทำ `/follow-gitignore` สร้าง `docs/.gitignore` ครอบคลุม `node_modules/`, `.vitepress/dist/`, `.vitepress/cache/`
- ทำ `/follow-tsconfig-json` สร้าง `docs/tsconfig.json` extends จาก root พร้อม `noEmit: true`, `types: ["vitepress"]`
- สำหรับ monorepo ให้เพิ่ม `docs` ใน `exclude` ของ root `tsconfig.json`

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
