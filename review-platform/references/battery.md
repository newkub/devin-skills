# Battery And Energy Checks

## Polling And Timers

1. ตรวจหา `setInterval`, `setTimeout`, cron jobs, หรือ loops ที่รัน background โดยไม่มี interval ยาวพอ
2. ตรวจหา polling ที่ซ้ำซ้อนกันหลายจุด
3. ตรวจหา timers ที่ไม่มีการ clear หรือหยุดเมื่อไม่ใช้งาน
4. ตรวจหา high-frequency updates บน UI หรือ state ที่ไม่จำเป็น

## Sensors And Hardware

1. ตรวจหา GPS, location services, geolocation API ที่ track ต่อเนื่องโดยไม่มีระยะห่าง
2. ตรวจหา accelerometer, gyroscope, magnetometer, compass ที่เปิดตลอดเวลา
3. ตรวจหา camera, microphone, Bluetooth, NFC ที่ไม่ปิดหลังใช้งาน
4. ตรวจหา wake locks ที่ถือครองนานเกินไปหรือไม่ release
5. ตรวจหา screen keep-awake, brightness, vibration ที่ใช้มากเกินไป

## Network And Sync

1. ตรวจหา network requests ที่ยิงบ่อยหรือซ้ำซ้อน
2. ตรวจหา retries ที่รวดเร็วเกินไปหรือไม่มี exponential backoff
3. ตรวจหา real-time WebSocket หรือ SSE ที่เปิดโดยไม่จำเป็น
4. ตรวจหา background sync ที่เกิดบ่อยหรือขนาด payload ใหญ่
5. ตรวจสอบ batching, debouncing, coalescing ของ requests
6. ตรวจสอบ cache และ stale-while-revalidate เพื่อลด network round-trips

## Background And Foreground Services

1. ตรวจหา background services, foreground services, background tasks ที่ทำงานบ่อย
2. ตรวจหา push notifications, Firebase Cloud Messaging, local notifications ที่ปลุกอุปกรณ์บ่อย
3. ตรวจหา work manager, job scheduler, AlarmManager, periodic tasks ที่ interval สั้น
4. ตรวจหา start-up tasks หรือ initialization ที่เกิดทุกครั้งแม้ไม่จำเป็น
5. ตรวจสอบ Doze, App Standby, low-power mode handling บน mobile

## UI And Rendering

1. ตรวจหา animations, transitions ที่รันโดยไม่มี pause หรือ stop condition
2. ตรวจหา infinite scroll หรือ auto-play media ที่ดึงทรัพยากรต่อเนื่อง
3. ตรวจหา layout thrashing, forced reflow/repaint บน browser
4. ตรวจหา re-renders บ่อยใน UI framework เช่น React, Vue, Svelte, Angular
5. ตรวจหา heavy canvas, WebGL, video ที่ไม่ pause เมื่อ off-screen

## Compute And Algorithms

1. ตรวจหา heavy computations บน main thread หรือ UI thread
2. ตรวจหา nested loops หรือ high time complexity บน critical paths
3. ตรวจหา crypto, compression, encoding ที่รัน repeatedly บน input ใหญ่
4. ตรวจหา repeated parsing/serialization ของ JSON, XML, binary
5. ตรวจหา long-running synchronous operations ที่ block กระบวนการอื่น

## Scope And Delegation

- ไม่ duplicate กับ performance review หรือ memory review — focus ที่ battery/energy-specific issues
- ถ้า issue ซ้อนทับกับ review อื่น → อ้างอิงแทน
- ถ้า project ไม่มี battery-sensitive dimension → ข้าม workflow นี้

## Severity

- Critical: wake lock ค้าง, GPS track ต่อเนื่องโดยไม่จำเป็น, high-frequency polling บน hot path, battery drain สูงบน user-facing flow
- High: network retries ไม่มี backoff, background sync บ่อย, sensors ไม่ปิด, animations ไม่หยุด, heavy compute บน main thread
- Medium: suboptimal polling interval, missing batching, cache ไม่ช่วยลด network, inefficient render
- Low: minor tuning opportunity, logging/telemetry บ่อยเกินไป
