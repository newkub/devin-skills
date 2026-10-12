---
name: improve-features
description: หา feature improvements ของ core business — extends/gaps ของ features เดิมเท่านั้น — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-stability
  - idea-features
  - refactor
  - deep-review
  - deep-review-then-fix
  - create-plan-in-dot-devin
  - idea
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "features improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — เฉพาะ `core business` (user-facing functionality) และเฉพาะ extends/gaps ของ features เดิมเท่านั้น — net-new features, platform capabilities (auth, security, performance, stability, observability ฯลฯ) และ feature ideas ใหม่ทั้งหมดส่งต่อ `/idea-features` — รวม findings จาก `/deep-review` domains เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "features ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

### Core Business — domains ที่ review

- `review-gaps` — feature gaps, missing capabilities, incomplete implementations
- `review-uxui` — UX flow, interaction quality, accessibility ของ features
- `review-business` — payment, subscription, feature flags usage ในธุรกิจ

### Out Of Scope → ส่งต่อ `/idea-features`

- Feature ideas ใหม่ (net-new capabilities ไม่ใช่ extends/gaps)
- Platform/cross-cutting capabilities — auth, security, performance, stability, optimize, release, observability — ถ้าระหว่าง review เจอ finding ฝั่งนี้ให้ note ไว้แนะนำ `/idea-features` หรือ `/improve-<domain>` ไม่นับเป็น finding ของ skill นี้
- Feature flags setup → `### setup-feature-flags` ใน `## Merged Details` (ยังใช้ได้กับ core business findings)

## Execute

### 1. Review Features

> Goal: ได้ prioritized feature findings ของ core business

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ core domains: `review-gaps` + `review-uxui` + `review-business`
3. เช็ค feature flags maturity — ถ้าไม่มี flag system เลย → เสนอ `### setup-feature-flags`
4. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Evidence, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. Feature flags request → ทำตาม `### setup-feature-flags` ใน `## Merged Details`
3. Feature additions ใหญ่ (module ใหม่, external provider) → ทำ `/create-plan-in-dot-devin` เสมอ ก่อน implement
4. หลังแก้ findings ครบ → ทำ `/refactor-to-srp` กับไฟล์ที่สร้าง/แตะเสมอ — ทุก unit เหลือ 1 responsibility, ≤250 บรรทัด ตาม global rules
5. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- Findings ต้องเป็น extends/gaps ของ feature เดิมเท่านั้น — net-new หรือ platform → ส่งต่อ `/idea-features` / `/improve-<domain>` ไม่ใส่ใน report
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง
- ทุก addition → ทำ `/create-plan-in-dot-devin` ก่อน implement เสมอ ห้ามข้าม

## Merged Details

### setup-feature-flags

ตั้ง feature flag system ให้ project — merged จาก `/setup-feature-flags` — เลือก approach (env-based, config file, หรือ provider), กำหนด flag lifecycle, naming convention และ cleanup path ตั้งแต่วันแรก

#### Assess Needs

1. ถามความต้องการจริง: kill switches, gradual rollout, A/B, entitlements — หรือแค่ on/off ง่ายๆ
2. ใช้ `/deep-review` ตรวจว่ามี flag tooling อยู่แล้วไหม
3. แนะนำตาม scale — ง่าย: env vars + typed config helper; กลาง: config file + evaluation utility; ใหญ่: external provider (Unleash, Flagsmith, GrowthBook)
4. ยืนยันกับ user ผ่าน `/ask-me` ก่อน implement — provider choice เปลี่ยนยาก

#### Define Flag Contract

1. Naming convention: `feature.<area>.<name>` หรือ kebab-case consistent
2. Metadata บังคับ: owner, created date, expiry/sunset date, description
3. Default value และ safe fallback เมื่อ evaluation fail
4. Flag types: boolean, percentage, variant

#### Implement Evaluation

1. สร้าง flag module เดียว (`flags.ts`, `feature_flags/` ฯลฯ) — ทุก check ต้องผ่านที่นี่ ห้าม scattered `if (env.X)`
2. Type-safe flags: enum/const registry ไม่ใช่ magic strings
3. Server/client separation ชัดเจน — flag ที่ leak ข้อมูลต้อง server-side only
4. Fail-safe defaults: evaluation error → fallback ปลอดภัย

#### Wire Into Codebase

1. เพิ่มตัวอย่างจริง: gate feature หนึ่งด้วย flag แรก
2. เพิ่ม testing helpers: override flags ใน tests (`setFlags({...})`)
3. เพิ่ม debug visibility: endpoint/command ที่ dump flag states (internal only)

#### Define Lifecycle

1. Sunset policy: flags ต้องมี expiry — เกินกำหนด flag เป็น debt
2. Cleanup path: เมื่อ rollout ครบ → ลบ flag + code path เก่า (ทำ `/follow-tool-knip`)
3. Document process ใน CONTRIBUTING หรือ `.devin/`

#### Flag Rules

- Single evaluation path — ทุก evaluation ผ่าน flag module เดียว, ไม่มี magic strings
- Fail safe — evaluation fail → fallback ปลอดภัย (ปกติ = off); provider outage ต้องไม่ทำ app ล่ม (cache/default layer)
- Right-sized — อย่าติดตั้ง external provider ถ้า env vars พอ

## Expected Outcome

- Prioritized improvement list จาก `/deep-review` เฉพาะ core business (extends/gaps เท่านั้น)
- Feature flags setup ผ่าน merged `### setup-feature-flags` เมื่อเลือก — registry เดียว, typed flags, lifecycle ชัดเจน
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`; additions ทั้งหมดผ่าน `/create-plan-in-dot-devin` (บังคับ)
