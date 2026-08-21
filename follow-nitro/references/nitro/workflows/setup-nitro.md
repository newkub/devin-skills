---
description: ตั้งค่า Nitro framework สำหรับโปรเจกต์ใหม่
---

## Goal

ตั้งค่า Nitro framework สำหรับโปรเจกต์ใหม่ตาม best practices

## Execute

### 1. Initialize Project

1. สร้างโปรเจกต์ใหม่ด้วย:
   ```bash
   bun init
   ```
2. ติดตั้ง Nitro:
   ```bash
   bun add nitropack
   bun add -D @types/node
   ```

### 2. Setup Configuration

1. สร้าง `nitro.config.ts`:
   ```typescript
   import { defineNitroConfig } from 'nitropack/config'

   export default defineNitroConfig({
     preset: 'node', // หรือ preset อื่นๆ ตาม deployment target
     srcDir: 'server',
     routeRules: {
       '/api/**': { cors: true }
     }
   })
   ```

### 3. Create Server Structure

1. สร้าง `server/` directory
2. สร้าง `server/api/` สำหรับ API routes
3. สร้าง `server/routes/` สำหรับ page routes
4. สร้าง `server/middleware/` สำหรับ middleware

### 4. Add Scripts

อัปเดต `package.json`:
```json
{
  "scripts": {
    "dev": "nitro dev",
    "build": "nitro build",
    "preview": "nitro preview"
  }
}
```

### 5. Verification

1. รัน development server:
   ```bash
   bun run dev
   ```
2. ตรวจสอบว่า server ทำงานที่ `http://localhost:3000`
3. ทดสอบ build:
   ```bash
   bun run build
   ```

## Rules

- ใช้ preset ที่เหมาะสมกับ deployment target
- แยก API routes และ page routes ให้ชัดเจน
- ใช้ middleware สำหรับ cross-cutting concerns
- ตั้งค่า CORS สำหรับ API endpoints
