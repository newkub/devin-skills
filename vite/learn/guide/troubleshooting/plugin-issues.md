# Plugin Issues

## 1. Plugin Not Working

**Problem:**
Plugin ไม่ทำงาน

**Solution:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import pluginName from 'vite-plugin-name'

export default defineConfig({
  plugins: [
    pluginName(),  // Ensure plugin is called as function
  ],
})
```

## 2. Plugin Conflicts

**Problem:**
Plugins ขัดแย้งกัน

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    plugin1(),
    plugin2(),  // Order matters
  ],
})
```
