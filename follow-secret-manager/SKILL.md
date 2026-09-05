---
name: follow-secret-manager
description: จัดการ secrets และ environment variables อย่างปลอดภัยด้วย secret manager (Infisical เป็น default)
argument-hint: "[scope]"
related:
  - follow-service-infisical
  - open-web-for-config-secret
  - deploy-to-cloudflare
  - deploy-to-vercel
  - deploy-to-railway
  - follow-deploy
  - review-security
  - follow-tool-github-actions
---

## Goal

ตั้งค่าและใช้งาน secret manager สำหรับจัดการ secrets และ environment variables ในโปรเจกต์อย่างปลอดภัย โดยไม่ให้ AI หรือ codebase ต้องรู้ค่า secrets จริง

## Scope

ใช้สำหรับทุก workspace ที่ต้องการ secrets management ทั้ง local development, CI/CD และ production รองรับ secret manager หลายตัวแต่แนะนำ Infisical เป็น default

## Execute

### 1. Choose Secret Manager

> Goal: เลือก secret manager ทีเหมาะสม

1. Default: ใช้ `/follow-service-infisical` (Infisical)
2. Self-hosted: ใช้ Infisical self-hosted หรือ HashiCorp Vault
3. Cloud-native: AWS Secrets Manager, Azure Key Vault, GCP Secret Manager, Cloudflare Secrets
4. ถ้า user ไม่ระบุ → ใช้ Infisical เพราะฟรี tier ใช้งานได้ดี มี CLI/SDK ครบ และรองรับ OIDC

### 2. Install And Authenticate

> Goal: ติดตั้ง CLI และ authenticate

1. ติดตั้ง CLI ตาม secret manager ทีเลือก
2. สำหรับ Infisical:
   - `bun add -g @infisical/cli` หรือ `brew install infisical` หรือ `scoop install infisical`
   - ล็อกอิน: `infisical login`
3. สำหรับ CI/CD ใช้ machine identity / OIDC แทน personal token
4. ตรวจสอบสิทธิ์ด้วย `infisical secrets` หรือคำสั่งเทียบเท่า

### 3. Initialize Project

> Goal: เชื่อมโยง project กับ secret manager

1. รัน `infisical init` ใน project root
2. เลือก project และ default environment (dev, staging, prod)
3. ตั้งค่า `.infisical.json` ด้วย `workspaceId` และ `defaultEnvironment`
4. Monorepo: รัน `infisical init` ในแต่ละ workspace ที่ต้องการ
5. Commit `.infisical.json` ได้ (ไม่มี sensitive data)

### 4. Collect Secrets Without AI Reading Values

> Goal: ระบุ secrets ทีต้องการและชี้ user ไปกรอกเอง

1. อ่าน `.env.example` หรือ project requirements
2. ใช้ `/open-web-for-config-secret` เพื่อเปิด:
   - URLs ของ external services (Stripe, OpenAI, Cloudflare, ฯลฯ) สำหรับสร้าง API keys
   - URL ของ secret manager dashboard สำหรับ paste ค่า
3. ให้ user copy API keys จาก service dashboard แล้ว paste ลง secret manager เอง
4. AI ไม่รับค่า secrets จาก user โดยตรง ยกเว้น user ต้องการป้อนใน dashboard เอง

### 5. Store Secrets In Secret Manager

> Goal: เก็บ secrets ในตัวจัดการ secrets

1. Local/CLI: `infisical secrets set KEY=value --env=dev`
2. File-based: `infisical secrets set CERT=@/path/to/cert.pem --env=dev`
3. Dashboard: เปิดหน้า secret manager แล้วกรอกค่าเอง
4. จัดระเบียบด้วย `--path` และ `--tags`
5. ใช้ secret referencing: `${KEY}` สำหรับค่าทีอ้างอิงกัน

### 6. Use In Local Development

> Goal: inject secrets สำหรับ local dev โดยไม่ต้องมี `.env`

1. รัน `infisical run --env=dev -- <command>`
2. รัน dev: `infisical run --env=dev -- bun run dev`
3. Auto-reload: `infisical run --watch -- bun run dev`
4. หลาย commands: `infisical run --command="bun run build && bun run start"`
5. ถ้า project ใช้ npm เป็นหลัก → แทนด้วย `npm run`
6. ใช้ root scripts ใน monorepo:
   - `"secrets:dev": "infisical run --env=dev -- turbo run dev"`
   - `"secrets:build": "infisical run --env=prod -- turbo run build"`

### 7. CI/CD Without Long-Lived Tokens

> Goal: ใช้ OIDC หรือ machine identity ใน CI/CD

