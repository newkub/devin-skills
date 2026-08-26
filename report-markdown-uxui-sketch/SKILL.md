---
name: report-markdown-uxui-sketch
description: สร้างรายงาน UX/UI sketch ใน markdown สำหรับ app/website จาก context ที่ให้มา
related:
  - report-markdown-uxui-all-routes
  - report-markdown-table
  - report-markdown-diagram
  - follow-design-system
  - roleplay-uxui-designer
---

## Goal

สร้างรายงาน UX/UI sketch ใน markdown สำหรับ app หรือ website จาก context ที่ผู้ใช้ให้ โดยแสดง layout, tabs, components, และ user flow แบบ text-based wireframe

## Scope

- ใช้สำหรับ UX/UI sketch ก่อน implement
- รองรับ mobile app, web app, desktop app
- แสดง tab/session/screen layout, navigation, list items, buttons
- ไม่สร้างรูปภาพ ใช้ markdown + ASCII/Unicode box-drawing

## Execute

### 1. Gather Context

> Goal: เข้าใจ app/website ที่จะ sketch

1. อ่าน prompt, context, `AGENTS.md`, หรือ references ที่เกี่ยวข้อง
2. ระบุ platform (iOS, Android, Web, Desktop), framework, และ screen size
3. ระบุ tabs, screens, main features, และ target users
4. ถ้า context ไม่พอ → ใช้ `/ask-me`

### 2. Define Screens And Flow

> Goal: แบ่ง app เป็น screens/tabs ที่ชัดเจน

1. ระบุชื่อ tab/screen ทั้งหมด
2. ระบุ flow หลัก: เปิด app → ไป tab ไหน → กดอะไร
3. ระบุ transitions ระหว่าง screen
4. จัดกลุ่ม screens ตาม bottom/tab navigation

### 3. Sketch Each Screen

> Goal: วาด wireframe แต่ละ screen ใน markdown

1. ใช้ box-drawing characters (`┌─┐│└─┘`) หรือ ASCII tables
2. แสดง status bar, navigation bar, tab bar ถ้าเป็น mobile
3. ใส่ labels, placeholders, list items, buttons
4. ระบุการ "กด" หรือ tap ที่ทำงานได้: `[Tap]`, `[Press]`
5. ความกว้างไม่เกิน 80 characters ต่อบรรทัด

### 4. Add UX Annotations

> Goal: อธิบาย behavior ของแต่ละ element

1. ใช้ bullet/numbered list อธิบาย interaction
2. ระบุ loading, empty, error states
3. ระบุ gestures (swipe, pull-to-refresh) ถ้ามี
4. ระบุ accessibility labels

### 5. Format As Markdown Report

> Goal: สรุป report ให้อ่านง่าย

1. สรุป key findings ด้านบน
2. ใช้ `/report-markdown-table` สำหรับ screen/tab summary
3. ใช้ `/report-markdown-diagram` สำหรับ user flow
4. ใช้ symbols `✅` `⚠️` สำหรับสถานะ
5. ทำ `/suggest-next-action` ท้าย report

## Rules

### Text-Only Sketch

- ไม่สร้างรูปภาพหรือ binary files
- ใช้ markdown, ASCII, Unicode box-drawing characters เท่านั้น
- หนึ่ง screen ต่อหนึ่ง sketch section

### Mobile Layout

- แสดง top status bar, middle content, bottom tab bar ถ้าเป็น mobile
- ใช้ `Tab 1 | Tab 2 | Tab 3` สำหรับ tab bar
- ระบุ safe area, navigation header ถ้าจำเป็น

### Web/Desktop Layout

- แสดง sidebar/top nav, main content area
- ระบุ breakpoints ถ้ามี responsive design
- ระบุ global nav กับ local nav แยกกัน

### Interactions

- ระบุ tap/click targets ชัดเจน เช่น `[Tap]`, `[Press]`, `[Toggle]`
- ระบุ disabled states ด้วย `[Disabled]`
- ระบุ transitions เช่น `→ Screen B`

### Formatting

- ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `screen-name`
- ห้ามใช้ `**` bold markers
- บรรทัดไม่เกิน 80 characters
- ใช้ headings แยกแต่ละ screen

### Consistency

- ใช้คำศัพท์เดียวกันทั้ง report
- เรียง tabs/screens ตามลำดับ navigation
- ทุก screen ต้องมีชื่อและ purpose กำกับ

## Expected Outcome

- Markdown UX/UI sketch ครอบคลุมทุก screen/tab
- Screen summary table ด้วย `/report-markdown-table`
- User flow หรือ navigation diagram ด้วย `/report-markdown-diagram`
- Clear interactions, loading/empty/error states, และ accessibility notes
- Next action ชัดเจนท้าย report
