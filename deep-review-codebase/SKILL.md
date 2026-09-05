---
name: deep-review-codebase
description: รัน review-* ครบทุก domain แล้วรายงานผลลง GitHub issue `deep-review-codebase` (report only)
argument-hint: "[path-or-target]"
related:
  - run-review
  - improve-review-cli
  - deep-review
  - create-github-issue
  - review-quality
  - review-security
  - review-performance
  - review-architecture
  - review-stability
  - review-by-engineer
  - review-by-qa
  - review-by-stakeholder
  - report-table
  - suggest-next-action
---

## Goal

ใช้ `tools/review-codebase` CLI รัน review แบบครอบคลุมทุกมิติของ codebase แล้ววิเคราะห์ผล จัดลำดับ findings และส่งต่อไปยัง review/improve ทีเหมาะสม

## Scope

ใช้เมื่อต้องการ review ครบทุก dimension ของ codebase (architecture, quality, security, performance, delivery, UX/DX) ผ่าน `tools/review-codebase` CLI ที่ project root โดยไม่ซ้ำกับ `/run-review` ที่เน้นการรัน CLI และแปลผลสั้นๆ

ผลลัพธ์รายงานลง GitHub issue title `deep-review-codebase` ผ่าน `/create-github-issue` โดย comment แยกตาม `review-*` แต่ละ domain — report เท่านั้น ไม่แก้ไข code

## Execute

### 1. Prepare And Verify CLI

> Goal: ตรวจสอบให้ `tools/review-codebase` พร้อมรัน

1. ตรวจสอบว่า `tools/review-codebase/package.json` และ entry point มีอยู่
2. ถ้าไม่มี → ทำ `/improve-review-cli` เพื่อสร้าง CLI ก่อน
3. รัน `bun --filter tools-review-codebase lint` และ `typecheck`
4. รัน `bun --filter tools-review-codebase review-codebase --help` เพื่อยืนยันว่า CLI ใช้งานได้
5. ถ้า CLI ติดตั้ง/รันไม่ได้ → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง

### 2. Run Comprehensive Review

> Goal: รัน review CLI แบบ full output

1. รัน `bun --filter tools-review-codebase review-codebase` เพื่อดู table summary
2. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อได้ `reports/review-report.json`
3. เก็บ before score, grade, domain breakdown, findings count, analyzerErrors, falsePositiveRate
4. ถ้า CLI crash → กลับไป Step 1

### 3. Validate Output Metrics

> Goal: ตรวจสอบความครบถ้วนของผลลัพธ์

1. ตรวจว่า categories ≥ 60 ตาม `run-review` 5 domains
2. ตรวจว่า `score` / `grade` ถูกสร้างครบ
3. ตรวจว่า findings มี `severity`, `evidence`, `action` ครบ
4. ถ้า `falsePositiveRate > 20%` หรือ `analyzerErrors > 0` → ส่งต่อ `/improve-review-cli` ก่อนวิเคราะห์

### 4. Analyze By Domain

> Goal: วิเคราะห์ findings ตาม domain reference

1. อ่าน `references/review-checklist.md` และ `references/index.md`
2. แบ่ง findings ตาม 5 domains ของ `run-review`
3. ใช้ reference ที่เหมาะกับปัญหา เช่น:
   - `clean-architecture.md` สำหรับ architecture issues
   - `analyzers.md` สำหรับ analyzer gaps
   - `issue-detection.md` สำหรับ bug-prone patterns
   - `package-scripts.md` สำหรับ CLI/package issues
   - `scoring.md` สำหรับ scoring/severity ทีไม่ชัด
4. บันทึก gaps แต่ละ domain พร้อม evidence

### 5. Deep Review Findings

> Goal: ส่งต่อ findings ให้ review skills ตรง domain

1. ถ้า architecture มีปัญหา → `/review-architecture`
2. ถ้า security มีปัญหา → `/review-security`
3. ถ้า performance มีปัญหา → `/review-performance`
4. ถ้า quality/correctness มีปัญหา → `/review-quality` หรือ `/review-correctness`
5. ถ้า stability มีปัญหา → `/review-stability`
6. ถ้า UI/UX มีปัญหา → `/review-uxui`
7. ถ้า scope ใหญ่หรือไม่ชัด → `/deep-review`

### 6. Stakeholder Prioritization

> Goal: จัดลำดับ findings ตาม impact

1. รวม findings จากทุก domain
2. ถ้าต้องการมุมมอง engineer/QA → `/review-by-engineer` หรือ `/review-by-qa`
3. ถ้าต้องการมุมมอง product/user → `/review-by-stakeholder` หรือ `/review-by-product`
4. เรียงลำดับตาม severity, effort และ business impact
5. ระบุ clear owner skill สำหรับแต่ละ action

### 7. Report To GitHub Issue

> Goal: รายงานผล review ลง GitHub issue `deep-review-codebase` (report only)

1. ทำ `/report-table` สรุป score, findings, owner skill, priority
2. ทำ `/create-github-issue` ด้วย title `deep-review-codebase` และ body เป็น executive summary: score, grade, findings count ตาม domain
3. comment แต่ละ `review-*` domain ลงใน issue ด้วย `gh issue comment <issue>` — แต่ละ comment มี header ของ review skill, findings, evidence และ severity
4. บันทึก action items เป็น `TODO` หรือ plan
5. ทำ `/suggest-next-action` โดยแนะนำ `/improve-*` หรือ `/optimize-*` ทีเหมาะสม

## Rules

### 1. No Duplication

- ไม่ซ้ำกับ `/run-review` — `run-review` เน้น "รันแล้วบอกผล" ส่วน `deep-review-codebase` เน้น "รัน + วิเคราะห์ลึก + จัดลำดับ + report ลง issue"
- Report only — รายงานผลลง issue เท่านั้น ไม่แก้ไข code ใน skill นี้
- ถ้าผลลัพธ์สั้นและไม่ต้อง deep analysis → ใช้ `/run-review` แทน

### 2. Evidence First

- ทุก finding ต้องมี evidence จาก `review-report.json` หรือ screenshots
- ไม่ตัดสิน severity จาก intuition อย่างเดียว
- ตรวจ `falsePositiveRate` ก่อนประเมินผล

### 3. Minimal Dispatch

- ส่งต่อเฉพาะ domain ที่มี findings จริง
- ไม่ต้องรัน `/review-*` ทั้งหมดถ้าไม่มี findings
- ถ้าหลาย domain มี findings → ทำ `/deep-review` ครั้งเดียวแทน

### 4. Loop Limit

- ถ้า CLI รันไม่ผ่าน วนกลับไป `/improve-review-cli` สูงสุด 3 รอบ
- ถ้า `score < 70` หรือ `grade D/F` หลัง 3 รอบ → stop และ report

### 5. Safety

- ไม่แก้ business logic โดยตรงจาก skill นี้
- ไม่เพิ่ม dependencies ใหม่นอกเหนือจาก CLI workspace
- ถ้า `tools/review-codebase` ติดตั้งไม่ได้ → หยุดและแจ้ง user

## Expected Outcome

- `tools/review-codebase` CLI รันได้และ produce `reports/review-report.json`
- Review ครอบคลุม 5 domains และ 60+ categories
- Findings ถูกวิเคราะห์ตาม reference ที่ถูกต้อง
- ทุก high-priority finding ถูก route ไปยัง review/improve skill ทีเหมาะสม
- รายงานสรุปพร้อม table, score, และ next action
