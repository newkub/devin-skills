---
name: follow-service-infisical
description: ใช้งาน Infisical สำหรับจัดการ secrets และ environment variables อย่างปลอดภัย
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - follow-math-cryptography
  - follow-tool-mise
  - follow-tasks
  - deploy-to-cloudflare
  - follow-service-cloudflare
  - follow-service-vercel
  - follow-tool-github-actions
  - review-security
---

## Goal

ตั้งค่าและใช้งาน Infisical สำหรับจัดการ secrets และ environment variables ในโปรเจกต์อย่างปลอดภัย

## Scope

ใช้สำหรับทุก workspace ที่ต้องการ secrets management ทั้ง local development, CI/CD และ production

## When To Use

ใช้ `/follow-service-infisical` เมื่อ:

- ต้องการแทนที่ `.env` files สำหรับ local development
- ต้องการ secrets สำหรับ CI/CD ด้วย OIDC หรือ machine identity แทน long-lived token
- ต้องการ secret rotation, dynamic secrets, หรือ audit logs สำหรับ platform ระยะยาว
- ต้องการ sync secrets ไปยัง Cloudflare, Vercel, Railway, GitHub Actions, AWS, Kubernetes
- กำลังสร้าง product/platform ที่มีหลาย environment (dev, staging, prod)

เลือก Infisical แทน `Phase.dev`, Doppler, Vault เมื่อต้องการ ecosystem integrations เยอะ, open-source core, OIDC CI/CD, และ community support

## Execute

### 1. Install And Authenticate

> Goal: ติดตั้ง Infisical CLI และ authenticate ด้วย machine identity

ติดตั้ง Infisical CLI และ authenticate ด้วย machine identity strategies

- ติดตั้ง CLI: `bun add -g @infisical/cli` หรือ `brew install infisical` หรือ `scoop install infisical` (Windows)
- Interactive login: `infisical login`
- CI/CD authentication: ใช้ machine identity กับ `infisical login --method=universal-auth --client-id=<id> --client-secret=<secret> --silent --plain`
- Machine Identity Strategies ที่รองรับ (9 strategies): `universal-auth`, `kubernetes`, `azure`, `gcp-id-token`, `gcp-iam`, `aws-iam`, `oidc`, `jwt`, `ldap`
- Self-hosted: ตั้งค่า `INFISICAL_DOMAIN` ก่อน login (เช่น `https://eu.infisical.com`)
- ตรวจสอบ authentication: `infisical secrets`
- Production: ตั้งค่า `INFISICAL_DISABLE_UPDATE_CHECK=true`

### 2. Initialize Project

> Goal: ตั้งค่า Infisical สำหรับ project และ commit configuration

ตั้งค่า Infisical สำหรับ project และ commit configuration

- รัน `infisical init` ใน project root directory
- เลือก project และ default environment จาก Infisical dashboard
- Monorepo: รัน `infisical init` ในแต่ละ workspace ที่ต้องการเชื่อมโยง
- Commit `.infisical.json` ไปยัง repository (ไม่มี sensitive data)

### 3. Configure .infisical.json

> Goal: ตั้งค่า workspace ID, default environment และ environment mapping

ตั้งค่า workspace ID, default environment, และ environment mapping

- ตั้งค่า `workspaceId` สำหรับ Infisical project ID
- ตั้งค่า `defaultEnvironment` เป็น `dev`, `staging`, หรือ `prod`
- ใช้ `gitBranchToEnvironmentMapping` สำหรับ auto-map Git branch ไปยัง environment
- ใช้ `domain` field สำหรับ self-hosted instances หรือ EU Cloud

### 4. Manage Secrets

> Goal: จัดการ secrets ผ่าน CLI และ dashboard

จัดการ secrets ผ่าน CLI และ dashboard

- ดู secrets: `infisical secrets --env=dev`
- ดึง secret เฉพาะ: `infisical secrets get <KEY> --env=dev --plain --silent`
- สร้าง secret: `infisical secrets set KEY=value --env=dev`
- สร้าง secret จากไฟล์: `infisical secrets set CERT=@/path/to/cert.pem --env=dev`
- ใช้ `--path` สำหรับจัดระเบียบ secrets ตาม folder structure
- ใช้ `--tags` สำหรับกรอง secrets ตาม tags
- ใช้ secret referencing: `${KEY}` สำหรับ local references

### 5. Inject Secrets In Local Development

> Goal: inject secrets เป็น environment variables สำหรับ local development

ใช้ `infisical run` เพื่อ inject secrets เป็น environment variables

- Inject secrets: `infisical run --env=dev -- <command>`
- ระบุ environment: `infisical run --env=dev -- npm run dev`
- Auto-reload: `infisical run --watch -- npm run dev`
- กรองตาม path: `infisical run --path="/api" -- npm run dev`
- กรองตาม tags: `infisical run --tags=tag1,tag2 -- npm run dev`
- หลาย commands: `infisical run --command="npm run build && npm run start"`
- Bun project: `infisical run -- bun run dev`

