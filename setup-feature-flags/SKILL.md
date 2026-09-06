---
name: setup-feature-flags
description: ตั้งระบบ feature flags ครบ — flag definitions, evaluation, cleanup path และ naming convention
argument-hint: "[provider-or-approach]"
related:
  - follow-config
  - implement-features-to-mvp
  - check-dead-code
  - follow-my-tech-stack
  - ask-me
  - report-table
---

## Goal

ตั้ง feature flag system ให้ project — เลือก approach (env-based, config file, หรือ provider), กำหนด flag lifecycle, naming convention และ cleanup path ตั้งแต่วันแรก

## Scope

- ครอบคลุม: flag definitions, evaluation points (client/server), provider choice (config file, env vars, Flagsmith/Unleash/LaunchDarkly), rollout helpers (percentage, targeting), flag cleanup process
- Action-oriented: implement จริงใน project — ปรับตาม stack และ scale ที่ต้องการ

## Execute

### 1. Assess Needs

> Goal: เลือก approach ที่พอดีกับ project

1. ถามความต้องการจริง: kill switches, gradual rollout, A/B, entitlements — หรือแค่ on/off ง่ายๆ
2. ใช้ `/follow-my-tech-stack` ตรวจว่ามี flag tooling อยู่แล้วไหม
3. แนะนำตาม scale:
   - ง่าย: env vars + typed config helper
   - กลาง: config file + evaluation utility
   - ใหญ่: external provider (Unleash, Flagsmith, GrowthBook)
4. ยืนยันกับ user ผ่าน `/ask-me` ก่อน implement — provider choice เปลี่ยนยาก

### 2. Define Flag Contract

> Goal: สร้าง contract ที่ทุก flag ต้องมี

1. Naming convention: `feature.<area>.<name>` หรือ kebab-case consistent
2. Metadata บังคับ: owner, created date, expiry/sunset date, description
3. Default value และ safe fallback เมื่อ evaluation fail
4. Flag types: boolean, percentage, variant

### 3. Implement Evaluation

> Goal: สร้าง flag evaluation path เดียว

1. สร้าง flag module เดียว (`flags.ts`, `feature_flags/` ฯลฯ) — ทุก check ต้องผ่านที่นี่ ห้าม scattered `if (env.X)`
2. Type-safe flags: enum/const registry ไม่ใช่ magic strings
3. Server/client separation ชัดเจน — flag ที่ leak ข้อมูลต้อง server-side only
4. Fail-safe defaults: evaluation error → fallback ปลอดภัย

### 4. Wire Into Codebase

> Goal: ใช้งานจริงอย่างน้อยหนึ่งจุด

1. เพิ่มตัวอย่างจริง: gate feature หนึ่งด้วย flag แรก
2. เพิ่ม testing helpers: override flags ใน tests (`setFlags({...})`)
3. เพิ่ม debug visibility: endpoint/command ที่ dump flag states (internal only)

### 5. Define Lifecycle

> Goal: flags ต้องตายได้ ไม่ใช่ตัวตลอดไป

1. Sunset policy: flags ต้องมี expiry — เกินกำหนด flag เป็น debt
2. Cleanup path: เมื่อ rollout ครบ → ลบ flag + code path เก่า (ทำ `/check-dead-code`)
3. Document process ใน CONTRIBUTING หรือ `.devin/`

## Rules

### 1. Single Evaluation Path

- ห้าม scattered flag checks — ทุก evaluation ผ่าน flag module เดียว
- Magic strings ต้องไม่มี — registry เดียวที่ type-safe

### 2. Fail Safe

- Flag evaluation fail → fallback ที่ปลอดภัย (ปกติ = off สำหรับ feature ใหม่)
- Provider outage ต้องไม่ทำ app ล่ม — cache/default layer

### 3. Right-Sized

- อย่าติดตั้ง external provider ถ้า env vars พอ — match กับ scale จริง
- อย่าสร้าง abstraction เกินกว่าที่ project ต้องการตอนนี้

## Expected Outcome

- Flag system พร้อมใช้พร้อม registry เดียวและ typed flags
- Naming/lifecycle conventions ชัดเจน
- ตัวอย่างการใช้จริงและ test helpers
- Cleanup path ที่ป้องกัน flag debt
