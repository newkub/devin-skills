---
name: check-secrets-report-inventory
description: สร้าง secrets inventory report — keys/vars ที่ใช้, ที่ขาด, ที่หลุด — พร้อม redaction rules
argument-hint: "[scope]"
related:
  - report
  - follow-secret-manager
  - open-web-for-config-secret
---

## Goal

สร้าง secrets inventory report จาก findings ของ `check-secrets` subskills — ครอบคลุม env vars, hardcoded values, leaks — ด้วย redaction ที่ปลอดภัย

## Scope

- ใช้เมื่อ `/check-secrets` dispatch มาที่ `report`/`inventory` หรือเรียก standalone
- Output: inventory table ในแชท — ถ้าต้อง persistent artifact ใช้ `/create-report-in-dot-devin` (ระวัง: artifact ต้องไม่มี secret values)

## Execute

### 1. Aggregate Findings

> Goal: รวมผลจากทุก secrets check

1. รวม findings จาก `env-vars`, `hardcoded-values`, `secrets-leak` subskills (หรือเฉพาะที่รัน)
2. จัดกลุ่ม: `required-but-missing`, `present-and-used`, `hardcoded`, `leaked`, `unused`

### 2. Build Inventory

> Goal: inventory ที่ชี้จุดกรอก/แก้ได้โดยไม่เปิดเผยค่า

1. ตาราง: `No.`, `Key`, `Location`, `Status`, `Used By`, `Action`
2. Redaction rules: แสดงแค่ key name + type (`sk_...`, `whsec_...`) — ห้าม print value แม้แต่ส่วนหนึ่ง
3. สำหรับ missing env vars → สร้าง inventory table ชี้ key/URL/จุดกรอกแล้วแนะนำ `/open-web-for-config-secret`

### 3. Report

> Goal: สรุป secrets posture

1. Counts ต่อ status + verdict (`clean` / `gaps` / `leaks-found`)
2. leaks = Critical เสมอ — แนะนำ rotate + ย้ายไป `/follow-secret-manager`
3. ทำ `/suggest-next-action`

## Rules

- ห้าม print secret values ใน report ทุกกรณี — mask ทุกอย่างยกเว้น key name
- leaked secrets → ระบุว่า commit ไหน/ไฟล์ไหนเพื่อ track rotation
- ถ้า persist artifact → double-check ว่าไม่มีค่าจริงในไฟล์ report

## Expected Outcome

- Inventory table พร้อม status ต่อ key + actions
- Verdict secrets posture โดยไม่เปิดเผยค่าใดๆ
