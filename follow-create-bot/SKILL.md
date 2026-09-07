---
name: follow-create-bot
description: สร้าง bot สำหรับ Slack, Discord, Telegram, LINE หรือ GitHub App/bot ด้วย TypeScript/Bun
argument-hint: "<slack|discord|telegram|line|github> [features]"
related:
  - follow-my-tech-stack
  - review-techstack
  - follow-secret-manager
  - open-web-for-config-secret

---

## Goal

สร้าง bot สำหรับแพลตฟอร์มที่ระบุ — Slack, Discord, Telegram, LINE หรือ GitHub (App/bot) — ด้วย project structure, commands/events และ deployment ที่ถูกต้อง

## Scope

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: follow-create-slack-bot, follow-create-discord-bot, follow-create-telegram-bot, follow-create-line-bot, follow-create-github-app, follow-create-github-bots)
- ใช้เมื่อต้องสร้าง chat bot หรือ GitHub automation bot
- ทำตาม `/follow-my-tech-stack` สำหรับ runtime และ dependencies

## Execute

### 1. Select Platform

> Goal: ระบุ platform และอ่านรายละเอียดเฉพาะ platform

| Platform | Reference |
|----------|-----------|
| Slack    | `references/slack.md` — slash commands, events, Socket Mode |
| Discord  | `references/discord.md` — commands, intents, gateway |
| Telegram | `references/telegram.md` — Bot API, commands, webhooks |
| LINE     | `references/line.md` — Messaging API, webhook, reply |
| GitHub   | `references/github.md` — GitHub App, probot, webhooks |

1. อ่าน platform จาก argument — ถ้าไม่ระบุ → ทำ `/ask-me`
2. ทำ `/follow-my-tech-stack` และ `/review-techstack`
3. อ่าน reference ของ platform ที่เลือกก่อนเริ่ม

### 2. Setup Project

> Goal: project structure พร้อมใช้งาน

1. สร้าง project ตาม reference ของ platform
2. ติดตั้ง SDK/dependencies ด้วย `bun add`
3. เก็บ tokens/secrets ผ่าน `/follow-secret-manager` — ห้าม hardcode

### 3. Implement And Ship

> Goal: bot ทำงานได้จริงพร้อม deploy

1. Implement commands/events ตาม reference
2. ทดสอบ local (Socket Mode / polling / webhook tunnel)
3. เตรียม deploy target และ document usage

## Rules

- ห้าม commit tokens หรือ webhook secrets
- ทำตาม reference ของ platform — ห้ามเดา API
- ใช้ `/open-web-for-config-secret` เพื่อชี้ user ไปสร้าง bot token เอง

## Expected Outcome

- Bot สำหรับ platform ที่เลือกทำงานได้ พร้อม structure และ secrets management ถูกต้อง
