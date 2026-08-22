---
name: follow-eslint
description: ตั้งค่า ESLint 9 พร้อม plugins ครบถ้วนสำหรับ TypeScript/Vue/Nuxt
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related: []
---

## Goal

ตั้งค่า ESLint 9 ด้วย flat config format พร้อม plugins ครบถ้วน

## Scope

ใช้สำหรับตั้งค่า ESLint 9 ใน TypeScript, Vue, และ Nuxt projects

## Execute

### 1. Install Core Dependencies

> Goal: Install Core Dependencies

1. รัน `bun add -D eslint @eslint/js typescript-eslint`
2. รัน `bun add -D eslint-config-prettier`

### 2. Install Vue/Nuxt Plugins

> Goal: Install Vue/Nuxt Plugins

1. รัน `bun add -D eslint-plugin-vue @vue/eslint-config-typescript`
2. รัน `bun add -D @nuxt/eslint-config`

### 3. Install Code Quality Plugins

> Goal: Install Code Quality Plugins

1. รัน `bun add -D eslint-plugin-import eslint-plugin-unused-imports`
2. รัน `bun add -D eslint-plugin-no-secrets eslint-plugin-regexp`
3. รัน `bun add -D eslint-plugin-functional eslint-plugin-oxlint`

### 4. Install Testing/A11y Plugins

> Goal: Install Testing/A11y Plugins

1. รัน `bun add -D eslint-plugin-vitest eslint-plugin-vue-a11y`

### 5. Create Flat Config

> Goal: Create Flat Config

สร้าง `eslint.config.ts` ด้วย flat config format

```typescript [eslint.config.ts]
import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import noSecrets from 'eslint-plugin-no-secrets'
import regexp from 'eslint-plugin-regexp'
import functional from 'eslint-plugin-functional'
import oxlint from 'eslint-plugin-oxlint'
import vitest from 'eslint-plugin-vitest'
import vueA11y from 'eslint-plugin-vue-a11y'

export default defineConfig([
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettier,
  {
    files: ['**/*.{ts,tsx,vue}'],
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
      'no-secrets': noSecrets,
      regexp,
      functional,
      oxlint,
      vitest,
      'vue-a11y': vueA11y
    },
    rules: {
      'import/order': ['warn', { alphabetize: { order: 'asc' } }],
      'import/no-cycle': 'error',
      'import/no-unresolved': 'error',
      'unused-imports/no-unused-imports': 'warn',
      'no-secrets/no-secrets': 'error',
      'regexp/prefer-regexp-exec': 'warn',
      'functional/immutable-data': 'warn',
      'functional/no-let': 'warn',
      'oxlint/unicorn/no-array-for-each': 'warn'
    }
  },
  {
    ignores: ['dist/', 'node_modules/', '.nuxt/**', '*.config.js']
  }
])
```

### 6. Add Package Scripts

> Goal: เพิ่ม scripts สำหรับ linting ใน `package.json`

```json [package.json]
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:report": "eslint . --format json -o eslint-report.json"
  }
}
```

### 7. Configure IDE

> Goal: ตั้งค่า IDE settings สำหรับ ESLint integration

```json [.vscode/settings.json]
{
  "eslint.validate": ["javascript", "typescript", "vue"],
  "eslint.format.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## Rules

### 1. Vue/Nuxt Configuration

ตั้งค่า ESLint สำหรับ Vue และ Nuxt projects

- ใช้ `eslint-plugin-vue` สำหรับ Vue 3 linting rules และ template linting
- ใช้ `@vue/eslint-config-typescript` สำหรับ Vue + TypeScript config อย่างเป็นทางการ
- ใช้ `@nuxt/eslint-config` สำหรับ Nuxt 3 project-aware config

### 2. Import/Export Management

จัดการ import และ export อย่างเป็นระเบียบ

- ใช้ `eslint-plugin-import` สำหรับ import ordering, validation, auto-sort
- ใช้ `eslint-plugin-unused-imports` สำหรับ auto-remove unused imports
- ใช้ `import/no-cycle` สำหรับ detect circular dependencies

### 3. Code Quality & Security

ตรวจสอบคุณภาพโค้ดและ security

- ใช้ `eslint-plugin-no-secrets` สำหรับ detect hardcoded secrets/API keys
- ใช้ `eslint-plugin-regexp` สำหรับ RegExp best practices
- ใช้ `eslint-plugin-functional` สำหรับ functional programming rules
- ใช้ `eslint-plugin-oxlint` สำหรับ fast Rust-based linting

### 4. Testing & Accessibility

ตรวจสอบ testing และ accessibility

- ใช้ `eslint-plugin-vitest` สำหรับ Vitest linting rules
- ใช้ `eslint-plugin-vue-a11y` สำหรับ Vue accessibility rules

### 5. Configuration Standards

ตั้งค่า configuration ตามมาตรฐาน ESLint 9

- ใช้ `eslint.config.ts` แทน `.eslintrc` (Flat Config)
- ใช้ `defineConfig()` จาก `eslint/config`
- ใช้ `typescript-eslint` แทน `@typescript-eslint/parser`
- ใส่ `prettier` config เป็นตัวสุดท้าย
- ไม่ใช้ `.eslintignore` ใน ESLint 9

## Expected Outcome

1. ESLint 9 พร้อม flat config และ plugins ครบถ้วน
2. Vue 3 + TypeScript + Nuxt 3 support
3. Import ordering และ circular dependency detection
4. Security checks สำหรับ hardcoded secrets
5. Functional programming best practices
6. Fast linting ด้วย oxlint
7. Testing linting ด้วย vitest
8. Accessibility rules สำหรับ Vue
