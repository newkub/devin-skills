---
name: report-config-drift
description: สร้างรายงาน drift ของ config files ระหว่าง environments
argument-hint: "[path]"
related:
  - report-in-table
  - report-file-structure
  - search-files-patterns
  - check-config-drift
  - check-env-vars
  - report
  - suggest-next-action
---

## Goal

สร้างรายงานเกี่ยวกับ configuration files ใน project พบ drift ระหว่าง environments และ default values

## Scope

ใช้สำหรับ review config files เช่น `.env`, `.yaml`, `.json`, `.toml`, `.config` ไม่แก้ไขไฟล์

## Execute

### 1. Discover Config Files

> Goal: หา config files ทั้งหมด

1. ใช้ `/search-files-patterns` หา `**/*.{json,yaml,yml,toml,ini,conf,config,env,env.*}`
2. แยกตาม environment (`dev`, `test`, `prod`, `staging`)
3. ระบุ sample files หรือ examples

### 2. Compare Environments

> Goal: เปรียบเทียบ config drift

1. จับคู่ไฟล์ config ตาม environment
2. เปรียบเทียบ keys/values
3. ระบุ keys ที่แตกต่างระหว่าง environments
4. ระบุ secrets หรือ hardcoded values

### 3. Report Findings

> Goal: สร้าง report

1. ทำ `/report-in-table` สำหรับ drift ระหว่าง environments
2. ทำ `/report-file-structure` สำหรับ tree ของ config files
3. สรุป missing keys, inconsistent values, default drift
4. ทำ `/suggest-next-action`

## Rules

### 1. No Modification

- ไม่แก้ไข config files
- ไม่ expose secrets
- ไม่ commit การเปลี่ยนแปลง

### 2. Secret Safety

- ระบุ secrets ที่ hardcoded โดยไม่แสดงค่าจริง
- แนะนำให้ย้ายไป `.env` หรือ secret manager

### 3. Ecosystem Aware

- ใช้ conventions ของ framework เช่น `.env` สำหรับ JS, `Cargo.toml` สำหรับ Rust

- ใช้ /check-config-drift ถ้าจำเป็นตรวจลึก
- ใช้ /check-env-vars ถ้าจำเป็น

## Expected Outcome

- รายการ config files ทั้งหมด
- ตารางเปรียบเทียบ drift ระหว่าง environments
- รายงาน missing/inconsistent keys
