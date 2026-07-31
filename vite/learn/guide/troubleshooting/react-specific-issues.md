# React-Specific Issues

## 1. Fast Refresh Not Working

**Problem:**
React Fast Refresh ไม่ทำงาน

**Solution:**
```typescript
// vite.config.ts
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

## 2. JSX Not Working

**Problem:**
JSX ไม่ทำงาน

**Solution:**
```typescript
// vite.config.ts
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',  // If using Emotion
    }),
  ],
})
```
