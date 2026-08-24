---
name: follow-wrangler-cli
description: ใช้งาน Wrangler CLI สำหรับ Cloudflare Workers และ Developer Platform
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
---

## Goal

ใช้งาน Wrangler CLI สำหรับ develop, deploy และ manage Cloudflare Workers และ Developer Platform products

## Scope

ใช้สำหรับโปรเจกต์ที่ใช้ Cloudflare Workers, Pages, D1, KV, R2, Queues, Workflows และ services อื่นๆ ของ Cloudflare

## Execute

### 1. Install And Authenticate

installและกำหนดค่า Wrangler CLI
> Goal: Install And Authenticate

1. install Wrangler ด้วย `bun add -D wrangler` หรือ `npm install -g wrangler`
2. ตรวจสอบ version ด้วย `wrangler --version`
3. Login ด้วย `wrangler login` เพื่อต่อกับ Cloudflare account
4. ตรวจสอบ authentication ด้วย `wrangler whoami`

### 2. Initialize Project

สร้างและกำหนดค่าโปรเจกต์
> Goal: Initialize Project

1. สร้างโปรเจกต์ใหม่ด้วย `wrangler init project-name`
2. สร้าง `wrangler.toml` config file อัตโนมัติ
3. กำหนดค่า `main`, `compatibility_date`, `vars` ใน config
4. เลือก template หรือ framework ที่ต้องการ

### 3. Local Development

พัฒนาและทดสอบใน local environment
> Goal: Local Development

1. รัน local dev server ด้วย `wrangler dev`
2. ตรวจสอบ logs และ errors ใน terminal
3. ใช้ `--local` flag สำหรับ local mode
4. ใช้ `--port` สำหรับ custom port
5. Test bindings และ environment variables

### 4. Deploy To Production

Deploy Workers และ resources ไปยัง Cloudflare
> Goal: Deploy To Production

1. Deploy ด้วย `wrangler deploy`
2. Deploy ไปยัง specific environment ด้วย `--env`
3. ตรวจสอบ deployment status
4. View deployment URL และ logs
5. ใช้ `wrangler versions` สำหรับ version management

### 5. Manage Bindings

จัดการ bindings สำหรับ Workers
> Goal: Manage Bindings

1. สร้าง D1 database ด้วย `wrangler d1 create`
2. สร้าง KV namespace ด้วย `wrangler kv:namespace create`
3. สร้าง R2 bucket ด้วย `wrangler r2 bucket create`
4. เพิ่ม bindings ใน `wrangler.toml`
5. Link bindings ด้วย `wrangler d1 execute` หรือ `wrangler kv:key put`

### 6. Manage Secrets

จัดการ secrets และ environment variables
> Goal: Manage Secrets

1. Set secrets ด้วย `wrangler secret put SECRET_NAME`
2. List secrets ด้วย `wrangler secret list`
3. Delete secrets ด้วย `wrangler secret delete`
4. ใช้ environment-specific secrets ด้วย `--env`
5. ห้าม commit secrets ไปยัง git

### 7. Manage Workers

จัดการ Workers และ configurations
> Goal: Manage Workers

1. List workers ด้วย `wrangler workers list`
2. Delete worker ด้วย `wrangler delete`
3. Tail logs ด้วย `wrangler tail`
4. Trigger cron schedules ด้วย `wrangler triggers secret`
5. Manage subrequests และ limits

### 8. Advanced Features

ใช้งาน features ขั้นสูง
> Goal: Advanced Features

1. ใช้ `wrangler pages deploy` สำหรับ Pages projects
2. ใช้ `wrangler queues` สำหรับ message queues
3. ใช้ `wrangler workflows` สำหรับ workflows
4. ใช้ `wrangler hyperdrive` สำหรับ database connections
5. ใช้ `wrangler vectorize` สำหรับ vector embeddings

## Rules

### 1. Configuration Management

จัดการ configuration files อย่างเป็นระบบ

- ใช้ `wrangler.toml` เป็น single source of truth
- กำหนดค่า `compatibility_date` เป็นวันปัจจุบันเสมอ
- ใช้ environment-specific configs ด้วย `[env.production]`
- ห้าม hardcode secrets ใน config files
- ใช้ `vars` สำหรับ public environment variables
- ใช้ `secrets` สำหรับ sensitive data

### 2. Deployment Best Practices

ทำตาม best practices สำหรับ deployment

- Deploy ไปยัง preview environments ก่อน production
- ใช้ `--env` flag สำหรับ multiple environments
- Test ใน local ก่อน deploy ด้วย `wrangler dev --local`
- ตรวจสอบ logs หลัง deploy ด้วย `wrangler tail`
- ใช้ versioning สำหรับ rollback capability
- กำหนดค่า routing และ custom domains อย่างถูกต้อง

### 3. Binding Management

จัดการ bindings อย่างเป็นระบบ

- สร้าง resources ผ่าน CLI ก่อน bind ใน config
- ใช้ descriptive names สำหรับ namespaces และ buckets
- ตรวจสอบ binding permissions และ limits
- ใช้ environment-specific bindings สำหรับ isolation
- Document binding names และ purposes
- Clean up unused resources ด้วย `wrangler d1 delete` หรือ `wrangler r2 bucket delete`

### 4. Secret Security

รักษาความปลอดภัยของ secrets

- ห้าม commit secrets ไปยัง version control
- ใช้ `wrangler secret put` แทนการแก้ config files
- Rotate secrets เป็นระยะ
- ใช้ environment-specific secrets
- ตรวจสอบ secret access logs
- ใช้ secret management services สำหรับ production

### 5. Development Workflow

ใช้งาน development workflow ที่มีประสิทธิภาพ

- ใช้ `wrangler dev` สำหรับ hot reload และ fast iteration
- ใช้ `--local` flag สำหรับ offline development
- Monitor logs และ errors ใน real-time
- Test bindings และ integrations ใน local
- ใช้ `wrangler tail` สำหรับ production debugging
- กำหนดค่า log levels และ filtering

### 6. Performance Optimization

ปรับปรุง performance ของ Workers

- ใช้ `wrangler tail` เพื่อ monitor performance
- ตรวจสอบ subrequest limits และ usage
- Optimize cold starts ด้วย proper caching
- ใช้ edge caching สำหรับ static assets
- Monitor CPU time และ memory usage
- ใช้ `wrangler analytics` สำหรับ insights

### 7. CI/CD Integration

ผสาน Wrangler เข้ากับ CI/CD pipelines

- ใช้ `WRANGLER_API_TOKEN` สำหรับ authentication
- ใช้ `wrangler deploy --env production` ใน CI
- กำหนดค่า environment variables ใน CI/CD
- ใช้ `wrangler secret put` ใน CI สำหรับ secrets
- Test ก่อน deploy ด้วย `wrangler dev --local`
- ใช้ GitHub Actions หรือ GitLab CI สำหรับ automation

## Expected Outcome

- Wrangler CLI installและกำหนดค่าอย่างถูกต้อง
- Workers deploy ได้อย่างราบรื่น
- Bindings และ secrets จัดการอย่างปลอดภัย
- Development workflow มีประสิทธิภาพ
- CI/CD integration ทำงานได้อัตโนมัติ
- Performance monitoring และ optimization
