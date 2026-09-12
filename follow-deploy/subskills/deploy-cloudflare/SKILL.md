---
name: follow-deploy-deploy-cloudflare
description: Deploy ไป Cloudflare โดย delegate ไปยัง /deploy-to-cloudflare skill
argument-hint: "[target]"
related:
  - deploy-to-cloudflare
  - follow-service-cloudflare
  - follow-secret-manager
  - ask-me
  - resolve-errors
---

## Goal

Map generic deploy flow ของ `/follow-deploy` ไปยัง Cloudflare โดย delegate งาน platform-specific ทั้งหมดไปยัง `/deploy-to-cloudflare`

## Scope

- ใช้เมื่อ parent `/follow-deploy` เลือก Cloudflare เป็น target platform
- subskill นี้เป็น dispatch layer เท่านั้น — workflow จริงอยู่ที่ `/deploy-to-cloudflare` และ `/follow-service-cloudflare`
- เหมาะกับ edge computing, serverless Workers, Pages sites และ framework ที่ deploy ไป Cloudflare

## Execute

### 1. Confirm Target

> Goal: ยืนยันว่า target คือ Cloudflare และ project พร้อม

1. ตรวจ project type — Workers/Pages (`wrangler.toml`/`wrangler.jsonc`) หรือ framework ที่ deploy ไป Cloudflare
2. ถ้าไม่ชัดว่า Workers หรือ Pages → `/ask-me`
3. ตรวจ prerequisites: env vars/secrets ครบผ่าน `/follow-secret-manager`

### 2. Map Generic Requirements

> Goal: map concepts ของ parent flow ไปยัง Cloudflare equivalents

1. env vars/secrets → `wrangler secret put` หรือ `vars` ใน `wrangler.toml`/`wrangler.jsonc`
2. staging environment → `wrangler deploy --env staging`
3. deployment URL → `*.workers.dev` หรือ custom domain ที่ bind
4. version id → output ของ `wrangler deploy` / `wrangler deployments list`

### 3. Delegate To Platform Skill

> Goal: ใช้ skill เฉพาะ platform แทน generic flow

1. ทำตาม `/deploy-to-cloudflare` ทั้ง flow — build, deploy, post-deploy verify
2. ถ้าต้อง setup/auth wrangler ก่อน → ทำตาม `follow-service-cloudflare/subskills/setup-wrangler/SKILL.md`
3. ถ้าต้องแก้ bindings/environments → ทำตาม `follow-service-cloudflare/subskills/config-bindings/SKILL.md`
4. ถ้า deploy worker เฉพาะ → ทำตาม `follow-service-cloudflare/subskills/deploy-worker/SKILL.md`

### 4. Report

> Goal: รายงานผล deploy ตาม generic contract ของ parent

1. report deployment URL, version/revision id และผล post-deploy verify
2. ถ้า fail → `/resolve-errors` max 3 รอบแล้ว stop report

## Rules

### 1. Delegate Only

- ห้าม duplicate platform logic ใน subskill นี้ — delegate ไป `/deploy-to-cloudflare` เสมอ
- ถ้า `/deploy-to-cloudflare` ไม่ครอบคลุม case → ใช้ `/follow-service-cloudflare` subskill ที่ตรง

### 2. Safety

- staging/preview ก่อน production ตาม rules ของ parent
- secrets ผ่าน `/follow-secret-manager` เท่านั้น — ห้าม hardcode

## Expected Outcome

- deploy ผ่าน `/deploy-to-cloudflare` สำเร็จพร้อม URL + version
- ผลรายงานกลับ parent flow ของ `/follow-deploy`
