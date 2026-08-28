---
name: idea-refactor-workspace
description: สร้างไอเดีย refactor workspace ใน monorepo ด้วย /refactor-all-workspace และ /follow-single-responsibility
related:
  - refactor-all-workspace
  - follow-single-responsibility
  - refactor-workspace
  - report-table
  - suggest-next-action
---

## Goal

สร้างไอเดียการ refactor workspace ใน monorepo โดยวิเคราะห์ SRP, แยก responsibility ของแต่ละ workspace member แล้วส่งต่อไปยัง `/refactor-all-workspace` เพื่อ deep refactor

## Scope

ใช้เมื่อต้องการไอเดียหรือแผนการ refactor workspaces ทั้งหมดใน monorepo ก่อนลงมือ implement

## Execute

### 1. Analyze Workspaces

> Goal: เข้าใจโครงสร้างและปัญหาของ workspaces

1. ทำ `/analyze-project` เพื่อดู workspace configuration และ package manifest
2. ทำ `/list-workspaces` เพื่อแสดงรายการ workspaces พร้อม dependency graph
3. ทำ `/check-circular-dependencies` เพื่อหา circular dependencies ระหว่าง workspaces
4. ทำ `/check-long-files` และ `/review-quality` เพื่อหา code smells
5. ระบุ workspaces ที่มีหลาย reasons to change, coupling สูง หรือ cohesion ต่ำ

### 2. Decompose Responsibilities

> Goal: แยกงาน refactor ออกเป็นหน่วยย่อยทีละอย่าง

1. ทำ `/follow-single-responsibility` เพื่อแยกปัญหาและคำสั่่ง refactor ออกเป็นรายการ numbered list
2. แต่ละข้อต้องมี single responsibility: เป็น workspace เดียว, concern เดียว หรือ task เดียว
3. เรียงลำดับตาม dependency direction: foundation → shared → apps
4. ถ้าข้อไหนซับซ้อน → แบ่งย่อยอีก

### 3. Generate Refactor Ideas

> Goal: สร้างไอเดีย refactor ที actionable

1. สร้างไอเดียแบ่งตามประเภท:
   - `Split` — แยก workspace ที่มีหลาย responsibility
   - `Merge` — รวม workspaces ที่เปลี่ยนด้วยกันและ deploy ด้วยกัน
   - `Relocate` — ย้ายไฟล์ไปยัง workspace ที่ถูกต้อง
   - `Extract` — ดึง shared code ออกมาเป็น workspace ใหม่
2. ระบุ problem ที่แต่ละไอเดียจะแก้
3. ระบุ impact, effort, และ risk
4. ไม่สร้าง micro-workspace โดยไม่จำเป็น

### 4. Rank And Report

> Goal: จัดลำดับและรายงานไอเดีย

1. ให้คะแนนแต่ละไอเดียตาม impact/effort ratio
2. จัดลำดับ: High → Medium → Low
3. ใช้ `/report-table` คอลัมน์:
   - No
   - Idea
   - Type
   - Target Workspace
   - Problem
   - Impact
   - Effort
   - Risk
4. ระบุ Top 3 ไอเดียทีควรทำก่อน

### 5. Propose Execution

> Goal: แนะนำขั้นตอนการลงมือ refactor

1. ถ้า user ต้องการ deep refactor ทั้งหมด → ทำ `/refactor-all-workspace`
2. ถ้า user ต้องการ refactor ทีละ workspace → ทำ `/refactor-workspace` ตามลำดับทีเลือก
3. ถ้า user ต้องการ decompose เพิ่ม → ทำ `/follow-single-responsibility` อีกครั้ง
4. ทำ `/suggest-next-action` เพื่อสรุปขั้นตอนถัดไป

## Rules

### 1. Single Responsibility Per Idea

- แต่ละไอเดีย refactor หนึ่ง workspace หรือหนึ่ง concern
- ถ้าไอเดียยังประกอบด้วยหลายงาน → แบ่งย่อยก่อน report
- ใช้ `/follow-single-responsibility` ก่อนสร้างรายงาน

### 2. Evidence Based

- ทุกไอเดียต้องมาจาก `/analyze-project`, `/list-workspaces`, หรือ `/review-quality`
- ระบุ file, workspace, หรือ dependency ทีเกี่ยวข้อง
- ไม่เสนอไอเดีย generic ทีไม่มีพื้นฐานจากข้อมูลจริง

### 3. No Over-Engineering

- หลีกเลี่ยงการสร้าง micro-workspace หรือ fragmentation
- รวม code ที่เปลี่ยนด้วยกัน, deploy ด้วยกัน, test ด้วยกัน
- ถ้าการ refactor เพิ่ม complexity → ระบุ risk สูง

### 4. Hand Off To Refactor

- ไอเดียต้องส่งต่อไปยัง `/refactor-all-workspace` หรือ `/refactor-workspace` ได้ชัดเจน
- ระบุลำดับการทำงานและ dependency direction
- ไม่ implement โดยตรงใน skill นี้ ยกเว้น user สั่ง realize

## Expected Outcome

- ไอเดีย refactor workspace ทีมี single responsibility, มาจากข้อมูลจริง
- ตารางเปรียบเทียบ impact, effort, risk พร้อม Top 3
- แผนการส่งต่อไปยัง `/refactor-all-workspace` หรือ `/refactor-workspace`
- ไม่ over-engineer หรือสร้าง fragmentation
