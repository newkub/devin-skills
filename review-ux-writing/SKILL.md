---
name: review-ux-writing
description: Review UX writing quality for copy, labels, error messages, voice, tone, localization readiness
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - validate
  - suggest-next-action
---


## Goal

Review UX writing ครอบคลุม copy, microcopy, labels, error messages, voice, tone, และ localization readiness พร้อม review score

## Scope

UX writing review สำหรับ: microcopy, button labels, link text, menu items, tooltips, placeholders, form labels, helper text, validation messages, error messages, empty states, onboarding copy, notifications, alerts, CLI/TUI copy, i18n readiness, terminology consistency, tone, voice

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ UX copy ทั้งหมดใน codebase

1. ทำ `/scan-codebase` เพื่อหา UX copy ใน components, pages, routes, translation files, และ content files
2. ระบุ copy sources: hardcoded strings, translation keys, CMS content, design system tokens
3. จัดประเภท copy ตามฟังก์ชัน: navigation, action, feedback, guidance, error
4. บันทึกจุดสัมผัส (touchpoints) ที่มีข้อความและ context การใช้งาน
5. ถ้า project ไม่มี UX copy ที่ตรวจสอบได้ → stop และ report

### 2. Voice And Tone Review

> Goal: ตรวจสอบ voice และ tone สม่ำเสมอ

1. ตรวจสอบ brand personality ที่กำหนดไว้: friendly, professional, playful, authoritative
2. ตรวจสอบ tone ตาม context: success, error, warning, informational, onboarding
3. ตรวจสอบ voice guidelines: active voice, พูดกับผู้ใช้โดยตรง, หลีกเลี่ยงศัพท์เทคนิค
4. ตรวจสอบ tone matrix สำหรับแต่ละ context
5. ตรวจสอบว่ามี guidelines บันทึกไว้ เช่น `docs/ux-writing-guidelines.md`

### 3. Microcopy And Labels Review

> Goal: ตรวจสอบ microcopy, labels, และ action text

1. ตรวจสอบ button labels: ใช้ action verbs ชัดเจน เช่น `สร้างการจอง` ไม่ใช่ `ตกลง`
2. ตรวจสอบ link text: บอกปลายทางชัดเจน ไม่ใช่ `คลิกที่นี่`
3. ตรวจสอบ menu items: กระชับ เข้าใจง่าย สอดคล้องกับฟังก์ชัน
4. ตรวจสอบ tooltips: อธิบายสิ่งที่ผู้ใช้สงสัย ไม่ใช่สิ่งที่ชัดเจนอยู่แล้ว
5. ตรวจสอบ placeholder text: แสดงตัวอย่างจริง ไม่ใช่คำอธิบายทั่วไป
6. ตรวจสอบ navigation labels: กระชับ ไม่กำกวม สอดคล้องกับ page/function
7. ตรวจสอบความสม่ำเสมอของคำศัพท์ทั่วทั้งแอป

### 4. Error Messages Review

> Goal: ตรวจสอบ error messages ว่าบอกสาเหตุและวิธีแก้

1. ตรวจสอบ error messages บอกสาเหตุและวิธีแก้ (what + how to fix)
2. ตรวจสอบว่าไม่ใช้คำว่า `Error`, `Failed`, `Invalid` โดยไม่มีบริบท
3. ตรวจสอบ human language ไม่ใช่ technical jargon หรือ error codes
4. ตรวจสอบการแยก validation errors จาก system errors โดยใช้ tone ที่เหมาะสม
5. ตรวจสอบ error messages สำหรับ forms, API, system, network, auth
6. Critical: error message ที่ไม่บอกวิธีแก้, button label ที่กำกวม ทำให้ผู้ใช้กดผิด
7. High: inconsistent terminology, system-centered language, technical jargon ในข้อความที่ผู้ใช้เห็น

### 5. Empty States And Onboarding Review

> Goal: ตรวจสอบ empty states และ onboarding copy

1. ตรวจสอบ empty states: อธิบายสิ่งที่จะปรากฏ, บอก next action, ใช้ภาพ/ไอคอนที่สื่อความหมาย
2. ตรวจสอบการแยก empty states ตาม context: first-time, no results, no permission, no data
3. ตรวจสอบ onboarding copy: welcome message อบอุ่นและกระชับ, value proposition 1-2 ประโยค
4. ตรวจสอบ instructions แบ่งเป็นขั้นตอนสั้นๆ
5. ตรวจสอบ progressive disclosure: บอกเฉพาะสิ่งที่จำเป็น
6. ตรวจสอบว่าไม่มี information overload

