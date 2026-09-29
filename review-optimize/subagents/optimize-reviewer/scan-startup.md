---
name: scan-startup
description: Scan startup/boot path — eager work, sequential awaits, pre-paint services
---

# Scan Startup And Boot

## Goal

first paint / time-to-interactive เร็วขึ้น — boot path ไม่แบกงานที่ไม่จำเป็น

## Checks

1. Entry file (`main.tsx`, `index.ts`, `main.rs`) — eager imports ของหนัก: charts, editors, icon sets, font families ที่ไม่ใช่ UI default
2. Mount/init function — `await` sequential ของ independent calls (event listeners, IPC, fetches) ที่ `Promise.all` ได้
3. Services ที่เริ่มใน `onMount`/constructor แต่ไม่กระทบ first paint — schedulers, pollers, sync, reminder, cloud checks → candidates สำหรับ `requestIdleCallback`/deferred
4. Sync I/O หรือ CPU work บน main thread ระหว่าง boot — JSON.parse ขนาดใหญ่, DB migration, file enumeration
5. Fonts/CSS — `@fontsource`/Google Fonts ทุกตัว load ตอน boot หรือไม่; font ที่ใช้เฉพาะ feature ควร defer
6. Deep-link/cold-start path — work ที่ทำก่อน routing เสร็จ
7. window visible/flash — หน้าต่างแสดงก่อน content พร้อมหรือไม่ (desktop apps)

## Severity

- Critical: sync I/O หรือ heavy parse block first paint > 500ms
- High: sequential `await` chain ของ independent calls, heavy module eager ใน entry
- Medium: services เริ่มก่อน idle ที่ defer ได้
- Low: font/asset deferral ที่ประหยัด < 50ms
