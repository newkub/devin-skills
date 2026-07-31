# Quick Start

## เริ่มต้นใช้งาน tsdown ภายใน 5 นาที

### Step 1: ติดตั้ง

```bash
bun add -D tsdown
```

### Step 2: สร้าง source file

สร้าง `src/index.ts`:

```typescript
export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}
```

### Step 3: ตั้งค่า package.json

```json
{
  "name": "my-math-lib",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch"
  },
  "devDependencies": {
    "tsdown": "latest"
  }
}
```

### Step 4: Build

```bash
bun run build
```

### Step 5: ใช้งาน

```typescript
// ใน project อื่น
import { add, multiply } from 'my-math-lib';

console.log(add(1, 2));  // 3
console.log(multiply(3, 4));  // 12
```

## ผลลัพธ์

```
dist/
├── index.mjs       # ESM format
├── index.cjs       # CJS format
└── index.d.ts      # TypeScript declarations
```

## Multiple Entry Points

```typescript
// src/index.ts
export { default as Calculator } from './calculator';

// src/utils.ts
export function formatDate(date: Date): string {
  return date.toISOString();
}
```

```typescript
// tsdown.config.ts
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: './src/index.ts',
    utils: './src/utils.ts',
  },
});
```

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./utils": {
      "types": "./dist/utils.d.ts",
      "import": "./dist/utils.mjs",
      "require": "./dist/utils.cjs"
    }
  }
}
```

## Watch Mode

สำหรับ development:

```bash
bun run dev
```

tsdown จะ watch ไฟล์และ rebuild อัตโนมัติเมื่อมีการเปลี่ยนแปลง

## Clean Build

ลบ output directory ก่อน build:

```typescript
// tsdown.config.ts
import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
});
```

หรือใช้ CLI:

```bash
tsdown --clean
```

## ตรวจสอบผลลัพธ์

ตรวจสอบว่า build สำเร็จ:

```bash
ls -la dist/
```

ควรเห็น:
- `index.mjs` - ESM format
- `index.cjs` - CJS format
- `index.d.ts` - TypeScript declarations
