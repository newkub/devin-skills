---
name: watch-browser-and-improve-uxui
description: เปิด browser แล้ว capture หน้าด้วย capture-image-app-to-screenshot เพื่อ review ปรับปรุง UX/UI
argument-hint: "[url]"
related:
  - review-by-stakeholder
  - review-uxui
  - capture-image-app-to-screenshot
  - capture-web
  - watch-browser-and-fix
  - watch-browser-and-test-all-routes
  - follow-tool-agent-browser
  - resolve-errors
  - ask-me
---

## Goal

เปิด browser แล้วใช้ `capture-image-app-to-screenshot` เพื่อ capture หน้าเว็บ แล้ว review และ improve UX/UI ด้วย `/review-by-stakeholder`

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `watch-browser-and-fix`, `watch-browser-and-test-all-routes`, `follow-tool-agent-browser`, `capture-image-app-to-screenshot`

ใช้สำหรับ capture หน้าเว็บจริง วิเคราะห์ UX/UI ผ่าน stakeholder review และ implement การปรับปรุงทีเหมาะสม

- ดูเพิ่มเติม: /capture-web

## Execute

### 1. Install And Verify Agent Browser

> Goal: เตรียม browser automation tool

1. ตรวจสอบการติดตั้งด้วย `agent-browser --help`
2. ถ้าไม่ได้ติดตั้ง ให้ติดตั้งด้วย `bun add -g agent-browser`
3. ดาวน์โหลด Chrome ด้วย `agent-browser install`
4. ถ้าติดตั้งไม่ได้ ให้ใช้ `browser-preview` tool แทน

### 2. Open Browser And Capture

> Goal: เปิด browser และ capture หน้าเว็บ

1. เปิด dev server ถ้าจำเป็น (`npm run dev`, `bun dev` ฯลฯ)
2. ใช้ `/capture-image-app-to-screenshot` เพื่อ capture ทุก route/component/view ลง `public/screenshots/`
3. ถ้า `capture-image-app-to-screenshot` ไม่ครอบคลุมหน้าเว็บนั้น → ใช้ `agent-browser open <url> --headed` แล้ว `agent-browser screenshot` แทน
4. ถ้าเปิดไม่ได้ ให้ใช้ `browser-preview` tool แทน
5. ใช้ `agent-browser snapshot -i` เพื่อบันทึก interactive elements และ state (ถ้าใช้ agent-browser)

### 3. Review By Stakeholder

> Goal: ใช้ /review-by-stakeholder เพื่อประเมิน UX/UI

1. รวบรวม screenshots, snapshots, และ context ของหน้าเว็บ
2. ทำ `/review-by-stakeholder` เพื่อขอ feedback จากมุมมอง stakeholder
3. ถ้าต้องการ focus ที UX/UI โดยเฉพาะ → ทำ `/review-uxui` ควบคู่
4. บันทึก findings และ priority

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

> Goal: ยื่นยันว่าการปรับปรุงทำงานได้

1. รีโหลดหน้าเว็บด้วย `agent-browser reload`
2. ใช้ `agent-browser screenshot` เพื่อ capture after
3. ทำ `/review-by-stakeholder` อีกครั้งเพื่อยื่นยันว่า improvements ตอบโจทย์
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
- ใช้ `agent-browser screenshot --annotate` เมื่อต้องการชี้จุดทีปรับปรุง

### 4. Minimal Changes

- หลีกเลี่ยง over-engineering
- แก้เฉพาะสิ่งที่ stakeholder ระบุหรือ gaps ทีชัดเจน
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
- `/review-by-stakeholder` ถูกใช้เพื่อประเมิน UX/UI
- ปรับปรุง UX/UI ตาม feedback สำเร็จ
- มี before/after screenshots พร้อมสรุป
- ไม่มี TODO/MOCK/placeholder
