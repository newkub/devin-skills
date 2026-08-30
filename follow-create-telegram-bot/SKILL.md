---
name: follow-create-telegram-bot
description: สร้าง Telegram bot ด้วย TypeScript/Bun พร้อม commands, middleware, error handling, และ webhook
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - deploy-to-cloudflare
  - deploy-to-railway
  - follow-create-bun-cli
  - follow-create-cli
  - follow-create-sdk
  - follow-create-web
  - follow-lang-typescript
  - run-test
  - search-npm-libraries
  - use-bun-native-api
  - follow-my-tech-stack
  - review-techstack
  - report-table
---
## Goal

สร้าง Telegram bot project ด้วย TypeScript/Bun ทีรันได้จริง พร้อม command handling, middleware, sessions, error handling และ webhook/long-polling

## Scope

ใช้สำหรับสร้าง Telegram bot จาก scratch บน Bun หรือ Node.js รองรับ command bots, conversational flows, notifications, และ webhook deployments

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Gather Requirements

> Goal: รวบรวมข้อมูลก่อนสร้าง bot

1. ถาม user ถึง purpose, ชื่อ bot, ประเภท (notification, command, conversational)
2. ขอ `BOT_TOKEN` หรือแนะนำสร้างผ่าน @BotFather
3. ระบุ runtime: `Bun` (default) หรือ `Node.js`
4. ระบุ deployment mode: `long-polling` สำหรับ dev หรือ `webhook` สำหรับ production

### 3. Setup Project

> Goal: สร้างโครงสร้าง project

1. ทำ `/follow-clean-architecture` หรือ `/follow-layered-architecture` เพื่อสร้าง `src/`
2. สร้าง `src/bot.ts`, `src/index.ts`, `src/commands/`, `src/middleware/`, `src/handlers/`, `src/config.ts`
3. สร้าง `package.json`, `tsconfig.json`, `.env.example`, `.gitignore`
4. รัน `bun init` หรือ `npm init` ตาม runtime
5. ใช้ `/search-npm-libraries` เลือก library หลัก (default แนะนำ `grammy`)

### 4. Configure Bot And Handlers

> Goal: เชื่อมต่อ Telegram Bot API

1. ติดตั้ง library ทีเลือก เช่น `bun add grammy`
2. สร้าง `src/bot.ts` ด้วย token จาก `process.env.BOT_TOKEN`
3. สร้าง `src/index.ts` เป็น entry point
4. สร้าง `src/commands/start.ts`, `src/commands/help.ts` เป็นตัวอย่าง
5. เพิ่ม middleware สำหรับ logging, error handling, rate limiting
6. ถ้าต้องการ session → ใช้ `grammy` session middleware หรือ memory/redis

### 5. Add Features

> Goal: เพิ่ม features ตาม requirement

1. สร้าง handlers สำหรับ messages, callback queries, inline queries ตาม need
2. ใช้ `bot.api.setMyCommands` เพื่อลงทะเบียน slash commands
3. ใช้ `/use-bun-native-api` แทน `node:*` ถ้าใช้ Bun
4. เพิ่ม type safety ด้วย TypeScript interfaces สำหรับ context/dependencies

### 6. Test Locally

> Goal: ทดสอบ bot

1. รัน `bun dev` หรือ `bun run src/index.ts`
2. ทดสอบ commands บน Telegram
3. ตรวจสอบ logs และ error handling
4. ทำ `/run-test` สำหรับ unit tests ของ handlers

### 7. Deploy

> Goal: deploy bot ไป production

1. ถ้าใช้ long-polling: รัน `bun start` บน server หรือ container
2. ถ้าใช้ webhook: setup `express`/`hono`/`elysia` endpoint แล้ว `webhookCallback`
3. ตั้งค่า environment variables บน host
4. ทำ `/deploy-to-cloudflare`, `/deploy-to-railway` หรือ `/deploy-to-vercel` ตาม target

## Rules

- ไม่ hardcode `BOT_TOKEN`; ใช้ `/follow-secret-manager` สำหรับจัดการ token ก่อน inject เข้า app
- ใช้ `grammy` เป็น default library บน Bun
- ใช้ long-polling สำหรับ dev, webhook สำหรับ production
- ไม่ commit `.env`
- ใช้ TypeScript first ตาม `/follow-lang-typescript`
- ดู `references/telegram-bot.md` สำหรับ official docs

## Expected Outcome

- Telegram bot project รันได้ด้วย `bun dev`
- Command handlers, middleware, error handling ครบ
- รองรับ long-polling และ webhook
- พร้อม deploy ด้วย environment variables

## Guide

- `references/telegram-bot.md` — official docs และ library choices
- `/follow-lang-typescript` — TypeScript best practices
- `/follow-create-bun-cli` — ถ้า bot เป็น Bun CLI project
- `/search-npm-libraries` — เลือก library ตาม use case
