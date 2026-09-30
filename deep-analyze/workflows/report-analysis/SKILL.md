---
name: deep-analyze-report-analysis
description: สร้าง analysis report — structure overview, root cause chains, evidence, recommendations
argument-hint: "[scope]"
related:
  - report
  - create-report-in-dot-devin
---

## Goal

แปลงผล `/deep-analyze` เป็น analysis report — structure, findings, root cause chains พร้อม evidence

## Scope

- ใช้เมื่อ `/deep-analyze` dispatch มาที่ `report` หรือเรียก standalone กับผล analysis ที่มีอยู่
- ครอบคลุม: codebase structure, findings per area, root cause chains, tool/CLI analysis
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin` ถ้า user ขอ

## Execute

### 1. Organize Analysis

> Goal: จัดผล analysis เป็นหมวดที่ตัดสินใจได้

1. จัดกลุ่ม findings ตาม area: structure, dependencies, data flow, error paths
2. สร้าง root cause chains: symptom → cause → origin สำหรับ findings สำคัญ
3. ทุก finding ผูก evidence (file:line, command output)

### 2. Build Report

> Goal: report ที่ตอบคำถาม analysis โดยตรง

1. Summary — คำตอบของ analysis question ก่อนเสมอ
2. ตาราง: `No.`, `Area`, `Finding`, `Evidence`, `Impact`
3. Root cause chains เป็น numbered steps สำหรับ findings ที่ซับซ้อน
4. Diagram/visualization reference ถ้า analysis สร้างไว้

### 3. Recommendations

> Goal: actionable output ไม่ใช่แค่บรรยาย

1. รายการ recommendations เรียงตาม impact/effort
2. ระบุ quick wins vs structural changes
3. ถ้าต้องเก็บถาวร → ทำ `/create-report-in-dot-devin`

## Rules

- คำตอบหลักต้องอยู่บนสุด — report รองรับ ไม่ใช่นำ
- ทุก claim มี evidence — ไม่มี = ติดป้าย hypothesis
- แยก "พบจริง" จาก "น่าจะเป็น" ชัดเจน

## Expected Outcome

- Analysis report ที่ตอบคำถามตรงๆ พร้อม evidence และ recommendations
