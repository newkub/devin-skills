---
name: report-config-drift
description: เปรียบเทียบ config ระหว่าง environments เพื่อตรวจจับ drift
allowed-tools:
- read
- write
- edit
- grep
- glob
- exec
- ask_user_question
triggers:
- user
- model
related:
- report-format-table
- suggest-next-action
---

## Goal

เปรียบเทียบ configuration ระหว่าง environments (dev, staging, prod) เพื่อตรวจจับ config drift และความไม่สอดคล้อง

## Scope

ใช้สำหรับการเปรียบเทียบ config ระหว่าง environments — ไม่รวมการแก้ไข config (ใช้ `/follow-config` สำหรับการจัดการ config)

## Execute

### 1. Identify Config Sources

ระบุแหล่ง config ที่ต้องเปรียบเทียบ

> Goal: รู้ config files และ env vars ที่ต้องเปรียบเทียบ

1. ระบุ environments ที่ต้องเปรียบเทียบ: dev, staging, prod
2. ระบุ config sources:
   - `.env` files: `.env`, `.env.local`, `.env.development`, `.env.production`
   - Config files: `tsconfig.json`, `vite.config.ts`, `biome.jsonc`, `turbo.json`
   - Platform configs: `wrangler.toml`, `infisical.json`, `capacitor.config.ts`
   - CI/CD configs: `.github/workflows/*.yml`
3. ระบุ env vars จาก `turbo.json` `globalEnv` ถ้ามี
4. ระบุ secrets manager configs ถ้ามี (Infisical, Phase, etc.)

### 2. Collect Config Values

รวบรวม config values จากแต่ละ environment

> Goal: มี config values ครบสำหรับการเปรียบเทียบ

1. อ่าน `.env.example` เพื่อดู expected env vars
2. อ่าน `.env.*` files สำหรับแต่ละ environment
3. ระบุ env vars ที่มีในบาง environment แต่ไม่มีในบาง environment
4. ระบุ env vars ที่มีค่าต่างกันระหว่าง environments
5. ไม่แสดง actual secret values — แสดงเฉพาะว่ามีหรือไม่ และ format

### 3. Compare Configs

เปรียบเทียบ config ระหว่าง environments

> Goal: รู้ความแตกต่างระหว่าง environments

1. เปรียบเทียบ env vars: มี/ไม่มี, ค่าต่างกัน, format ต่างกัน
2. เปรียบเทียบ config files: settings ต่างกัน, options ต่างกัน
3. ระบุ config drift:
   - Missing in env: var มีใน env หนึ่งแต่ไม่มีในอีก env
   - Value mismatch: var มีค่าต่างกัน
   - Format mismatch: var มี format ต่างกัน
   - Extra in env: var มีใน env แต่ไม่มีใน `.env.example`
4. ระบุ config ที่ควรเหมือนกันทุก env (เช่น API endpoints)
5. ระบุ config ที่ควรต่างกัน (เช่น database URLs, API keys)

### 4. Assess Risk

ประเมินความเสี่ยงของ config drift

> Goal: รู้ว่า drift ใดเป็นปัญหาและไม่เป็นปัญหา

1. จัดประเภท drift:
   - Critical: missing required env var, different API endpoint
   - Warning: different timeout, different rate limit
   - Info: expected difference (database URL, API key)
2. ระบุ drift ที่อาจทำให้ staging ไม่เหมือน prod
3. ระบุ drift ที่อาจทำให้เกิด runtime errors
4. ระบุ drift ที่อาจกระทบ security

### 5. Format Report

จัดรูปแบบรายงานให้อ่านง่าย

> Goal: รายงานครบ อ่านง่าย มี insights

1. ทำ `/report-format-table` เพื่อจัดรูปแบบเป็นตาราง
2. แสดงผลตามลำดับ: Summary → Missing Vars → Value Mismatches → Extra Vars → Risk Assessment
3. กำหนด columns:
   - No. ลำดับ
   - Variable ชื่อ env var หรือ config key
   - Dev มี/ค่า (masked)
   - Staging มี/ค่า (masked)
   - Prod มี/ค่า (masked)
   - Drift Type missing / mismatch / extra
   - Risk critical / warning / info
4. จัดกลุ่มตาม risk: critical ก่อน

### 6. Provide Insights

ให้ insights และ recommendations

> Goal: ผู้อ่านรู้ว่าต้องแก้ drift ใดก่อน

1. สรุปจำนวน drifts แยกตาม type และ risk
2. ระบุ critical drifts ที่ต้องแก้ทันที
3. ระบุ drifts ที่ทำให้ staging ไม่เหมือน prod
4. แนะนำ next steps: `/follow-config` สำหรับแก้ไข, `/validate` สำหรับ validate

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-format-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-format-terminal` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### Read-Only

- ไม่แก้ไข config หรือ env vars — รายงานเท่านั้น
- ใช้ `/follow-config` สำหรับการจัดการ config
- ใช้ `/validate` สำหรับ validation

### Security

- ไม่แสดง actual secret values — แสดงเฉพาะ มี/ไม่มี และ format
- ไม่แสดง API keys, passwords, tokens ในรายงาน
- ใช้ masking: `***` สำหรับ secrets, แสดงเฉพาะ prefix/suffix

### Output Format

- ทำ `/report-format-table` สำหรับจัดรูปแบบผลลัพธ์
- จัดกลุ่มตาม risk: critical ก่อน
- ใช้ symbols: 🔴 critical, 🟡 warning, ℹ️ info, ✅ match

### High Impact Content

- ชี้เน้น critical drifts ก่อนเสมอ
- ชี้เน้น drifts ที่ทำให้ staging ไม่เหมือน prod
- ถ้ามีมากกว่า 50 vars → แสดงเฉพาะที่มี drift
- ไม่แสดง vars ที่เหมือนกันทุก env ในรายละเอียด

### Non-Redundancy

- การจัดการ config อยู่ใน `/follow-config` แล้ว
- การ validation อยู่ใน `/validate` แล้ว

## Expected Outcome

- รายการ config drifts ระหว่าง environments ในตารางที่อ่านง่าย
- ระบุ critical drifts ที่ต้องแก้ทันที
- ไม่แสดง actual secret values
- มี recommendations ชัดเจน
- ไม่มีการแก้ไข config — read-only report
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน
