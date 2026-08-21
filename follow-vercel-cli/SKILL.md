---
name: follow-vercel-cli
description: ใช้งาน Vercel CLI สำหรับ deploy และ manage projects บน Vercel
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

ใช้งาน Vercel CLI สำหรับ deploy, manage และ monitor projects บน Vercel platform

## Scope

ใช้สำหรับโปรเจกต์ที่ deploy ไปยัง Vercel รวมถึง Next.js, Nuxt, React, และ frameworks อื่นๆ

## Execute

### 1. Install And Authenticate

ติดตั้งและตั้งค่า Vercel CLI

1. ติดตั้ง Vercel CLI ด้วย `bun add -g vercel` หรือ `pnpm i -g vercel`
2. ตรวจสอบ version ด้วย `vercel --version`
3. Login ด้วย `vercel login` เพื่อเชื่อมต่อกับ Vercel account
4. เลือก team และ scope ที่ต้องการ
5. ตรวจสอบ authentication ด้วย `vercel whoami`

### 2. Initialize Project

สร้างและ link โปรเจกต์กับ Vercel

1. Link โปรเจกต์ที่มีอยู่ด้วย `vercel link`
2. สร้างโปรเจกต์ใหม่ด้วย `vercel`
3. ตั้งค่า project name และ settings
4. เลือก framework preset หรือ custom build settings
5. สร้าง `vercel.json` config file หากจำเป็น

### 3. Local Development

พัฒนาและทดสอบใน local environment

1. รัน local dev server ด้วย `vercel dev`
2. ตรวจสอบ logs และ errors ใน terminal
3. ใช้ `--listen` flag สำหรับ custom port
4. Test environment variables และ build settings
5. Simulate production environment ใน local

### 4. Deploy To Preview

Deploy ไปยัง preview environments

1. Deploy ด้วย `vercel` เพื่อสร้าง preview deployment
2. ตรวจสอบ deployment URL และ status
3. View logs ด้วย `vercel logs`
4. Test preview deployment ก่อน merge
5. Share preview URL สำหรับ code review

### 5. Deploy To Production

Deploy ไปยัง production environment

1. Deploy ไป production ด้วย `vercel --prod`
2. ใช้ `--prebuilt` flag สำหรับ prebuilt deployments
3. ตรวจสอบ production deployment status
4. Monitor production logs ด้วย `vercel logs --prod`
5. Rollback หากจำเป็นด้วย `vercel rollback`

### 6. Manage Environment Variables

จัดการ environment variables และ secrets

1. Set environment variable ด้วย `vercel env add`
2. List environment variables ด้วย `vercel env ls`
3. Pull environment variables ด้วย `vercel env pull`
4. ใช้ environment-specific variables ด้วย `--environment`
5. ไม่ commit secrets ไปยัง git

### 7. Monitor And Debug

Monitor และ debug deployments

1. View logs ด้วย `vercel logs`
2. Filter logs ด้วย `--level` flag
3. Monitor specific deployment ด้วย `--deployment`
4. Inspect build output ด้วย `vercel inspect`
5. View deployment metrics ด้วย `vercel metrics`

### 8. Manage Domains

จัดการ custom domains

1. Add custom domain ด้วย `vercel domains add`
2. List domains ด้วย `vercel domains ls`
3. Remove domain ด้วย `vercel domains rm`
4. Verify DNS configuration
5. Configure SSL certificates อัตโนมัติ

### 9. Team And Project Management

จัดการ teams และ projects

1. List projects ด้วย `vercel list`
2. Switch teams ด้วย `vercel switch`
3. Manage team members ผ่าน dashboard
4. Configure project settings
5. Manage billing และ usage

## Rules

### 1. Configuration Management

จัดการ configuration files อย่างเป็นระบบ

- ใช้ `vercel.json` สำหรับ custom build settings
- ตั้งค่า `buildCommand` และ `outputDirectory` อย่างถูกต้อง
- ใช้ environment-specific configs ด้วย `--environment`
- ไม่ hardcode secrets ใน config files
- ใช้ `.env` files สำหรับ local development
- ใช้ Vercel dashboard สำหรับ sensitive configs

### 2. Deployment Best Practices

ทำตาม best practices สำหรับ deployment

- Deploy ไป preview ก่อน production เสมอ
- ใช้ Git integration สำหรับ automatic deployments
- Test preview deployments ก่อน merge PR
- ใช้ `--prebuilt` สำหรับ faster deployments
- Monitor logs หลัง deploy ทุกครั้ง
- ตั้งค่า deployment protection สำหรับ production

### 3. Environment Variable Security

รักษาความปลอดภัยของ environment variables

- ไม่ commit secrets ไปยัง version control
- ใช้ `vercel env add` แทนการแก้ config files
- ใช้ environment-specific variables สำหรับ isolation
- Rotate secrets อย่างสม่ำเสมอ
- ตรวจสอบ variable access logs
- ใช้ different environments สำหรับ dev/staging/prod

### 4. Development Workflow

ใช้งาน development workflow ที่มีประสิทธิภาพ

- ใช้ `vercel dev` สำหรับ local development
- Simulate production environment ใน local
- Test environment variables ใน local
- Monitor logs และ errors ใน real-time
- ใช้ Git integration สำหรับ automatic preview deployments
- ใช้ branch-based deployments สำหรับ feature branches

### 5. Performance Optimization

ปรับปรุง performance ของ deployments

- ใช้ `--prebuilt` flag สำหรับ faster builds
- Optimize build process ด้วย caching
- ใช้ edge functions สำหรับ dynamic content
- Monitor build times และ deployment duration
- ใช้ image optimization สำหรับ assets
- ตรวจสอบ bundle size และ loading performance

### 6. CI/CD Integration

ผสาน Vercel CLI เข้ากับ CI/CD pipelines

- ใช้ `VERCEL_TOKEN` สำหรับ authentication
- ใช้ `vercel --prod --token` ใน CI
- ตั้งค่า environment variables ใน CI/CD
- ใช้ `vercel env pull` สำหรับ local development
- Test ก่อน deploy ด้วย `vercel dev`
- ใช้ GitHub Actions หรือ GitLab CI สำหรับ automation

### 7. Monitoring And Debugging

Monitor และ debug deployments อย่างมีประสิทธิภาพ

- ใช้ `vercel logs` สำหรับ real-time monitoring
- Filter logs ด้วย `--level error` สำหรับ errors
- Monitor specific deployment ด้วย `--deployment`
- ใช้ `vercel inspect` สำหรับ build debugging
- ตรวจสอบ deployment metrics แล告 analytics
- ใช้ Vercel dashboard สำหรับ detailed insights

## Expected Outcome

- Vercel CLI ติดตั้งและตั้งค่าอย่างถูกต้อง
- Projects deploy ได้อย่างราบรื่น
- Environment variables จัดการอย่างปลอดภัย
- Development workflow มีประสิทธิภาพ
- CI/CD integration ทำงานได้อัตโนมัติ
- Monitoring และ debugging ทำได้อย่างมีประสิทธิภาพ
