---
name: skills-type-report
description: Template สำหรับ report-* skills รวบรวมข้อมูล
allowed-tools:
  - read
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
---

## Goal

Template สำหรับสร้าง `report-*` skills ที่รวบรวมข้อมูล วิเคราะห์ และนำเสนอในรูปแบบที่อ่านง่าย

## Scope

ใช้สำหรับ skills ที่ report เช่น `report-health`, `report-agents-session-status`, `report-todo`, `report-features`, `report-bundle`

## Execute

### 1. Gather Data

รวบรวมข้อมูลจาก source

> Goal: มีข้อมูลครบ ถูกต้อง ทันสมัย

1. ทำ `/scan-codebase`, อ่าน configs, อ่าน manifests, อ่าน key files
2. ถ้าต้องประมวลผลซับซ้อน → ทำ `/use-scripts`
3. ถ้าข้อมูลจาก external → ทำ `/learn-from-web`

### 2. Analyze

วิเคราะห์ข้อมูลที่รวบรวม

> Goal: เข้าใจข้อมูล หา patterns และ insights

1. จัดกลุ่มข้อมูลตาม category
2. คำนวณ metrics, หา patterns, หา trends และ anomalies
3. ระบุ highlights และ concerns

### 3. Format

จัดรูปแบบ report

> Goal: Report อ่านง่าย เหมาะกับ audience

1. ทำ `/report-table`, ทำ `/report-file-structure` ถ้าเกี่ยวกับ files
2. ใช้ headings, lists และ tables ตามประเภทข้อมูล
3. สรุป key findings ไว้ด้านบน

### 4. Present

นำเสนอ report

> Goal: ผู้ใช้ได้ report ที่พร้อมใช้

1. นำเสนอ report ในรูปแบบที่เหมาะสม
2. ถ้าเป็น interactive → ทำ `/report-in-html` หรือ `/visualize-in-web`
3. ระบุ next actions ที่ชัดเจน
4. ทำ `/suggest-next-action`

## Rules

### 1. Clarity

- ใช้ headings และ sections ชัดเจน
- สรุป key findings ไว้ด้านบน
- ไม่ dump ข้อมูลทั้งหมด — เฉพาะส่วนสำคัญ

### 2. Accuracy

- ข้อมูลต้องถูกต้องและทันสมัย
- ระบุ source ของข้อมูล
- ถ้าข้อมูลอาจเก่า → ระบุวันที่

### 3. Format

- ใช้ตารางสำหรับข้อมูลที่เปรียบเทียบได้
- ใช้ lists สำหรับข้อมูลที่ลำดับสำคัญ
- ใช้ code blocks สำหรับ code หรือ file paths

### 4. Actionable

- ทุก report ต้องมี next actions
- ถ้า report พบ issues → แนะนำ skill ที่เหมาะสม
- ถ้า report ไม่พบ issues → ระบุว่า "no issues found"

## Expected Outcome

- Report ที่จัดรูปแบบดี อ่านง่าย
- ข้อมูลถูกต้อง ครบถ้วน
- ผู้ใช้รู้ next action ที่ชัดเจน
