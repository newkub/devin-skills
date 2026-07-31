---
description: Setup Storybook ใน project ใหม่
---

## Goal

ติดตั้งและ configure Storybook ใน project

## Execute

### 1. Install Storybook

```bash
bun create storybook@latest
```

หรือสำหรับ version ก่อน 8.3:

```bash
npx storybook@latest init
```

### 2. Select Framework

เลือก framework ที่เหมาะสม:
- React
- Vue
- Angular
- Svelte
- Web Components
- React Native

### 3. Configure Framework

Storybook จะ detect framework อัตโนมัติ และติดตั้ง packages ที่เหมาะสม:
- `@storybook/react-vite` สำหรับ React + Vite
- `@storybook/react-webpack5` สำหรับ React + Webpack
- `@storybook/vue3-vite` สำหรับ Vue 3 + Vite
- `@storybook/angular` สำหรับ Angular

### 4. Add Scripts

```json
{
  "scripts": {
    "storybook": "storybook dev",
    "build-storybook": "storybook build"
  }
}
```

### 5. Start Development Server

```bash
bun run storybook
```

## Rules

- ใช้ Vite builder เมื่อเป็นไปได้สำหรับ performance ที่ดีกว่า
- ตรวจสอบ requirements: Node.js 20+, bun 10+, bun 9+, Yarn 4+
- ตรวจสอบ framework requirements: Angular 18+, React Native 0.72+, Svelte 5+, Vue 3+, Vite 5+
- ใช้ `--type` flag ถ้า auto-detection ล้มเหลว
- ใช้ `--package-manager` flag สำหรับ specify package manager
