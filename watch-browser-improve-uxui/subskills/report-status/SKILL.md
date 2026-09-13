---
name: watch-browser-improve-uxui-report-status
description: สร้าง UX/UI watch report — findings per route, improvements applied, before/after
argument-hint: "[session-or-url]"
related:
  - report
  - create-report-in-dot-devin
  - review-uxui
---

## Goal

แปลง session ของ `/watch-browser-improve-uxui` เป็น report — UX/UI findings ต่อ route, improvements ที่ apply, before/after evidence

## Scope

- ใช้เมื่อ `/watch-browser-improve-uxui` dispatch มาที่ `report`/`status` หรือเรียกหลัง session จบ
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Collect Findings Per Route

> Goal: รวม findings + improvements

1. รวม findings ต่อ route/viewport (desktop, mobile)
2. ต่อ finding: category (contrast, responsive, states, spacing), severity, status (fixed/pending)
3. รวม screenshots before/after ต่อ fix ที่ apply

### 2. Build Report

> Goal: ตอบว่า UX/UI ดีขึ้นแค่ไหน

1. ตาราง: `No.`, `Route`, `Finding`, `Category`, `Severity`, `Status`
2. Summary: findings by category, fixed vs pending
3. Screenshots เป็น path references

### 3. Verdict

> Goal: สรุป UX/UI posture

1. Verdict: `improved` / `findings-pending` / `no-issues`
2. pending findings → แนะนำ `/improve-uxui` subskill ที่ตรง category
3. ถ้าต้องเก็บถาวร → ทำ `/create-report-in-dot-devin`

## Rules

- ทุก finding มี screenshot หรือ DOM evidence — ไม่ flag จากความรู้สึก
- responsive issues ต้องระบุ viewport ที่พัง
- severity: blocks-usage > visual-bug > polish

## Expected Outcome

- UX/UI report พร้อม per-route findings + fixed/pending split
