---
title: Migrate from Rollup - Common Changes
description: การเปลี่ยนแปลงทั่วไปและ migration checklist จาก Rollup ไปยัง Rolldown
auto_execution_mode: 3
---

## Goal

ระบุการเปลี่ยนแปลงทั่วไปใน migration และตรวจสอบความครบถ้วน

## Scope

- Common changes
- Migration checklist

## Common Changes

### 1. Config File Extension

เปลี่ยนจาก `.js` เป็น `.ts`:

```bash
mv rollup.config.js rolldown.config.ts
```

### 2. Import Statement

เปลี่ยน import:

Before:
```javascript
export default {
  input: 'src/index.js',
}
```

After:
```typescript
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.js',
})
```

### 3. TypeScript Support

Rolldown มี built-in TypeScript support:

Before (Rollup):
```javascript
import typescript from '@rollup/plugin-typescript'

export default {
  plugins: [typescript()],
}
```

After (Rolldown):
```typescript
export default defineConfig({
  tsconfig: './tsconfig.json',
})
```

### 4. Minification

Rolldown ใช้ built-in minifier:

Before (Rollup):
```javascript
import terser from '@rollup/plugin-terser'

export default {
  plugins: [terser()],
}
```

After (Rolldown):
```typescript
export default defineConfig({
  output: {
    minify: true,
  },
})
```

## Migration Checklist

- [ ] Install Rolldown
- [ ] Update config file name
- [ ] Update import statements
- [ ] Update plugins
- [ ] Update build scripts
- [ ] Remove TypeScript plugin (if using)
- [ ] Remove Terser plugin (if using)
- [ ] Test build
- [ ] Verify output
- [ ] Test runtime

## Rules

- เปลี่ยน config file extension เป็น `.ts`
- ใช้ `defineConfig` สำหรับ type safety
- ลบ plugins ที่ Rolldown มี built-in แล้ว (TypeScript, Terser)

## Expected Outcome

- Config และ plugins อัปเดตครบถ้วนตาม checklist
- ไม่มี plugin ซ้ำซ้อนกับ built-in features
