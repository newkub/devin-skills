---
name: idea-new-features
description: สร้างไอเดีย features ใหม่ล้วน (net-new capabilities) — ไม่ใช่ extends หรือ gap-fills ของ feature เดิม
argument-hint: "[scope|topic]"
related:
  - idea
  - idea-features
  - idea-improve
  - improve-features
  - deep-analyze
  - bench-competitors
  - create-plan-in-dot-devin
  - implement-features-to-mvp
  - implement-to-production
  - report
  - ask-me
  - reframe
  - suggest-next-action
---

## Goal

สร้างไอเดีย features ใหม่ (net-new) สำหรับ scope/topic ที่ user ระบุ — capabilities ที่ยังไม่มีใน project เลย (new user flow, new module, new integration, new surface) ไม่ใช่การขยาย (extends) หรืออุดช่องว่าง (gaps) ของ feature เดิม

## Scope

- ใช้เมื่อ user ต้องการ "feature ใหม่" ที่เป็น standalone capability — เพิ่ม product surface ที่ไม่เคยมี
- ไม่ใช้เมื่อ idea ขยาย feature เดิม (extends) หรือเติม gaps จาก review findings → `/improve-features` (extends/gaps only); mixed Extends/New/Remove → `/idea-improve`
- 30 ideas + web viewer → `/idea-features`; general dispatcher → `/idea`
- ไม่ implement เอง — idea ที่ confirm ส่งต่อ `/create-plan-in-dot-devin` (บังคับ) → `/implement-features-to-mvp` หรือ `/implement-to-production`

## Execute

### 1. Analyze Context

> Goal: ground ไอเดียกับ codebase จริงและกันซ้ำกับ features เดิม

1. รับ `scope`/`topic` จาก argument — ถ้าไม่มีใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-analyze` ดู stack, architecture และ existing features list — ไอเดียที่เสนอห้ามทับ/extend ของเดิม
3. ถ้าต้องการ market evidence → ทำ `/bench-competitors` หา capabilities ที่ยังขาดทั้งระบบ (ไม่ใช่ gap ของ implementation เดิม)

### 2. Generate New-Feature Ideas

> Goal: ได้ ideas ที่เป็น net-new ทั้งหมด

1. ทุก idea ต้องเป็น net-new — new user flow, new module, new integration, new audience หรือ new surface ที่ไม่เคยมี
2. Reject: extends ของ feature เดิม, gap-fills ของ implementation เดิม, quality/perf/stability items (ส่งต่อ `/improve-features` ถ้าพบ)
3. ทุก idea ระบุ problem, target user, expected outcome — ห้าม generic filler
4. ใช้ `/reframe` ถ้า ideas จำเจหรือติดกรอบเดิม

### 3. Prioritize And Report

> Goal: prioritized list พร้อม implement path

1. จัดอันดับตาม impact/effort — แยก quick wins กับ strategic
2. ทำ `/report table` columns: `No.`, `Idea`, `Problem`, `User`, `Impact`, `Effort`, `Implement Path` — continuous numbering
3. Map implement path ต่อ idea: `/create-plan-in-dot-devin` → `/implement-features-to-mvp` (MVP scope) หรือ `/implement-to-production` (full)
4. ทำ `/suggest-next-action` — ถ้า user confirm idea ไหน → ส่งไป `/create-plan-in-dot-devin` เสมอ แล้วจึง implement skill นั้น

## Rules

### 1. New Only

- ทุก idea ต้องเป็น net-new capability — ห้ามปน extends/gaps; ถ้าพบว่า idea คือขยายของเดิมให้ tag แล้วส่งต่อ `/improve-features`
- ทุก idea มาจาก context จริง + solve real problem — ห้ามเสนอเพราะเท่ห์อย่างเดียว

### 2. Actionable

- ทุก idea map ไป executable path (`/create-plan-in-dot-devin`, `/implement-features-to-mvp`, `/implement-to-production`)
- ไม่ implement เอง — หลัง confirm เท่านั้น

### 3. Plan Always

- หลัง user confirm idea → ทำ `/create-plan-in-dot-devin` เสมอ ก่อน implement ทุกครั้ง — ห้ามข้ามไป implement ตรงๆ

## Expected Outcome

- Prioritized net-new feature ideas พร้อม Problem, User, Impact, Effort, Implement Path ต่อรายการ
- ตาราง `/report` ที่ sort ตาม impact/effort
- Idea ที่ confirm ส่งต่อ `/create-plan-in-dot-devin` เสมอ → implement
