---
name: follow-create-discord-bot
description: สร้าง Discord bot ด้วย TypeScript/Bun พร้อม slash commands, events, auto-load, และ modular handlers
related:
  - deploy-to-cloudflare
  - deploy-to-railway
  - follow-create-bun-cli
  - follow-create-cli
  - follow-create-sdk
  - follow-create-website
  - follow-lang-typescript
  - run-test
  - search-npm-libraries
  - use-bun-native-api
  - report-table
---
## Goal

สร้าง Discord bot project ด้วย TypeScript/Bun ทีรันได้จริง พร้อม slash commands, event handlers, auto-load commands, และ modular architecture

## Scope

ใช้สำหรับสร้าง Discord bot จาก scratch บน Bun หรือ Node.js รองรับ slash commands, buttons, select menus, modals, context menus, และ deployment

## Execute

### 1. Gather Requirements

> Goal: รวบรวมข้อมูลก่อนสร้าง bot

1. ถาม user ถึง purpose, ชื่อ bot, target guilds, และ commands ทีต้องการ
2. ขอ `DISCORD_TOKEN`, `APPLICATION_ID`, และ `GUILD_ID` หรือแนะนำสร้าง app ที่ Discord Developer Portal
3. ระบุ intents: `GatewayIntentBits.Guilds`, `GuildMessages`, `MessageContent`, etc.
4. ระบุ deployment target: local dev หรือ server/serverless

### 2. Setup Project

> Goal: สร้างโครงสร้าง project

1. ทำ `/follow-clean-architecture` หรือ `/follow-layered-architecture` เพื่อสร้าง `src/`
2. สร้าง `src/index.ts`, `src/client.ts`, `src/commands/`, `src/events/`, `src/handlers/`, `src/types.ts`, `src/config.ts`
3. สร้าง `package.json`, `tsconfig.json`, `.env.example`, `.gitignore`
4. รัน `bun init` หรือ `npm init`
5. ใช้ `/search-npm-libraries` เลือก library (default `discord.js` หรือ lightweight wrapper)

### 3. Configure Bot And Commands

> Goal: เชื่อมต่อ Discord API

1. ติดตั้ง library เช่น `bun add discord.js`
2. สร้าง `src/client.ts` ด้วย token, intents, `Client` instance
3. สร้าง `src/index.ts` เป็น entry point
4. สร้าง `src/types.ts` สำหรับ `Command` interface (`data: SlashCommandBuilder; execute: ...`)
5. สร้าง `src/deploy-commands.ts` เพื่อ register slash commands กับ Discord
6. สร้าง `src/commands/ping.ts` เป็นตัวอย่าง

### 4. Auto-Load Commands And Events

> Goal: โหลด commands/events จาก directory อัตโนมัติ

1. ใช้ `Bun.Glob` หรือ `readdirSync` เพื่อ scan `src/commands/`
2. เก็บ commands ใน `Collection<string, Command>` ที่ client
3. ใช้ `client.on('interactionCreate')` เพื่อ route slash commands, buttons, modals
4. ใช้ `client.on('ready')` เพื่อ log login
5. เพิ่ม `src/events/` สำหรับ `ready`, `interactionCreate`, `messageCreate` ตาม need

### 5. Add Features

> Goal: เพิ่ม features ตาม requirement

1. สร้าง slash commands ด้วย `SlashCommandBuilder`
2. รองรับ buttons, select menus, modals, context menus ถ้าต้องการ
3. ใช้ `/use-bun-native-api` แทน `node:*` ถ้าใช้ Bun
4. เพิ่ม guards/middleware สำหรับ permission checks, rate limiting
5. ใช้ `Interaction` types สำหรับ type safety

### 6. Test Locally

> Goal: ทดสอบ bot

1. รัน `bun run deploy-commands` เพื่อ register commands
2. รัน `bun dev` หรือ `bun run src/index.ts`
3. ทดสอบ slash commands บน guild
4. ตรวจสอบ logs และ error handling
5. ทำ `/run-test` สำหรับ unit tests

### 7. Deploy

> Goal: deploy bot ไป production

1. ใช้ `bun start` บน server หรือ container
2. ตั้งค่า `DISCORD_TOKEN` และ `APPLICATION_ID` บน host
3. ถ้าใช้ serverless → ทำ `/deploy-to-cloudflare` หรือ `/deploy-to-railway` ตาม target

## Rules

- ไม่ hardcode `DISCORD_TOKEN`, `APPLICATION_ID`, `GUILD_ID`; ใช้ environment variables
- ใช้ `discord.js` เป็น default library บน Bun
- ต้องมี `deploy-commands` script สำหรับ register slash commands
- ไม่ commit `.env`
- ใช้ TypeScript first ตาม `/follow-lang-typescript`
- ใช้ intents ตาม least privilege
- ดู `references/discord-bot.md` สำหรับ official docs

## Expected Outcome

- Discord bot project รันได้ด้วย `bun dev`
- Slash commands auto-load และทำงาน
- Event handlers แยกออกเป็น modules
- พร้อม deploy ด้วย environment variables

## Guide

- `references/discord-bot.md` — official docs, intents, OAuth scopes
- `/follow-lang-typescript` — TypeScript best practices
- `/follow-create-bun-cli` — ถ้า bot เป็น Bun CLI project
- `/search-npm-libraries` — เลือก library ตาม use case
