# Env Vars And Secrets Checks

## Goal

ตรวจ env vars และ secrets ครบถ้วนก่อน deploy

## Checks

### Env Var Inventory

1. ตรวจ `.env.example` มี variables ที่จำเป็นทั้งหมด
2. ตรวจ env vars ตั้งค่าใน platform: Vercel, Cloudflare, Railway
3. ตรวจ env vars แยก environment: dev, staging, production
4. ตรวช required env vars มี validation ที่ startup time

### Secrets Management

1. ตรวจไม่มี secrets ใน codebase หรือ config files
2. ตรวจ secrets ใช้ platform secrets management: `vercel env`, `wrangler secret`, `railway variables`
3. ตรวช API keys ใช้ environment variables ไม่ใช่ hardcoded
4. ตรวจ database connection strings ไม่ expose ใน client-side

### Authentication Tokens

1. ตรวจ `NPM_TOKEN` ตั้งค่าสำหรับ npm publish
2. ตรวจ `VERCEL_TOKEN` ตั้งค่าสำหรับ Vercel deploy
3. ตรวจ `RAILWAY_TOKEN` ตั้งค่าสำหรับ Railway deploy
4. ตรวช `CARGO_REGISTRY_TOKEN` ตั้งค่าสำหรับ crates publish
5. ตรวจ `VSCE_PAT` ตั้งค่าสำหรับ VSCode publish

### Config Validation

1. ตรวจ config validate ที่ startup time
2. ตรวช throw error ถ้า required env vars ไม่มี
3. ตรวจไม่ silently fall back ไปใช้ default ที่ไม่ปลอดภัย
4. ตรวจ error messages บอกว่าต้องตั้งค่าอะไร

## Severity

- Critical: secrets ใน codebase, required env vars ขาด, ไม่มี validation
- High: `.env.example` ขาด, tokens ไม่ตั้งค่า, env vars ไม่แยก environment
- Medium: validation ขาด, error messages ไม่ชัด, fallback ไม่ปลอดภัย
- Low: env vars ไม่ document, naming ไม่สม่ำเสมอ
