---
name: check-hardcoded-values
description: สแกนหา hardcoded URLs, IPs, credentials และ magic strings ที่ควรย้ายไป config
argument-hint: "[path]"
related:
  - follow-config
  - check-env-vars
  - check-secrets-leak
  - search-files-patterns
  - use-astgrep
  - report-table
---

## Goal

ตรวจหา hardcoded values ใน source code ที่ควรย้ายไป config/env — URLs, IP addresses, ports, file paths, API keys pattern และ magic strings ที่ใช้ซ้ำ

## Scope

- ตรวจ source files ใน `src/`, `app/`, `lib/` (ยกเว้น `test/`, `mock/`, `fixtures/`, docs)
- Patterns: URLs (`https?://`), IPs, localhost/ports, absolute paths, credential-like strings, magic strings ซ้ำ ≥3 จุด
- Read-only: รายงานอย่างเดียว — ไม่แยกกับ `/check-secrets-leak` ซึ่งจัดการ credentials จริง

## Execute

### 1. Scan Patterns

> Goal: หา hardcoded values ตามหมวด

1. ใช้ `/search-files-patterns` หรือ `/use-astgrep` สแกน patterns:
   - URLs: `https?://` ที่ไม่ใช่ example/localhost ใน comments
   - IPs: `\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}`
   - Localhost/ports: `localhost:\d+`, `127.0.0.1`, `0.0.0.0`
   - Absolute paths: `C:\\`, `/Users/`, `/home/`
2. สแกน string literals ที่ซ้ำ ≥3 ไฟล์ — เป็น candidate สำหรับ shared constant
3. ข้าม secrets patterns → ส่งต่อ `/check-secrets-leak`

### 2. Classify

> Goal: จัดหมวดตามควรย้ายไปไหน

1. `env-var` → ค่าต่อ environment ต่างกัน (API base URL, host) → ควรอยู่ใน `.env`
2. `config` → ค่าคงที่ต่อ environment เหมือนกัน → config file
3. `constant` → magic string ซ้ำ → shared constants file
4. `acceptable` → localhost ใน dev-only code, example URLs ใน types/comments → ไม่นับ

### 3. Report

> Goal: สรุปพร้อม fix location

1. ใช้ `/report-table` คอลัมน์: `No.`, `File:Line`, `Value`, `Category`, `Severity`, `Move To`
2. Severity: `critical` (prod URL/IP ใน code), `warning` (dev-only hardcoded), `info` (duplicate strings)
3. แนะนำ `/check-env-vars` หลังย้ายค่าไป env

## Rules

### 1. Evidence-Based

- ทุก finding ต้องมี `file:line` และค่าจริง (mask ค่าที่คล้าย secret)
- ไม่ flag test fixtures, example code หรือ documentation

### 2. No Secret Handling

- ถ้าเจอค่าที่เป็น credential จริง → ส่งต่อ `/check-secrets-leak` ไม่ report ค่าเต็มที่นี่

### 3. Read-Only

- ไม่แก้ code หรือสร้าง config — รายงานพร้อมแนะนำ `/follow-config`

- ใช้ /check-secrets-leak สำหรับ credentials จริง
- ใช้ /check-env-vars ตรวจ env keys หลัง refactor
- ใช้ /follow-config เมื่อต้องแก้ไข config structure

## Expected Outcome

- รายการ hardcoded values จัดหมวดตาม fix target
- แผนย้ายค่าไป env/config/constants
