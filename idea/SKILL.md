---
name: idea
description: สร้างไอเดียตาม user context วิเคราะห์ gaps และ opportunities
argument-hint: "[topic]"
related:
  - review-frontend
  - report
  - then-apply
  - suggest-next-action
  - implement-to-production

---
## Goal

สร้างไอเดียตาม user context วิเคราะห์ gaps, needs และ opportunities แล้วรายงานเป็นตาราง

## Scope

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: report-idea, idea-new-skills, idea-create-devin-skills-global)

ใช้เมื่อผู้ใช้บอกว่า "ขอ idea" หรือต้องการไอเดียสำหรับงานใดๆ ครอบคลุม features, UX/UI, refactor, และ improvements

## Execute

### Subskills

| Topic | Subskill |
|-------|----------|
| ไอเดีย features ใหม่/ขยาย | `subskills/features/SKILL.md` |
| ตั้งชื่อไฟล์/directory สำหรับ idea | `subskills/naming/SKILL.md` |
| ไอเดีย merge/consolidate สิ่งที่ซ้ำซ้อน | `subskills/merge/SKILL.md` |
| ไอเดีย UX/UI improvements และ features | `subskills/uxui-features/SKILL.md` |
| ไอเดีย refactor workspace ใน monorepo | `subskills/refactor-workspace/SKILL.md` |
| ไอเดีย devin global skills ใหม่/ปรับปรุง | `subskills/new-devin-global-skills/SKILL.md` |
| skill candidates จาก session ปัจจุบัน | `subskills/devin-global-skills-from-session/SKILL.md` |
| แปลง CLI tools เป็น Devin skills | `subskills/convert-my-global-cli-to-skills/SKILL.md` |

### 1. Analyze Context

> Goal: Analyze Context

วิเคราะห์ context จาก user request:

1. ระบุประเภทไอเดียที่ต้องการ (features, UX/UI, refactor, improvements)
2. ระบุ scope จาก user context (project, module, file, workflow)
3. ระบุ pain points และ gaps จาก context

### 2. Generate Ideas

> Goal: Generate Ideas

สร้างไอเดียตาม context:

1. ถ้าเป็นไอเดีย features ให้อ่าน `subskills/features/SKILL.md` สร้างไอเดีย features ใหม่และปรับปรุง features ที่มีอยู่
2. ถ้าเป็นไอเดีย UX/UI ให้ทำ `/review-frontend` สร้างไอเดีย UX/UI improvements
3. สร้างไอเดียปรับปรุงจากเดิม (Extends)
4. สร้างไอเดียใหม่ที่ยังไม่มี (New)
5. ระบุ problem ที่แต่ละไอเดียจะ solve
6. จัดกลุ่มตาม topics

### 3. Prioritize And Report

> Goal: Prioritize And Report

จัดลำดับและรายงาน:

1. จัดลำดับตาม value vs effort
2. ระบุ quick wins และ strategic ideas
3. ทำ `/report table` แสดงผลเป็นตาราง: `No.`, `Idea`, `Type`, `Problem`, `Impact`, `Effort`
4. ถ้ามี action ต่อเนื่องจาก idea ก่อนหน้า → ใช้ `/then-apply`
4. ใช้ Impact: 🔴 สูง → 🟡 ปานกลาง → 🟢 ต่ำ
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Context-Based

- สร้างไอเดียตาม user context ไม่ใช่ generic
- ทุกไอเดียต้อง solve real problem
- ไม่สร้างไอเดียเพราะเท่ห์อย่างเดียว

### 2. Direct Execution

- ถ้าผู้ใช้บอกว่า "ทำ ... ให้" ให้ทำตาม `/implement-to-production` เลย
- ไม่ต้องทำตาม workflow ปกติถ้าผู้ใช้สั่งโดยตรง

## Expected Outcome

- ไอเดียตาม user context พร้อมจัดลำดับตาม Impact
- รายงานเป็นตารางตาม `/report`
- ทุกไอเดีย solve real problem