---
name: follow-wtx
description: แนวทางการพัฒนา Web Extensions ด้วย WXT framework ตาม best practices
---

## Goal

กำหนดแนวทางการพัฒนา Web Extensions ด้วย WXT framework ให้มีประสิทธิภาพและเป็นมาตรฐาน

## Execute

### 1. Project Setup

1. ทำ `/wtx` เพื่อตั้งค่าโปรเจกต์ WXT
2. ติดตั้ง dependencies ด้วย `bun install`
3. ตั้งค่า `wxt.config.ts` ให้เหมาะกับโปรเจกต์

### 2. Folder Structure

1. ทำ `/nuxt-architecture` เพื่อจัดโครงสร้างโปรเจกต์
2. ใช้ `src/` directory สำหรับ source code หลัก
3. จัดระเบียบตามมาตรฐาน WXT:
   - `entrypoints/` - popup, background, content scripts
   - `components/` - UI components
   - `composables/` - Vue composables
   - `utils/` - utility functions
   - `assets/` - static assets

### 3. Configuration

1. ทำ `/unocss` เพื่อตั้งค่า UnoCSS
2. ตั้งค่า auto-imports ใน `wxt.config.ts`
3. กำหนด target browsers และ manifest version
4. เพิ่ม modules ที่จำเป็น (Vue, UnoCSS)

### 4. Development Workflow

1. ใช้ `bun run dev` สำหรับ development mode
2. ใช้ `bun run dev:firefox` สำหรับ Firefox testing
3. ตั้งค่า HMR สำหรับ fast development
4. ใช้ `bun run build` สำหรับ production build

### 5. Testing and Quality

1. ทำ `/code-quality` เพื่อรักษามาตรฐานโค้ด
2. ตั้งค่า Biome สำหรับ linting และ formatting
3. ใช้ TypeScript สำหรับ type safety
4. ทำ `/run-test` สำหรับ unit testing

### 6. Deployment

1. ใช้ `bun run zip` สำหรับ Chrome extension
2. ใช้ `bun run zip:firefox` สำหรับ Firefox extension
3. ตั้งค่า GitHub Actions สำหรับ automated deployment
4. ใช้ WXT submit สำหรับ store publishing

## Rules

### 1. Setup

เพิ่มไฟล์ `.github/workflows/chrome-release.yml` สำหรับ automated deployment

```yml [chrome-release.yml]
name: Release

on:
  workflow_dispatch:

jobs:
  submit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - name: Install dependencies
        run: bun install
      - name: Zip extensions
        run: |
          bun run zip
          bun run zip:firefox
      - name: Submit to stores
        run: |
          bunx wxt submit \
            --chrome-zip .output/*-chrome.zip \
            --firefox-zip .output/*-firefox.zip --firefox-sources-zip .output/*-sources.zip
        env:
          CHROME_EXTENSION_ID: ${{ secrets.CHROME_EXTENSION_ID }}
          CHROME_CLIENT_ID: ${{ secrets.CHROME_CLIENT_ID }}
          CHROME_CLIENT_SECRET: ${{ secrets.CHROME_CLIENT_SECRET }}
          CHROME_REFRESH_TOKEN: ${{ secrets.CHROME_REFRESH_TOKEN }}
          FIREFOX_EXTENSION_ID: ${{ secrets.FIREFOX_EXTENSION_ID }}
          FIREFOX_JWT_ISSUER: ${{ secrets.FIREFOX_JWT_ISSUER }}
          FIREFOX_JWT_SECRET: ${{ secrets.FIREFOX_JWT_SECRET }}
```

### 2. Libraries

- `wxt` - Core WXT framework
- `chrome-webstore-upload-cli` - Chrome Web Store publishing

### 3. Project Structure

```plaintext
src/
.github/workflows/chrome-release.yml
package.json
wxt.config.ts
```

### 4. Core Principles

- build ต้อง reproducible (CI ใช้ bun)
- แยก logic จาก integration กับ browser API

### 5. Folder Rules

#### `src/entrypoints/`

- Do
  - ใช้ file-based routing ตามมาตรฐาน WXT
  - แยก popup, background, content scripts ชัดเจน
- Don't
  - ไม่ใช้ deep nesting ใน entrypoints

#### `src/components/`

- Do
  - ใช้ PascalCase สำหรับ component names
  - จัดเก็บ UI components ที่ reusable
- Don't
  - ไม่ผสม business logic กับ UI components

#### `src/composables/`

- Do
  - ใช้ camelCase สำหรับ composable names
  - แยก logic ที่ใช้ซ้ำได้
- Don't
  - ไม่ใส่ browser API calls โดยตรง

### 6. Configuration

```ts [wxt.config.ts]
import { defineConfig } from 'wxt'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-vue'],
  vite: () => ({
    plugins: [UnoCSS()],
  }),
  manifest: {
    // Manifest configuration
  },
  runner: {
    disabled: process.env.NODE_ENV === 'production',
  },
})
```

### 7. Development Best Practices

- ใช้ TypeScript สำหรับทุกไฟล์
- ใช้ auto-imports สำหรับ components และ composables
- แยก business logic จาก browser API integration
- ใช้ composables สำหรับ reusable logic

### 8. File Naming

- Use kebab-case สำหรับ entrypoint names
- Use PascalCase สำหรับ component names
- Use camelCase สำหรับ composable names
- Use descriptive names สำหรับ clarity

## Expected Outcome

- Web Extension ที่มีโครงสร้างชัดเจน
- Development workflow ที่รวดเร็วด้วย HMR
- Code quality ที่สูงด้วย TypeScript และ linting
- Multi-browser support ด้วย WXT framework
- Automated deployment สำหรับ extension stores
