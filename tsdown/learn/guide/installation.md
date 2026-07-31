# Installation

## การติดตั้ง tsdown

### ติดตั้งด้วย Bun

```bash
# ติดตั้งเป็น dev dependency
bun add -D tsdown

# หรือติดตั้ง global
bun add -g tsdown
```

### ติดตั้งด้วย bun

```bash
# ติดตั้งเป็น dev dependency
bun install -D tsdown

# หรือติดตั้ง global
bun install -g tsdown
```

### ติดตั้งด้วย bun

```bash
# ติดตั้งเป็น dev dependency
bun add -D tsdown

# หรือติดตั้ง global
bun add -g tsdown
```

### ติดตั้งด้วย yarn

```bash
# ติดตั้งเป็น dev dependency
yarn add -D tsdown

# หรือติดตั้ง global
yarn global add tsdown
```

## Project Setup

### 1. สร้าง package.json

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch"
  },
  "devDependencies": {
    "tsdown": "latest"
  }
}
```

### 2. สร้าง source file

สร้าง `src/index.ts`:

```typescript
export function hello(name: string): string {
  return `Hello, ${name}!`;
}
```

### 3. Build

```bash
bun run build
```

### 4. ผลลัพธ์

```
dist/
├── index.mjs       # ESM format
├── index.cjs       # CJS format
└── index.d.ts      # TypeScript declarations
```

## Configuration

### tsdown.config.ts

สร้าง `tsdown.config.ts` ที่ root ของ project:

```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: './src/index.ts',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
});
```

### TypeScript Config

tsdown จะอ่าน `tsconfig.json` อัตโนมัติ แต่สามารถ override ได้:

```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  tsconfig: './tsconfig.build.json',
});
```

## Requirements

- Node.js >= 16.0.0
- TypeScript >= 4.5.0
- แนะนำให้ใช้ Bun สำหรับ performance ที่ดีขึ้น
