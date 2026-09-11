---
name: readability-checklist
description: ปัจจัยทีมีผลต่อ readability
---

# Readability Checklist

## Goal

ตรวจสอบปัจจัยทีมีผลต่อ readability

## Checks

1. Function/section ไม่เกิน 250 บรรทัด
2. Nesting ไม่เกิน 3 ระดับ
3. Line length ไม่เกิน 120 ตัวอักษร
4. ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill names`
5. ไม่ใช้ `**` (bold markers) — ใช้ backticks แทน
6. ชื่อ variables, functions, classes บอก intent ชัดเจน
7. จัดเรียง code ตามลำดับทีอ่านง่าย

---
## Extended Full-Dimension Checklist

## 1. Structure

- [ ] logical flow top-down, early returns, guard clauses
- [ ] nesting depth ≤3, function length reasonable
- [ ] related code grouped, separation clear

## 2. Naming

- [ ] names intent-revealing, consistent vocabulary
- [ ] booleans is/has/can, functions verb-first
- [ ] no abbreviations/shadowing/misleading names

## 3. Comments And Docs

- [ ] comments explain why, not what
- [ ] no stale/misleading/commented-out code
- [ ] public APIs documented, examples where helpful

## 4. Formatting

- [ ] consistent style, line length, whitespace rhythm
- [ ] no dense walls of code, paragraphing
- [ ] idiomatic expressions for the language

## 5. Comprehension

- [ ] could new dev understand in one pass?
- [ ] magic values named, conditions decomposed
- [ ] reuse opportunities (`/consider-*`) spotted

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)

