# Vue-Specific Issues

## 1. Vue SFC Not Working

**Problem:**
Vue SFC files ไม่ทำงาน

**Solution:**
```typescript
// vite.config.ts
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

## 2. JSX Not Working in Vue

**Problem:**
JSX ไม่ทำงานใน Vue

**Solution:**
```bash
bun add -D @vitejs/plugin-vue-jsx
```

```typescript
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [vue(), vueJsx()],
})
```
