---
name: follow-deploy-deploy-railway
description: Deploy ไป Railway โดย delegate ไปยัง /deploy-to-railway skill
argument-hint: "[target]"
related:
  - deploy-to-railway
  - follow-secret-manager
  - ask-me
  - resolve-errors
---

## Goal

Map generic deploy flow ของ `/follow-deploy` ไปยัง Railway โดย delegate งาน platform-specific ทั้งหมดไปยัง `/deploy-to-railway`

## Scope

- ใช้เมื่อ parent `/follow-deploy` เลือก Railway เป็น target platform
- subskill นี้เป็น dispatch layer เท่านั้น — workflow จริงอยู่ที่ `/deploy-to-railway`
- เหมาะกับ full-stack applications ที่ต้องการ database หรือ long-running services

## Execute

### 1. Confirm Target

> Goal: ยืนยันว่า target คือ Railway และ project พร้อม

1. ตรวจ project type — full-stack app, Dockerfile หรือ service ที่ Railway รองรับ (`railway.json` ถ้ามี)
2. ถ้าไม่ชัด → `/ask-me`
3. ตรวจ prerequisites: env vars/secrets ครบผ่าน `/follow-secret-manager` — ตั้งค่าด้วย `railway variables set KEY=value` หรือ Railway dashboard

### 2. Map Generic Requirements

> Goal: map concepts ของ parent flow ไปยัง Railway equivalents

1. env vars/secrets → `railway variables set KEY=value` หรือ Railway dashboard ผ่าน `/follow-secret-manager`
2. staging environment → Railway environment แยกใน project เดียวกัน
3. deployment URL → `*.up.railway.app` หรือ custom domain ที่ผูกไว้
4. version id → Railway deployment id จาก output ของ deploy command

### 3. Delegate To Platform Skill

> Goal: ใช้ skill เฉพาะ platform แทน generic flow

1. ทำตาม `/deploy-to-railway` ทั้ง flow — link project, deploy, post-deploy verify
2. ถ้าไม่แน่ใจ command/flag ของ Railway CLI → ดู official docs แทนการเดา

### 4. Report

> Goal: รายงานผล deploy ตาม generic contract ของ parent

1. report deployment URL, service/deployment id และผล post-deploy verify
2. ถ้า fail → `/resolve-errors` max 3 รอบแล้ว stop report

## Rules

### 1. Delegate Only

- ห้าม duplicate platform logic ใน subskill นี้ — delegate ไป `/deploy-to-railway` เสมอ
- ถ้าไม่แน่ใจ Railway feature → ดู official docs แทนการเดา

### 2. Safety

- staging environment ก่อน production ตาม rules ของ parent
- secrets ผ่าน `/follow-secret-manager` เท่านั้น — ห้าม hardcode

## Expected Outcome

- deploy ผ่าน `/deploy-to-railway` สำเร็จพร้อม URL + deployment id
- ผลรายงานกลับ parent flow ของ `/follow-deploy`
