---
name: follow-supabase-cli
description: ใช้งาน Supabase CLI สำหรับ local development และ database management
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

ใช้งาน Supabase CLI สำหรับ local development, database migrations, และ deploy ไปยัง Supabase Platform

## Scope

ใช้สำหรับโปรเจกต์ที่ใช้ Supabase database, auth, storage, และ edge functions

## Execute

### 1. Install And Authenticate
> Goal: Install And Authenticate
ติดตั้งและตั้งค่า Supabase CLI

1. ติดตั้ง Supabase CLI ด้วย Homebrew, Scoop, หรือ standalone binary
2. ตรวจสอบ version ด้วย `supabase --version`
3. Login ด้วย `supabase login` เพื่อเชื่อมต่อกับ Supabase account
4. ตรวจสอบ authentication ด้วย `supabase projects list`
5. ติดตั้ง Docker สำหรับ local development

### 2. Initialize Project
> Goal: Initialize Project
สร้างและตั้งค่าโปรเจกต์

1. Initialize project ด้วย `supabase init`
2. สร้าง `supabase/config.toml` config file
3. Link ไปยัง remote project ด้วย `supabase link`
4. ตั้งค่า project ID และ database URL
5. ตรวจสอบ project status ด้วย `supabase status`

### 3. Local Development
> Goal: Local Development
พัฒนาและทดสอบใน local environment

1. Start local stack ด้วย `supabase start`
2. Stop local stack ด้วย `supabase stop`
3. ตรวจสอบ status ด้วย `supabase status`
4. Access local database ผ่าน Studio ที่ localhost
5. Test migrations และ seed data ใน local

### 4. Database Migrations
> Goal: Database Migrations
จัดการ database migrations

1. Create migration ด้วย `supabase migration new migration_name`
2. List migrations ด้วย `supabase migration list`
3. Apply migrations ด้วย `supabase migration up`
4. Rollback migrations ด้วย `supabase migration down`
5. Fetch remote migrations ด้วย `supabase migration fetch`

### 5. Database Operations
> Goal: Database Operations
จัดการ database operations

1. Pull schema จาก remote ด้วย `supabase db pull`
2. Push schema ไป remote ด้วย `supabase db push`
3. Reset database ด้วย `supabase db reset`
4. Dump database ด้วย `supabase db dump`
5. Diff schemas ด้วย `supabase db diff`

### 6. Seed Data
> Goal: Seed Data
จัดการ seed data

1. Create seed files ใน `supabase/seed.sql`
2. Run seed data ด้วย `supabase db reset` (includes seed)
3. Manage storage buckets ด้วย `supabase seed buckets`
4. Test seed data ใน local environment
5. Version control seed files

### 7. Type Generation
> Goal: Type Generation
สร้าง TypeScript types จาก database schema

1. Generate types ด้วย `supabase gen types typescript`
2. Generate types สำหรับ specific schema ด้วย `--schema`
3. Output types ไปยัง file ด้วย `--output`
4. Integrate types กับ ORM หรือ client libraries
5. Regenerate types เมื่อ schema เปลี่ยน

### 8. Edge Functions
> Goal: Edge Functions
จัดการ Edge Functions

1. Create function ด้วย `supabase functions new function_name`
2. List functions ด้วย `supabase functions list`
3. Serve locally ด้วย `supabase functions serve`
4. Deploy function ด้วย `supabase functions deploy`
5. Delete function ด้วย `supabase functions delete`

### 9. Secrets Management
> Goal: Secrets Management
จัดการ secrets สำหรับ Edge Functions

1. Set secret ด้วย `supabase secrets set`
2. List secrets ด้วย `supabase secrets list`
3. Delete secret ด้วย `supabase secrets unset`
4. ใช้ environment-specific secrets
5. ไม่ commit secrets ไปยัง git

### 10. Storage Management
> Goal: Storage Management
จัดการ storage buckets และ files

1. List storage ด้วย `supabase storage ls`
2. Copy files ด้วย `supabase storage cp`
3. Move files ด้วย `supabase storage mv`
4. Remove files ด้วย `supabase storage rm`
5. Manage bucket policies ผ่าน dashboard

### 11. Branch Management
> Goal: Branch Management
จัดการ database branches

