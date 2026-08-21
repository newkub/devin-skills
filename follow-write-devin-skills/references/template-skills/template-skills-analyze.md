---
name: template-skills-analyze
description: Template สำหรับ analyze-* skills วิเคราะห์ codebase
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
  - run_subagent
triggers:
  - user
  - model
---

## Goal

Template สำหรับสร้าง `analyze-*` skills ที่วิเคราะห์ codebase ด้วย scripts, tools และหลายมิติ

## Scope

ใช้สำหรับ skills ที่วิเคราะห์ เช่น `analyze-project`, `analyze-code-structure`, `deep-analyze-by-use-scripts`

## Execute

### 1. Gather Data

รวบรวมข้อมูลจาก codebase

> Goal: มีข้อมูลครบเพื่อวิเคราะห์

1. ทำ `/scan-codebase`, อ่าน package manifests, อ่าน configs และ key files
2. ถ้าต้องประมวลผลซับซ้อน → ทำ `/use-scripts`
3. ถ้าข้อมูลไม่พอ → ใช้ `/deep-analyze` เพิ่มเติม

### 2. Analyze

วิเคราะห์ข้อมูลที่รวบรวม

> Goal: เข้าใจ patterns, issues และ opportunities

1. วิเคราะห์ structure, dependencies และ patterns
2. ระบุ strengths, ระบุ weaknesses, ระบุ gaps
3. หา root causes ของ issues
4. จัดกลุ่ม findings ตาม category

### 3. Report

รายงานผลการวิเคราะห์

> Goal: Report ชัดเจน อ่านง่าย ลำดับถูกต้อง

1. ทำ `/report-table` สำหรับ summary
2. จัดลำดับ findings ตาม impact
3. ระบุ evidence สำหรับทุก finding
4. ทำ `/suggest-next-action`

## Rules

### 1. Data-Driven

- ทุก finding ต้องมี evidence จาก codebase
- ถ้าเป็น assumption → ระบุชัดเจน
- ไม่สรุปโดยไม่มีข้อมูล

### 2. Use Scripts

- ถ้าประมวลผลซับซ้อน → ทำ `/use-scripts`
- ใช้ ast-grep สำหรับ structural analysis
- ใช้ review CLI สำหรับ project review

### 3. Completeness

- ครอบคลุมทุก workspaces ใน monorepo
- ไม่ข้าม dependencies และ configs
- รวม external references ถ้าเกี่ยวข้อง

## Expected Outcome

- Analysis report พร้อม evidence และ findings
- จัดลำดับตาม impact
- ผู้ใช้รู้ next action ที่ชัดเจน
