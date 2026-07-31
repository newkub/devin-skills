---
name: template-workflows-analyze
description: Template สำหรับสร้าง analyze-* workflows ที่วิเคราะห์ codebase ด้วย scripts และ tools
---

## Goal

Template สำหรับสร้าง `analyze-*` workflows ที่วิเคราะห์ codebase ด้วย scripts, tools และหลายมิติ

## Scope

ใช้สำหรับ workflows ที่วิเคราะห์ เช่น `analyze-project`, `analyze-code-structure`, `deep-analyze-by-use-scripts`

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

1. ทำ `/report-format-table` สำหรับ summary
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
- ใช้ health CLI สำหรับ project health

### 3. Completeness

- ครอบคลุมทุก workspaces ใน monorepo
- ไม่ข้าม dependencies และ configs
- รวม external references ถ้าเกี่ยวข้อง

## Expected Outcome

- Analysis report พร้อม evidence และ findings
- จัดลำดับตาม impact
- ผู้ใช้รู้ next action ที่ชัดเจน

## Example Template

```markdown
---
title: Analyze Project
description: วิเคราะห์โปรเจกต์พื้นฐานด้วย tools ที่เหมาะสม
auto_execution_mode: 3
related:
  - /scan-codebase
  - /use-scripts
  - /report-format-table
---

## Goal
วิเคราะห์ project structure, dependencies และ patterns

## Scope
ใช้สำหรับ project analysis ในทุก workspace

## Execute

### 1. Gather Data
รวบรวมข้อมูล

> Goal: มีข้อมูลครบ

1. ทำ `/scan-codebase`, อ่าน manifests, อ่าน configs

### 2. Analyze
วิเคราะห์

> Goal: เข้าใจ patterns และ issues

1. วิเคราะห์ structure และ dependencies
2. ระบุ strengths, weaknesses, gaps

### 3. Report
รายงาน

> Goal: Report ชัดเจน

1. ทำ `/report-format-table`
2. ทำ `/suggest-next-action`

## Rules

### 1. Data-Driven
- ทุก finding ต้องมี evidence

### 2. Use Scripts
- ถ้าซับซ้อน → ทำ `/use-scripts`

## Expected Outcome
- Analysis report พร้อม evidence และ findings
```
