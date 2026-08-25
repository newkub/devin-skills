---
title: Migrate from Rollup - Setup
description: ขั้นตอนติดตั้งและตั้งค่าเบื้องต้นสำหรับ migration จาก Rollup ไปยัง Rolldown
auto_execution_mode: 3
---

## Goal

Migration จาก Rollup ไปยัง Rolldown อย่าง smooth

## Scope

- Config migration
- Plugin migration
- API compatibility
- Common changes

## Execute

### 1. Install Rolldown

ติดตั้ง Rolldown:

```bash
bun add -D rolldown
```

### 2. Update Config File

เปลี่ยนจาก `rollup.config.js` เป็น `rolldown.config.ts`:

**Before (rollup.config.js):**
```javascript
export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'esm',
  },
}
```

**After (rolldown.config.ts):**
```typescript
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
```

### 3. Update Plugins

เปลี่ยน plugins จาก Rollup เป็น Rolldown:

**Before:**
```javascript
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'

export default {
  plugins: [
    nodeResolve(),
    commonjs(),
  ],
}
```

**After:**
```typescript
import commonjs from '@rolldown/plugin-commonjs'
import nodeResolve from '@rolldown/plugin-node-resolve'

export default defineConfig({
  plugins: [
    nodeResolve(),
    commonjs(),
  ],
})
```

### 4. Update Build Script

เปลี่ยน build script ใน package.json:

**Before:**
```json
{
  "scripts": {
    "build": "rollup -c"
  }
}
```

**After:**
```json
{
  "scripts": {
    "build": "rolldown"
  }
}
```

### 5. Test Build

ทดสอบ build:

```bash
bun run build
```

### 6. Verify Output

ตรวจสอบ output:

```bash
ls dist/
```

## Rules

- ใช้ `defineConfig` สำหรับ type safety
- เปลี่ยน plugins เป็น Rolldown versions
- ทดสอบ build หลัง migration
- ตรวจสอบ output อย่างละเอียด

## Expected Outcome

- Project ที่ migrate ไปยัง Rolldown สำเร็จ
- Build time ลดลงอย่างมีนัยสำคัญ
- Output ที่เทียบเคียงได้กับ Rollup
- Performance ที่ดีขึ้น
