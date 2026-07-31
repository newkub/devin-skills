---
name: template-workflows-check
description: Template สำหรับสร้าง check-* workflows ที่ scan และ report findings
---

## Goal

Template สำหรับสร้าง `check-*` workflows ที่ scan codebase หา issues และ report findings พร้อมคำแนะนำ

## Scope

ใช้สำหรับ workflows ที่ตรวจสอบ เช่น `check-duplication`, `check-unused-deps`, `check-configuration`

## Execute

### 1. Define Scope

กำหนดขอบเขตการตรวจสอบ

> Goal: รู้ว่าจะตรวจสอบอะไร ที่ไหน

1. ระบุ target: file, directory, package หรือทั้ง project
2. ระบุ criteria และ pass/fail conditions
3. ถ้า target ไม่มีอยู่ → stop และ report
4. ถ้าเป็น monorepo → ตรวจสอบทุก workspaces หรือระบุ workspace

### 2. Scan

สแกน target ตาม criteria

> Goal: พบ issues ทั้งหมดที่เกี่ยวข้อง

1. ทำ `/scan-codebase` เพื่อค้นหา patterns ที่เกี่ยวข้อง
2. ใช้ tools ที่เหมาะสม (grep, ast-grep, jscpd, knip) ตาม criteria
3. จับผลลัพธ์เป็น list ของ findings
4. ถ้าใช้ scripts ซับซ้อน → ทำ `/use-scripts`

### 3. Analyze Findings

วิเคราะห์ findings

> Goal: เข้าใจ severity และ root cause ของแต่ละ finding

1. จัดประเภท findings: Critical, Warning, Info
2. ระบุ root cause, กรอง false positives
3. จัดลำดับตาม impact

### 4. Report

รายงานผลและคำแนะนำ

> Goal: ผู้ใช้รู้ issues และวิธีแก้

1. สร้าง report เป็นตาราง: file, line, issue, severity, recommendation
2. ถ้ามี critical issues → แนะนำให้ทำ `/resolve-errors`
3. ถ้าไม่พบ issues → report "no issues found"
4. ทำ `/suggest-next-action`

## Rules

### 1. Accuracy

- กรอง false positives ก่อน report
- ระบุ file และ line number ชัดเจน
- ถ้าไม่แน่ใจ → ระบุระดับความไม่แน่นอน

### 2. Completeness

- ตรวจสอบครบทุก workspaces ใน monorepo
- ไม่ข้าม files ที่ gitignored
- รวม dependencies ในการตรวจสอบถ้าเกี่ยวข้อง

### 3. Actionable

- ทุก finding ต้องมี recommendation
- ถ้า issue ซับซ้อน → แนะนำ workflow ที่เหมาะสม
- ถ้าไม่มีวิธีแก้ → ระบุว่าต้องวิจัยเพิ่ม

## Expected Outcome

- รายการ findings พร้อม severity และ recommendations
- ไม่มี false positives
- ผู้ใช้รู้ next action ที่ชัดเจน

## Example Template

```markdown
---
title: Check Duplication
description: ตรวจจับ code duplication ด้วย jscpd
auto_execution_mode: 3
related:
  - /scan-codebase
  - /use-scripts
  - /report-status
---

## Goal
ตรวจจับ duplicate code ใน project

## Scope
ใช้สำหรับทุก workspace ใน monorepo

## Execute

### 1. Define Scope
กำหนดขอบเขต

> Goal: รู้ว่าจะตรวจสอบที่ไหน

1. ระบุ target directories
2. กำหนด threshold (เช่น 5+ lines)

### 2. Scan
สแกนหา duplicates

> Goal: พบ duplicates ทั้งหมด

1. รัน jscpd บน target
2. จับผลเป็น list

### 3. Analyze Findings
วิเคราะห์ผล

> Goal: เข้าใจ severity

1. จัดประเภท: Critical >50 lines, Warning 20-50, Info <20
2. กรอง false positives

### 4. Report
รายงาน

> Goal: ผู้ใช้รู้ issues

1. สร้างตาราง: file, line, duplicate, severity
2. ทำ `/suggest-next-action`

## Rules

### 1. Accuracy
- กรอง false positives ก่อน report

### 2. Completeness
- ตรวจครบทุก workspaces

## Expected Outcome
- รายการ duplicates พร้อม severity
```
