---
name: idea-uxui
description: สร้างไอเดีย UX/UI improvements ใหม่และปรับปรุง UX/UI ที่มีอยู่ วิเคราะห์ usability gaps, user experience และ design trends ด้วย continuous numbering และ scope ที่ชัดเจน
---

## Goal

สร้างตาราง UX/UI improvements 40 รายการ (Extends + New) พร้อม continuous numbering และ scope ที่ชัดเจน

## Scope

ใช้สำหรับ project ที่ต้องการวิเคราะห์และปรับปรุง UX/UI

## Execute

### 1. Deep Analyze

วิเคราะห์โปรเจกต์อย่างลึกซึ้งครบทุกมิติ

- ทำ `/deep-analyze` เพื่อวิเคราะห์ architecture, code quality, features, dependencies, performance, security
- วิเคราะห์ UX/UI ปัจจุบันและ component structure
- ระบุ usability gaps และ missing design elements
- ระบุ UI components ที่สามารถ reuse ได้

### 2. Research Design Trends

วิจัย design trends และ best practices

- ศึกษา UX/UI patterns ยอดนิยมใน similar products
- วิเคราะห์ emerging design trends
- หา user feedback จาก usability testing, reviews, analytics
- ศึกษา design systems และ accessibility guidelines (WCAG)

### 3. Generate Ideas

สร้างไอเดีย UX/UI improvements ทั้ง Extends และ New

- สร้างไอเดียปรับปรุง UX/UI ที่มีอยู่ (Extends)
- สร้างไอเดีย UX/UI improvements ใหม่ที่ยังไม่มี (New)
- ระบุ usability problem ที่แต่ละ improvement จะ solve
- กำหนด target users และ use cases
- ระบุ component type (button, form, layout, navigation, etc)

### 4. Output to Chat

ตอบตาราง UX/UI improvements ในแชท

- สร้างตารางเดียวรวม 40 UX/UI improvements (Extends + New)
- แต่ละ improvement มี continuous numbering 1-40
- ระบุ หมายเลข, ชื่อ UX/UI Improvement, คำอธิบาย, ปัญหาที่แก้, วิธีทำ, Dependencies, Component/Category, ประเภท, ความยาก, ผลกระทบ, Interface, หัวข้อ, Scope
- Type ระบุเป็น: Extends (ปรับปรุงจากเดิม) หรือ New (ใหม่)
- Interface ระบุเป็น: component, layout, pattern, interaction, animation, etc
- Topics ระบุหัวข้อ เช่น accessibility, responsive, dark-mode, etc
- Scope ระบุขอบเขต เช่น component-level, page-level, app-level, cross-app
- ใช้ impact indicators: 🔴 สูง, 🟡 ปานกลาง, 🟢 ต่ำ
- ใช้ difficult indicators: 🔴 ยาก, 🟡 ปานกลาง, 🟢 ง่าย
- เรียงลำดับตารางตาม Impact (สูง → ปานกลาง → ต่ำ)

### 5. Prioritize and Roadmap

จัดลำดับและเสนอ roadmap

- จัดลำดับตาม value vs effort (RICE framework)
- ระบุ quick wins และ strategic improvements
- กำหนด MVP scope สำหรับแต่ละ UX/UI improvement
- เสนอ roadmap สำหรับ implement UX/UI improvements
- แนะนำ phasing strategy (MVP → v2 → v3)

## Rules

### 1. Single Table (40 UX/UI Improvements)

ตารางเดียวรวมทั้ง Extends และ New UX/UI improvements

- ตารางเดียวรวมทั้ง Extends และ New UX/UI improvements
- ทั้งหมด 40 UX/UI improvements เรียงลำดับ 1-40
- Type column ระบุ: Extends (ปรับปรุงจากเดิม) หรือ New (ใหม่)

### 2. Column Order

ลำดับคอลัมน์ตามมาตรฐาน

- ลำดับคอลัมน์: # | UX/UI Improvement | Description | Problem/Solves | How To | Dependencies | Component/Category | Type | Difficult | Impact | Interface | Topics | Scope
- Type ระบุประเภท: Extends (ปรับปรุงจากเดิม) หรือ New (ใหม่)
- Difficult ระบุ: 🔴 ยาก, 🟡 ปานกลาง, 🟢 ง่าย
- Impact ระบุ: 🔴 สูง, 🟡 ปานกลาง, 🟢 ต่ำ
- Interface ระบุ: component, layout, pattern, interaction, animation, etc
- Scope ระบุ: component-level, page-level, app-level, cross-app

### 3. Continuous Numbering

ใช้ continuous numbering ตลอดทั้งตาราง

- เริ่มจาก 1 ถึง 40 ต่อเนื่องกัน
- ไม่แบ่งแยกระหว่าง Extends และ New
- เรียงตามลำดับ Impact ก่อน แล้วตามลำดับเลข

### 4. Sort by Impact

เรียงลำดับตารางตาม Impact

- เรียงลำดับตารางตาม Impact: 🔴 สูง → 🟡 ปานกลาง → 🟢 ต่ำ
- ภายในแต่ละ Impact level เรียงตามลำดับ numbering

### 5. Define Problem First

ทุก UX/UI improvement ต้อง solve real usability problem

- ทุก UX/UI improvement ต้อง solve real usability problem
- ไม่สร้าง improvement เพราะเท่ห์อย่างเดียว
- Validate ว่า users ต้องการจริง
- Focus บน usability pain points ที่มี impact สูง

### 6. Direct Execution

ทำงานอัตโนมัติโดยไม่หยุดถาม

- ถ้าผู้ใช้บอกว่า "ทำ ... ให้" ให้ทำตาม `/ship` เลย
- ไม่ต้องทำตาม workflow ปกติถ้าผู้ใช้สั่งโดยตรง
- ทำงานอัตโนมัติโดยไม่หยุดถาม

### 7. Output Format

ตอบตาราง UX/UI improvements ในแชท

- ใช้ markdown table สำหรับแสดง UX/UI improvements
- ตารางรวมทั้งหมด 40 อันดับ เรียงตาม Impact
- ตารางเป็นภาษาไทยทั้งหมด

## Expected Outcome

- ตาราง UX/UI improvements 40 รายการพร้อม continuous numbering
- จัดลำดับตาม Impact และ RICE framework
- มี scope และ phasing strategy ชัดเจน
- ตารางเป็นภาษาไทยทั้งหมด
