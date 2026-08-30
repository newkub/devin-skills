---
name: create-cloudflare-tokens
description: สร้าง Cloudflare API token URL ตามชื่อ project <repo-name>-wrikka-com พร้อม pre-fill permissions
argument-hint: "[project-name]"
related:
  - create-cloudflare-project
  - create-cloudflare-token
  - create-cloudflare-worker
  - follow-secret-manager
  - open-web
---

## Goal

สร้าง Cloudflare API token URL สำหรับ project โดยตั้นชื่อ token ตาม `<repo-name>-wrikka-com` พร้อม pre-fill permissions ทีจำเป็น

## Scope

- ตรวจชื่อ project จาก `wrangler.toml`, `package.json` หรือ `git remote`
- ถ้าไม่ระบุ ใช้ชื่อ `<repo-name>-wrikka-com`
- สร้าง URL สำหรับ token ด้วย permissions สำหรับ Workers deploy
- เปิด dashboard ให้ user สร้าง token เอง

## Execute

### 1. Detect Project Name

> Goal: หาชื่อ project สำหรับตั้นชื่อ token

1. ตรวจ `wrangler.toml` ฟิลด์ `name`
2. ถ้าไม่เจอ ตรวจ `package.json` ฟิลด์ `name`
3. ถ้าไม่เจอ รัน `git remote -v` เพื่อหา repo name
4. ตั้นชื่อ token เป็น `<project-name>` หรือ `<repo-name>-wrikka-com`

### 2. Determine Permissions

> Goal: เลือก permissions ตาม use case

สำหรับ Workers deploy ทั่วไป:

| Permission | Type |
|------------|------|
| `account_settings` | `read` |
| `workers_scripts` | `edit` |
| `workers_kv_storage` | `edit` |
| `workers_routes` | `edit` |
| `user_details` | `read` |
| `memberships` | `read` |

ถ้าใช้ D1 เพิ่ม:
- `d1` `edit`

ถ้าใช้ R2 เพิ่ม:
- `workers_r2_storage` `edit`

### 3. Generate Token URL

> Goal: สร้าง URL ที pre-fill permissions

ใช้ Bun สร้าง URL:

```bash
bun -e "
const perms = [
  { key: 'account_settings', type: 'read' },
  { key: 'workers_scripts', type: 'edit' },
  { key: 'workers_kv_storage', type: 'edit' },
  { key: 'workers_routes', type: 'edit' },
  { key: 'user_details', type: 'read' },
  { key: 'memberships', type: 'read' }
];
const name = '<repo-name>-wrikka-com';
const url = 'https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=' + encodeURIComponent(JSON.stringify(perms)) + '&accountId=*&zoneId=all&name=' + encodeURIComponent(name);
console.log(url);
"
```

### 4. Open Dashboard

> Goal: พา user ไปสร้าง token

1. แสดง URL ให้ user
2. ใช้ `/open-web` เปิด Cloudflare dashboard
3. บอก user กด **Continue to summary** → **Create Token**
4. ให้ user copy token ทันที

### 5. Open GitHub Actions Secrets Page

> Goal: พา user ไปหน้า secrets เพื่อวาง token

1. รับชื่อ GitHub repo จาก `git remote -v` หรือ user input (เช่น `newkub/ratatui-ui`)
2. สร้าง URL: `https://github.com/<owner>/<repo>/settings/secrets/actions`
3. ใช้ `/open-web` เปิดหน้า GitHub Actions secrets
4. บอก user ให้สร้าง/อัปเดต secret ชื่อ `CLOUDFLARE_API_TOKEN`

### 6. Store Token

> Goal: เก็บ token อย่างปลอดภัย

1. ใช้ `/follow-secret-manager` หรือ `gh secret set CLOUDFLARE_API_TOKEN --repo <owner>/<repo>`
2. ใส่ `CLOUDFLARE_ACCOUNT_ID` ด้วย
3. AI ไม่รับค่า token จาก user

### 7. Report

> Goal: สรุปผล

รายงาน:
- Token name
- Permissions ทีเลือก
- URL สำหรับสร้าง token
- ขั้นตอนถัดไป

## Rules

- ชื่อ token ต้องสอดคล้องกับ project name ตาม `<repo-name>-wrikka-com`
- ใช้ permission group keys ไม่ใช่ display names
- AI ไม่รับค่า token ในแชท
- ไม่เขียน token ลง source code
- เปิด dashboard ให้ user สร้างเอง

- ใช้ /create-cloudflare-project ถ้าจำเป็น
- ใช้ /create-cloudflare-token ถ้าจำเป็น
- ใช้ /create-cloudflare-worker ถ้าจำเป็น

## Expected Outcome

- Token URL สำหรับสร้าง Cloudflare API token พร้อม permissions
- User สร้าง token ได้จาก dashboard
- User เปิดหน้า GitHub Actions secrets ได้เพื่อวาง token
- Token ถูกเก็บใน secret manager หรือ GitHub secrets
