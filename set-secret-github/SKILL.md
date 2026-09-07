---
name: set-secret-github
description: ตั้งค่า GitHub repository secrets ด้วย gh CLI อย่างปลอดภัย
argument-hint: "<owner>/<repo> <secret-name>"
related:
  - watch-github-actions
  - ship-to-production
---

## Goal

ช่วยตั้งค่า GitHub repository secrets ด้วย `gh` CLI โดยไม่ expose ค่า token ใน chat

## Scope

- รองรับ repo ที่ `gh` CLI เข้าถึงได้
- ตั้งทีละ secret หรือหลาย repo ตามที่ user ระบุ
- ตรวจสอบหลังตั้งด้วย `gh secret list`

## Execute

### 1. ตรวจสอบสิทธิ์

> Goal: ยืนยันว่า `gh` CLI authenticated และเข้าถึง repo เป้าหมายได้

```bash
gh auth status
gh secret list -R <owner>/<repo>
```

### 2. ตั้งค่า secret

> Goal: ตั้ง secret โดยให้ user รันคำสั่งเอง ไม่ expose ค่าใน chat หรือไฟล์

ให้ user รันคำสั่งเองเพื่อความปลอดภัยสูงสุด:

```bash
gh secret set <SECRET_NAME> -R <owner>/<repo>
```

ถ้า token อยู่ในตัวแปร:

```bash
printf "%s" "$SECRET_VALUE" | gh secret set <SECRET_NAME> -R <owner>/<repo>
```

### 3. ตรวจสอบผล

> Goal: ยืนยันว่า secret ถูกตั้งครบและไม่มีค่ารั่วไหล

```bash
gh secret list -R <owner>/<repo>
```

### 4. Secrets ที่จำเป็นสำหรับ project นี้

> Goal: ระบุ secrets มาตรฐานที่ CI/CD และ deploy ต้องใช้

- `CLOUDFLARE_API_TOKEN` — deploy Cloudflare Workers
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID
- `NPM_TOKEN` — publish ไป npm
- `GH_PAT` — access private repo / trigger dispatch

Secrets เหล่านี้ถูกใช้โดย workflow ที่ monitor ด้วย `/watch-github-actions` และ pipeline deploy ของ `/ship-to-production`

## Rules

- ไม่แสดงค่า secret ใน output
- ไม่บันทึก secret ลงไฟล์ ถ้าไม่จำเป็น
- ถ้า user ยังไม่มี token → หยุดแล้วแนะนำวิธีสร้าง

## Expected Outcome

- Secret ถูกตั้งใน repo ที่ระบุ
- `gh secret list` แสดงชื่อ secret ที่ตั้ง
- ไม่มี secret รั่วไหลใน log หรือ chat