### 6. Forms And Validation Copy Review

> Goal: ตรวจสอบ labels, helper text, validation messages ในฟอร์ม

1. ตรวจสอบ field labels: ชัดเจน กระชับ บอกหน่วยถ้ามี
2. ตรวจสอบ helper text: อธิบาย format หรือข้อกำหนดก่อนกรอก
3. ตรวจสอบ validation messages: บอกเกณฑ์ที่ต้องการ ไม่ใช่แค่ `ไม่ถูกต้อง`
4. ตรวจสอบ required field indicators: ชัดเจน ไม่กำกวม
5. ตรวจสอบ inline validation feedback
6. ตรวจสอบ form error messages ที่ชี้ field และบอกวิธีแก้

### 7. Notifications, Alerts And Dialogs Review

> Goal: ตรวจสอบ notifications, alerts, confirmations

1. ตรวจสอบ toast messages: กระชับ บอกผลลัพธ์ ไม่หายเร็วเกินไป
2. ตรวจสอบ banner messages: บอกความสำคัญและ action ที่ต้องทำ
3. ตรวจสอบ confirmation dialogs: ถามชัดเจน บอกผลของการเลือก
4. ตรวจสอบ tone ตาม severity: info, success, warning, error
5. ตรวจสอบ status messages: loading, progress, success, error ชัดเจน

### 8. CLI And TUI Copy Review

> Goal: ตรวจสอบ UX writing สำหรับ CLI และ TUI

1. ตรวจสอบ help messages: กระชับ มี examples และ usage patterns
2. ตรวจสอบ actionable error messages: บอกวิธีแก้ ไม่ใช่ error codes
3. ตรวจสอบ consistent flag naming และ option descriptions
4. ตรวจสอบ TUI labels: concise อ่านง่ายบน terminal
5. ตรวจสอบ TUI status messages และ progress indicators ชัดเจน
6. ตรวจสอบ color coding ที่สื่อความหมาย ไม่ใช่ decoration อย่างเดียว

### 9. Localization Readiness Review

> Goal: ตรวจสอบ UX writing ที่รองรับ i18n

1. ตรวจสอบว่า copy ทั้งหมดอยู่ใน translation files ไม่ hardcode ใน components
2. ตรวจสอบว่าไม่ใช้ idioms หรือ cultural references เฉพาะภาษา
3. ตรวจสอบ copy ที่ยืดหยุ่นต่อความยาวของข้อความ (text expansion)
4. ตรวจสอบ placeholders ชัดเจน เช่น `{name}` ไม่ใช่ `{}`
5. ตรวจสอบ locale-aware error messages และ validation messages

### 10. Validate and Report

> Goal: ตรวจสอบ findings และรายงานผล

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี UI → ข้าม Step 3 บางส่วน
- ถ้า project ไม่มี forms → ข้าม Step 6
- ถ้า project ไม่มี CLI/TUI → ข้าม Step 8
- ถ้า project ไม่มี i18n → ข้าม Step 9 บางส่วน
- ถ้า project ไม่มี onboarding → ข้าม Step 5 ส่วน onboarding

### 2. Severity Classification

- Critical: error message ที่ไม่บอกวิธีแก้, button label ที่กำกวมทำให้ผู้ใช้กดผิด, empty state ที่ไม่มี next action, hardcoded copy ใน critical path ของ multi-locale app, misleading confirmation dialog
- High: inconsistent terminology, system-centered language, technical jargon ในข้อความผู้ใช้, missing error recovery instruction, inconsistent tone/voice, placeholder ที่หายไปทำให้ field ไม่ชัด
- Medium: inconsistent microcopy, missing helper text, minor voice/tone drift, missing tooltip บน complex action, inconsistent label casing
- Low: cosmetic, minor wording improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ copy, label, message, หรือ translation key ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ถ้าพบ issue ที่เกี่ยวกับ implementation → อ้างอิง `/improve-ux-writing`

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก UX writing section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

