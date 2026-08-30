---
title: Setup Rolldown
description: Setup Rolldown สำหรับ project ใหม่
auto_execution_mode: 3
---

## Goal

Setup Rolldown สำหรับ project ใหม่ด้วยความเร็วและถูกต้อง

## Scope

- Initialize project
- Install Rolldown
- Create config file
- Setup basic structure

## Execute

### 1. Initialize Project

สร้าง project ใหม่:

```bash
mkdir my-rolldown-project
cd my-rolldown-project
bun init -y
```

### 2. Install Rolldown

ติดตั้ง Rolldown:

```bash
bun add -D rolldown
```

### 3. Create Source Structure

สร้าง source structure:

```bash
mkdir src
```

### 4. Create Entry File

สร้าง entry file:

src/index.ts:
```typescript
export function greet(name: string): string {
  return `Hello, ${name}!`
}

export const version = '1.0.0'
```

### 5. Create Config File

สร้าง config file:

rolldown.config.ts:
```typescript
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
```

### 6. Add Build Script

เพิ่ม build script ใน package.json:

```json
{
  "scripts": {
    "build": "rolldown",
    "dev": "rolldown --watch"
  }
}
```

### 7. Test Build

ทดสอบ build:

```bash
bun run build
```

### 8. Verify Output

ตรวจสอบ output:

```bash
ls dist/
```

## Optional: TypeScript Setup

### 1. Install TypeScript

```bash
bun add -D typescript
```

### 2. Create tsconfig.json

tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### 3. Update Config

rolldown.config.ts:
```typescript
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  tsconfig: './tsconfig.json',
})
```

## Optional: Plugin Setup

### 1. Install Plugins

```bash
bun add -D @rolldown/plugin-commonjs @rolldown/plugin-node-resolve
```

### 2. Update Config

rolldown.config.ts:
```typescript
import { defineConfig } from 'rolldown'
import commonjs from '@rolldown/plugin-commonjs'
import nodeResolve from '@rolldown/plugin-node-resolve'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
  ],
})
```

## Rules

- ใช้ `bun add -D rolldown` สำหรับติดตั้ง
- ใช้ TypeScript สำหรับ config file
- ตั้งชื่อ config file เป็น `rolldown.config.ts`
- ใช้ `defineConfig` สำหรับ type safety

## Expected Outcome

- Project ที่มี Rolldown ติดตั้งแล้ว
- Config file ที่ถูกต้อง
- Build script ที่พร้อมใช้งาน
- Output directory ที่สร้างขึ้น
