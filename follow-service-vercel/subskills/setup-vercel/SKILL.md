---
name: follow-service-vercel-setup-vercel
description: ติดตั้ง Vercel CLI, login และ link project ให้พร้อม deploy
argument-hint: "[project-path]"
related:
  - follow-secret-manager
  - deploy-to-vercel
  - run-verify
  - resolve-errors
  - suggest-next-action
---

## Goal

ติดตั้ง Vercel CLI, authenticate และ link project กับ Vercel — first-time setup ก่อน deploy

## Scope

- ติดตั้ง `vercel` CLI, `vercel login`, `vercel link`
- สร้าง `.vercel/project.json` ที่มี `orgId`/`projectId`
- ถ้า link แล้ว → verify เท่านั้น; config env/vercel.json → `subskills/config-vercel/SKILL.md`; deploy → `/deploy-to-vercel`

## Execute

### 1. Check Prerequisites

> Goal: ยืนยัน project พร้อมและยังไม่ได้ link

1. ตรวจ `package.json` ว่ามี `vercel` แล้วหรือยัง และดู `.vercel/project.json` ว่ามีอยู่หรือไม่
2. ถ้ามี `.vercel/project.json` แล้ว → skip ไปขั้น verify
3. เพิ่ม `.vercel` ใน `.gitignore` ถ้ายังไม่มี

### 2. Install CLI

> Goal: มี Vercel CLI พร้อมใช้

1. รัน `bun add -D vercel` หรือใช้ `bunx vercel` โดยไม่ต้องติดตั้ง
2. ตรวจว่า CLI ทำงานด้วย `bunx vercel --version`

### 3. Authenticate

> Goal: CLI login กับ Vercel account

1. รัน `bunx vercel login` แล้วให้ user ยืนยันผ่าน email/provider
2. ตรวจ auth ด้วย `bunx vercel whoami`
3. สำหรับ CI/CD → เก็บ `VERCEL_TOKEN` ผ่าน `/follow-secret-manager`

### 4. Link Project

> Goal: project เชื่อมกับ Vercel project

1. รัน `bunx vercel link` ใน project root แล้วเลือก scope และ project (สร้างใหม่หรือ existing)
2. ตรวจ `.vercel/project.json` มี `orgId` และ `projectId`
3. สำหรับ CI → เก็บ `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` ผ่าน `/follow-secret-manager`

### 5. Verify

> Goal: setup พร้อม deploy

1. รัน `bunx vercel pull` เพื่อ sync project settings/env ลง local
2. ทำ `/run-verify` สำหรับ lint, typecheck
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report
4. สำเร็จ → ทำ `/suggest-next-action`

## Rules

- ห้าม commit `.vercel/` หรือ `VERCEL_TOKEN`
- ใช้ `bunx vercel` หรือ dev dependency — ห้ามพึ่ง global install ที่ไม่ pin
- ใช้ official docs เป็นแหล่งหลัก ถ้าไม่แน่ใจ → ดู https://vercel.com/docs

## Expected Outcome

- Vercel CLI ติดตั้งและ authenticated
- project link แล้วพร้อม `.vercel/project.json`
- พร้อมไป `subskills/config-vercel/SKILL.md` หรือ `/deploy-to-vercel`
