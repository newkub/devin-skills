---
name: create-cloudflare-token
description: สร้าง Cloudflare API token สำหรับ use case ทีระบุ ทังแบบ dashboard URL และ API (เมื่อมี seed token)
argument-hint: "<use-case>"
related:
  - follow-create-cloudflare-token
  - follow-secret-manager
  - deploy-to-cloudflare
  - follow-service-cloudflare
  - open-web-for-config-secret
---

## Goal

สร้าง Cloudflare API token ทีมี permissions ถูกต้องตาม use case ของ project โดย AI ไม่ต้องเห็นหรือเก็บ token secret

## Scope

- ระบุ use case เช่น `workers`, `d1`, `pages`, `r2`, `kv`, `access`, `zero-trust`
- สร้าง dashboard URL ที pre-fill permissions สำหรับ user สร้างเอง
- ถ้ามี seed `CLOUDFLARE_API_TOKEN` ทีมีสิทธิ์ `API Tokens: Edit` สามารถสร้าง token ใหม่ผ่าน API ได้
- แนะนำวิธีเก็บ token อย่างปลอดภัย (`wrangler secret`, GitHub Actions secrets, Infisical, `.env` gitignored)

## Execute

### 1. Identify Use Case And Permissions

> Goal: ระบุ Use Case And Permissions
เลือก permissions ตาม use case:

| Use case | Permission keys |
|---|---|
| Workers deploy | `workers_scripts` `edit`, `workers_routes` `edit`, `account_settings` `read`, `user_details` `read`, `memberships` `read` |
| D1 | `d1` `edit` (รวม Workers deploy permissions) |
| Pages | `page` `edit`, `account_settings` `read` |
| R2 | `workers_r2_storage` `edit` |
| KV | `workers_kv_storage` `edit` |
| Queues | `workers_queues` `edit` |
| Tail | `workers_tail` `read` |
| Cloudflare Access / Zero Trust | `access_orgs` `edit`, `access_apps` `edit`, `access_policies` `edit` (หรือ `access_apps_and_policies` `write`) |
| Account info | `account_settings` `read`, `user_details` `read`, `memberships` `read` |

สำหรับ Cloudflare Access โดยเฉพาะ ต้องใช้ permission groups:
- `Access: Apps and Policies Write` → key `access`, type `edit`
- `Access: Organizations, Identity Providers, and Groups Write` → key `access_acct`, type `edit` (เพื่อ enable Zero Trust org)

ตรวจสอบ permission key ล่าสุดได้ที:
- `https://cfdata.lol/tools/api-token-url-generator/`
- `GET /client/v4/user/tokens/permission_groups` (ต้องมี token ก่อน)

Common permission keys:
- Workers: `workers_scripts` `edit`, `workers_routes` `edit`, `workers_kv_storage` `edit`, `workers_r2` `edit`, `d1` `edit`
- Access/Zero Trust: `access` `edit`, `access_acct` `edit`
- Account: `account_settings` `read`, `user_details` `read`, `memberships` `read`
- Token management: `account_api_tokens` `edit` (สำหรับสร้าง token ผ่าน API)

### 2. Generate Dashboard URL

> Goal: สร้าง Dashboard URL
1. สร้าง JSON permissions array:
   ```json
   [
     { "key": "workers_scripts", "type": "edit" },
     { "key": "workers_routes", "type": "edit" },
     { "key": "d1", "type": "edit" },
     { "key": "account_settings", "type": "read" },
     { "key": "user_details", "type": "read" },
     { "key": "memberships", "type": "read" }
   ]
   ```
2. URL-encode JSON ด้วย `encodeURIComponent`
3. ประกอบ URL:
   ```
   https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=<ENCODED_JSON>&accountId=*&zoneId=all&name=<TOKEN_NAME>
   ```
4. เปิด URL ใน browser หรือส่งให้ user

ตัวอย่าง Bun script:
```bash
bun -e "
const perms = [
  { key: 'workers_scripts', type: 'edit' },
  { key: 'workers_routes', type: 'edit' },
  { key: 'd1', type: 'edit' },
  { key: 'account_settings', type: 'read' },
  { key: 'user_details', type: 'read' },
  { key: 'memberships', type: 'read' }
];
const name = 'projects-wrikka-com-deploy';
console.log('https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=' + encodeURIComponent(JSON.stringify(perms)) + '&accountId=*&zoneId=all&name=' + encodeURIComponent(name));
"
```

### 3. Create Token Via API (If Seed Token Available)

> Goal: สร้าง Token Via API If Seed Token Available
ถ้ามี `CLOUDFLARE_API_TOKEN` seed ทีมีสิทธิ์ `User > API Tokens > Edit` หรือ `Account > API Tokens > Edit`:

1. หา permission group IDs ด้วย `GET /client/v4/user/tokens/permission_groups`
2. สร้าง token ด้วย `POST /client/v4/user/tokens`:
   ```json
   {
     "name": "projects-wrikka-com-access",
     "policies": [
       {
         "effect": "allow",
         "resources": {
           "com.cloudflare.api.account.<ACCOUNT_ID>": "*"
         },
         "permission_groups": [
           { "id": "<GROUP_ID>" }
         ]
       }
     ]
   }
   ```
3. รับ `value` จาก response (แสดงครั้้งเดียว) แล้วให้ user เก็บเอง

หมายเหตุ: ไม่สามารถสร้าง API token ผ่าน CLI โดยไม่มี seed token ก่อน ถ้าไม่มี seed token ให้ใช้ dashboard URL ในขั้นตอน 2

### 4. Store Token Securely

> Goal: Store Token Securely
- `wrangler secret put CLOUDFLARE_API_TOKEN`
- `gh secret set CLOUDFLARE_API_TOKEN --repo <owner>/<repo>` สำหรับ GitHub Actions
- `.env` ที่ gitignored สำหรับ local dev
- Infisical / 1Password สำหรับ team

AI ไม่ควรเขียนค่า token ลงไฟล์ ยกเว้น user เป็นคนวางเอง

### 5. Verify Token

> Goal: ตรวจสอบ Token
ใช้ `GET /client/v4/user/tokens/verify` เพื่อตรวจสอบสิทธิ์ token:
```bash
curl -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  https://api.cloudflare.com/client/v4/user/tokens/verify
```

## Rules

1. AI ไม่รับค่า token secret จาก user และไม่เขียนลงไฟล์
2. แนะนำให้ user ตั้งชื่อ token ทีบอก project และ use case
3. Scope permissions ให้เล็กทีสุด ไม่ใส่ทุก permission
4. Account resource ควรระบุ account ID เฉพาะ ไม่ใช้ `*` ถ้าไม่จำเป็น
5. สำหรับ Cloudflare Access ตรวจให้ account เปิด Zero Trust แล้วหรือ token มีสิทธิ์ enable ได้

- ใช้ /follow-create-cloudflare-token ถ้าจำเป็น
- ใช้ /follow-secret-manager ถ้าจำเป็น
- ใช้ /deploy-to-cloudflare ถ้าจำเป็น
- ใช้ /follow-service-cloudflare ถ้าจำเป็น
- ใช้ /open-web-for-config-secret ถ้าจำเป็น

## Expected Outcome

- ได้ dashboard URL หรือ API command สำหรับสร้าง token
- User สร้าง token และเก็บใน secret manager เอง
- Token มี permissions ตรงกับ use case (Workers, D1, Pages, R2, KV, Access, Zero Trust)
- Project สามารถใช้ token สำหรับ deploy หรือจัดการ Cloudflare resources ต่อไป
