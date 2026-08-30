---
name: follow-service-supabase
description: ใช้งาน Supabase สำหรับ build backend ด้วย PostgreSQL, Auth, Edge Functions, Realtime และ CLI
related:
  - follow-service-aws-sdk
  - follow-service-cloudflare
  - follow-service-infisical
  - follow-best-practice
  - learn-from-web
  - setup-cicd
  - delete
---

## Goal

ใช้งาน Supabase สำหรับ build backend ด้วย PostgreSQL, Auth, Edge Functions, Realtime และจัดการ local development, migrations, deploy ผ่าน Supabase CLI

## Scope

ใช้สำหรับ:
- Build backend ด้วย PostgreSQL, Auth, Edge Functions, Realtime
- Database management ด้วย PostgreSQL
- Authentication และ authorization
- Realtime subscriptions
- Edge functions ด้วย Deno
- Local development ด้วย Supabase CLI
- Database migrations และ type generation
- Secrets, storage, branches และ CI/CD integration

## Execute

### 1. Install And Authenticate

> Goal: ติดตั้งและตั้งค่า Supabase CLI

1. ติดตั้ง Supabase CLI ด้วย `bun add -D supabase` หรือ Homebrew/Scoop/standalone binary
2. ตรวจสอบ version ด้วย `supabase --version`
3. Login ด้วย `supabase login` เพื่อเชื่อมต่อกับ Supabase account
4. ตรวจสอบ authentication ด้วย `supabase projects list`
5. ติดตั้ง Docker สำหรับ local development

### 2. Initialize Project

> Goal: สร้างและตั้งค่าโปรเจกต์

1. Initialize project ด้วย `supabase init`
2. สร้าง `supabase/config.toml` config file
3. Link ไปยัง remote project ด้วย `supabase link --project-ref <project-id>`
4. ตั้งค่า project ID และ database URL
5. ตรวจสอบ project status ด้วย `supabase status`

### 3. Local Development

> Goal: พัฒนาและทดสอบใน local environment

1. Start local stack ด้วย `supabase start`
2. Stop local stack ด้วย `supabase stop`
3. ตรวจสอบ status ด้วย `supabase status`
4. Access local database ผ่าน Studio ที่ `http://127.0.0.1:54323`
5. Test migrations และ seed data ใน local

### 4. Database Migrations

> Goal: จัดการ database migrations

1. Create migration ด้วย `supabase migration new migration_name`
2. List migrations ด้วย `supabase migration list`
3. Apply migrations ด้วย `supabase migration up`
4. Rollback migrations ด้วย `supabase migration down`
5. Fetch remote migrations ด้วย `supabase migration fetch`

### 5. Database Operations

> Goal: จัดการ database operations

1. Pull schema จาก remote ด้วย `supabase db pull`
2. Push schema ไป remote ด้วย `supabase db push`
3. Reset database ด้วย `supabase db reset`
4. Dump database ด้วย `supabase db dump`
5. Diff schemas ด้วย `supabase db diff`

### 6. Type Generation

> Goal: สร้าง TypeScript types จาก database schema

1. Generate types ด้วย `supabase gen types typescript --local`
2. Generate types สำหรับ specific schema ด้วย `--schema public --schema auth`
3. Output types ไปยัง file ด้วย `--output`
4. Integrate types กับ ORM หรือ client libraries
5. Regenerate types เมื่อ schema เปลี่ยน

### 7. Edge Functions

> Goal: จัดการ Edge Functions

1. Create function ด้วย `supabase functions new function_name`
2. List functions ด้วย `supabase functions list`
3. Serve locally ด้วย `supabase functions serve`
4. Deploy function ด้วย `supabase functions deploy`
5. Delete function ด้วย `supabase functions delete`

### 8. Secrets And Storage

> Goal: จัดการ secrets และ storage

1. Set secret ด้วย `supabase secrets set KEY=value`
2. List secrets ด้วย `supabase secrets list`
3. Delete secret ด้วย `supabase secrets unset KEY`
4. List storage ด้วย `supabase storage ls`
5. Copy/move/remove files ด้วย `supabase storage cp/mv/rm`

### 9. Branches And Inspection

> Goal: จัดการ branches และตรวจสอบ database health

1. Create branch ด้วย `supabase branches create`
2. List/switch/pause/delete branches
3. Inspect bloat ด้วย `supabase inspect db bloat`
4. Inspect blocking และ long-running queries
5. Generate report ด้วย `supabase inspect report`

### 10. Configuration And API Reference

> Goal: อ่าน configuration และ API reference

1. อ่าน [references/supabase-cli.md](references/supabase-cli.md) สำหรับ CLI commands
2. อ่าน [references/supabase-config.md](references/supabase-config.md) สำหรับ configuration reference
3. อ่าน [references/supabase-client-api.md](references/supabase-client-api.md) สำหรับ Client SDK API reference
4. อ่าน [references/official-resources.md](references/official-resources.md) สำหรับ official links และ resources

## Rules

### 1. Configuration Management

- ใช้ `supabase/config.toml` เป็น single source of truth
- ตั้งค่า `project_id` และ `api_url` อย่างถูกต้อง
- ไม่ commit sensitive data ไปยัง version control
- ใช้ environment-specific configs สำหรับ dev/staging/prod
- ใช้ `.env` files สำหรับ local development

### 2. Migration Best Practices

- Create migrations สำหรับทุก schema changes
- ใช้ descriptive names สำหรับ migrations
- Test migrations ใน local ก่อน deploy
- ไม่ edit migrations ที่ deploy แล้ว
- ใช้ `supabase db diff` สำหรับ review changes

### 3. Type Safety

- Generate types อัตโนมัติด้วย `supabase gen types`
- Regenerate types เมื่อ schema เปลี่ยน
- Integrate types กับ ORM หรือ client libraries
- ใช้ strict type checking

### 4. Secret Security

- ไม่ commit secrets ไปยัง version control
- ใช้ `supabase secrets set` แทนการแก้ config
- Rotate secrets อย่างสม่ำเสมอ
- ใช้ environment-specific secrets

### 5. CI/CD Integration

- ใช้ `SUPABASE_ACCESS_TOKEN` สำหรับ authentication
- ใช้ `supabase db push` ใน CI สำหรับ migrations
- ใช้ `supabase functions deploy` สำหรับ functions
- Test ก่อน deploy ด้วย `supabase db diff`

- ใช้ /follow-service-aws-sdk ถ้าจำเป็น
- ใช้ /follow-service-cloudflare ถ้าจำเป็น
- ใช้ /follow-service-infisical ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /learn-from-web ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น

## Expected Outcome

- Supabase CLI ติดตั้งและตั้งค่าอย่างถูกต้อง
- Local development environment ทำงานได้
- Database migrations จัดการอย่างเป็นระบบ
- TypeScript types สร้างอัตโนมัติ
- Edge functions deploy ได้อย่างราบรื่น
- Secrets จัดการอย่างปลอดภัย
- CI/CD integration ทำงานได้อัตโนมัติ
- Backend ที่ built ด้วย Supabase พร้อม PostgreSQL, Auth, Realtime
