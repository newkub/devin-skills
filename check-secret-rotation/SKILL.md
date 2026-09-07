---
name: check-secret-rotation
description: ตรวจ secrets และ credentials ที่ไม่ได้ rotate นาน หรือไม่มี expiry policy
argument-hint: "[max-age-days]"
related:
  - check-secrets-leak
  - follow-secret-manager
  - check-env-vars
  - follow-service-infisical
  - report-table
---

## Goal

ตรวจ secrets/credentials ทั้งหมดว่าเก่าเกิน policy หรือไม่ — API keys, tokens, certs, passwords — พร้อมระบุตัวที่ไม่มี rotation plan

## Scope

- ตรวจ secret sources: `.env*` files, secret managers (Infisical, Doppler, Vault, AWS SM, GitHub Secrets), CI variables, config secrets
- วัดอายุจาก git history, secret manager metadata, หรือ file timestamps — ไม่อ่านค่า secret จริง
- Read-only: รายงานอายุและสถานะ — rotate ผ่าน `/follow-secret-manager` หรือ `/follow-service-infisical`

## Execute

### 1. Inventory Secrets

> Goal: map secrets ทั้งหมดที่ project ใช้

1. หา env keys ที่เป็น secrets (นามแฝง: `*_KEY`, `*_SECRET`, `*_TOKEN`, `*_PASSWORD`, `*_CREDENTIALS`) — ทำ `/check-env-vars` เพื่อ inventory
2. ตรวจ secret manager stores ที่ project เชื่อม (`.infisical.json`, doppler config, vault paths)
3. ตรวจ GitHub Actions secrets/variables ผ่าน `gh secret list` (ไม่ดึงค่า)
4. รวม certs/keys ใน repo (`*.pem`, `*.key`) — flag ถ้า committed จริง (ส่งต่อ `/check-secrets-leak`)

### 2. Determine Age

> Goal: ประเมินอายุของแต่ละ secret

1. `.env` files: ใช้ `git log`/`git blame` ดูว่า key ถูก set/เปลี่ยนล่าสุดเมื่อไหร่
2. GitHub secrets: `gh secret list` แสดง `Updated at`
3. Secret managers: ดู metadata (version history, updated_at) ถ้า tool รองรับ
4. ถ้าอายุไม่ทราบได้ → ระบุ `unknown` แทนการเดา

### 3. Evaluate Against Policy

> Goal: flag secrets ที่เกินกำหนด

1. Default threshold: 90 วัน (ปรับผ่าน argument)
2. Severity: `critical` (>365 วัน หรือ leaked แล้ว), `high` (>180), `medium` (>90), `info` (unknown age)
3. flag secrets ที่ไม่มี rotation mechanism เลย (manual-only, undocumented)
4. flag long-lived tokens ที่ควรเปลี่ยนเป็น short-lived (OIDC, workload identity)

### 4. Report

> Goal: สรุป rotation status พร้อมแผน

1. ใช้ `/report-table` คอลัมน์: `No.`, `Secret Name`, `Source`, `Age`, `Severity`, `Rotation Path`
2. รายงานเป็น ชื่อ secret เท่านั้น — ห้ามแสดงค่า
3. แนะนำ rotation order: critical ก่อน พร้อมระบุ downtime risk ต่อตัว

## Rules

### 1. Never Expose Values

- รายงานเฉพาะชื่อ/อายุ/แหล่ง — ห้ามอ่านหรือแสดง secret values เด็ดขาด
- ห้ามเขียน secrets ลงไฟล์หรือ logs

### 2. Evidence-Based

- อายุต้องมาจาก metadata จริง — ถ้าไม่ทราบให้ระบุ `unknown`
- ไม่สันนิษฐานว่า secret ยังใช้งาน — ระบุ "possibly unused" แยกถ้าไม่มี code reference

### 3. Read-Only

- ไม่ rotate หรือแก้ค่า — รายงานแล้วให้ `/follow-secret-manager` หรือ user ดำเนินการ
- rotation เป็นงานเสี่ยงสูง — ต้องมี plan และ user confirmation

## Expected Outcome

- Inventory secrets ทั้งหมดพร้อมอายุและ severity
- รายการที่เกิน rotation policy เรียงตามความเสี่ยง
- แผน rotation พร้อมช่องทางที่ถูกต้องต่อตัว
