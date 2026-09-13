---
name: check-supply-chain-typosquat
description: ตรวจ typosquatting และ suspicious packages — lookalike names, dependency confusion
argument-hint: "[manifest-path]"
related:
  - review-dependencies
  - report
---

## Goal

ตรวจหา packages ที่อาจเป็นของปลอม — typosquat lookalikes, packages ใหม่ที่น่าสงสัย, dependency confusion

## Scope

- ใช้เมื่อ `/check-supply-chain` dispatch มาที่ `typosquat`/`packages` หรือเรียกเดี่ยวๆ
- Read-only: รายงาน — แก้ผ่าน `/review-dependencies`

## Execute

### 1. Lookalike Detection

> Goal: หาชื่อที่ใกล้ popular packages

1. flag names ที่ใกล้ popular packages (lodash vs lodas ฯลฯ) — edit distance
2. เทียบกับ top packages ของ registry ที่ใช้

### 2. Suspicious Signals

> Goal: flag packages ที่มีสัญญาณเสี่ยง

1. flag: packages ที่เพิ่ง publish, downloads ต่ำมาก, no repo/README, single maintainer ใหม่
2. flag packages ที่ชื่อ internal-looking แต่ resolve จาก public registry (dependency confusion)
3. บันทึก findings พร้อม evidence

### 3. Report

> Goal: ส่ง findings กลับ parent

1. ตาราง: `No.`, `Finding`, `Package/Location`, `Severity`, `Evidence`, `Fix`

## Rules

- typosquat ที่ยืนยัน = Critical; suspicious signals = High/Medium
- ไม่ flag ทุก transitive dep — เน้น direct deps และชื่อที่ใกล้ popular จริงๆ

## Expected Outcome

- Findings ของ typosquat/suspicious packages พร้อม severity และ evidence
