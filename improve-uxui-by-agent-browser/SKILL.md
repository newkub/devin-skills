---
name: improve-uxui-by-agent-browser
description: Capture หน้าเว็บจริงด้วย agent-browser แล้ว review/improve UX/UI ผ่าน stakeholder
argument-hint: "[url-or-route]"
related:
  - capture-image-app-to-screenshot
  - review-by-stakeholder
  - review-uxui
  - test-uxui-by-agent-browser
  - report-table
  - resolve-errors
  - refactor
  - restructure
  - ask-me
---

## Goal

เปิด browser แล้วใช้ `capture-image-app-to-screenshot` หรือ `agent-browser` เพื่อ capture หน้าเว็บ แล้ว review และ improve UX/UI ด้วย `/review-by-stakeholder`

## Scope

ใช้กับ web apps, components, pages ที่ต้องการ capture จริง วิเคราะห์ UX/UI ผ่าน stakeholder review และ implement การปรับปรุง — ไม่รวม visual regression testing (ใช้ `/test-uxui-by-agent-browser`)

## Execute

### 1. Install And Verify Agent Browser

> Goal: เตรียม browser automation tool

1. ตรวจสอบการติดตั้งด้วย `agent-browser --help`
2. ถ้าไม่ได้ติดตั้ง ให้ติดตั้งด้วย `bun add -g agent-browser`
3. ดาวน์โหลด Chrome ด้วย `agent-browser install`
4. ถ้าติดตั้งไม่ได้ ให้ใช้ `browser-preview` tool แทน — ดู `references/agent-browser-setup.md`

### 2. Open Browser And Capture

> Goal: เปิด browser และ capture หน้าเว็บ

1. เปิด dev server ถ้าจำเป็น (`npm run dev`, `bun dev` ฯลฯ)
2. ใช้ `/capture-image-app-to-screenshot` เพื่อ capture ทุก route/component/view ลง `public/screenshots/`
3. ถ้าไม่ครอบคลุมหน้าเว็บนั้น → ใช้ `agent-browser open <url> --headed` แล้ว `agent-browser screenshot` แทน
4. ถ้าเปิดไม่ได้ ให้ใช้ `browser-preview` tool แทน
5. ใช้ `agent-browser snapshot -i` เพื่อบันทึก interactive elements และ state
6. เก็บ before evidence ตาม `references/capture-and-evidence.md`

### 3. Review By Stakeholder

> Goal: ใช้ stakeholder review เพื่อประเมิน UX/UI

1. รวบรวม screenshots, snapshots, และ context ของหน้าเว็บ
2. ทำ `/review-by-stakeholder` เพื่อขอ feedback — เลือก domain reference จาก `references/index.md` ให้ตรงกับหน้าที่ review (landing-pages, dashboard, navigation, feedback, animation, theme, design-system, forms, typography, responsive, accessibility, content-copy, onboarding)
3. ถ้าต้องการ focus ที่ UX/UI โดยเฉพาะ → ทำ `/review-uxui` ควบคู่
4. บันทึก findings และ priority ตาม `references/stakeholder-review.md`

### 4. Generate Improvement Plan

> Goal: สร้างแผนปรับปรุง UX/UI

1. จัดลำดับ findings ตาม impact และ effort
2. ระบุว่าแต่ละข้อต้องแก้ไข code, assets, copy, layout หรือ interaction
3. ทำ checklist พร้อม acceptance criteria
4. ถ้ามีข้อสงสัย → `/ask-me`

### 5. Implement Improvements

> Goal: แก้ไข code ตามแผนปรับปรุง

1. แก้ไขทีละ item ตาม priority
2. ใช้ minimal changes ไม่ over-engineer
3. ถ้าต้องแก้ code หลายไฟล์ → ใช้ `/refactor` หรือ `/restructure`
4. ถ้ามี errors ระหว่างแก้ → `/resolve-errors`

### 6. Validate Changes

> Goal: ยืนยันว่าการปรับปรุงทำงานได้

1. รีโหลดหน้าเว็บด้วย `agent-browser reload`
2. ใช้ `agent-browser screenshot` เพื่อ capture after
3. ทำ `/review-by-stakeholder` อีกครั้งเพื่อยืนยัน improvements
4. ถ้ายังไม่ผ่าน → กลับไปขั้นตอนที่ 4

### 7. Cleanup

> Goal: ปิด browser session อย่างสะอาด

1. ปิด browser session ด้วย `agent-browser close`
2. สรุป before/after พร้อม screenshots
3. ใช้ `/report-table` เพื่อแสดงสรุป improvements

## Rules

### 1. Stakeholder Centric

- ต้องใช้ `/review-by-stakeholder` ก่อน implement improvements
- บันทึก feedback อย่างชัดเจนและ traceable
- ถ้ามีหลาย stakeholders ให้ระบุ role ของแต่ละคน

### 2. UX/UI Focus

- ปรับปรุง UX/UI เท่านั้น ไม่แก้ business logic ถ้าไม่จำเป็น
- ใช้ `/review-uxui` เมื่อต้องการ review โดยเฉพาะ
- ให้ความสำคัญกับ accessibility, visual hierarchy, และ interaction

### 3. Before/After Evidence

- ต้องมี before screenshot ก่อนแก้ไข
- ต้องมี after screenshot หลังแก้ไข
- ใช้ `agent-browser screenshot --annotate` เมื่อต้องการชี้จุดที่ปรับปรุง

### 4. Minimal Changes

- หลีกเลี่ยง over-engineering
- แก้เฉพาะสิ่งที่ stakeholder ระบุหรือ gaps ที่ชัดเจน
- ไม่เพิ่ม dependencies ใหม่ถ้าไม่จำเป็น

### 5. Error Handling

- ถ้าเกิด error ระหว่าง capture → ใช้ `browser-preview` tool แทน
- ถ้าเกิด error ระหว่าง implement → `/resolve-errors`
- ถ้าไม่สามารถปรับปรุงได้ตาม feedback → หยุดและ report

### 6. Timeout And Retry Limits

- `timeout` = 600 วินาที (10 นาที) สำหรับ session ทั้งหมด
- `maxReviewRounds` = 3 รอบสำหรับ review/improve cycles
- `maxRetries` = 3 สำหรับ `agent-browser` crash recovery

### 7. Graceful Shutdown

- หยุดทันทีเมื่อ user กด `Ctrl+C`
- ปิด browser session ด้วย `agent-browser close` ก่อนหยุด
- บันทึกสถานะสุดท้ายก่อน cleanup

## Expected Outcome

- Browser เปิดและ capture หน้าเว็บได้
- `/review-by-stakeholder` ถูกใช้เพื่อประเมิน UX/UI พร้อม domain reference ที่ตรง
- ปรับปรุง UX/UI ตาม feedback สำเร็จ
- มี before/after screenshots พร้อมสรุป
- ทุก reference ใน `references/index.md` ถูกใช้งานตาม context
