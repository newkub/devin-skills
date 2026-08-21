---
name: follow-vercel
description: Deploy applications บน Vercel พร้อม serverless และ edge functions
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - watch-browser
  - resolve-errors
  - loop-until-complete
---

## Goal

Deploy applications บน Vercel platform พร้อม auto-build, preview deployments, serverless functions และ edge functions

## Scope

ครอบคลุมการติดตั้ง Vercel CLI, link project, configure, build, deploy, environment variables, serverless/edge functions และ CI/CD

## Execute

### 1. Install Vercel CLI

> Goal: ติดตั้งและ authenticate Vercel CLI
> Goal: Vercel CLI ติดตั้งและ authenticate สำเร็จ

1. รัน `bun add -D vercel`
2. หรือใช้ `bunx vercel` โดยไม่ต้องติดตั้ง
3. รัน `bunx vercel login` เพื่อ authenticate

### 2. Link Project

> Goal: เชื่อมต่อ project กับ Vercel
> Goal: Project เชื่อมต่อกับ Vercel ได้

1. รัน `bunx vercel link` ใน project directory
2. ยืนยัน project settings
3. หรือใช้ `VERCEL_ORG_ID` และ `VERCEL_PROJECT_ID` สำหรับ CI/CD

### 3. Configure vercel.json

> Goal: กำหนด configuration สำหรับ deployment
> Goal: `vercel.json` ตั้งค่าถูกต้องตาม project

`vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/src/index.ts" }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 4. Framework Presets

> Goal: Vercel รองรับ auto-detection สำหรับ frameworks
> Goal: ระบุ framework preset ที่เหมาะสม

- Next.js: ใช้ `next` preset อัตโนมัติ
- Nuxt: ใช้ `nuxt` preset พร้อม SSR
- SvelteKit: ใช้ `sveltekit` preset
- Remix: ใช้ `remix` preset
- Astro: ใช้ `astro` preset
- Vite: ใช้ `vite` preset สำหรับ static build

### 5. Build And Deploy

> Goal: Build และ deploy application
> Goal: Application build และ deploy สำเร็จ

1. รัน `bun run build` หรือ `nitro build` สำหรับ Nitro projects
2. ตรวจสอบว่า build สำเร็จและ output พร้อม
3. รัน `bunx vercel deploy` สำหรับ preview deployment
4. รัน `bunx vercel deploy --prod` สำหรับ production
5. สำหรับ Nitro: รัน `nitro build deploy vercel`

### 6. Environment Variables

> Goal: ตั้งค่า environment variables
> Goal: Environment variables ถูกต้องและ sync กับ Vercel

1. รัน `bunx vercel env add KEY_NAME`
2. หรือใช้ dashboard สำหรับ manage variables
3. ใช้ `vercel env pull .env.local` เพื่อ sync ไปยัง local
4. กำหนด `NODE_ENV`, `API_URL` และ secrets

### 7. Serverless Functions

> Goal: สร้าง serverless functions ใน `api/` directory
> Goal: Serverless functions ทำงานได้บน Vercel

`api/hello.ts`:
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ message: 'Hello from Vercel' })
}
```

### 8. Edge Functions

> Goal: สร้าง edge functions สำหรับ edge deployment
> Goal: Edge functions ทำงานได้ถูกต้อง

`api/edge.ts`:
```typescript
export const config = {
  runtime: 'edge'
}

export default async function handler(req: Request) {
  return new Response('Hello from Edge Function')
}
```

### 9. Watch Deployment

> Goal: ตรวจสอบ deployment ด้วย browser preview
> Goal: Deployment ทำงานถูกต้องไม่มี errors

1. ทำ `/watch-browser` ด้วย deployment URL
2. ตรวจสอบว่า page load สำเร็จ
3. ตรวจสอบ console errors และ network errors
4. ทำ `/resolve-errors` เมื่อพบปัญหา
5. ทำ `/loop-until-complete` จนกว่า deployment live สำเร็จ

### 10. CI/CD Deployment

> Goal: ตั้งค่า automated deployment
> Goal: CI/CD deploy อัตโนมัติทั้ง preview และ production

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bunx vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Rules

### 1. Framework Detection

- Vercel จะ auto-detect framework จาก `package.json`
- กำหนด `buildCommand` ใน `package.json` scripts หรือ `vercel.json`
- ระบุ `outputDirectory`: `dist`, `build`, หรือ `.next` ตาม framework
- ใช้ `bun install` สำหรับ Bun projects

### 2. Build Process

- ใช้ `nitro build` ก่อน deploy เสมอ สำหรับ Nitro projects
- ตรวจสอบ build output ว่าสำเร็จ
- ตรวจสอบ bundle size

### 3. Environment Variables

- ใช้ `vercel env` CLI หรือ dashboard
- ใช้ `vercel env pull` สำหรับ sync ไป local
- ไม่ hardcode secrets

### 4. Functions

- Serverless functions สร้างใน `api/` directory
- Edge functions ใช้ `runtime: 'edge'`
- กำหนด `regions` ใน `vercel.json` ถ้าต้องการ

### 5. Deployment

- ทุก PR จะสร้าง preview deployment อัตโนมัติ
- ใช้ `bunx vercel deploy` สำหรับ preview
- ใช้ `bunx vercel deploy --prod` สำหรับ production
- ตั้งค่า protection rules สำหรับ production deployments
- ใช้ `/watch-browser` สำหรับ monitoring
- ทำ `/loop-until-complete` จนกว่า deployment live

### 6. Advanced Configuration

- กำหนด `rewrites` ใน `vercel.json` สำหรับ URL routing
- กำหนด `headers` สำหรับ security และ caching
- ใช้ `crons` สำหรับ scheduled functions
- ใช้ `ignoreCommand` สำหรับ skip builds

## Expected Outcome

- Application ที่ deploy บน Vercel ได้สำเร็จ
- Auto-build configuration ที่รองรับ multiple frameworks
- Serverless และ Edge functions ที่ทำงานได้ถูกต้อง
- CI/CD pipeline ที่ deploy อัตโนมัติทั้ง preview และ production
- Environment variables ที่จัดการอย่างปลอดภัย
- Deployment live และใช้งานได้ ไม่มี console หรือ network errors

## Guide

อ้างอิงเพิ่มเติม:

- `references/vercel-overview.md` — overview ของ Vercel platform
- `references/website.md` — links หลักของ Vercel
