---
name: deep-analyze-and-refactor
description: Deep-analyze project แล้ว refactor ตาม findings อันดับสูงสุดจนผ่าน validation
argument-hint: "[scope]"
related:
  - deep-analyze
  - refactor
  - review-refactor
  - deep-impact
  - resolve-errors
  - run-check
  - ask-me
  - report
  - suggest-next-action
---

## Goal

วิเคราะห์ project แบบลึกด้วย `/deep-analyze` แล้วนำ findings ที่มี impact สูงสุดมา refactor จริงตาม `/refactor` — ครบวงจร analyze → plan → refactor → validate ในคำสั่งเดียว

## Scope

ใช้เมื่อต้องการวิเคราะห์และปรับปรุง codebase ในคำสั่งเดียว — findings จาก analysis กลายเป็น refactor targets ทันที

- ถ้าต้องการ analyze อย่างเดียว → `/deep-analyze`
- ถ้าต้องการ refactor เป้าหมายที่รู้อยู่แล้ว → `/refactor`
- ถ้าต้องการ review แล้ว fix ทั่วไป → `/deep-review-then-fix` (canonical fix skill); quick fix ตรงๆ → `/fix`
- ถ้า analysis ต้องการ metrics จาก scripts → `/deep-analyze-by-use-scripts`

## Execute

### 1. Deep Analyze

> Goal: ได้ findings พร้อม severity และ evidence

1. ทำ `/deep-analyze` ตาม scope ที่ระบุ — เก็บ findings, root cause chains, scores
2. ถ้ามี analysis เดิมจาก session นี้ → reuse ไม่ analyze ซ้ำ
3. filter เฉพาะ findings ที่แก้ด้วย refactor ได้ — structure, SRP, duplication, coupling, naming, file placement
4. ข้าม findings ที่เป็น dependencies/security/external — ส่งต่อ `/review-dependencies` หรือ `/review-security`

### 2. Rank Refactor Targets

> Goal: เลือก targets ที่คุ้มที่สุดก่อน

1. ทำ `/prioritize` findings ตาม impact/effort — Critical → High → Medium
2. ทำ `/deep-impact` ต่อ target อันดับต้น — ระบุ consumers, blast radius, rollback path
3. สร้าง refactor plan: target, before/after, files touched, risk
4. ทำ `/report-todo` แสดง plan เป็นตารางก่อนลงมือ

### 3. Confirm Before Refactor

> Goal: user approve scope ก่อนแก้ code

1. ทำ `/ask-me` ให้ user เลือก targets ที่จะ refactor (multi-select จาก ranked list)
2. ถ้าอยู่ใน `/dont-ask-me` mode → เลือกเฉพาะ findings severity สูงสุดที่ risk ต่ำสุด
3. ถ้าไม่มี findings ที่ควร refactor → report และจบ

### 4. Refactor

> Goal: แก้ตาม plan ทีละ target

1. ทำ `/refactor` ต่อ target ที่เลือก — รักษา public API, SRP, existing style
2. target ละ commit แยกผ่าน `/git-commit` เพื่อ rollback ง่าย
3. ถ้า refactor ต้องแก้ >10 ไฟล์ → ทำ `/use-scripts`
4. ถ้าพบ error ระหว่าง refactor → `/resolve-errors` สูงสุด 3 รอบแล้ว skip target นั้น

### 5. Validate And Report

> Goal: ยืนยัน refactor ไม่ทำ regression

1. ทำ `/run-check` — lint, typecheck, scan ผ่านทั้งหมด
2. ทำ `/run-test` ถ้า project มี test suite
3. เปรียบเทียบ before/after metrics จาก Step 1 — ยืนยัน findings หายจริง
4. ทำ `/report` before/after + targets ที่ refactor/skip พร้อมเหตุผล
5. ทำ `/suggest-next-action`

## Rules

### 1. Evidence Before Refactor

- ทุก refactor target ต้องมาจาก finding ที่มี evidence — ห้าม refactor ตามความรู้สึก
- ทำ `/review-refactor` หรือ `/deep-impact` ก่อนแก้ target ที่ blast radius กว้าง

### 2. Confirm High Risk

- refactor ที่แตะ public API, shared modules หรือ >10 ไฟล์ → `/ask-me` ก่อนเสมอ
- ไม่ refactor ระหว่างที่ analysis ยังไม่เสร็จ — findings ต้องครบก่อน

### 3. Minimal Change

- แก้เฉพาะ findings ที่เลือก — ห้าม drive-by changes
- ห้ามเปลี่ยน behavior — refactor ต้อง preserve exact functionality
- ถ้า check ไม่ผ่านหลัง refactor → revert target นั้นแล้ว report

### 4. Loop Limit

- refactor-validate loop สูงสุด `3` targets ต่อครั้ง — ที่เหลือเก็บเป็น next actions
- ถ้า targets เหลือ → เสนอรัน `/deep-analyze-and-refactor` ซ้ำใน report

## Expected Outcome

- Findings จาก `/deep-analyze` ถูกแปลงเป็น refactor targets ที่ ranked แล้ว
- Targets ที่เลือกถูก refactor จริงและผ่าน `/run-check` + tests
- Report แสดง before/after metrics, targets ที่ทำและที่ skip พร้อมเหตุผล
- ไม่มี regression — ทุก refactor preserve functionality เดิม
