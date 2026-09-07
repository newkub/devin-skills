---
name: follow-create-slack-bot
description: สร้าง Slack bot ด้วย TypeScript/Bun พร้อม slash commands, events และ Socket Mode
argument-hint: "[scope]"
related:
  - follow-create-discord-bot
  - follow-my-tech-stack
  - review-techstack
  - follow-secret-manager
  - open-web-for-config-secret
  - follow-lang-typescript
  - use-bun-native-api
  - search-npm-libraries
  - run-test
  - deploy-to-cloudflare
  - deploy-to-railway
  - report-table
---

## Goal

สร้าง Slack bot project ด้วย TypeScript/Bun ที่รันได้จริง พร้อม slash commands, event handlers, interactivity (buttons, modals) และ Socket Mode หรือ HTTP endpoint

## Scope

ใช้สำหรับสร้าง Slack bot จาก scratch บน Bun หรือ Node.js รองรับ notification bots, slash command workflows, interactive messages และ workspace integrations

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Gather Requirements

> Goal: รวบรวมข้อมูลก่อนสร้าง bot

1. ถาม user ถึง purpose, ชื่อ bot, ประเภท (notification, slash commands, interactive)
2. แนะนำสร้าง Slack App ที่ api.slack.com/apps แล้วขอ `SLACK_BOT_TOKEN` (`xoxb-...`), `SLACK_SIGNING_SECRET` และ `SLACK_APP_TOKEN` (`xapp-...` ถ้าใช้ Socket Mode)
3. ระบุ runtime: `Bun` (default) หรือ `Node.js`
4. ระบุ connection mode: `socket-mode` สำหรับ dev หรือ `http` (Events API endpoint) สำหรับ production

### 3. Setup Project

> Goal: สร้างโครงสร้าง project

1. ทำ `/follow-clean-architecture` หรือ `/follow-layered-architecture` เพื่อสร้าง `src/`
2. สร้าง `src/app.ts`, `src/index.ts`, `src/commands/`, `src/events/`, `src/actions/`, `src/config.ts`
3. สร้าง `package.json`, `tsconfig.json`, `.env.example`, `.gitignore`
4. รัน `bun init` หรือ `npm init` ตาม runtime
5. ใช้ `/search-npm-libraries` เลือก library หลัก (default แนะนำ `@slack/bolt`)

### 4. Configure Bot And Handlers

> Goal: เชื่อมต่อ Slack API

1. ติดตั้ง `bun add @slack/bolt`
2. สร้าง `src/app.ts` ด้วย `new App({ token, signingSecret, socketMode, appToken })`
3. สร้าง `src/index.ts` เป็น entry point เรียก `app.start()`
4. สร้าง `src/commands/` ตัวอย่าง `app.command('/hello', ...)`
5. สร้าง `src/events/` ตัวอย่าง `app.event('app_mention', ...)` และ `app.message(...)`
6. เพิ่ม error handling ด้วย `app.error()` และ ack pattern (`ack()` ก่อน process)

### 5. Add Features

> Goal: เพิ่ม features ตาม requirement

1. สร้าง `src/actions/` สำหรับ `app.action()`, `app.view()` (modals), `app.shortcut()`
2. ใช้ Block Kit (`blocks`) สำหรับ rich messages
3. ใช้ `/use-bun-native-api` แทน `node:*` ถ้าใช้ Bun
4. เพิ่ม type safety ด้วย TypeScript interfaces สำหรับ payloads และ dependencies

### 6. Test Locally

> Goal: ทดสอบ bot

1. รัน `bun dev` หรือ `bun run src/index.ts`
2. ถ้า HTTP mode → tunnel ด้วย `cloudflared` หรือ ngrok แล้วตั้ง Request URL ใน Slack App
3. ทดสอบ slash commands, mentions และ interactive actions ใน Slack workspace
4. ทำ `/run-test` สำหรับ unit tests ของ handlers

### 7. Deploy

> Goal: deploy bot ไป production

1. ถ้าใช้ Socket Mode → รัน `bun start` บน server หรือ container ที่ outbound ได้
2. ถ้าใช้ HTTP mode → expose endpoint แล้วตั้ง Event/Interactivity Request URL
3. ตั้งค่า environment variables บน host
4. ทำ `/deploy-to-cloudflare`, `/deploy-to-railway` หรือ `/deploy-to-vercel` ตาม target

## Rules

- ไม่ hardcode `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `SLACK_APP_TOKEN`; ใช้ `/follow-secret-manager` ก่อน inject เข้า app
- ใช้ `@slack/bolt` เป็น default library บน Bun/Node
- ใช้ Socket Mode สำหรับ dev, HTTP endpoint สำหรับ production
- ทุก listener ต้องเรียก `ack()` ภายใน 3 วินาที ก่อนทำงานหนัก
- ไม่ commit `.env`
- ใช้ TypeScript first ตาม `/follow-lang-typescript`

- ใช้ /open-web-for-config-secret ถ้าจำเป็น
- ใช้ /follow-create-discord-bot ถ้าจำเป็น
- ใช้ /report-table ถ้าจำเป็น

## Expected Outcome

- Slack bot project รันได้ด้วย `bun dev`
- Slash commands, event handlers และ interactive actions ครบตาม requirement
- รองรับ Socket Mode และ HTTP endpoint
- พร้อม deploy ด้วย environment variables