1. GitHub Actions: ใช้ `Infisical/secrets-action` ด้วย OIDC
2. สร้าง machine identity ใน Infisical
3. ตั้งค่า OIDC Discovery URL: `https://token.actions.githubusercontent.com`
4. ตั้งค่า Subject: `repo:<owner>/<repo>:<context>`
5. Workflow example:
   ```yaml
   permissions:
     id-token: write
     contents: read
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: Infisical/secrets-action@v1.0.9
           with:
             method: oidc
             identity-id: <identity-id>
             project-slug: <project-slug>
             env-slug: dev
   ```
6. CI/CD อื่นๆ: ใช้ `INFISICAL_TOKEN` สั้น ๆ ชั่วคราว แล้ว revoke หลังใช้

### 8. Platform Integrations

> Goal: ให้ทุก platform ดึง secrets จาก secret manager

- Cloudflare: `infisical run --env=prod -- wrangler deploy` — ไม่ต้องเก็บ `CLOUDFLARE_API_TOKEN` ใน repo
- Vercel: sync ด้วย Infisical Vercel integration หรือ inject ผ่าน CI
- Railway: ใช้ `infisical run` ก่อน `railway up`
- GitHub: sync หรือ OIDC
- Docker: ติดตั้ง Infisical CLI ใน image แล้ว `infisical run` ใน `CMD`
- Kubernetes: Infisical Operator หรือ sync ไป Kubernetes secrets

### 9. SDK For Production

> Goal: programmatic access โดยไม่ hardcode credentials

- ติดตั้ง SDK: `bun add @infisical/sdk` (ถ้า project ใช้ npm เป็นหลัก ให้ใช้ `npm install @infisical/sdk`)
- Authenticate: `client.auth().universalAuth.login({ clientId, clientSecret })`
- ดึง secret: `client.secrets().getSecret({ environment, projectId, secretName })`
- ดึงทั้งหมด: `client.secrets().listSecrets({ environment, projectId, expandSecretReferences: true })`
- อย่า hardcode `clientId`/`clientSecret` — ใช้ env var หรือ OIDC

### 10. Rotate And Audit

> Goal: ดูแล secrets ระยะยาว

- Dual-phase rotation สำหรับ zero-downtime
- Rotation schedule: Database 30-90 วัน, API keys 60-90 วัน, Cloud 90 วัน
- ใช้ dynamic secrets ถ้าเป็นไปได้
- ตรวจ audit logs ทุกเดือน
- ตั้ง alerts สำหรับ unauthorized access
- ใช้ secret scanning เพื่อตรวจ leak ใน Git

## Rules

### 1. Security First

- ห้าม hardcode secrets ใน codebase
- ห้าม commit `.env` หรือ `.env.local` ทีมีค่าจริง
- AI ไม่ควรรู้ค่า secrets ถ้าไม่จำเป็น
- สำหรับ secrets ที sensitive มาก ให้ user กรอกเองใน dashboard

### 2. Prefer OIDC

- CI/CD ใช้ OIDC แทน long-lived token เสมอ
- สร้าง machine identity แยกตาม environment
- ใช้ least privilege access

### 3. Local Development

- ใช้ `infisical run` แทน `.env` files
- `.infisical.json` commit ได้ แต่ไม่มี secrets
- ถ้าต้องมี `.env.example` ให้มีแค่ key names ไม่มี values

### 4. Onboarding Flow

- ใช้ `/open-web-for-config-secret` สำหรับชี้ user ไปยัง URLs ทีถูกต้อง
- ไม่เปิดให้ user paste ค่าให้ AI
- ให้ user paste ค่าลง secret manager dashboard โดยตรง

### 5. When Not To Use

- ถ้า project มี secrets น้อยมากและทีมเล็กมาก อาจใช้ `.env` ผ่าน USB/secure channel แล้วไม่ commit ก็ยังพอรับได้
- ถ้า secret manager ล่มแล้ว production ได้รับผลกระทบ → วางแผน fallback

- ใช้ /deploy-to-cloudflare ถ้าจำเป็น
- ใช้ /deploy-to-vercel ถ้าจำเป็น
- ใช้ /deploy-to-railway ถ้าจำเป็น
- ใช้ /follow-deploy ถ้าจำเป็น
- ใช้ /review-security ถ้าจำเป็น
- ใช้ /follow-tool-github-actions ถ้าจำเป็น

## Expected Outcome

- มี secret manager ตั้งค่าครบถ้วน
- Secrets ไม่อยู่ใน repo หรือเครื่อง developer โดยตรง
- Local dev ใช้ `infisical run` หรือเทียบเท่า
- CI/CD ใช้ OIDC หรือ machine identity
- ทุก platform ดึง secrets จาก secret manager
- AI ไม่จำเป็นต้องเห็นค่า secrets จริง
- Audit logs และ rotation ใช้งานได้
