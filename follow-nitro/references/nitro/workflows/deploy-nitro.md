---
description: Deploy Nitro application ไปยังต่างๆ platform
---

## Goal

Deploy Nitro application ไปยัง platform ที่ต้องการ

## Execute

### 1. Choose Deployment Target

เลือก platform ตามความต้องการ:
- **Vercel** - preset: `vercel`
- **Cloudflare** - preset: `cloudflare` หรือ `cloudflare-pages`
- **Netlify** - preset: `netlify`
- **Node.js** - preset: `node`
- **Deno** - preset: `deno`
- **Bun** - preset: `bun`

### 2. Update Configuration

แก้ไข `nitro.config.ts`:
```typescript
export default defineNitroConfig({
  preset: 'vercel', // เปลี่ยนตาม platform
})
```

### 3. Build

```bash
bun run build
```

### 4. Deploy

ตาม platform:

#### Vercel
```bash
bunx vercel
```

#### Cloudflare Pages
```bash
bunx wrangler pages deploy .output/public
```

#### Netlify
```bash
bunx netlify deploy --prod
```

### 5. Environment Variables

ตั้งค่า environment variables ใน platform dashboard:
- `NITRO_PORT`
- ตัวแปรอื่นๆ ที่ application ต้องการ

## Rules

- ใช้ preset ที่ match กับ platform
- ตั้งค่า environment variables ใน platform ไม่ใช่ใน code
- ทดสอบ deployment บน staging ก่อน production
- ใช้ `/follow-deploy-to-cloudflare` สำหรับ Cloudflare deployment