### 6. Export Secrets For CI/CD

> Goal: Export secrets หรือใช้ `infisical run` ใน CI/CD scripts

Export secrets หรือใช้ `infisical run` ใน CI/CD scripts

- GitHub Actions: ใช้ `Infisical/secrets-action` ด้วย OIDC แทน long-lived token
- CI/CD อื่นๆ: ตั้งค่า `INFISICAL_TOKEN` environment variable ใน CI/CD platform
- Export เป็น `.env`: `infisical export --format=dotenv-export > .env`
- Export เป็น JSON: `infisical export --format=json > secrets.json`
- Export เป็น YAML: `infisical export --format=yaml > secrets.yaml`
- ใช้ `infisical run` ใน CI/CD scripts แทนการ export ไฟล์
- Machine identity token (non-OIDC): `export INFISICAL_TOKEN=$(infisical login --method=universal-auth --client-id=<id> --client-secret=<secret> --silent --plain)`

### 7. Use SDK For Programmatic Access

> Goal: ใช้ `@infisical/sdk` สำหรับ programmatic access ใน production

ใช้ `@infisical/sdk` สำหรับ programmatic access ใน production

- ติดตั้ง SDK: `bun add @infisical/sdk` หรือ `npm install @infisical/sdk` หรือ `pnpm add @infisical/sdk`
- Initialize client ด้วย machine identity credentials
- Authenticate: `client.auth().universalAuth.login({ clientId, clientSecret })`
- ดึง secrets: `client.secrets().getSecret({ environment, projectId, secretName })`
- ดึง secrets ทั้งหมด: `client.secrets().listSecrets({ environment, projectId, expandSecretReferences: true })`
- ใช้ `secretPath` สำหรับกรอง secrets ตาม path
- อย่า hardcode `clientId` และ `clientSecret` — ใช้ environment variables

### 8. Configure Platform Integrations

> Goal: ตั้งค่า Infisical สำหรับ platforms ต่างๆ

ตั้งค่า Infisical สำหรับ platforms ต่างๆ

- Docker: ติดตั้ง CLI ใน Dockerfile และใช้ `infisical run` ใน `CMD`
- Kubernetes: ใช้ Infisical Operator หรือ sync ไป Kubernetes secrets
- GitHub Actions: ใช้ `Infisical/secrets-action` ด้วย OIDC authentication
  - สร้าง machine identity ใน Infisical project > Access Control > Machine Identities
  - ลบ Universal Auth default แล้วเพิ่ม auth method `OIDC Auth`
  - ตั้งค่า OIDC Discovery URL และ Issuer เป็น `https://token.actions.githubusercontent.com`
  - ตั้งค่า Subject `repo:<owner>/<repo>:<context>` เช่น `repo:octocat/example-repo:ref:refs/heads/main`
  - ตั้งค่า Audiences เป็น GitHub organization URL เช่น `https://github.com/octo-org`
  - คัดลอก Identity ID (safe สำหรับ commit ใน workflow)
  - Workflow example:
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
  - ใช้ `github/actions-oidc-debugger` ช่วย inspect token claims
  - ทางเลือก: GitHub Secret Syncs สำหรับ one-way sync Infisical → GitHub Secrets
- Vercel: ใช้ Infisical sync ไป Vercel environment variables
- Cloudflare Workers / Pages: เก็บ `CLOUDFLARE_API_TOKEN` และ `CLOUDFLARE_ACCOUNT_ID` ใน Infisical แล้ว inject ด้วย `infisical run --env=prod -- wrangler deploy` หรือใช้ `Infisical/secrets-action` ใน GitHub Actions
- Terraform: ใช้ Infisical Terraform Provider
- OIDC: ใช้สำหรับ passwordless authentication ใน CI/CD ถ้ารองรับ
- Gateway & Relay: ใช้สำหรับ secure tunneling ไปยัง internal resources
- PAM Proxies: ใช้สำหรับ audited access ไปยัง databases (MySQL, Redis, Kubernetes)
- Infisical Agent: ใช้ daemon สำหรับ automatic secret rotation และ certificate management

### 9. Rotate Secrets

> Goal: ตั้งค่า secret rotation schedule และ monitor

- ใช้ dual-phase rotation สำหรับ zero-downtime rotation
- Rotation schedule: Database passwords (30-90 วัน), API keys (60-90 วัน), Cloud access keys (90 วัน)
- ใช้ dynamic secrets แทน static credentials ถ้าเป็นไปได้
- Monitor rotation status ใน Infisical dashboard
- ทดสอบ application หลัง rotation

### 10. Monitor And Audit

> Goal: ตรวจสอบ audit logs และ secret access patterns

- ตรวจสอบ audit logs ใน Infisical dashboard อย่างสม่ำเสมอ
- Monitor secret access patterns สำหรับ anomalous behavior
- ตั้งค่า alerts สำหรับ unauthorized access
- ใช้ secret scanning เพื่อตรวจจับ leaked secrets ใน Git
- Feed audit logs ไปยัง SIEM หรือ monitoring stack

