---
name: deep-analyze-by-use-scripts
description: Deep codebase analysis driven by programmatic scripts and AST tooling instead of manual reading
related:
  - deep-analyze
  - use-scripts
  - use-ast-grep
  - scan-codebase
---

## Goal

วิเคราะห์ codebase อย่างลึกซึ้งด้วย programmatic scripts — AST analysis, metrics collection, และ structured data — แทนการอ่านไฟล์ทีละไฟล์

## Scope

ใช้เมื่อ `/deep-analyze` ต้องการ quantitative metrics หรือ codebase ใหญ่เกินกว่าจะอ่าน manual — ครอบคลุม metrics, AST patterns, dependency graph, complexity และ report

ไม่รวม qualitative judgment เชิงลึกที่ต้องอ่าน business logic — ใช้ `/deep-analyze` ร่วม

## Execute

### 1. Prepare Tooling

> Goal: ยืนยัน tools ที่มีและเลือก engine ที่เหมาะ

1. ตรวจ `tools/review-codebase` และ `tools/analyze` ใน repo ก่อน — ใช้ของที่มีอยู่แล้ว
2. เลือก engine ตาม ecosystem: `oxc-parser` หรือ `@ast-grep/napi` สำหรับ JS/TS, `ast-grep scan` สำหรับ pattern rules
3. รวม metrics tools: knip (unused), biome (lint), vitest (coverage), madge (dependency graph)
4. ถ้าไม่มี tools เหล่านี้ → fallback ไป `rg` + PowerShell/bun scripts

### 2. Collect Metrics

> Goal: รวบรวม structured metrics ก่อนวิเคราะห์

1. File metrics: count, lines, size ต่อ directory/extension ด้วย script
2. Symbol metrics: exports, functions, classes ต่อไฟล์ ด้วย `ast-grep outline` หรือ oxc-parser
3. Complexity: function >50 lines, nesting >3 levels, cyclomatic >10
4. Coupling: import count ต่อไฟล์, high coupling >7 dependencies
5. Unused: dead exports/files/dependencies ด้วย knip หรือ import-graph script
6. Test coverage: test files vs source files ratio, vitest coverage ถ้ามี

### 3. Pattern Analysis

> Goal: หา patterns และ anti-patterns ด้วย AST

1. รัน `ast-grep scan` ด้วย project rules ถ้ามี `sgconfig.yml`
2. หา anti-patterns ด้วย ast-grep/napi scripts: console.log, any-cast, deep ternary, mutation ใน render
3. หา design patterns: factory, barrel exports, compound components, context providers
4. Cross-layer imports: ตรวจ imports ข้าม boundary ที่ไม่ควรมี (เช่น package → app)

### 4. Aggregate And Analyze

> Goal: รวม metrics เป็น findings ที่จัดลำดับได้

1. สร้าง structured output (JSON/table) ต่อ dimension
2. เปรียบเทียบกับ thresholds ใน Rules ข้อ 4 ของ `/deep-analyze`
3. ระบุ hotspots: ไฟล์ที่มีหลาย violations พร้อมกัน
4. Cross-reference findings กับ git churn ถ้าต้องการ (ไฟล์ที่แก้บ่อย + complexity สูง = risk)

### 5. Report

> Goal: รายงาน metrics-driven findings

1. สร้างตาราง metrics summary: files, symbols, avg length, complexity distribution
2. ตาราง findings พร้อม evidence จาก metrics (ไม่ใช่เดา)
3. Recommendations ตาม impact — ไฟล์/module ที่ควร refactor ก่อน
4. เก็บ scripts ที่ใช้ไว้ใน `tools/` หรือ report ถ้าจะใช้ซ้ำ

## Rules

### 1. Script-First

- ใช้ scripts/AST tools เป็นหลัก — manual reading เฉพาะเพื่อ verify findings
- ทุก finding ต้องมี metric หรือ AST match เป็น evidence
- ไม่เดา — ถ้า metric ไม่มี tool วัด ให้เขียน script หรือข้ามพร้อมระบุ

### 2. Reproducible

- Scripts ต้องรันซ้ำได้ผลเดิม ไม่มี side effects
- เก็บ command ที่ใช้ไว้ใน report เพื่อรันซ้ำได้

### 3. Efficiency

- Parallel รัน metrics ที่อิสระกัน
- อย่าเขียน script ใหม่ถ้า tool ที่มี (`tools/review-codebase`, `tools/analyze`) ให้ผลเดียวกัน

### 4. Thresholds

ใช้ thresholds เดียวกับ `/deep-analyze`: function >50 lines, nesting >3, complexity >10, file >300 lines, coupling >7, cohesion <0.3

## Expected Outcome

- Structured metrics ของ codebase ทั้งหมด
- Findings ที่มี evidence จาก metrics/AST ทุกรายการ
- Hotspot list ที่จัดลำดับตาม severity
- Recommendations พร้อม scripts ที่ใช้ reproduce
