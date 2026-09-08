---
name: report-health-devin-global-skills
description: สร้าง health scorecard ของ devin global skills repo
argument-hint: "[path]"
related:
  - review-devin-global-skills
  - check-broken-skills-references
  - check-uncommit
  - check-unpush
  - check-git-logs
  - report-in-table
  - report-progress
  - suggest-next-action
  - validate-then-apply
---

## Goal

สร้าง health scorecard ของ devin global skills repository — รวม signals จาก validation, references, git state, และ structure

## Scope

ใช้กับ `%APPDATA%\devin\skills` หรือ path ที่ระบุ

- รัน `/review-devin-global-skills` ดู score, findings, grade
- รัน `/check-broken-skills-references` ตรวจ broken references
- ตรวจ git state: uncommit, unpush, last commit
- สรุปเป็นตารางเดียวพร้อม grade

## Execute

### 1. Collect Signals

> Goal: เก็บ health signals ของ skills repo

1. ทำ `/review-devin-global-skills` บันทึก `score`, `findings`, `grade`
2. ทำ `/check-broken-skills-references` บันทึก broken refs count
3. ทำ `/check-uncommit` บันทึก modified/untracked files
4. ทำ `/check-unpush` บันทึก commits ที่ยังไม่ push
5. ทำ `/check-git-logs` บันทึก last commit, frequency, staleness
6. ตรวจสอบ skills ทีเกิน 250 บรรทัดด้วย line count scan

### 2. Score Dimensions

> Goal: ให้คะแนนแต่ละมิติ

| Dimension | Weight | Signal |
|---|---|---|
| Validation | 30% | review score / findings |
| References | 25% | broken refs count |
| Git Clean | 20% | uncommit / unpush status |
| Activity | 15% | last commit, staleness |
| Structure | 10% | line count, naming conventions |

คะแนน 0-100 ต่อ dimension → overall grade A-F

### 3. Report Scorecard

> Goal: สรุปผลเป็นตาราง

1. ทำ `/report-in-table` คอลัมน์: `No.`, `Dimension`, `Score`, `Weight`, `Status`, `Notes`
2. ใช้ status symbols: `✅ pass`, `⚠️ warning`, `❌ fail`, `ℹ️ info`
3. แสดง overall grade
4. ระบุ top issues ที่กดคะแนน
5. ถ้ามีหลาย repo/round ให้ทำ `/report-progress`

### 4. Recommend

> Goal: แนะนำ action ถัดไป

1. ถ้า grade < B → แนะนำให้แก้ findings ก่อนด้วย `/resolve-errors`
2. ถ้ามี broken refs → แนะนำ `/update-references`
3. ถ้ามี uncommit → แนะนำ `/git-commit`
4. ถ้ามี unpush → แนะนำ `/git-push`
5. ถ้าต้อง apply หลาย fix อย่างปลอดภัย → แนะนำ `/validate-then-apply`
6. ทำ `/suggest-next-action`

## Rules

### 1. Evidence-Based

- ทุกคะแนนต้องมาจาก tools จริง
- ไม่ให้คะแนนด้วย assumption

### 2. Read-Only

- ไม่แก้ไฟล์ — report เท่านั้น
- ไม่ commit/push โดยอัตโนมัติ

### 3. Fast

- ไม่รัน checks ที่หนักเกินไป
- ใช้ cache ถ้ามี

## Expected Outcome

- Health scorecard ของ devin skills repo
- Grade พร้อม top issues
- Recommended next actions