1. Create branch ด้วย `supabase branches create`
2. List branches ด้วย `supabase branches list`
3. Switch branches ด้วย `supabase branches get`
4. Pause branch ด้วย `supabase branches pause`
5. Delete branch ด้วย `supabase branches delete`

### 12. Database Inspection
> Goal: Database Inspection
ตรวจสอบ database performance และ health

1. Inspect bloat ด้วย `supabase inspect db bloat`
2. Inspect blocking queries ด้วย `supabase inspect db blocking`
3. Inspect long-running queries ด้วย `supabase inspect db long-running-queries`
4. Inspect table stats ด้วย `supabase inspect db table-stats`
5. Generate report ด้วย `supabase inspect report`

## Rules

### 1. Configuration Management

จัดการ configuration files อย่างเป็นระบบ

- ใช้ `supabase/config.toml` เป็น single source of truth
- ตั้งค่า `project_id` และ `api_url` อย่างถูกต้อง
- ไม่ commit sensitive data ไปยัง version control
- ใช้ environment-specific configs สำหรับ dev/staging/prod
- Document configuration changes
- ใช้ `.env` files สำหรับ local development

### 2. Migration Best Practices

ทำตาม best practices สำหรับ migrations

- Create migrations สำหรับทุก schema changes
- ใช้ descriptive names สำหรับ migrations
- Test migrations ใน local ก่อน deploy
- ไม่ edit migrations ที่ deploy แล้ว
- ใช้ `supabase db diff` สำหรับ review changes
- Version control migration files

### 3. Local Development Workflow

ใช้งาน local development workflow ที่มีประสิทธิภาพ

- ใช้ `supabase start` สำหรับ local development
- Test migrations และ seed data ใน local
- ใช้ Studio สำหรับ database inspection
- Sync local changes ด้วย `supabase db push`
- Reset local database เมื่อจำเป็น
- Monitor local logs และ errors

### 4. Type Safety

รักษา type safety สำหรับ database operations

- Generate types อัตโนมัติด้วย `supabase gen types`
- Regenerate types เมื่อ schema เปลี่ยน
- Integrate types กับ ORM หรือ client libraries
- ใช้ types สำหรับ type-safe queries
- Version control generated types
- ใช้ strict type checking

### 5. Secret Security

รักษาความปลอดภัยของ secrets

- ไม่ commit secrets ไปยัง version control
- ใช้ `supabase secrets set` แทนการแก้ config
- ใช้ environment-specific secrets
- Rotate secrets อย่างสม่ำเสมอ
- ตรวจสอบ secret access logs
- ใช้ secret management services สำหรับ production

### 6. Branch Management

จัดการ database branches อย่างเป็นระบบ

- ใช้ branches สำหรับ feature development
- Test branches ก่อน merge ไป main
- Clean up unused branches
- Monitor branch resource usage
- ใช้ branches สำหรับ staging environments
- Document branch purposes

### 7. CI/CD Integration

ผสาน Supabase CLI เข้ากับ CI/CD pipelines

- ใช้ `SUPABASE_ACCESS_TOKEN` สำหรับ authentication
- ใช้ `supabase db push` ใน CI สำหรับ migrations
- ใช้ `supabase functions deploy` สำหรับ functions
- ตั้งค่า environment variables ใน CI/CD
- Test ก่อน deploy ด้วย `supabase db diff`
- ใช้ GitHub Actions หรือ GitLab CI สำหรับ automation

### 8. Performance Monitoring

Monitor และ optimize database performance

- ใช้ `supabase inspect db` สำหรับ performance insights
- Monitor long-running queries และ blocking
- ตรวจสอบ table bloat และ vacuum stats
- Optimize indexes ตาม inspection results
- Monitor replication slots และ lag
- ใช้ reports สำหรับ regular health checks

## Expected Outcome

- Supabase CLI ติดตั้งและตั้งค่าอย่างถูกต้อง
- Local development environment ทำงานได้
- Database migrations จัดการอย่างเป็นระบบ
- TypeScript types สร้างอัตโนมัติ
- Edge functions deploy ได้อย่างราบรื่น
- Secrets จัดการอย่างปลอดภัย
- CI/CD integration ทำงานได้อัตโนมัติ
- Database performance ถูก monitor และ optimize
