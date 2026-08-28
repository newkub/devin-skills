---
name: analyze-tech-debt
description: วิเคราะห์ technical debt และจัดลำดับการแก้ไข
argument-hint: "[path]"
related:
  - check-dead-code
  - analyze-codebase-quality
  - improve
  - refactor-to-single-responsibility
---

## Goal
ให้คะแนน technical debt และจัดลำดับ remediation ตาม impact/effort

## Scope
- ใช้ heuristics, code metrics, change history
- รองรับทุกภาษาโปรแกรม
- รายงาน score และ priority

## Execute
### 1. Collect Metrics

> Goal: Collect Metrics

1. ใช้ `scc` หรือ `cloc` นับขนาดไฟล์
2. ใช้ `code-maat` หรือ `git log` หา hot spots
3. หา long files, deep nesting, high cyclomatic complexity

### 2. Score Debt

> Goal: Score Debt

1. ให้คะแนนตาม complexity, change frequency, test coverage, TODO count
2. ระบุ hot spots ทีมี churn สูง
3. คำนวน effort โดยประมาณในการ refactor

### 3. Prioritize

> Goal: Prioritize

1. จัดลำดับตาม debt score × impact
2. แยก quick wins และ strategic debt
3. เชื่อมโยงกับ business risk ถ้าได้

### 4. Report

> Goal: Report

1. สรุป top debt items
2. แนะนำ refactoring sequence
3. ใช้ `/report-table` แสดง score, impact, effort

## Rules
### 1. Objectivity

- ใช้ metrics ไม่ใช่ความรู้สึก
- ระบุ assumption ใน scoring
- ทำซ้ำได้กับ input เดิม

### 2. No Big Bang

- แนะนำ refactor ทีละส่วน
- ไม่ rewrite ทัังหมดโดยไม่มีเหตุผล
- คง public API ถ้าเป็นไปได้

## Expected Outcome
- tech debt score ของแต่ละไฟล์/ส่วน
- priority list พร้อมเหตุผล
- แผน refactoring
