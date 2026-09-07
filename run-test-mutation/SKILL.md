---
name: run-test-mutation
description: รัน mutation testing วัดว่า test suite จับ bugs จริง — mutant survival rate ต่อ module
argument-hint: "[path-or-module]"
related:
  - follow-tool-stryker-mutator
  - improve-test-everything
  - report-table
---

## Goal

วัดคุณภาพ test suite ด้วย mutation testing — แก้ code เล็กน้อย (mutants) แล้วดูว่า tests จับได้ไหม — เพื่อหา code ที่ coverage สูงแต่ tests ไม่ verify จริง

## Scope

- Tools ตาม stack: Stryker (JS/TS), mutants-rs (Rust), mutmut (Python), go-mutesting (Go)
- ครอบคลุม: mutation score (killed/survived/timeout), surviving mutants analysis, weak assertions
- ช้าโดยธรรมชาติ — scope ให้แคบ (module/PR diff) ไม่รันทั้ง repo

## Execute

### 1. Select Tool And Scope

> Goal: เลือก mutation tool ตาม ecosystem

1. ตรวจ stack จาก manifest — เลือก tool ที่ตรง (`/follow-tool-stryker-mutator` สำหรับ JS/TS)
2. จำกัด scope เสมอ: เลือก module/files ที่สำคัญหรือที่เพิ่งเปลี่ยน — mutation testing ทั้ง repo ใช้เวลานานมาก
3. ติดตั้ง tool ถ้ายังไม่มี (`npx stryker`, `cargo install cargo-mutants`)

### 2. Run Baseline

> Goal: รัน mutation testing บน scope ที่เลือก

1. รันกับ test suite ปัจจุบัน — ตั้ง timeout ที่เหมาะ
2. เก็บผล: total mutants, killed, survived, timeout, no-coverage
3. flag files ที่ mutation score ต่ำผิดปกติ

### 3. Analyze Survivors

> Goal: เข้าใจ mutants ที่รอด

1. ตรวจ surviving mutants — แต่ละตัวคือ code change ที่ tests ไม่จับ
2. จัดประเภท: missing assertions (test รันแต่ไม่ assert), equivalent mutants (เปลี่ยนแล้วเหมือนเดิม), boundary gaps
3. แยก `no-coverage` mutants — code ที่ tests ไม่แตะเลย

### 4. Report

> Goal: สรุป mutation score พร้อม weak spots

1. ใช้ `/report-table`: `No.`, `File`, `Mutants`, `Killed`, `Survived`, `Score %`, `Weakest Area`
2. รายงาน top surviving mutants พร้อม suggested test cases
3. แนะนำ `/improve-test-everything` สำหรับ files ที่ score ต่ำ

## Rules

### 1. Scoped Always

- ห้ามรัน mutation ทั้ง repo — scope เป็น module/diff เสมอ
- แจ้ง user เรื่องเวลาที่ใช้ — mutation testing ช้าโดยธรรมชาติ

### 2. Quality Over Score

- เป้าหมายคือหา weak tests ไม่ใช่ตัวเลขสูง — surviving mutants สำคัญกว่า score
- equivalent mutants (ไม่มีความหมายต่าง) ให้ mark ไม่ใช่นับเป็นปัญหา

### 3. Read-Only On Source

- mutation tool แก้ code ชั่วคราวใน sandbox — ห้ามแก้ source จริง
- verify working tree clean หลังรัน

## Expected Outcome

- Mutation score ต่อ scoped module พร้อม breakdown
- รายการ surviving mutants = test gaps ที่จริง
- คำแนะนำ test cases ที่ควรเพิ่ม
