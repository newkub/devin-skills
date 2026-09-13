---
name: compare-alternative
description: เปรียบเทียบ subject กับ alternatives ด้วย deep-research เป็น matrix + gap list
argument-hint: "<subject> [alternatives...]"
related:
  - deep-research
  - alternative
  - choose-and-apply
  - bench-competitors
  - report
  - check-reference
  - ask-me
  - suggest-next-action
---

## Goal

เปรียบเทียบ subject (project, tool, library, feature) กับ alternatives อย่างเป็นระบบด้วย `/deep-research` ผลลัพธ์เป็น comparison matrix และ gap list ที่มี evidence ทุก claim

## Scope

ใช้เมื่อต้องการเปรียบเทียบเชิง evidence ระหว่าง subject กับ alternatives — features, capabilities, performance, pricing, DX

- ถ้าต้องหา alternatives ใหม่ที่ดีกว่า → ใช้ `/alternative` ก่อน
- ถ้าต้องเลือกตัวที่ดีที่สุดจาก options → ใช้ `/choose-and-apply` (skill นี้ผลิต matrix ไม่ตัดสินใจ)
- ถ้าเปรียบเทียบ project กับคู่แข่งเพื่อ implement ให้ดีกว่า → ใช้ `/bench-competitors` (เรียก skill นี้ข้างใน)

## Execute

### 1. Define Subject And Alternatives

> Goal: รู้ว่าเทียบอะไรกับอะไร

1. รับ `<subject>` และ list ของ alternatives จาก argument หรือ context
2. ถ้าไม่ระบุ alternatives → ทำ `/alternative` หรือ `/deep-research` เพื่อหา alternatives ที่ relevant 3-5 ราย
3. ถ้า subject หรือ scope ไม่ชัด → ใช้ `/ask-me`

### 2. Define Comparison Criteria

> Goal: รู้ว่าเทียบด้วยมิติอะไร

1. ระบุ criteria/dimensions ที่จะเทียบ เช่น features, performance, DX, pricing, ecosystem
2. ใช้ criteria ที่ measurable และ relevant กับ context
3. ถ้า criteria ไม่ชัด → ใช้ `/ask-me` หรือ default ตาม domain ของ subject

### 3. Deep Research Each Alternative

> Goal: มี evidence ทุก claim

1. ทำ `/deep-research` ต่อ alternative — official docs, changelogs, benchmarks, reviews และ user feedback
2. ทำ `/deep-research` หรือ scan codebase เพื่อยืนยัน state ปัจจุบันของ subject ถ้าข้อมูลไม่พอ
3. แยก `fact` (มีหลักฐานจาก source) ออกจาก `assumption` (คาดว่ามี)
4. ถ้า `/deep-research` หาข้อมูลไม่ได้ → stop และ report

### 4. Build Comparison Matrix

> Goal: matrix อ่านง่าย เทียบได้ทุก cell

1. ทำ `/report` สร้างตารางเปรียบเทียบ — คอลัมน์ `No.` เป็นคอลัมน์แรก
2. แต่ละ criterion ระบุ status ของ subject เทียบ alternative: `มี`, `ไม่มี`, `ดีกว่า`, `ด้อยกว่า`, `เท่ากัน`
3. ทุก cell ต้องมี source — ไม่มีหลักฐานให้ mark เป็น `assumption`

### 5. Extract Gaps And Uniques

> Goal: ได้ gap list ที่ actionable และ unique ที่ต้องรักษา

1. รวม items ที่ subject `ไม่มี` หรือ `ด้อยกว่า` เป็น gap list — แต่ละ gap ระบุ: item, alternative ที่มี, impact, effort โดยประมาณ, source
2. ระบุ unique strengths ของ subject ที่ alternatives ไม่มี — ต้องรักษาไว้
3. จัด priority: Critical, High, Medium, Nice-to-have
4. output พร้อมส่งต่อ `/create-plan-in-dot-devin`, `/choose-and-apply` หรือ `/idea-features`

## Rules

### 1. Evidence First

- ใช้ `/deep-research` ทุกครั้งที่ต้องการข้อมูล alternative — ห้ามเดาจาก memory
- ทุก claim ใน matrix ต้องมี source (official docs เป็นแหล่งหลัก)
- แยก `fact` ออกจาก `assumption` ชัดเจน — ไม่สรุปว่าด้อยกว่าถ้าไม่มีหลักฐาน
- ทุก gap ต้อง map เป็น item ที่ implement ได้ — แตก gap กว้างเป็น items ย่อย

### 2. Comparison Not Decision

- output คือ matrix + gap list เท่านั้น — ไม่เลือก "ตัวที่ดีที่สุด"
- การตัดสินใจเลือกส่งต่อ `/choose-and-apply`; การ implement ส่งต่อ plan/implement skills

### 3. Matrix Format

- ทุก table มีคอลัมน์ `No.` แรก เรียง 1, 2, 3, ...
- status ใช้ชุดเดียว: `มี`, `ไม่มี`, `ดีกว่า`, `ด้อยกว่า`, `เท่ากัน`
- criteria เดียวกันต้องเทียบทุก alternative ไม่ข้าม cell

### 4. Lightweight

- ไม่ research ลึกเกินความจำเป็น — พอสำหรับตัดสินว่ามี/ไม่มี/ดีกว่า/ด้อยกว่า
- รายงานกระชับไม่เกิน 1 หน้า A4 ต่อ alternative

## Expected Outcome

- Comparison matrix: subject vs alternatives ครบทุก criteria พร้อม status และ source ต่อ cell
- Gap list ที่ prioritized (Critical → Nice-to-have) พร้อม impact/effort
- Unique strengths ที่ต้องรักษา
- ผลลัพธ์พร้อมส่งต่อ `/choose-and-apply`, `/create-plan-in-dot-devin` หรือ `/idea-features`
