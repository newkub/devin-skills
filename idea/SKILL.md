---
name: idea
description: สร้างไอเดียตาม user context วิเคราะห์ gaps และ opportunities
---

## Goal

สร้างไอเดียตาม user context วิเคราะห์ gaps, needs และ opportunities แล้วรายงานเป็นตาราง

## Scope

ใช้เมื่อผู้ใช้บอกว่า "ขอ idea" หรือต้องการไอเดียสำหรับงานใดๆ ครอบคลุม features, UX/UI, refactor, และ improvements

## Execute

### 1. Analyze Context

วิเคราะห์ context จาก user request:

1. ระบุประเภทไอเดียที่ต้องการ (features, UX/UI, refactor, improvements)
2. ระบุ scope จาก user context (project, module, file, workflow)
3. ระบุ pain points และ gaps จาก context

### 2. Generate Ideas

สร้างไอเดียตาม context:

1. ถ้าเป็นไอเดีย features ให้ทำ `/idea-features` สร้างไอเดีย features ใหม่และปรับปรุง features ที่มีอยู่
2. ถ้าเป็นไอเดีย UX/UI ให้ทำ `/idea-uxui` สร้างไอเดีย UX/UI improvements
3. สร้างไอเดียปรับปรุงจากเดิม (Extends)
4. สร้างไอเดียใหม่ที่ยังไม่มี (New)
5. ระบุ problem ที่แต่ละไอเดียจะ solve
6. จัดกลุ่มตาม topics

### 3. Prioritize And Report

จัดลำดับและรายงาน:

1. จัดลำดับตาม value vs effort
2. ระบุ quick wins และ strategic ideas
3. ทำ `/report` พร้อม `/report-format-table` เพื่อแสดงผลเป็นตาราง: #, Idea, Type, Problem, Impact, Effort
4. ใช้ Impact: 🔴 สูง → 🟡 ปานกลาง → 🟢 ต่ำ
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Context-Based

- สร้างไอเดียตาม user context ไม่ใช่ generic
- ทุกไอเดียต้อง solve real problem
- ไม่สร้างไอเดียเพราะเท่ห์อย่างเดียว

### 2. Direct Execution

- ถ้าผู้ใช้บอกว่า "ทำ ... ให้" ให้ทำตาม `/realize-implementation` เลย
- ไม่ต้องทำตาม workflow ปกติถ้าผู้ใช้สั่งโดยตรง

## Expected Outcome

- ไอเดียตาม user context พร้อมจัดลำดับตาม Impact
- รายงานเป็นตารางตาม `/report`
- ทุกไอเดีย solve real problem
