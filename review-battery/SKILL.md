---
name: review-battery
description: Review battery/energy usage ครอบคลุม polling, sensors, network, background, rendering, wake locks
---

## Goal

Review battery และ energy usage ของ project พร้อมระบุ patterns ทีเปลืองพลังงาน, findings, severity, และ review score

## Scope

ใช้สำหรับ review battery/energy usage ใน project หรือ workspace ทีต้องการประหยัดพลังงาน เช่น mobile app, web app, IoT, wearable, desktop app, backend, หรือ embedded

## Execute

### 1. Prepare And Scan

เตรียม context และสแกน codebase

> Goal: เข้าใจ patterns การใช้พลังงาน และ runtime ของ project

1. ทำ `/scan-codebase` เพื่อหา patterns ทีเกี่ยวกับ battery/energy
2. ระบุ runtime และ platform: browser, Node.js, mobile native, desktop, IoT, embedded
3. ระบุ tools/metrics สำหรับ power profiling ทีมีอยู่
4. ระบุ components ทีทำงาน background, polling, sensor, network, animation, wake lock

### 2. Review Polling And Timers

Review ความถี่และระยะเวลาของ polling และ timers

> Goal: ลดการปลุก CPU บ่อยเกินไป

1. ตรวจหา `setInterval`, `setTimeout`, cron jobs, หรือ loops ทีรัน background โดยไม่มี interval ยาวพอ
2. ตรวจหา polling ทีซ้ำซ้อนกันหลายจุด
3. ตรวจหา timers ทีไม่มีการ clear หรือหยุดเมื่อไม่ใช้งาน
4. ตรวจหา high-frequency updates บน UI หรือ state ทีไม่จำเป็น

### 3. Review Sensors And Hardware

Review การใช้ sensors และ hardware ทีกินไฟ

> Goal: ลดการ activate hardware โดยไม่จำเป็น

1. ตรวจหา GPS, location services, geolocation API ที track ต่อเนื่องโดยไม่มีระยะห่าง
2. ตรวจหา accelerometer, gyroscope, magnetometer, compass ทีเปิดตลอดเวลา
3. ตรวจหา camera, microphone, Bluetooth, NFC ทีไม่ปิดหลังใช้งาน
4. ตรวจหา wake locks ทีถือครองนานเกินไปหรือไม่ release
5. ตรวจหา screen keep-awake, brightness, vibration ทีใช้มากเกินไป

### 4. Review Network And Sync

Review network activity และการ sync ข้อมูล

> Goal: รวมและลด network ลงเพื่อประหยัดพลังงาน

1. ตรวจหา network requests ทียิงบ่อยหรือซ้ำซ้อน
2. ตรวจหา retries ทีรวดเร็วเกินไปหรือไม่มี exponential backoff
3. ตรวจหา real-time WebSocket หรือ SSE ทีเปิดโดยไม่จำเป็น
4. ตรวจหา background sync ทีเกิดบ่อยหรือขนาด payload ใหญ่
5. ตรวจสอบ batching, debouncing, coalescing ของ requests
6. ตรวจสอบ cache และ stale-while-revalidate เพื่อลด network round-trips

### 5. Review Background And Foreground Services

Review services ทีทำงานระหว่าง background หรือ foreground

> Goal: ลดงาน background ทีไม่จำเป็นหรือไม่มีเงื่อนไขตื่น

1. ตรวจหา background services, foreground services, background tasks ทีทำงานบ่อย
2. ตรวจหา push notifications, Firebase Cloud Messaging, local notifications ทีปลุกอุปกรณ์บ่อย
3. ตรวจหา work manager, job scheduler, AlarmManager, periodic tasks ที interval สั้น
4. ตรวจหา start-up tasks หรือ initialization ทีเกิดทุกครั้งแม้ไม่จำเป็น
5. ตรวจสอบ Doze, App Standby, low-power mode handling บน mobile

### 6. Review UI And Rendering

Review การ render UI และ animations

> Goal: ลด GPU/CPU load จาก UI updates

1. ตรวจหา animations, transitions ทีรันโดยไม่มี pause หรือ stop condition
2. ตรวจหา infinite scroll หรือ auto-play media ทีดึงทรัพยากรต่อเนื่อง
3. ตรวจหา layout thrashing, forced reflow/repaint บน browser
4. ตรวจหา re-renders บ่อยใน UI framework เช่น React, Vue, Svelte, Angular
5. ตรวจหา heavy canvas, WebGL, video ทีไม่ pause เมื่อ off-screen

### 7. Review Compute And Algorithms

Review การคำนวณและ algorithm ทีใช้พลังงาน

> Goal: ลด CPU time และ thermal throttling

1. ตรวจหา heavy computations บน main thread หรือ UI thread
2. ตรวจหา nested loops หรือ high time complexity บน critical paths
3. ตรวจหา crypto, compression, encoding ทีรัน repeatedly บน input ใหญ่
4. ตรวจหา repeated parsing/serialization ของ JSON, XML, binary
5. ตรวจหา long-running synchronous operations ที block กระบวนการอื่น

### 8. Validate Findings

ตรวจสอบ findings

> Goal: issues ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate หลายมิติ: cross-reference, type safety, runtime, platform constraints
2. ทำ `/validate` สำหรับแต่ละ finding — จัดลำดับ Critical → High → Medium → Low
3. ตัด false positives และขาด evidence ไม่ report

### 9. Report

รายงานผล review

> Goal: รายงาน aggregate findings พร้อม actionable recommendations

1. ทำ `/report-review` และ `/report-table`
2. สร้างตาราง findings พร้อม severity, file, line, recommendation
3. ทำ `/suggest-next-action`

### 10. Implement All

ตรวจสอบ implementation completeness

> Goal: ไม่มี TODO, MOCK, STUB ค้าง

1. ทำ `/implement-all` สำหรับ areas ที review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings

## Rules

### 1. Scope And Delegation

- ไม่ duplicate กับ performance review หรือ memory review — focus ที battery/energy-specific issues
- ถ้า issue ซ้อนทับกับ review อื่น → อ้างอิงแทน
- ถ้า project ไม่มี battery-sensitive dimension → ข้าม workflow นี้

### 2. Severity Classification

- Critical: wake lock ค้าง, GPS track ต่อเนื่องโดยไม่จำเป็น, high-frequency polling บน hot path, battery drain สูงบน user-facing flow
- High: network retries ไม่มี backoff, background sync บ่อย, sensors ไม่ปิด, animations ไม่หยุด, heavy compute บน main thread
- Medium: suboptimal polling interval, missing batching, cache ไม่ช่วยลด network, inefficient render
- Low: minor tuning opportunity, logging/telemetry บ่อยเกินไป

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path, line number, code snippet หรือ config evidence
- ไม่ report โดยไม่มี evidence
- ใช้ power profiling, battery metrics, หรือ code structure เป็น evidence

### 4. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- Findings พร้อม severity, review score, และ actionable recommendations
- Review score ต่อ dimension และ overall
- Before/after battery/energy metrics ถ้ามี
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