## Rules

### 1. Security

- ห้าม hardcode secrets ใน codebase หรือ commit `.env` ไฟล์
- ใช้ machine identities แทน shared credentials สำหรับ CI/CD
- แยก secrets ตาม environments (dev, staging, prod) อย่างเคร่งครัด
- ใช้ least privilege access — ให้เฉพาะ permissions ที่จำเป็น
- Rotate secrets อย่างสม่ำเสมอตาม schedule
- ใช้ OIDC สำหรับ CI/CD authentication ถ้ารองรับ

### 2. Configuration

- `.infisical.json` สามารถ commit ได้เพราะไม่มี sensitive data
- ใช้ `gitBranchToEnvironmentMapping` สำหรับ auto environment switching
- ตั้งค่า `INFISICAL_TOKEN` เป็น CI/CD secret variable เท่านั้น
- ใช้ `INFISICAL_DOMAIN` สำหรับ self-hosted instances (เช่น `https://eu.infisical.com`)
- ใช้ `INFISICAL_DISABLE_UPDATE_CHECK=true` ใน production เพื่อปิด update check
- ใช้ `INFISICAL_API_URL` สำหรับ custom API endpoint

### 3. CLI Usage

- ใช้ `infisical run` แทน `.env` files สำหรับ local development
- ใช้ `--env` flag สำหรับระบุ environment
- ใช้ `--watch` สำหรับ auto-reload เมื่อ secrets เปลี่ยน
- ใช้ `--path` สำหรับกรอง secrets ตาม folder structure
- ใช้ `--tags` สำหรับกรอง secrets ตาม tags
- ใช้ `--plain --silent` สำหรับ scripting และ piping

### 4. SDK Usage

- ใช้ `@infisical/sdk` สำหรับ programmatic access ใน production
- อย่า hardcode `clientId` และ `clientSecret` — ใช้ environment variables
- ใช้ `expandSecretReferences: true` สำหรับ expand secret references
- ใช้ caching และ automatic refresh ที่ SDK มีให้
- จัดการ errors สำหรับ network failures และ authentication issues

### 5. CI/CD Patterns

- GitHub Actions: ใช้ `Infisical/secrets-action` ด้วย OIDC — ไม่ต้องเก็บ `INFISICAL_TOKEN`
- CI/CD อื่นๆ: ใช้ `INFISICAL_TOKEN` environment variable สำหรับ authentication
- ใช้ `infisical export` สำหรับ export secrets ไปยังไฟล์
- ใช้ `infisical run` สำหรับ inject secrets โดยตรง
- แยก machine identities สำหรับแต่ละ environment
- ใช้ OIDC แทน long-lived tokens ถ้ารองรับ

### 6. Monorepo Considerations

- รัน `infisical init` ในแต่ละ workspace ที่ต้องการ
- ใช้ `--path` สำหรับกรอง secrets ตาม workspace
- ใช้ `--projectId` สำหรับระบุ project ที่ต้องการ
- ใช้ shared secrets ใน common path และ workspace-specific secrets ใน separate paths

### 7. Monorepo Scripts Integration

เพิ่ม scripts ที่ root `package.json` สำหรับ Infisical integration กับ Turborepo

- Root scripts:
  - `"secrets:dev": "infisical run --env=dev -- turbo run dev"` — dev พร้อม secrets injection
  - `"secrets:build": "infisical run --env=prod -- turbo run build"` — build พร้อม production secrets
  - `"secrets:export": "infisical export --format=dotenv-export > .env"` — export secrets เป็น .env
  - `"secrets:run": "infisical run --env=dev --"` — generic secrets runner สำหรับ command อื่นๆ
- Workspace scripts: ไม่ต้องเพิ่ม Infisical scripts ที่ workspace level — ใช้ root scripts ครอบผ่าน Turborepo
- CI/CD: สำหรับ GitHub Actions ใช้ `Infisical/secrets-action` ด้วย OIDC; สำหรับ CI/CD อื่นๆ ตั้งค่า `INFISICAL_TOKEN` แล้วใช้ `infisical run --env=prod -- turbo run ci`
- `.env.example` ต้องมี `INFISICAL_TOKEN` และ `INFISICAL_DOMAIN` สำหรับ documentation
- `turbo.json` ต้องมี `INFISICAL_TOKEN` ใน `passThroughEnv` และ `INFISICAL_DOMAIN` ใน `env`

## Expected Outcome

- Infisical ตั้งค่าเสร็จสมบูรณ์
- Secrets จัดการอย่างปลอดภัย ไม่ hardcode ใน codebase
- `.infisical.json` ตั้งค่าถูกต้องและ commit ได้
- Local development ใช้ `infisical run` แทน `.env` files
- CI/CD ใช้ machine identities สำหรับ authentication
- SDK ใช้สำหรับ programmatic access ใน production
- Secrets rotate อัตโนมัติตาม schedule
- Audit logs พร้อมใช้งาน