---
name: template-skills-check
description: Template สำหรับ check-* skills scan และ report
allowed-tools:
  - read
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
---

## Goal

Template สำหรับสร้าง `check-*` skills ที่ scan codebase หา issues และ report findings พร้อมคำแนะนำ

## Scope

ใช้สำหรับ skills ที่ตรวจสอบ เช่น `check-duplication`, `check-unused-deps`, `check-configuration`

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
- ถ้า issue ซับซ้อน → แนะนำ skill ที่เหมาะสม
- ถ้าไม่มีวิธีแก้ → ระบุว่าต้องวิจัยเพิ่ม

## Expected Outcome

- รายการ findings พร้อม severity และ recommendations
- ไม่มี false positives
- ผู้ใช้รู้ next action ที่ชัดเจน
