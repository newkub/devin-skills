---
name: follow-create-bot
description: สร้าง bot สำหรับ Slack, Discord, Telegram, LINE หรือ GitHub App/bot ด้วย TypeScript/Bun
argument-hint: "<slack|discord|telegram|line|github|github-app> [features]"
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

- Latest: `discord.js@14.27.0` (verified 2026-09-11)

## Execute

### 1. Select Platform

> Goal: ระบุ platform และอ่านรายละเอียดเฉพาะ platform

| Platform   | Subskill |
|------------|----------|
| Slack      | `subskills/slack/SKILL.md` — slash commands, events, Socket Mode |
| Discord    | `subskills/discord/SKILL.md` — commands, intents, gateway |
| Telegram   | `subskills/telegram/SKILL.md` — Bot API, commands, webhooks |
| LINE       | `subskills/line/SKILL.md` — Messaging API, webhook, reply |
| GitHub     | `subskills/github/SKILL.md` — GitHub bot, probot, webhooks |
| GitHub App | `subskills/github-app/SKILL.md` — app manifest, JWT auth, installation |

1. อ่าน platform จาก argument — ถ้าไม่ระบุ → ทำ `/ask-me`
2. ทำ `/follow-my-tech-stack` และ `/review-techstack`
3. อ่าน `subskills/<platform>/SKILL.md` ของ platform ที่เลือกแล้วทำตาม flow ในนั้น — ไม่ execute จากตารางนี้โดยตรง

### 2. Setup Project

> Goal: project structure พร้อมใช้งาน

1. สร้าง project ตาม subskill ของ platform ที่เลือก
2. ติดตั้ง SDK/dependencies ด้วย `bun add`
3. เก็บ tokens/secrets ผ่าน `/follow-secret-manager` — ห้าม hardcode

### 3. Implement And Ship

> Goal: bot ทำงานได้จริงพร้อม deploy

1. Implement commands/events ตาม subskill
2. ทดสอบ local (Socket Mode / polling / webhook tunnel)
3. เตรียม deploy target และ document usage

## Rules

- ห้าม commit tokens หรือ webhook secrets
- ทำตาม subskill ของ platform — ห้ามเดา API
- ใช้ `/open-web-for-config-secret` เพื่อชี้ user ไปสร้าง bot token เอง

## Expected Outcome

- Bot สำหรับ platform ที่เลือกทำงานได้ พร้อม structure และ secrets management ถูกต้อง
