---
name: choose-and-apply
description: ให้เลือกระหว่าง N ทางเลือก แล้ว apply สิ่งที่แนะนำตาม context
argument-hint: "[options...]"
related:
  - ask-me
  - rethink
  - then-apply
  - follow-your-suggestion
  - report-in-table
  - suggest-next-action
  - manage
---

## Goal

รับทางเลือก N รายการ จาก user หรือ context แล้ววิเคราะห์ เลือก ทำตามสิ่งที่เหมาะสมทีสุด

## Scope

ใช้เมื่อมีหลายทางเลือก (tools, libraries, approaches, actions) และต้องการให้ agent ช่วยเลือกแล้วดำเนินการต่อ

- รับ options จาก argument หรือ context
- วิเคราะห์ข้อดี/ข้อเสียของแต่ละทางเลือก
- แนะนำตัวเลือกทีดีทีสุดพร้อมเหตุผล
- ถาม user ยืนยันก่อน apply
- Apply ตามทีเลือกโดยไม่ทิ้ง context

## Execute

### 1. Capture Options

> Goal: รู้ว่ามีทางเลือกอะไรบ้าง

1. รับ options จาก argument หรือ context
2. ถ้าไม่มี options → ทำ `/ask-me` ให้ user ระบุ
3. ถ้ามี option เดียว → ใช้ `/follow-your-suggestion`

### 2. Analyze Options

> Goal: ประเมินแต่ละทางเลือก

1. วิเคราะห์ criteria: scope, cost, effort, risk, compatibility, maintainability
2. ทำ `/rethink` ถ้าทางเลือกใกล้เคียงกันหรือมี trade-off สูง
3. ระบุ option ทีแนะนำพร้อมเหตุผล

### 3. Present And Confirm

> Goal: ให้ user ตัดสินใจ

1. ทำ `/report-in-table` คอลัมน์: `No.`, `Option`, `Pros`, `Cons`, `Score`, `Recommended`
2. ระบุ option ทีแนะนำด้วย `✅` ใน column `Recommended`
3. ถ้า high-risk หรือ user ไม่แน่ใจ → ทำ `/ask-me`
4. ถ้า user ยืนยัน → ไป step ถัดไป

### 4. Apply Selected Option

> Goal: ดำเนินการตาม option ทีเลือก

1. ถ้าต้องทำต่อเนื่องจาก context ก่อนหน้า → ใช้ `/then-apply`
2. ถ้าเป็น action เดียว → ใช้ `/follow-your-suggestion` หรือ `/continue`
3. ถ้าต้องจัดการหลาย step → ใช้ `/manage`
4. ถ้า apply แล้วส่งผลหลายที → ใช้ `/all-this-patterns`

### 5. Validate And Report

> Goal: ยืนยันว่า apply สำเร็จ

1. ทำ `/run-check` หรือ `/deep-validate` ตาม nature ของ option
2. ทำ `/report-in-table` สรุป: `No.`, `Option`, `Status`, `Output`
3. ทำ `/suggest-next-action`

## Rules

- ไม่ apply โดยไม่ได้รับ user confirm ถ้าเป็น high-risk
- ทุก option ต้อง evaluate ตาม context จริง
- ถ้า options ไม่ชัดหรือขาด context → ถามก่อน
- เก็บ context เดิมไว้ตลอดการ apply

## Expected Outcome

- ตารางเปรียบเทียบ options ครบถ้วน
- Option ทีแนะนำพร้อมเหตุผล
- ผลจากการ apply ตาม option ทีเลือก
- ทราบ next action
