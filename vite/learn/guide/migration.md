# Migration

## Migration Guide สำหรับ Vite

คู่มือการย้ายโปรเจกต์จาก build tools อื่นๆ มายัง Vite

## Migration from Webpack

### 1. Install Vite

```bash
bun add -D vite @vitejs/plugin-vue
```

### 2. Create vite.config.ts

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

### 3. Update index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

### 4. Update package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 5. Remove Webpack Config

ลบ `webpack.config.js` และ dependencies ที่เกี่ยวข้อง

### 6. Update Imports

```typescript
// Before (Webpack)
import logo from './logo.png'

// After (Vite) - same syntax
import logo from './logo.png'
```

## Migration from Parcel

### 1. Install Vite

```bash
bun add -D vite @vitejs/plugin-vue
```

### 2. Create vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

### 3. Update Entry Point

Parcel ใช้ HTML file เป็น entry point เหมือน Vite แต่ต้องเปลี่ยน script tag

```html
<!-- Before (Parcel) -->
<script src="./src/main.ts"></script>

<!-- After (Vite) -->
<script type="module" src="/src/main.ts"></script>
```

### 4. Update package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Migration from Create React App

### 1. Install Vite

```bash
bun add -D vite @vitejs/plugin-react
```

### 2. Create vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### 3. Update index.html

ย้าย `index.html` จาก `public/` ไปยัง root directory

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### 4. Update Environment Variables

```bash
# Before (CRA)
REACT_APP_API_URL=https://api.example.com

# After (Vite)
VITE_API_URL=https://api.example.com
```

```typescript
// Before
const apiUrl = process.env.REACT_APP_API_URL

// After
const apiUrl = import.meta.env.VITE_API_URL
```

### 5. Remove CRA Dependencies

```bash
bun remove react-scripts
```

## Migration from Vue CLI

### 1. Install Vite

```bash
bun add -D vite @vitejs/plugin-vue
```

### 2. Create vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

### 3. Update index.html

ย้าย `public/index.html` ไปยัง root directory

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

### 4. Update Environment Variables

```bash
# Before (Vue CLI)
VUE_APP_API_URL=https://api.example.com

# After (Vite)
VITE_API_URL=https://api.example.com
```

### 5. Remove Vue CLI Dependencies

```bash
bun remove @vue/cli-service
```

## Common Migration Issues

### 1. Path Aliases

```typescript
// vite.config.ts
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 2. CSS Preprocessors

```bash
# Install preprocessors
bun add -D sass less stylus
```

```typescript
// vite.config.ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
})
```

### 3. Proxy Configuration

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:3000',
        changeOrigin: true,
      },
    },
  },
})
```

### 4. Static Assets

```typescript
// Before (Webpack)
import logo from './logo.png'

// After (Vite) - same syntax
import logo from './logo.png'
```

## Breaking Changes

### Vite 5.x → 6.x

1. **Node.js Version**: ต้องใช้ Node.js 18+ หรือ 20+
2. **Rollup Version**: อัปเดตเป็น Rollup 4.x
3. **Plugin API**: บาง plugins อาจต้องอัปเดต

### Vite 4.x → 5.x

1. **esbuild Version**: อัปเดตเป็น esbuild 0.19+
2. **Dep Optimization**: เปลี่ยนรูปแบบ cache
3. **CSS Modules**: ปรับปรุง behavior

## Migration Checklist

### Before Migration

- [ ] Backup project
- [ ] Check Node.js version (18+)
- [ ] Document current build configuration
- [ ] List all custom plugins

### During Migration

- [ ] Install Vite
- [ ] Create vite.config.ts
- [ ] Update index.html
- [ ] Update package.json scripts
- [ ] Migrate environment variables
- [ ] Update path aliases
- [ ] Configure proxy if needed
- [ ] Test development server
- [ ] Test production build

### After Migration

- [ ] Remove old build tool dependencies
- [ ] Update CI/CD configuration
- [ ] Test all features
- [ ] Check bundle size
- [ ] Update documentation

## Tools for Migration

### 1. Vite Migration Guide

Official migration guide: https://vitejs.dev/guide/migration.html

### 2. AST-based Migration

ใช้ tools อย่าง `jscodeshift` สำหรับ automated code transformations

### 3. Manual Review

ตรวจสอบ manually สำหรับ custom configurations และ plugins
