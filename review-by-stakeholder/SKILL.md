---
name: review-by-stakeholder
description: รวบรวม evidence, screenshots, context แล้วขอ feedback จาก stakeholder เพื่อ prioritize การปรับปรุง
argument-hint: "[area-or-question]"
related:
  - improve-uxui
  - capture-image-app-to-screenshot
  - report-table
  - ask-me
  - suggest-next-action
---

## Goal

รวบรวม evidence, screenshots, context แล้วขอ feedback จาก stakeholder เพื่อ prioritize การปรับปรุง

## Scope

ใช้เมื่อต้องการ review UX/UI, design, copy, layout, flow โดยนำเสนอ evidence ให้ stakeholder และบันทึก feedback

## Execute

### 1. Gather Evidence

> Goal: มี evidence ครบถ้วนสำหรับ review

1. ใช้ screenshots จาก `/capture-image-app-to-screenshot` หรือ `/improve-uxui`
2. ใช้ `agent-browser snapshot` ถ้าจำเป็น
3. รวบรวม URLs, routes, components, states
4. ระบุ user stories หรือ acceptance criteria

### 2. Identify Stakeholders

> Goal: รู้ว่าใครเกี่ยวข้อง

1. ระบุ product owner, designer, frontend lead, หรือ end-user representative
2. ระบุ role ของแต่ละ stakeholder
3. ระบุสิ่งที stakeholder แต่ละคนดูแล

### 3. Present Findings

> Goal: ถาม stakeholder อย่างชัดเจน

1. ใช้ `/report-table` แสดง finding, evidence, proposed change
2. ถามคำถามเฉพาะเจาะจง ไม่ถามทั่วไป
3. ระบุ options และ trade-offs
4. ถ้าไม่ชัด → ใช้ `/ask-me`

### 4. Record Feedback

> Goal: บันทึก feedback traceable

1. บันทึก feedback ตาม item
2. ระบุ decision: accept, reject, defer, needs-design
3. ระบุ priority ตาม stakeholder
4. บันทึก role และวันที

### 5. Prioritize

> Goal: เรียงลำดับ action items

1. ใช้ impact/effort matrix
2. จัดลำดับตาม business value
3. ระบุ dependencies ระหว่าง items
4. ทำ checklist พร้อม acceptance criteria

### 6. Suggest Next Action

> Goal: แนะนำ action ถัดไป

1. ทำ `/suggest-next-action`
2. แนะนำ skill ทีเหมาะสม เช่น `/improve-uxui`, `/refactor`, `/restructure`
3. บันทึก next steps

## Rules

### 1. Evidence First

- ไม่ถาม stakeholder โดยไม่มี evidence
- ใช้ screenshots, URLs, code snippets
- ระบุ context เช่น route, viewport, role

### 2. Specific Questions

- ถามเฉพาะจุด เช่น "button นี้ควรย้ายไปขวาหรือไม่"
- ไม่ถาม "ชอบไหม" อย่างเดียว
- ให้ options เมื่อเหมาะสม

### 3. Traceability

- บันทึกทุก feedback กับ item
- ระบุ stakeholder role
- ระบุ decision และเหตุผล

### 4. No Assumptions

- ไม่เดา stakeholder intent
- ถามก่อน implement
- ถ้า conflict → escalate

## Expected Outcome

- Evidence รวบรวมครบ
- Feedback บันทึกชัดเจน
- Priority list เรียงลำดับ
- Next action ชัดเจน
