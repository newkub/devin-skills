---
name: follow-service-cloudflare-setup-wrangler
description: ติดตั้งและ authenticate Wrangler CLI ให้พร้อมใช้งานกับ Cloudflare account
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - create-cloudflare-token
  - follow-tool-mise
  - use-wrangler
  - resolve-errors
  - learn-web
---

## Goal

ติดตั้ง Wrangler CLI และเชื่อมต่อกับ Cloudflare account ให้พร้อมสำหรับ develop และ deploy — first-time setup ที่ verify ได้และ idempotent

## Scope

ใช้สำหรับติดตั้ง `wrangler`, ตั้งค่า authentication (`wrangler login` หรือ `CLOUDFLARE_API_TOKEN`) และ verify ด้วย `wrangler whoami` — ไม่ครอบคลุม bindings (ใช้ `subskills/config-bindings`) หรือ deploy (ใช้ `subskills/deploy-worker`)

## Execute

### 1. Check Prerequisites

> Goal: ตรวจ current state ก่อนติดตั้ง (idempotent)

1. ตรวจว่ามี Wrangler แล้วหรือยังด้วย `wrangler --version`
2. ถ้ามีแล้ว → ข้ามไป Step 3 เพื่อ verify auth ทันที
3. ตรวจ package manager ของ project จาก `package.json` (`bun`, `pnpm`, `npm`)

### 2. Install Wrangler

> Goal: ติดตั้ง Wrangler ตาม ecosystem ของ project

1. ติดตั้งเป็น devDependency ด้วย `bun add -D wrangler` (หรือ package manager ที่ project ใช้)
2. ถ้าต้องการ global → ทำ `/follow-tool-mise` หรือ `mise use -g wrangler` ก่อน แล้วค่อยพิจารณา package manager ของระบบ
3. ถ้าใช้ TypeScript → ติดตั้ง `@cloudflare/workers-types` ด้วย `bun add -D @cloudflare/workers-types`
4. verify version ด้วย `wrangler --version`

### 3. Authenticate

> Goal: เชื่อมต่อ Wrangler กับ Cloudflare account

1. Interactive: รัน `wrangler login` — เปิด browser ให้ user authorize
2. CI/headless: ใช้ `CLOUDFLARE_API_TOKEN` environment variable — สร้าง token ตาม `/create-cloudflare-token` แล้วเก็บผ่าน `/follow-secret-manager`
3. ห้าม commit token หรือใส่ใน config files

### 4. Verify

> Goal: ยืนยัน auth ทำงานและ account ถูกต้อง

1. รัน `wrangler whoami` — ต้องแสดง account name และ account ID
2. ถ้ามีหลาย accounts → เลือก account ที่ถูกต้องให้ user confirm
3. ถ้า verify fail → ทำ `/resolve-errors` max 3 รอบ (re-login, ตรวจ token scope) แล้ว stop report
4. สำเร็จ → report account ที่ใช้แล้ว `/suggest-next-action`

## Rules

### 1. Idempotent Setup

- ตรวจ version และ auth state ก่อนเสมอ — ถ้า setup ไปแล้ว verify เท่านั้น
- ติดตั้งตาม package manager ของ project ห้ามผสม

### 2. Credential Safety

- ใช้ `/follow-secret-manager` จัดการ `CLOUDFLARE_API_TOKEN` — ห้าม hardcode หรือ commit
- CI ใช้ API token แทน `wrangler login` เสมอ

### 3. Docs First

- ถ้าไม่แน่ใจ command/flag → ดู official docs ผ่าน `/learn-web` หรือ `/use-wrangler` แทนการเดา

## Expected Outcome

- `wrangler --version` แสดง version ที่ติดตั้ง
- `wrangler whoami` ยืนยัน account ถูกต้อง
- credentials เก็บอย่างปลอดภัย พร้อมใช้ทั้ง local และ CI
