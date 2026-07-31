---
title: Migrate from Rollup
description: Migration guide จาก Rollup ไปยัง Rolldown
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

## API Compatibility

### Compatible APIs

Rolldown เข้ากันได้กับ Rollup APIs ส่วนใหญ่:

- `input` - Entry points
- `output` - Output options
- `plugins` - Plugin system
- `external` - External dependencies
- `treeshake` - Tree shaking options

### Minor Differences

**Output Options:**
- Rolldown รองรับ options ส่วนใหญ่ของ Rollup
- บาง advanced options อาจยังไม่รองรับ

**Plugin Hooks:**
- Rolldown รองรับ plugin hooks หลักของ Rollup
- บาง advanced hooks อาจยังไม่รองรับ

## Plugin Migration

### Common Plugins

| Rollup Plugin | Rolldown Plugin | Status |
|---------------|----------------|--------|
| `@rollup/plugin-commonjs` | `@rolldown/plugin-commonjs` | ✅ Compatible |
| `@rollup/plugin-node-resolve` | `@rolldown/plugin-node-resolve` | ✅ Compatible |
| `@rollup/plugin-terser` | `@rolldown/plugin-terser` | ✅ Compatible |
| `@rollup/plugin-babel` | `@rolldown/plugin-babel` | ✅ Compatible |

### Custom Plugins

Custom plugins ที่ใช้ Rollup API สามารถใช้กับ Rolldown ได้:

```typescript
// Custom plugin compatible with both
const myPlugin = () => ({
  name: 'my-plugin',
  transform(code, id) {
    // transform logic
  },
})
```

## Common Changes

### 1. Config File Extension

เปลี่ยนจาก `.js` เป็น `.ts`:

```bash
mv rollup.config.js rolldown.config.ts
```

### 2. Import Statement

เปลี่ยน import:

**Before:**
```javascript
export default {
  input: 'src/index.js',
}
```

**After:**
```typescript
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.js',
})
```

### 3. TypeScript Support

Rolldown มี built-in TypeScript support:

**Before (Rollup):**
```javascript
import typescript from '@rollup/plugin-typescript'

export default {
  plugins: [typescript()],
}
```

**After (Rolldown):**
```typescript
export default defineConfig({
  tsconfig: './tsconfig.json',
})
```

### 4. Minification

Rolldown ใช้ built-in minifier:

**Before (Rollup):**
```javascript
import terser from '@rollup/plugin-terser'

export default {
  plugins: [terser()],
}
```

**After (Rolldown):**
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

## Troubleshooting

### Plugin Not Compatible

**Problem:** Plugin ไม่ทำงานกับ Rolldown

**Solution:**
- ตรวจสอบว่ามี Rolldown version หรือไม่
- ใช้ plugin ที่ compatible กับทั้งสอง
- ปรับ plugin ให้ compatible

### Build Error

**Problem:** Build error หลัง migration

**Solution:**
- ตรวจสอบ config options
- ตรวจสอบ plugin compatibility
- ตรวจสอบ TypeScript config

### Output Different

**Problem:** Output ต่างจาก Rollup

**Solution:**
- ตรวจสอบ tree-shaking options
- ตรวจสอบ minification settings
- ตรวจสอบ output format

## Benefits of Migration

- **Performance**: 10-100x faster builds
- **TypeScript**: Built-in TypeScript support
- **Minification**: Built-in minifier
- **Compatibility**: Rollup-compatible API

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
