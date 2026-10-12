---
name: follow-lib-tanstack-intent
description: ใช้ TanStack Intent — ship agent skills ไปกับ npm packages
argument-hint: "[package-name]"
related:
  - follow-lib-tanstack-ecosystem
  - resolve-errors
---

## Goal

ใช้ TanStack Intent — วิธีมาตรฐานในการแพ็ค **agent skills** ไปกับ npm package เพื่อให้ consumers ติดตั้ง skill ของ lib นั้นเข้า agent tooling ได้

## Scope

ใช้เมื่อ maintain npm package และอยาก ship skill (เช่น Devin/Claude/Cursor-compatible skills) พร้อม package — สำหรับ package authors, ไม่ใช่ app developers — **0.x**: ตรวจ `https://tanstack.com/intent/latest` ก่อน implement

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Install And Layout

```bash
bun add -D @tanstack/intent
```

1. วาง skill files ตาม convention ที่ package กำหนด (โดยทั่วไป `skills/` directory ใน package root — ตรวจ docs ล่าสุด)
2. แต่ละ skill = dir ที่มี `SKILL.md` เหมือน repo นี้ — frontmatter `name`/`description`/`related`

### 2. Publish And Consume

> Goal: consumers ติดตั้ง skills จาก package ได้

1. Publish package ปกติ — `skills/` ต้องอยู่ใน published files (ตรวจ `files` field ใน `package.json`)
2. Consumers รัน intent CLI/MCP เพื่อ discover + install skills จาก installed deps เข้า agent config dir ของตัวเอง
3. Sync version ของ skills กับ package version — skill content ต้องตรง API ของ release นั้น

### 3. Verify

1. `npm pack --dry-run` ดูว่า `skills/` ติดใน tarball
2. Install ใน test project แล้ว discover skill ผ่าน intent tooling
3. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- Skills ใน package ต้องตรง version ของ code — ห้าม stale examples
- `files` ใน `package.json` ต้องครอบ skills dir — มิฉะนั้นไม่ถูก publish
- ใช้สำหรับ library authors เท่านั้น — app projects ไม่จำเป็น

## Expected Outcome

- Package publish พร้อม skills ติดใน tarball
- Consumers discover/install skill ผ่าน intent tooling ได้
