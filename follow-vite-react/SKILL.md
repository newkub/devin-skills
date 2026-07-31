---
name: follow-vite-react
description: ตั้งค่า Vite + React + TypeScript พร้อม ESLint
---

## Goal

ตั้งค่า Vite + React + TypeScript project พร้อม ESLint และ UnoCSS

## Scope

ใช้สำหรับ project ที่ใช้ Vite + React + TypeScript

## Execute

### 1. Setup

ตั้งค่า Vite, TypeScript, และ ESLint config

> Goal: มี config files ครบและถูกต้อง

1. สร้าง `vite.config.ts` พร้อม `@vitejs/plugin-react` และ `vite-tsconfig-paths`
2. สร้าง `tsconfig.json` พร้อม `strict: true` และ path aliases
3. สร้าง `eslint.config.js` พร้อม `typescript-eslint` และ `eslint-plugin-react-hooks`
4. เพิ่ม scripts ใน `package.json`: `dev`, `build`, `preview`, `lint`

### 1.1. Vite Config

`vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: { port: 3000, open: true },
  build: { outDir: 'dist', sourcemap: true }
})
```

### 1.2. TypeScript Config

`tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### 1.3. ESLint Config

`eslint.config.js`
```javascript
import js from '@eslint/js'
import ts from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
]
```

### 1.4. Package Scripts

`package.json`
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

### 2. React Components

พัฒนา React components ตาม best practices

> Goal: Components ใช้ TypeScript และ UnoCSS

1. ใช้ `.tsx` สำหรับ components
2. กำหนด types สำหรับ props
3. ใช้ UnoCSS สำหรับ styling — หลีกเลี่ยง CSS modules
4. ทำ `/follow-react` สำหรับ component patterns
5. ทำ `/follow-unocss` สำหรับ styling

### 3. Refactor

Refactor โค้ดให้ถูกต้องตาม framework

> Goal: โค้ดสอดคล้องกับ Vite + React best practices

1. ทำ `/refactor` หลัง setup เสร็จ

## Rules

- ใช้ `@vitejs/plugin-react` สำหรับ React support
- ใช้ `vite-tsconfig-paths` สำหรับ path resolution
- ใช้ `strict: true` ใน `tsconfig.json`
- ใช้ `eslint-plugin-react-hooks` สำหรับ hooks rules
- ใช้ UnoCSS สำหรับ styling — หลีกเลี่ยง CSS modules

## Expected Outcome

- `vite.config.ts`, `tsconfig.json`, `eslint.config.js` ครบ
- Scripts: `dev`, `build`, `preview`, `lint` ใน `package.json`
- Components ใช้ TypeScript และ UnoCSS
