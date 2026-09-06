---
name: check-repo-hygiene
description: ตรวจ repo มี LICENSE, README, SECURITY.md, CODEOWNERS และ .github essentials ครบ
argument-hint: "[path]"
related:
  - follow-github
  - follow-dot-github
  - follow-lib-license-md
  - update-readme-md
  - update-contributing-md
  - check-dead-link
  - check-secrets-leak
  - report-table
  - improve-onboarding
  - check-file-encoding
---

## Goal

Audit repository hygiene: ตรวจว่า repo มีไฟล์และ config มาตรฐานครบ — LICENSE, README, CONTRIBUTING, SECURITY, CODEOWNERS, .gitignore, .github templates และ repo metadata

## Scope

- ใช้กับ repo ใดก็ได้ (local หรือ GitHub ผ่าน `gh`)
- ครอบคลุม required files, `.github/` structure, repo metadata และ branch protection basics
- Read-only: รายงาน findings พร้อม suggestion เท่านั้น

## Execute

### 1. Identify Repo

> Goal: ระบุ repo ที่จะตรวจ

1. รับ `path` จาก argument — default: current directory
2. ยืนยันว่าเป็น git repo และระบุ remote (ถ้ามี)
3. ถ้าเป็น GitHub repo → ดึง metadata ด้วย `gh repo view --json` เพิ่ม

### 2. Check Required Files

> Goal: ไฟล์มาตรฐานครบ

1. ตรวจ root files: `README.md`, `LICENSE`, `CONTRIBUTING.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`
2. ตรวจ `.gitignore` มีและครอบ artifacts หลัก (`node_modules`, `dist`, `.env`)
3. ตรวจ `.editorconfig` หรือ formatter config ถ้า project มีหลาย contributors
4. แต่ละไฟล์ที่มี → ตรวจว่าไม่ว่างหรือ placeholder ล้วน

### 3. Check .github Structure

> Goal: `.github/` มี essentials

1. ตรวจ `.github/ISSUE_TEMPLATE/` และ `pull_request_template.md`
2. ตรวจ `.github/workflows/` มี CI อย่างน้อยหนึ่ง workflow
3. ตรวจ `CODEOWNERS`, `dependabot.yml` หรือ `renovate.json`, `FUNDING.yml` (optional)
4. ระบุไฟล์ที่ขาดและไฟล์ที่ stale (template ไม่ตรง project จริง)

### 4. Check Metadata And Safety

> Goal: repo metadata และความปลอดภัยพื้นฐาน

1. ถ้ามี `gh` → ตรวจ description, topics, homepage, license field, default branch
2. ทำ `/check-secrets-leak` แบบเร็วเพื่อยืนยันไม่มี secrets ใน repo
3. ตรวจ branch protection บน default branch (ถ้าเข้าถึงได้)
4. ทำ `/check-dead-link` เฉพาะ README/docs หลักถ้ามีเวลา

### 5. Report

> Goal: scorecard ที่แก้ไขได้ทันที

1. ทำ `/report-table` คอลัมน์: `No.`, `Item`, `Status`, `Severity`, `Suggestion`
2. Status: `present`, `missing`, `empty`, `stale`
3. สรุป hygiene score (present/total) และ top gaps
4. แนะนำ skills ที่แก้แต่ละ gap: `/update-readme-md`, `/follow-lib-license-md`, `/follow-dot-github`

## Rules

### 1. Evidence-Based

- ทุก finding ต้องชี้ไปไฟล์/field จริง — ไม่เดา
- `empty` = ไฟล์มีแต่เนื้อหา placeholder หรือว่าง

### 2. Read-Only

- ไม่สร้างหรือแก้ไฟล์ใน skill นี้ — ส่งต่อ skill ที่เกี่ยวข้อง
- ไม่เปลี่ยน repo settings บน remote

### 3. Proportional

- repo private/experiment ไม่ต้องครบทุก item — ระบุ context ใน report
- weight สูงสุดให้ LICENSE, README, .gitignore, CI workflow

- ใช้ /follow-github ถ้าจำเป็น
- ใช้ /follow-dot-github ถ้าจำเป็น
- ใช้ /check-secrets-leak ถ้าจำเป็น

## Expected Outcome

- Hygiene scorecard ครบพร้อม status ต่อ item
- รายการ gaps เรียงตามความสำคัญพร้อม skill ที่แก้ได้
- พร้อมส่งต่อ `/follow-github` หรือ skills เฉพาะทาง
