---
name: bench-features
description: Benchmark features เทียบคู่แข่งด้วย deep-research เพื่อทำให้ features ดีกว่าคู่แข่ง
argument-hint: "[scope]"
related:
  - deep-research
  - bench-competitors
  - idea-features
  - deep-idea-features
  - report-table
  - create-plan-as-github-issue
  - ask-me
  - suggest-next-action
---

## Goal

Benchmark features ของ project เทียบกับคู่แข่งโดยตรงผ่าน `/deep-research` เพื่อหา feature gaps และวางแผนให้ features ดีกว่าคู่แข่ง

## Scope

- Focus เฉพาะมิติ features เท่านั้น ไม่ครอบคลุม performance, UX/UI, architecture หรือมิติอื่น
- ใช้ `/deep-research` เป็นเครื่องมือหลักในการรวบรวมและเปรียบเทียบ features ของคู่แข่ง
- ผลลัพธ์คือ feature gap analysis และ prioritized feature list ไม่ใช่ implementation
- ถ้าต้องการ benchmark ทุกมิติ → ใช้ `/bench-competitors` แทน
- ถ้าต้องการไอเดีย features ใหม่ → ใช้ `/idea-features` หรือ `/deep-idea-features`

## Execute

### 1. Identify Competitors

> Goal: ระบุคู่แข่งที่ relevant สำหรับ benchmark features

1. รับ `<scope>` จาก argument หรือ conversation context
2. ทำ `/deep-research` เพื่อระบุ direct และ indirect competitors
3. เลือก competitors 3-5 รายที่มี features ใกล้เคียงหรือเหนือกว่า
4. ถ้า scope ไม่ชัด → ใช้ `/ask-me` ก่อน

### 2. Research Competitor Features

> Goal: รวบรวม features ของคู่แข่งแต่ละราย

1. ทำ `/deep-research` ต่อ competitor เพื่อรวบรวม feature list, feature matrix, pricing tiers ที่ผูกกับ features
2. รวบรวมจาก official docs, changelogs, reviews และ user feedback
3. จัดกลุ่ม features ตามหมวด เช่น core, advanced, integrations, automation
4. ถ้า `/deep-research` หาข้อมูลไม่ได้ → stop และ report

### 3. Benchmark Feature Matrix

> Goal: เปรียบเทียบ features ของ project กับคู่แข่งเป็น matrix

1. ทำ `/deep-research` เพื่อยืนยัน features ปัจจุบันของ project ถ้า codebase ไม่พอ
2. สร้าง feature comparison matrix: project vs คู่แข่งแต่ละราย
3. ทำ `/report-table` สำหรับ matrix โดยมีคอลัมน์ `No.` เป็นคอลัมน์แรก
4. ระบุสถานะแต่ละ feature: `มี`, `ไม่มี`, `ดีกว่า`, `ด้อยกว่า`, `เท่ากัน`
5. บันทึกผลเป็น `comparison-features.md`

### 4. Identify Feature Gaps

> Goal: หา features ที่คู่แข่งมีแต่ project ไม่มีหรือด้อยกว่า

1. รวม features ที่ project `ไม่มี` และ `ด้อยกว่า` เป็น gap list
2. จัดลำดับ gap ตาม impact ต่อผู้ใช้และความสำคัญของตลาด
3. ระบุ unique features ของ project ที่คู่แข่งไม่มีเพื่อรักษาไว้
4. แต่ละ gap ระบุ: feature, competitor ที่มี, impact, effort โดยประมาณ

### 5. Plan Feature Improvements

> Goal: วางแผนให้ features ดีกว่าคู่แข่ง

1. สร้าง prioritized feature list: Critical, High, Medium, Nice-to-have
2. ทำ `/create-plan-as-github-issue` จาก feature list ถ้า user ต้องการ implement
3. ทำ `/suggest-next-action` โดยแนะนำ `/deep-idea-features` ถ้าต้องการขยายไอเดียต่อ

## Rules

### 1. Features Only

- Benchmark เฉพาะมิติ features เท่านั้น
- ไม่เปรียบเทียบ performance, security, UX/UI, architecture, pricing model หรือมิติอื่น
- ถ้าต้องการมิติอื่น → ส่งต่อ `/bench-competitors`

### 2. Research Discipline

- ใช้ `/deep-research` ทุกครั้งที่ต้องการข้อมูลคู่แข่ง ไม่เดาจาก memory
- อ้างอิงแหล่งข้อมูลของแต่ละ feature claim
- รายงานกระชับไม่เกิน 1 หน้า A4 ต่อ competitor

### 3. Evidence First

- ทุก feature gap ต้องมี evidence จาก competitor docs หรือ reviews
- ไม่สรุปว่า project ด้อยกว่าถ้าไม่มีหลักฐาน
- แยก `fact` (คู่แข่งมีจริง) ออกจาก `assumption` (คาดว่ามี)

### 4. Actionable Output

- ทุก gap ต้อง map เป็น feature ที่ implement ได้
- ไม่รายงาน gap ที่กว้างเกินไปโดยไม่แตกเป็น feature ย่อย
- ผลลัพธ์ต้องพร้อมส่งต่อ `/create-plan-as-github-issue` หรือ `/deep-idea-features`

## Expected Outcome

- Feature comparison matrix เทียบ project กับคู่แข่ง 3-5 ราย
- Prioritized feature gap list พร้อม impact และ effort
- Unique features ที่ต้องรักษาไว้ถูกระบุชัดเจน
- พร้อมส่งต่อ plan หรือ idea generation โดยไม่ implement ใน skill นี้
