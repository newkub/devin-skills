---
name: follow-deploy-deploy-vercel
description: Deploy ไป Vercel โดย delegate ไปยัง /deploy-to-vercel skill
argument-hint: "[target]"
related:
  - deploy-to-vercel
  - follow-service-vercel
  - follow-secret-manager
  - ask-me
  - resolve-errors
---

## Goal

Map generic deploy flow ของ `/follow-deploy` ไปยัง Vercel โดย delegate งาน platform-specific ทั้งหมดไปยัง `/deploy-to-vercel`

## Scope

- ใช้เมื่อ parent `/follow-deploy` เลือก Vercel เป็น target platform
- subskill นี้เป็น dispatch layer เท่านั้น — workflow จริงอยู่ที่ `/deploy-to-vercel` และ `/follow-service-vercel`
- เหมาะกับ Next.js, React applications และ frontend frameworks ที่ Vercel รองรับ

## Execute

### 1. Confirm Target

> Goal: ยืนยันว่า target คือ Vercel และ project พร้อม

1. ตรวจ project type — Next.js/React หรือ framework ที่ Vercel รองรับ (`vercel.json`, framework detection)
2. ถ้าไม่ชัด → `/ask-me`
3. ตรวจ prerequisites: env vars/secrets ครบผ่าน `/follow-secret-manager` — ตั้งค่าใน Vercel dashboard หรือ CLI

### 2. Map Generic Requirements

> Goal: map concepts ของ parent flow ไปยัง Vercel equivalents

1. env vars/secrets → Vercel environment variables (dashboard หรือ CLI) ผ่าน `/follow-secret-manager`
2. staging environment → Vercel preview deployment
3. deployment URL → `*.vercel.app` หรือ custom domain ที่ผูกไว้
4. version id → Vercel deployment id จาก output ของ deploy command

### 3. Delegate To Platform Skill

> Goal: ใช้ skill เฉพาะ platform แทน generic flow

1. ทำตาม `/deploy-to-vercel` ทั้ง flow — link project, deploy preview, deploy production, post-deploy verify
2. ถ้าต้อง setup/config เพิ่ม → ทำตาม `/follow-service-vercel`

### 4. Report

> Goal: รายงานผล deploy ตาม generic contract ของ parent

1. report deployment URL, deployment id และผล post-deploy verify
2. ถ้า fail → `/resolve-errors` max 3 รอบแล้ว stop report

## Rules

### 1. Delegate Only

- ห้าม duplicate platform logic ใน subskill นี้ — delegate ไป `/deploy-to-vercel` เสมอ
- ถ้า `/deploy-to-vercel` ไม่ครอบคลุม case → ใช้ `/follow-service-vercel`

### 2. Safety

- preview deployment ก่อน production ตาม rules ของ parent
- secrets ผ่าน `/follow-secret-manager` เท่านั้น — ห้าม hardcode

## Expected Outcome

- deploy ผ่าน `/deploy-to-vercel` สำเร็จพร้อม URL + deployment id
- ผลรายงานกลับ parent flow ของ `/follow-deploy`
