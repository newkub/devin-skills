---
name: restore-files-verify-restore
description: ยืนยันไฟล์ที่ restore ตรงกับ source — hash/content match, paths ถูก, ไม่มี partial restore
argument-hint: "[restored-paths]"
related:
  - report
---

## Goal

ยืนยันหลัง restore ว่าไฟล์กลับมาครบและตรงกับ source จริง — fidelity check ที่ restore skills ทุกตัวควรเรียกต่อท้าย

## Scope

- ใช้เมื่อ `/restore-files` dispatch มาที่ `verify` หรือเรียกหลัง restore เสร็จ
- ครอบคลุม: file presence, content fidelity (hash), expected paths, partial restore detection
- Read-only: ตรวจสอบ — ไม่ re-restore

## Execute

### 1. Check Presence

> Goal: ทุกไฟล์ที่ควร restore อยู่ครบ

1. เทียบรายการไฟล์ที่ restore กับ expected list (จาก restore output หรือ source manifest)
2. flag ไฟล์ที่ขาดหรือถูก restore ไปผิด path

### 2. Check Fidelity

> Goal: content ตรงกับ source

1. ถ้า restore จาก git → เทียบ `git hash-object <file>` กับ blob ใน commit ต้นทาง
2. ถ้า restore จาก copy/backup → เทียบ `Get-FileHash` SHA256 กับ source
3. ถ้า restore จาก Devin history → เทียบ content กับ recorded snapshot
4. flag ไฟล์ที่ hash ไม่ตรง — partial write หรือ encoding drift

### 3. Check Consistency

> Goal: restored files ทำงานร่วมกับ repo ได้

1. ถ้า restore เป็น code → `bun run typecheck` หรือ build best-effort
2. ตรวจ imports/references ที่ไฟล์ใหม่อ้างถึงยังมีอยู่
3. flag restored file ที่อ้างถึง paths/deps ที่ไม่มีแล้ว

### 4. Report

> Goal: สรุป restore fidelity

1. ใช้ `/report` คอลัมน์: `No.`, `Path`, `Status`, `Expected`, `Actual`, `Notes`
2. Verdict: `faithful` / `partial` / `mismatched` พร้อมรายการที่ต้อง re-restore

## Rules

- hash mismatch = รายงานทันที — ห้ามถือว่า restore สำเร็จ
- ถ้า source ไม่มีให้เทียบ (เช่น deleted file ไม่มีต้นฉบับเหลือ) → ระบุ verification method ที่ใช้แทน (e.g. git show)
- ไม่แก้ไฟล์ที่ restore มา — ถ้าต้องแก้ report กลับให้ restore ใหม่

## Expected Outcome

- ตาราง fidelity ต่อไฟล์พร้อม verdict
- รายการไฟล์ที่ต้อง re-restore ถ้า partial
