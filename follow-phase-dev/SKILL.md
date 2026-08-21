---
name: follow-phase-dev
description: ตั้งค่าและใช้งาน Phase.dev สำหรับจัดการ secrets และ environment variables อย่างปลอดภัย
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

ตั้งค่าและใช้งาน Phase.dev สำหรับจัดการ secrets และ environment variables ในโปรเจกต์อย่างปลอดภัย

## Scope

Use `follow-phase-dev` for the specific tasks and workflows it covers

## Execute

### 1. Prepare
> Goal: Prepare

1. ศึกษา Phase.dev documentation จาก DeepWiki (phasehq/console), Official Docs (docs.phase.dev), และ Web Search
2. อ่าน workflows ที่คล้ายกันเพื่อดู patterns และ conventions

### 2. Account Setup
> Goal: Account Setup

1. เข้าไปที่ https://phase.dev/
2. Login หรือสมัครสมาชิก (รองรับ Google, GitHub, GitLab OAuth)
3. สร้าง Organization ใหม่
4. สร้าง App ภายใน Organization

### 3. Authentication
> Goal: Authentication

1. Authenticate กับ Phase Cloud: `phase auth` (default mode: webauth)
2. สำหรับ self-hosted: `phase auth --mode token`
3. สำหรับ AWS IAM: `phase auth --mode aws-iam --service-account-id <id>`
4. สำหรับ Azure AD: `phase auth --mode azure --service-account-id <id>`
5. ตั้งค่า environment variables:
   - Phase Cloud: `PHASE_HOST=https://console.phase.dev`, `PHASE_TOKEN=<token>`
   - Self-hosted: `PHASE_HOST=http://localhost`, `PHASE_TOKEN=<token>`

### 4. Project Initialization
> Goal: Project Initialization

1. Navigate ไปยัง project directory
2. Run `phase init` เพื่อเชื่อมโยง project กับ Phase
3. เลือก organization และ app (หรือใช้ flags: `--app-id`, `--env`)
4. สำหรับ monorepo: `phase init --monorepo`
5. Import existing secrets (optional): `phase secrets import .env`

### 5. Secret Management
> Goal: Secret Management

1. สร้าง secrets: `phase secrets create KEY "value" --env production`
2. ดึง secrets: `phase secrets get KEY --env production`
3. อัพเดท secrets: `phase secrets update KEY "new-value" --env production`
4. ลบ secrets: `phase secrets delete KEY --env production`
5. แสดง secrets ทั้งหมด: `phase secrets list --env production`
6. Import จาก `.env`: `phase secrets import .env --env production`
7. Export secrets: `phase secrets export --env production`
8. สร้าง secrets ผ่าน Console: เลือก App → Environment → Create Secret
9. ใช้ secret referencing เพื่อหลีกเลี่ยงการซ้ำซ้อน:
   - Local references: `${KEY}`
   - Cross-environment references: `${env.KEY}`
   - Cross-application references: `${app::env.KEY}`
10. เพิ่ม tags และ comments เพื่อจัดระเบียบ
11. จัดระเบียบ secrets ด้วย folders สำหรับจำนวน secrets ที่มาก

### 6. Encryption and Security
> Goal: Encryption and Security

1. Phase ใช้ end-to-end encryption (E2EE) ด้วย `libsodium` asymmetric encryption
2. Secrets encrypt ด้วย environment-specific `public/private keys`
3. Frontend encrypt key, value, comment ก่อนส่งไป backend
4. Backend ใช้ server-side key retrieval ด้วย `master keypair`
5. Validate secret references ก่อน save เพื่อป้องกัน broken references

### 7. Bulk Operations
> Goal: Bulk Operations

1. ใช้ bulk operations สำหรับ create, update, delete secrets ใน transaction เดียว
2. Track `unsaved changes` ใน UI component
3. ใช้ `BulkProcessSecrets` mutation สำหรับ operations หลายตัวพร้อมกัน

### 8. Sync Configuration
> Goal: Sync Configuration

1. ตั้งค่า sync ไปยัง external services (`AWS Secrets Manager`, `GitHub Actions`, `Vercel`, `Railway`)
2. สร้าง sync configuration: `phase sync create aws-secrets-manager --env production --region us-east-1`
3. ตั้งค่า automatic sync ใน `.phase/config.yaml`
4. Trigger sync manually: `phase sync trigger --env production`

### 9. Platform Integration
> Goal: Platform Integration

1. Docker: ใช้ Phase SDK หรือ CLI injection
2. Kubernetes: ใช้ Phase Agent หรือ sync ไป Kubernetes secrets
3. GitHub Actions: ใช้ Phase GitHub Actions integration
4. GitHub Dependabot: ใช้ Phase integration สำหรับ secrets
5. AWS Elastic Container Service: ใช้ Phase sync ไป AWS
6. Hashicorp Nomad: ใช้ Phase integration
7. Cloudflare Pages: ใช้ Phase integration

### 10. Dynamic Secrets
> Goal: Dynamic Secrets

1. List dynamic secrets: `phase dynamic-secrets list`
2. Manage leases: `phase dynamic-secrets lease`
3. Generate leases สำหรับ dynamic secrets ด้วย `phase run --generate-leases`
4. Set lease TTL ด้วย `phase run --lease-ttl <seconds>`

### 11. Application Integration
> Goal: Application Integration

1. Inject secrets ด้วย CLI: `phase run --env production -- npm run dev`
2. ใช้ flags สำหรับ `phase run`:
   - `--app` หรือ `--app-id`: ระบุ application
   - `--env`: ระบุ environment
   - `--path`: กรอง secrets ตาม path (default: "/")
   - `--tags`: กรอง secrets ตาม tags
   - `--generate-leases`: Generate leases สำหรับ dynamic secrets (default: "true")
   - `--lease-ttl`: Set lease TTL ใน seconds
3. ใช้ Phase SDK สำหรับ programmatic access (`Node.js`, `Python`)
4. ตั้งค่า environment variables ใน application config
5. Test secrets injection ใน staging environment ก่อน production

### 12. Monitoring and Audit
> Goal: Monitoring and Audit

1. ตรวจสอบ audit logs อย่างสม่ำเสมอ (`CREATE`, `UPDATE`, `READ`, `DELETE` events)
2. Monitor sync status เพื่อให้แน่ใจว่า secrets sync สำเร็จ
3. ตั้งค่า alerts สำหรับ failed syncs หรือ unauthorized access
4. Audit logs รวม `timestamps`, `IP addresses`, `user agents`, `secret version`
5. Read logs trigger เมื่อ user reveal secret ใน UI

## Rules

### 1. Frontmatter Standards

- title: Title Case สื่อความหมายชัดเจน
- description: อธิบายงานและ scope กระชับไม่เกิน 100 ตัวอักษร
- auto_execution_mode: 3
related_workflows: เท่านั้น

### 2. Structure & Format

- โครงสร้างต้องเป็น: ## Goal, ## Execute, ## Rules,

## Expected Outcome

- Phase.dev ตั้งค่าเสร็จสมบูรณ์
- Secrets จัดเรียงตาม environments อย่างถูกต้อง
- Secret references ใช้งานได้อย่างถูกต้อง (local, cross-env, cross-app)
- Automatic sync ตั้งค่าเสร็จสมบูรณ์
- Application ใช้งาน secrets จาก Phase ได้อย่างปลอดภัย
- Monitoring และ audit logs พร้อมใช้งาน
- Platform integrations ตั้งค่าเสร็จสมบูรณ์
