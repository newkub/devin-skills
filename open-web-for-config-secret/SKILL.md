---
name: open-web-for-config-secret
description: อ่าน .env.example แล้วเปิด URLs สำหรับสร้าง API keys และ secret manager dashboard ให้ user กรอกเอง
related:
  - follow-secret-manager
  - follow-service-infisical
  - follow-create-product
  - follow-create-web
  - follow-deploy
  - deploy-to-cloudflare
  - follow-create-cloudflare-token
  - deploy-to-vercel
  - deploy-to-railway
---

## Goal

อ่าน `.env.example` แล้วเปิด URLs ทีจำเป็นสำหรับตั้งค่า secrets ทั้งหมด — ทั้งหน้า external services สำหรับสร้าง API keys และหน้า secret manager dashboard สำหรับ paste ค่า โดย user กรอกเองทั้งหมด

## Scope

ใช้ตอน onboarding project ใหม่ หรือตอนต้องการเชื่อม external services กับ secret manager ไม่เกี่ยวข้องกับการ deploy หรือรันแอพ

## Execute

### 1. Read Env Example

> Goal: รวบรวม keys ทีต้องตั้งค่า

1. อ่าน `.env.example` จาก project root
2. ถ้าไม่มี → สร้างจาก project manifest (`package.json`, `wrangler.jsonc`, ฯลฯ)
3. แยก environment variable names ออกมา
4. กรอง internal values ออก (localhost, `127.0.0.1`, paths)

### 2. Identify External Services

> Goal: หา service ทีแต่ละ variable มาจาก

Map variable names ไปยัง services:

| Variable prefix | Service | Key type |
|---|---|---|
| `OPENAI_*` | OpenAI | API key / Project key |
| `ANTHROPIC_*` | Anthropic | API key |
| `GOOGLE_*`, `GEMINI_*`, `GCP_*` | Google AI Studio / GCP | API key |
| `GITHUB_*` | GitHub | Personal Access Token |
| `SUPABASE_*` | Supabase | Project API keys / JWT |
| `STRIPE_*` | Stripe | Secret key, publishable key, webhook secret |
| `CLOUDFLARE_*` | Cloudflare | API token, Account ID, Zone ID |
| `VERCEL_*` | Vercel | Token, Org ID, Project ID |
| `RAILWAY_*` | Railway | Token |
| `WORKOS_*` | WorkOS | API key, client ID |
| `DATABASE_URL` | ฐานข้อมูลทีเลือก | Connection string |
| `REDIS_*` | Redis provider | URL / password |
| `LINE_*` | LINE Developers | Channel access token, secret |
| `DISCORD_*` | Discord Developer Portal | Bot token, application ID |
| `TELEGRAM_*` | @BotFather | Bot token |

### 3. Open Service Dashboard URLs

> Goal: เปิดหน้าสร้าง API keys สำหรับแต่ละ service

เปิด URL ตามลำดับทีหลีกเลี่ยงไม่ได้:

- OpenAI: `https://platform.openai.com/api-keys`
- Anthropic: `https://console.anthropic.com/settings/keys`
- Google AI: `https://aistudio.google.com/app/apikey`
- GitHub tokens: `https://github.com/settings/tokens`
- Supabase: `https://supabase.com/dashboard/project/_/settings/api`
- Stripe: `https://dashboard.stripe.com/test/apikeys`
- Stripe webhooks: `https://dashboard.stripe.com/webhooks`
- Cloudflare API tokens: `https://dash.cloudflare.com/profile/api-tokens`
- Cloudflare dashboard: `https://dash.cloudflare.com/`
- Vercel tokens: `https://vercel.com/account/tokens`
- Railway: `https://railway.com/account/tokens`
- WorkOS: `https://dashboard.workos.com/api-keys`
- LINE: `https://developers.line.biz/console/`
- Discord: `https://discord.com/developers/applications`

บอก user ทีละ URL ว่าต้องสร้าง key อะไร:

```text
เปิด `https://dashboard.stripe.com/test/apikeys` แล้ว copy `STRIPE_SECRET_KEY` ไปวางใน secret manager
```

### 4. Open Secret Manager Dashboard

> Goal: เปิดหน้า secret manager สำหรับ user วาง key

1. ตรวจ secret manager ที project ใช้ (default คือ Infisical)
2. เปิด URL:
   - Infisical Cloud: `https://app.infisical.com/`
   - Infisical EU: `https://eu.infisical.com/`
   - Self-hosted: ใช้ `INFISICAL_DOMAIN` ทีตั้งไว้
3. บอก user ไปยัง path:
   - `Project → Secrets → Add Secret`
   - หรือ `Project → <environment> → Add Secret`

### 5. Guide Manual Entry

> Goal: ให้ user กรอก secrets เองโดย AI ไม่เห็นค่า

1. สร้างรายการ key ทีต้องใส่แยก environment:
   ```text
   Environment: dev
   - STRIPE_SECRET_KEY (copy จาก Stripe dashboard)
   - OPENAI_API_KEY (copy จาก OpenAI dashboard)
   - CLOUDFLARE_API_TOKEN (copy จาก Cloudflare dashboard)
   ```
2. บอก user ให้:
   - คลิก "Add Secret" ใน secret manager
   - ใส่ `Key` = ชื่อ variable
   - ใส่ `Value` = ค่า key ที copy มา
   - เลือก `Environment` ให้ถูกต้อง
3. ย้ำว่า AI ไม่ควรเห็นค่า
4. ถ้า key หลาย environment (dev/staging/prod) ให้ add ซ้ำในแต่ละ environment

### 6. Verify In Secret Manager

> Goal: ยืนยันว่าครบถ้วน

1. ให้ user ตรวจรายการใน secret manager dashboard
2. ตรวจว่า key ทั้งหมดมี value
3. ถ้าขาด → เปิด service URL นั้นอีกครั้ง
4. ถ้าครบ → เรียก `/follow-secret-manager` เพื่อตั้งค่า `infisical run`

## Rules

### 1. AI Does Not Read Secret Values

- AI เปิด URL เท่านั้น ไม่รับค่า key จาก user
- ไม่พิมพ์ค่า key ที user copy มาใส่ secret manager
- ไม่เก็บ key ลงไฟล์ ไม่เขียน `.env.local` ให้

### 2. User Does Manual Entry

- User ต้อง copy-paste ค่าจาก service dashboard ไป secret manager เอง
- AI บอกขั้นตอนและ URLs เท่านั้น
- ถ้า user ไม่เข้าใจ ให้เปิด URL ซ้ำหรืออธิบายแต่ละหน้า

### 3. Service Mapping Accuracy

- ตรวจ variable names ก่อน map ไปยัง services
- ถ้าไม่แน่ใจ → ถาม user ว่า service นี้คืออะไร
- ไม่เดา URL ถ้าไม่มั่นใจ

### 4. Post-Action

- หลัง user กรอกเสร็จให้เรียก `/follow-secret-manager` ต่อ
- ไม่ให้ user deploy ก่อนยืนยันว่า secrets ครบ
- ไม่แนะนำให้เก็บค่าลง `.env`

## Expected Outcome

- `.env.example` ถูกอ่านและแยก keys ออกมา
- URLs ของ external services ถูกเปิดสำหรับสร้าง keys
- URL ของ secret manager dashboard ถูกเปิดสำหรับวาง keys
- User กรอก secrets เองโดย AI ไม่เห็นค่า
- รายการ keys ทีขาดหรือครบถูกต้อง
- พร้อมเรียก `/follow-secret-manager` เพื่อใช้งาน secrets
