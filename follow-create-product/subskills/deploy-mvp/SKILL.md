---
name: follow-create-product-deploy-mvp
description: Deploy product MVP — เลือก platform, env, deploy และ verify live URL
argument-hint: "[platform]"
related:
  - follow-create-product
  - follow-deploy
  - deploy-to-cloudflare
  - implement-to-production
  - ask-me
---

## Goal

Deploy MVP ให้ live — platform ตาม techstack catalog, env vars ครบ, verify บน URL จริง

## Scope

- ใช้หลัง scaffold + features พร้อม — เน้น MVP deploy ไม่ใช่ full production hardening
- production gate เต็มรูปแบบ → `/implement-to-production`

## Execute

### 1. Select Platform

> Goal: platform ตรง stack และ cost

1. เลือก platform ตาม `/review-dependencies` catalog (default: Cloudflare)
2. ถ้า requirement ไม่ match default → `/ask-me` ให้ user เลือก

### 2. Configure And Deploy

> Goal: deploy สำเร็จ

1. env vars/secrets ครบ — ผ่าน `/follow-secret-manager` ไม่ commit
2. ทำ `/follow-deploy` หรือ `deploy-to-<platform>` ตาม target
3. preview/staging ก่อน production ถ้า platform รองรับ

### 3. Verify Live

> Goal: MVP ทำงานจริงบน URL สาธารณะ

1. smoke test critical path บน live URL
2. เก็บ URL + version ไว้ใน report

## Rules

- MVP deploy ไม่ข้าม secrets/verify — ข้ามได้เฉพาะ non-critical hardening
- destructive config ต้อง confirm ก่อน

## Expected Outcome

- MVP live บน URL จริง พร้อม version และผล verify
