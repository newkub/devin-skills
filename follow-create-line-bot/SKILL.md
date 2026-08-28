---
name: follow-create-line-bot
description: สร้าง LINE bot ด้วย TypeScript/Bun พร้อม webhook, commands, และ messaging API
related:
  - deploy-to-cloudflare
  - deploy-to-railway
  - follow-create-bun-cli
  - follow-create-sdk
  - follow-create-website
  - follow-lang-typescript
  - follow-service-infisical
  - run-test
  - use-bun-native-api
  - report-table
---
## Goal

สร้าง LINE bot project ด้วย TypeScript/Bun ทีรันได้จริง พร้อม webhook signature validation, message event handling, reply/push messages, rich menu, และ deploy

## Scope

ใช้สำหรับสร้าง LINE bot จาก scratch บน Bun หรือ Node.js รองรับ command bots, notifications, rich menus, และ webhook deployments บน Cloudflare/Railway/Vercel

## Execute

### 1. Gather Requirements

> Goal: รวบรวมข้อมูลก่อนสร้าง bot

1. ถาม user ถึง purpose, ชื่อ bot, ประเภท (notification, command, customer service)
2. ขอ `LINE_CHANNEL_ACCESS_TOKEN` และ `LINE_CHANNEL_SECRET` หรือแนะนำสร้างผ่าน LINE Developers Console
3. ระบุ runtime: `Bun` (default) หรือ `Node.js`
4. ระบุ deployment target: `Cloudflare Workers`, `Railway`, `Vercel`, หรือ `VPS`

### 2. Setup Project

> Goal: สร้างโครงสร้าง project

1. ทำ `/follow-clean-architecture` หรือ `/follow-layered-architecture` เพื่อสร้าง `src/`
2. สร้าง `src/index.ts`, `src/bot.ts`, `src/config.ts`, `src/handlers/`, `src/messages/`, `src/webhook.ts`
3. สร้าง `package.json`, `tsconfig.json`, `.env.example`, `.gitignore`
4. รัน `bun init` หรือ `npm init` ตาม runtime

### 3. Install Dependencies

> Goal: ติดตั้ง SDK และ web server

1. ติดตั้ง SDK: `bun add @line/bot-sdk`
2. ติดตั้ง web server: `bun add hono` (default) หรือ `express`
3. ติดตั้ง dev tools: `bun add -D @types/bun bun-types typescript`

### 4. Configure Bot And Webhook

> Goal: เชื่อมต่อ LINE Messaging API

1. สร้าง `src/config.ts` อ่าน `LINE_CHANNEL_ACCESS_TOKEN`, `LINE_CHANNEL_SECRET` จาก environment
2. สร้าง `src/bot.ts` ด้วย `Client` จาก `@line/bot-sdk`
3. สร้าง `src/webhook.ts` ด้วย `Hono` `POST /webhook` ที validate `x-line-signature` ด้วย `validateSignature`
4. สร้าง `src/index.ts` เป็น entry point

### 5. Implement Handlers

> Goal: จัดการ message events

1. สร้าง `src/handlers/message.ts` สำหรับ `message` events (text, image, sticker, location)
2. สร้าง `src/handlers/follow.ts` สำหรับ `follow` / `unfollow` events
3. สร้าง `src/handlers/postback.ts` สำหรับ `postback` events
4. ใช้ `client.replyMessage` หรือ `client.pushMessage` สำหรับส่งข้อความ

### 6. Add Features

> Goal: เพิ่ม features ตาม requirement

1. สร้าง rich menu หรือ quick replies ถ้าต้องการ
2. ใช้ `Flex Message` สำหรับ cards ทีซับซ้อน
3. ใช้ `LIFF` สำหรับ in-app web view (optional)
4. เพิ่ม middleware สำหรับ logging, error handling, rate limiting

### 7. Test Locally

> Goal: ทดสอบ bot ก่อน deploy

1. รัน `bun dev` หรือ `bun run src/index.ts`
2. ใช้ `ngrok` หรือ `cloudflared` สร้าง public URL สำหรับ webhook
3. ลงทะเบียน webhook URL ใน LINE Developers Console
4. ทดสอบส่งข้อความและตรวจสอบ logs
5. ทำ `/run-test` สำหรับ unit tests ของ handlers

### 8. Deploy

> Goal: deploy bot ไป production

1. ถ้า `Cloudflare Workers`: ใช้ `/deploy-to-cloudflare` พร้อม `Hono` adapter
2. ถ้า `Railway/Vercel/VPS`: ใช้ `/deploy-to-railway` หรือ `/deploy-to-vercel` พร้อม environment variables
3. อัปเดต webhook URL เป็น production endpoint
4. ทำ `/ship`

## Rules

- ไม่ hardcode `LINE_CHANNEL_ACCESS_TOKEN` หรือ `LINE_CHANNEL_SECRET`; ใช้ `/follow-service-infisical` สำหรับจัดการ channel secrets
- ใช้ `@line/bot-sdk` เป็น default SDK
- ใช้ `Hono` เป็น default web server บน Bun
- Validate `x-line-signature` ทุกครั้งก่อน parse events
- ไม่ commit `.env`
- ใช้ TypeScript first ตาม `/follow-lang-typescript`

## Expected Outcome

- LINE bot project รันได้ด้วย `bun dev`
- Webhook validate signature ถูกต้อง
- Message/follow/postback handlers ทำงานได้
- รองรับ reply/push messages และ rich menu
- พร้อม deploy ด้วย environment variables
