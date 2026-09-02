---
name: follow-create-cloudflare-token
description: สร้าง Cloudflare API token URL ที่ pre-fill permissions แล้วเปิด dashboard
related:
  - follow-service-cloudflare
  - open-web-for-config-secret
  - follow-secret-manager
  - follow-my-tech-stack
  - review-techstack
  - resolve-cicd
---

## Goal

สร้าง Cloudflare API token URL ที่ pre-fill permissions สำหรับงานทีต้องการ เช่น Workers deploy, D1 migrations, หรือ Pages deploy แล้วให้ user เปิด dashboard สร้าง token เองโดย AI ไม่เห็นค่า

## Scope

ใช้เมื่อ project ต้องการ `CLOUDFLARE_API_TOKEN` สำหรับ:
- `wrangler deploy` หรือ GitHub Actions deploy ไป Cloudflare Workers
- `wrangler d1 migrations apply` สำหรับ D1
- `wrangler pages deploy` หรือ `wrangler kv/r2/queues` commands
- ตั้งค่า secret manager เช่น Infisical, GitHub Actions secrets, หรือ `.env` (gitignored)

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Identify Required Permissions

> Goal: ระบุ permission keys ตาม use case

ถาม user หรือสรุปจาก context ว่าต้องใช้ products อะไร แล้วเลือก permissions ตามตาราง:

| Use case | Permission key | Type |
|---|---|---|
| Workers deploy / update script | `workers_scripts` | `edit` |
| D1 migrations / queries | `d1` | `edit` |
| Workers Tail logs | `workers_tail` | `read` |
| Workers KV | `workers_kv_storage` | `edit` |
| Workers R2 | `workers_r2_storage` | `edit` |
| Cloudflare Pages | `page` | `edit` |
| Workers Routes (custom domain) | `workers_routes` | `edit` |
| Read account info | `account_settings` | `read` |
| Read user info | `user_details` | `read` |
| Read user memberships | `memberships` | `read` |

สำหรับทั่วไป (Workers + D1 + deploy):
- `account_settings` `read`
- `d1` `edit`
- `workers_scripts` `edit`
- `workers_routes` `edit`
- `user_details` `read`
- `memberships` `read`

### 3. Determine Token Name

> Goal: ตั้งชื่อ token ทีบอกทั้ง project และ purpose

1. ใช้ชื่อ project จาก `package.json`, `wrangler.toml`, หรือ repo name
2. ต่อท้ายด้วย `-github-actions`, `-ci`, `-local-dev`, หรือ `-deploy`
3. ตัวอย่าง: `tiermaker-github-actions`

### 4. Generate Template URL

> Goal: สร้าง URL ที่ pre-fill permissions ใน Cloudflare dashboard

1. สร้าง JSON permissions array:
   ```json
   [
     { "key": "account_settings", "type": "read" },
     { "key": "d1", "type": "edit" },
     { "key": "workers_scripts", "type": "edit" },
     { "key": "workers_routes", "type": "edit" },
     { "key": "user_details", "type": "read" },
     { "key": "memberships", "type": "read" }
   ]
   ```
2. URL-encode JSON ด้วย `encodeURIComponent` หรือเครื่องมือเทียบเท่า
3. ประกอบ URL:
   ```
   https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=<ENCODED_JSON>&accountId=*&zoneId=all&name=<TOKEN_NAME>
   ```
4. สามารถใช้ Bun สร้าง URL ได้:
   ```bash
   bun -e "
   const perms = [
     { key: 'account_settings', type: 'read' },
     { key: 'd1', type: 'edit' },
     { key: 'workers_scripts', type: 'edit' },
     { key: 'workers_routes', type: 'edit' },
     { key: 'user_details', type: 'read' },
     { key: 'memberships', type: 'read' }
   ];
   const name = 'tiermaker-github-actions';
   console.log('https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=' + encodeURIComponent(JSON.stringify(perms)) + '&accountId=*&zoneId=all&name=' + encodeURIComponent(name));
   "
   ```

### 5. Open Dashboard

> Goal: พา user ไปยังหน้าสร้าง token

1. แสดง URL ให้ user โดยตรง
2. ถ้าอยู่บน Windows ให้ลองเปิด browser ด้วย:
   ```powershell
   Start-Process '<URL>'
   ```
3. ถ้าไม่สามารถเปิดอัตโนมัติได้ ให้ user copy URL แล้ววางใน browser

### 6. Guide Token Creation

> Goal: ให้ user สร้าง token ถูกต้องและปลอดภัย

1. บอก user ว่าหน้า dashboard จะ pre-fill permissions ไว้แล้ว
2. ให้ตรวจ Account resources: `Include all accounts` หรือเลือก account ทีต้องการ
3. ให้ตรวจ Zone resources: `All zones` (ถ้ามี Workers Routes)
4. กด Continue to summary → Create Token
5. บอก user ให้ copy token secret ทันที เพราะ dashboard แสดงครั้งเดียว

### 7. Store Token In Secret Manager

> Goal: ไม่ให้ token หลุดไปยัง source code

1. ถ้าใช้ GitHub Actions: ให้ใช้ `gh secret set CLOUDFLARE_API_TOKEN --repo <owner>/<repo>`
2. ถ้าใช้ Infisical: เปิด dashboard แล้ว paste ลง secret manager
3. ถ้าใช้ `.env` (gitignored): บอก user ไปวางเองใน `.env`
4. AI ไม่รับค่า token จาก user และไม่พิมพ์ค่า token ลงไฟล์

## Rules

### 1. AI Does Not Touch Token Secret

- AI สร้างเฉพาะ URL และให้คำแนะนำ
- AI ไม่รับค่า token ที่ user copy มา
- AI ไม่เขียน token ลง `.env`, source code, หรือ secret manager แทน user

### 2. Use Permission Group Keys, Not Display Names

- ใช้ key เช่น `workers_scripts`, `d1`, `workers_kv_storage` ไม่ใช่ชื่อ display จาก dashboard
- ถ้าไม่แน่ใจ key ให้ตรวจกับ `cfdata.lol/tools/api-token-url-generator/` หรือ Cloudflare API docs

### 3. Scope To Required Products Only

- เลือก permissions ตาม use case จริง ไม่ใส่ทุก permission
- ถ้าไม่มี custom domain สำหรับ Workers Routes ก็สามารถละ `workers_routes` ได้ แต่ไม่ต้องละเสมอ
- Account resources ควรเลือก `Include all accounts` เฉพาะเมื่อ CI ต้องการ access หลาย account

### 4. Token Naming

- ตั้งชื่อ token ให้สื่อ project และ purpose เพื่อง่ายต่อการ audit
- ห้ามใช้ชื่อทั่วไป เช่น `token1`, `mytoken`

- ใช้ /follow-service-cloudflare ถ้าจำเป็น
- ใช้ /open-web-for-config-secret ถ้าจำเป็น
- ใช้ /follow-secret-manager ถ้าจำเป็น
- ใช้ /resolve-cicd ถ้าจำเป็น

## Expected Outcome

- User ได้ URL ที่ pre-fill permissions ถูกต้อง
- User สร้าง Cloudflare API token ผ่าน dashboard เอง
- Token ถูกเก็บใน secret manager หรือ GitHub Actions secrets อย่างปลอดภัย
- AI ไม่เคยเห็นหรือบันทึก token secret
