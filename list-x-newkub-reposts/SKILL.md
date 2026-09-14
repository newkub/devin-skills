---
name: list-x-newkub-reposts
description: รายการ reposts (retweets) ของ @newkrubx จาก X ผ่าน local CLI + env config
argument-hint: "[username] [--limit <n>]"
related:
  - list-github-star
  - list-raindrop-favorite
  - search
  - report
  - suggest-next-action
---

## Goal

ดึง reposts (retweets) ของ X user `@newkrubx` (https://x.com/newkrubx/reposts) ด้วย local CLI `scripts/list-x-reposts.ts` — ใช้ X API v2 user timeline + `referenced_tweets` filter

## Scope

- ใช้กับ X API v2 — reposts = timeline items ที่มี `referenced_tweets[].type == "retweeted"`
- CLI เป็น bun/TypeScript ไม่มี external deps — อ่าน token จาก env หรือ `.env` ใน local เท่านั้น
- read-only — ไม่โพสต์ ไม่ repost ไม่แก้ไข account ใดๆ
- รองรับ user อื่นผ่าน `[username]` argument (default `newkrubx`)

## Execute

### 1. Prepare Env

> Goal: token พร้อมใช้โดยไม่ leak

1. ตั้ง `X_BEARER_TOKEN` ใน `.env` ที่ root ของ skill นี้ หรือ export ใน shell — bun auto-load `.env`
2. ถ้าไม่มี token → stop และบอก user ให้สร้าง Bearer Token จาก https://developer.x.com (free tier อ่าน timeline ได้)
3. ห้ามใส่ token ใน command line หรือ commit `.env`

### 2. Run CLI

> Goal: ดึง reposts ด้วยคำสั่งเดียว

```sh
bun run scripts/list-x-reposts.ts [username] [--limit 50]
```

1. CLI resolve `@username` → user id ผ่าน `GET /2/users/by/username/:username`
2. ดึง timeline `GET /2/users/:id/tweets` พร้อม `expansions=referenced_tweets.id,referenced_tweets.id.author_id` + `tweet.fields=created_at,author_id` + `user.fields=username,name`
3. filter เฉพาะ `referenced_tweets[].type == "retweeted"` แล้ว map ไปหา original tweet + author
4. output `--json` หรือ TSV: `reposted_at`, `author`, `text`, `url`

### 3. Report

> Goal: แสดงผลเป็นตาราง

1. ทำ `/report` คอลัมน์: No., Reposted At, Author, Text (truncated), URL
2. สรุปจำนวน reposts และช่วงเวลาที่ครอบคลุม
3. ทำ `/suggest-next-action` ถ้าจำเป็น

## Rules

### 1. Secrets

- `X_BEARER_TOKEN` อยู่ใน `.env` หรือ env เท่านั้น — ห้ามใน command args, logs, reports
- `.env` ต้องอยู่ใน `.gitignore` เสมอ

### 2. Read Only

- GET requests เท่านั้น — ห้าม POST/DELETE ใดๆ
- เคารพ rate limit — `--limit` สูงสุด 100 ต่อ page, paginate ด้วย `pagination_token`

### 3. Fallback

- ถ้า X API ใช้ไม่ได้ (ไม่มี token/quota) → แนะนำ `/watch-browser` เปิด `x.com/newkrubx/reposts` เป็น fallback

## Expected Outcome

- ตาราง reposts ของ @newkrubx เรียงใหม่ → เก่า พร้อม author, text, URL
- ไม่มี token/secret รั่วไหล
- next action ชัดเจน
