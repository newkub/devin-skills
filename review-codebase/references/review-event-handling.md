---
name: review-event-handling
description: Review listener cleanup, event delegation, memory leak prevention, passive listeners, debounce/throttle, custom events
---

## Goal

Review event handling ครอบคลุม listener cleanup, delegation, passive listeners, debounce/throttle, custom events พร้อม review score

## Scope

event handling review สำหรับ: listener cleanup (addEventListener/removeEventListener, cleanup on unmount), event delegation, memory leak prevention, passive listeners (passive: true for touch/wheel), debounce/throttle, event target correctness, custom events (typed payload, naming, documentation), event listener patterns, global event listeners, window/document listeners

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ event handling patterns ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ event handling structure
2. ระบุ event handling patterns, listener cleanup strategy, debounce/throttle usage, custom event patterns ที่ใช้
3. ถ้า project ไม่มี event listeners → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก event handling dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ event handling patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Listener Cleanup And Memory Leak Review

> Goal: ครอบคลุม listener cleanup, memory leak prevention, event delegation

1. ตรวจสอบ listener cleanup: addEventListener/removeEventListener pairs, cleanup on unmount, cleanup on route change, cleanup on component destroy, missing removeEventListener detection
2. ตรวจสอบ memory leak prevention: listener leak detection, closure reference leak, detached DOM element listeners, global listener cleanup, window/document listener cleanup, interval/timeout cleanup
3. ตรวจสอบ event delegation: event delegation patterns, delegation vs direct binding, delegation performance, delegation correctness, delegation cleanup
4. ตรวจสอบ event target correctness: correct event target, event target vs currentTarget, event bubbling, event capturing, event delegation target matching
5. Critical: listener ที่ไม่ cleanup ทำให้ memory leak, listener leak ใน critical path, detached DOM listener ที่ก่อให้เกิด error
6. High: missing cleanup on unmount, missing interval/timeout cleanup, missing global listener cleanup, no event delegation ที่ควรมี, incorrect event target

### 4. Passive Listeners, Debounce, Throttle And Custom Events Review

> Goal: ครอบคลุม passive listeners, debounce/throttle, custom events

1. ตรวจสอบ passive listeners: passive: true for touch/wheel events, passive listener on scroll, passive listener performance, missing passive flag detection, passive vs non-passive decision
2. ตรวจสอบ debounce: debounce on input/search/resize, debounce time configuration, debounce cleanup, debounce correctness, missing debounce detection
3. ตรวจสอบ throttle: throttle on scroll/resize/mousemove, throttle time configuration, throttle cleanup, throttle vs debounce selection, missing throttle detection
4. ตรวจสอบ custom events: typed custom event payload, custom event naming, custom event documentation, CustomEvent usage, event dispatching patterns, event listener for custom events
5. ตรวจสอบ global event listeners: window.addEventListener cleanup, document.addEventListener cleanup, visibilitychange handler, online/offline handler, beforeunload handler, popstate handler
6. Critical: preventDefault บน passive listener ที่ไม่ทำงาน, memory leak from missing cleanup ใน critical path
7. High: missing passive: true, missing debounce on search input, missing throttle on scroll, missing custom event typing, missing global listener cleanup, missing visibilitychange handler

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี event listeners → ข้ามทั้งหมด
- ถ้า project ไม่มี custom events → ข้าม Step 4 item 4
- ถ้า project ไม่มี global listeners → ข้าม Step 4 item 5

### 2. Severity Classification

- Critical: listener ที่ไม่ cleanup ทำให้ memory leak, listener leak ใน critical path, detached DOM listener ที่ก่อให้เกิด error, preventDefault บน passive listener ที่ไม่ทำงาน
- High: missing cleanup on unmount, missing interval/timeout cleanup, missing global listener cleanup, missing passive: true, missing debounce, missing throttle, incorrect event target
- Medium: suboptimal debounce time, suboptimal throttle time, missing event delegation, minor custom event issue, missing visibilitychange handler
- Low: cosmetic, minor listener improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ listener, event type, หรือ component ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก event handling section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
