# Environment Variables Issues

## 1. Env Variables Not Loading

**Problem:**
Environment variables ไม่ถูกโหลด

**Solution:**
```bash
# Ensure .env file exists
# Variables must start with VITE_
VITE_API_URL=https://api.example.com
```

```typescript
// Access correctly
const apiUrl = import.meta.env.VITE_API_URL
```

## 2. Type Safety for Env Variables

**Problem:**
ไม่มี type safety สำหรับ env variables

**Solution:**
```typescript
// src/env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```
