---
name: alternative
description: แนะนำ alternatives ของ <x> และสรุปผลลัพธ์ด้วย /report-table
argument-hint: "<x>"
related:
  - list-alternative
  - report-table
  - compare
  - deep-research
  - follow-best-practice
  - ask-me
---

## Goal

เมื่อผู้ใช้ถาม `<x> alternative` หรือขอ alternatives ของสิ่งใดสิ่งหนึ่ง ให้ค้นหา เปรียบเทียบ และนำเสนอผลลัพธ์ในรูปแบบตาราง (`/report-table`) พร้อม recommendation

## Scope

ใช้กับ:
- คำสั่ง `<x> alternative` หรือ `alternative to <x>`
- คำถาม "มีอะไรแทน <x>" หรือ "compare <x> alternatives"
- libraries, tools, frameworks, patterns, services, languages, build tools

## Execute

### 1. Identify Subject And Context

> Goal: ระบุ <x> และ context

1. ดึง <x> จากคำถาม (library, tool, framework, pattern, service)
2. ระบุ context หรือ tech stack หลักจาก conversation
3. ถ้า <x> ไม่ชัดเจน ให้ถามด้วย `/ask-me` ก่อน
4. ระบุสิ่งที่ user ต้องการเปรียบเทียบ (features, performance, DX, ecosystem)

### 2. Research Alternatives

> Goal: หาตัวเลือกที่เหมาะสม

1. ใช้ `/list-alternative` เพื่อค้นหา alternatives ของ <x>
2. ถ้าต้องการข้อมูลลึก ให้ใช้ `/deep-research`
3. รวบรวมอย่างน้อย 3 alternatives รวมตัวเดิม
4. บันทึกแหล่งอ้างอิงที่น่าเชื่อถือ

### 3. Compare Alternatives

> Goal: เปรียบเทียบด้วย criteria ชัดเจน

1. เลือก criteria ที่เหมาะสมกับ <x> เช่น:
   - สำหรับ library: bundle size, type safety, maintenance, ecosystem
   - สำหรับ tool: speed, config, plugins, CI/CD
   - สำหรับ framework: rendering, state, DX, deployment
2. ใช้ `/compare` ถ้าต้องการวิเคราะห์ trade-off หลายตัวเลือก
3. ระบุ pros/cons ของแต่ละ alternative

### 4. Report As Table

> Goal: สรุปผลลัพธ์ด้วย /report-table

1. สร้างตารางเปรียบเทียบด้วย `/report-table`
2. คอลัมน์: # | Alternative | Type | Key Features | Pros | Cons | Best For | Maintenance
3. เรียงลำดับตามความเหมาะสมกับ context
4. ใช้สัญลักษณ์ ok / warn / no สำหรับ status/ข้อจำกัดถ้าเหมาะสม

### 5. Recommend

> Goal: ให้คำแนะนำที่เหมาะสม

1. เลือก alternative ที่เหมาะสมที่สุดกับ context
2. อธิบายเหตุผลสั้น ๆ
3. ระบุ trade-off หรือข้อควรระวัง
4. แนะนำ next step ด้วย `/suggest-next-action`

## Rules

### 1. Trigger Patterns

- `<x> alternative` หรือ `alternative to <x>` หรือ `<x> vs ...`
- รองรับคำถามภาษาไทยและอังกฤษ

### 2. Output Format

- ต้องสรุปด้วยตาราง (`/report-table`) เสมอ
- ไม่เรียงลำดับความสำคัญก่อนหน้า table มากจนเกินไป
- ระบุ recommendation หลัง table ชัดเจน

### 3. Quality

- ต้องมีอย่างน้อย 3 alternatives
- ต้องมี criteria เปรียบเทียบที่ชัดเจน
- ไม่สรุปผลที่ยังไม่ได้ตรวจสอบ
- ไม่เดาเฉย ๆ ถ้าไม่แน่ใจให้ถามหรือ `/deep-research`

### 4. Context

- พิจารณา tech stack ปัจจุบัน
- พิจารณา project requirements (DX, performance, team expertise)
- ระบุ trade-off ที่สำคัญ

## Expected Outcome

- ตาราง alternatives ที่ครบถ้วนและอ่านง่าย
- Recommendation ที่เหมาะสมกับ context
- Pros/cons และ trade-off ชัดเจน
- Next action ที่แนะนำถัดไป
