---
name: follow-lib-elysia-deploy-elysia
description: Deploy Elysia — bun build, production notes, platform targets
argument-hint: "[platform]"
related:
  - follow-lib-elysia
  - use-bun-native-api
  - follow-secret-manager
  - check-secrets
  - resolve-errors
---

## Goal

เตรียมและ deploy Elysia app สู่ production — `bun build`, env config และ platform targets

## Scope

ใช้เมื่อต้อง deploy Elysia API — ครอบคลุม production build, env vars, process management และ platform notes (VPS, Docker, serverless ที่รองรับ Bun)

## Execute

### 1. Prepare Production Config

> Goal: ตรวจ config ก่อน deploy

1. ตรวจ env vars ที่ app ใช้ — ทำ `/check-secrets env-vars`; secrets ผ่าน `/follow-secret-manager` ห้าม commit
2. ตรวจ `Bun.version` บน target รองรับ Elysia version ที่ใช้
3. ใช้ `process.env.PORT` สำหรับ port — อย่า hardcode
4. ตรวจ CORS, error handling (`.onError()`), และ logging พร้อม production

### 2. Build

> Goal: build app สำหรับ production

1. Bun รัน TypeScript โดยตรงได้ — `bun run src/index.ts` ใช้ได้ใน production ถ้า runtime มี Bun
2. Bundle เพื่อลด cold start/image size: `bun build src/index.ts --target bun --outfile dist/index.js` — ดู official docs สำหรับ flags ล่าสุด
3. Compile เป็น single binary (optional): `bun build --compile src/index.ts --outfile app` — standalone executable ไม่ต้องติดตั้ง Bun
4. ทดสอบ build output locally ก่อน deploy

### 3. Choose Deploy Target

> Goal: เลือก platform ที่รองรับ Bun

1. VPS/bare metal: ติดตั้ง Bun แล้วรัน `bun run` หรือ compiled binary — ใช้ process manager (systemd, pm2) สำหรับ restart
2. Docker: base image `oven/bun` — multi-stage build ลด image size
3. Platforms ที่รองรับ Bun natively — ดู official docs ที่ `https://elysiajs.com` สำหรับ deploy guides ล่าสุด
4. ถ้า platform ไม่รองรับ Bun → ใช้ compiled binary หรือ Docker

### 4. Verify Deployment

> Goal: smoke test production deployment

1. Health endpoint ตอบถูกต้อง (เพิ่ม `.get('/health', () => 'ok')` ถ้ายังไม่มี)
2. ทดสอบ routes หลักและ validation บน production URL
3. ตรวจ logs ไม่มี error; secrets ไม่ leak ใน responses
4. ถ้าพัง → ทำ `/resolve-errors` แล้ว report

## Rules

- ห้าม commit secrets/env — ใช้ `/follow-secret-manager` เสมอ
- ใช้ `process.env.PORT` — platforms กำหนด port เอง
- ใช้ `--target bun` เมื่อ build — Elysia เป็น Bun-first framework
- ทดสอบ build output locally ก่อน push deploy เสมอ
- ใช้ `/follow-lib-elysia` สำหรับ full reference

## Expected Outcome

- Production build (bundle หรือ binary) ทำงานได้
- Env vars/secrets จัดการถูกต้อง
- Deployed app ตอบ health check และ routes หลัก
- ไม่มี secrets leak ใน logs/responses
