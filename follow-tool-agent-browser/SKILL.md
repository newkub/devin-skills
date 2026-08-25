---
name: follow-tool-agent-browser
description: ใช้ agent-browser CLI สำหรับ browser automation และ web testing อย่างครบถ้วน
---

## Goal

ใช้ `agent-browser` CLI สำหรับ browser automation และ web testing อย่างมีประสิทธิภาพ ครอบคลุมการติดตั้ง การเปิด browser การ navigate การ interact การ monitor การ debug และการ cleanup

## Scope

ใช้สำหรับ browser automation, web testing, monitoring และ debugging ด้วย `agent-browser` CLI จาก Vercel Labs (vercel-labs/agent-browser)

## Execute
### 1. Install And Verify

> Goal: Install And Verify
ติดตั้ง `agent-browser` ก่อนใช้งานครั้งแรก

1. ติดตั้งด้วย `bun install -g agent-browser`
2. ดาวน์โหลด Chrome ด้วย `agent-browser install`
3. ตรวจสอบการติดตั้งด้วย `agent-browser --help`
4. ตรวจสอบเวอร์ชันด้วย `agent-browser --version`
5. ถ้าติดตั้งไม่ได้ ให้ใช้ `playwriter` skill หรือ `browser-preview` tool แทนตาม ## Rules ข้อ 8
### 2. Open Browser Session

> Goal: Open Browser Session
เปิด browser session ตาม ## Rules ข้อ 1

1. ใช้ `agent-browser open <url> --headed` เพื่อเปิด browser แบบมองเห็นหน้าต่าง
2. ใช้ `agent-browser open` เพื่อเปิด browser โดยไม่ navigate (อยู่ที่ about:blank)
3. ใช้ `agent-browser --session <name> open <url>` สำหรับ isolated sessions
4. ใช้ `agent-browser --profile <name|path> open <url>` สำหรับ persistent data
5. ถ้าเปิดไม่ได้ ให้ตรวจสอบว่า `agent-browser install` ทำแล้ว
6. ถ้า daemon error ให้ใช้ `browser-preview` tool แทน
### 3. Navigate

> Goal: Navigate
นำทางหน้าเว็บตาม ## Rules ข้อ 2

1. ใช้ `agent-browser open <url>` สำหรับเปิดและ navigate (aliases: `goto`, `navigate`)
2. ใช้ `agent-browser back` สำหรับย้อนกลับ
3. ใช้ `agent-browser forward` สำหรับไปหน้าถัดไป
4. ใช้ `agent-browser reload` สำหรับรีเฟรชหน้า
5. ใช้ `agent-browser pushstate <url>` สำหรับ SPA client-side navigation
6. ใช้ `agent-browser read [url]` สำหรับอ่าน agent-readable text จากหน้าเว็บ
### 4. Snapshot And Interact

> Goal: Snapshot And Interact
ถ่ายภาพ accessibility tree และโต้ตอบกับหน้าเว็บตาม ## Rules ข้อ 3

1. ใช้ `agent-browser snapshot -i` สำหรับดู interactive elements และ refs (แนะนำ)
2. ใช้ `agent-browser snapshot` สำหรับดู full accessibility tree
3. ใช้ `agent-browser click @e1` สำหรับคลิก element ด้วย ref
4. ใช้ `agent-browser fill @e2 "text"` สำหรับกรอกข้อมูล (clear ก่อนพิมพ์)
5. ใช้ `agent-browser type @e2 "text"` สำหรับพิมพ์โดยไม่ clear
6. ใช้ `agent-browser press Enter` สำหรับกดปุ่ม keyboard
7. ใช้ `agent-browser scroll down 500` สำหรับเลื่อนหน้า
8. ใช้ semantic locators เป็นทางเลือกแทน refs ตาม ## Rules ข้อ 3
### 5. Monitor And Debug

> Goal: Monitor And Debug
Monitor และ debug ตาม ## Rules ข้อ 4

1. ใช้ `agent-browser snapshot -i` สำหรับดู interactive elements และ refs
2. ใช้ `agent-browser screenshot` สำหรับ capture หน้าจอ
3. ใช้ `agent-browser screenshot --full` สำหรับ full-page screenshot
4. ใช้ `agent-browser screenshot --annotate` สำหรับ annotated screenshot
5. ใช้ `agent-browser console` สำหรับดู console messages
6. ใช้ `agent-browser errors` สำหรับดู page errors
7. ใช้ `agent-browser inspect` สำหรับเปิด Chrome DevTools
### 6. Handle Errors

> Goal: Handle Errors
จัดการ errors ที่เกิดขึ้นตาม ## Rules ข้อ 5
### 7. Cleanup And Close

> Goal: Cleanup And Close
ทำ cleanup หลังจากใช้งานเสร็จ

1. ปิด browser session ด้วย `agent-browser close`
2. ปิดทุก session ด้วย `agent-browser close --all`
3. ลบ temporary files และ profiles
4. สรุปผลลัพธ์และ issues ที่พบ

## Rules
### 1. Browser Configuration

ตั้งค่า browser configuration อย่างถูกต้อง

- ใช้ `agent-browser` เท่านั้นในการจัดการเบราว์เซอร์
- ใช้ `agent-browser open <url> --headed` เพื่อเปิด browser แบบมองเห็นหน้าต่าง
- ใช้ `agent-browser --session <name> open <url>` สำหรับ isolated sessions (global flag)
- ใช้ `agent-browser --profile <name|path> open <url>` สำหรับ persistent data (global flag)
- ใช้ `agent-browser --cdp <port> open <url>` สำหรับเชื่อมต่อผ่าน Chrome DevTools Protocol
- ใช้ `agent-browser --proxy <url> open <url>` สำหรับเชื่อมต่อผ่าน proxy
- ใช้ `agent-browser --user-agent <ua> open <url>` สำหรับกำหนด custom User-Agent
- ใช้ `agent-browser --color-scheme dark open <url>` สำหรับกำหนด color scheme
### 2. Navigation

นำทางหน้าเว็บอย่างถูกต้อง

- ใช้ `agent-browser open <url>` สำหรับเปิดและ navigate (aliases: `goto`, `navigate`)
- รองรับ protocols: `https://`, `http://`, `file://`, `about:`, `data://`
- ถ้าไม่ระบุ protocol จะ auto-prepend `https://`
- ใช้ `agent-browser back` สำหรับย้อนกลับ
- ใช้ `agent-browser forward` สำหรับไปหน้าถัดไป
- ใช้ `agent-browser reload` สำหรับรีเฟรช
- ใช้ `agent-browser pushstate <url>` สำหรับ SPA navigation (auto-detect Next.js router)
- ใช้ `agent-browser read [url]` สำหรับอ่าน agent-readable text หรือ rendered DOM
- ใช้ `agent-browser connect <port>` สำหรับเชื่อมต่อ browser ที่เปิดอยู่ผ่าน CDP
### 3. Snapshot And Interaction

ถ่ายภาพ accessibility tree และโต้ตอบกับหน้าเว็บอย่างถูกต้อง

- ใช้ `agent-browser snapshot -i` สำหรับ interactive elements เท่านั้น (แนะนำสำหรับ AI)
- ใช้ `agent-browser snapshot` สำหรับ full accessibility tree
- ใช้ `agent-browser snapshot -c` สำหรับ compact output
- ใช้ `agent-browser snapshot -d <n>` สำหรับ limit tree depth
- ใช้ `agent-browser snapshot -s "<selector>"` สำหรับ scope ไปที่ CSS selector
- ใช้ `agent-browser click @e1` สำหรับคลิกด้วย ref (จาก snapshot)
- ใช้ `agent-browser click @e1 --new-tab` สำหรับคลิกและเปิดใน tab ใหม่
- ใช้ `agent-browser fill @e2 "text"` สำหรับ clear แล้วกรอกข้อมูล
- ใช้ `agent-browser type @e2 "text"` สำหรับพิมพ์โดยไม่ clear
- ใช้ `agent-browser press <key>` สำหรับกด keyboard (เช่น `Enter`, `Control+a`)
- ใช้ `agent-browser hover @e1` สำหรับ hover
- ใช้ `agent-browser select @e1 "value"` สำหรับเลือก dropdown
- ใช้ `agent-browser check @e1` และ `agent-browser uncheck @e1` สำหรับ checkbox
- ใช้ `agent-browser scroll <dir> [px]` สำหรับ scroll (up/down/left/right)
- ใช้ `agent-browser scrollintoview @e1` สำหรับ scroll element เข้ามาใน view
- ใช้ `agent-browser drag @e1 @e2` สำหรับ drag and drop
- ใช้ `agent-browser upload @e1 <files>` สำหรับ upload files
- ใช้ semantic locators เป็นทางเลือก: `agent-browser find text "Sign In" click`
- ใช้ `agent-browser find role button click --name "Submit"` สำหรับ find by role
- ใช้ `agent-browser find label "Email" fill "user@test.com"` สำหรับ find by label
- ใช้ `agent-browser find placeholder "Search" type "query"` สำหรับ find by placeholder
- ใช้ `agent-browser find testid "submit-btn" click` สำหรับ find by testid
- รอให้ page load เสร็จก่อน interact ด้วย `agent-browser wait @e1` หรือ `agent-browser wait --load networkidle`
### 4. Monitoring And Debugging

Monitor และ debug อย่างมีประสิทธิภาพ

- ใช้ `agent-browser snapshot -i` สำหรับดู interactive elements และ refs
- ใช้ `agent-browser snapshot` สำหรับดู full accessibility tree
- ใช้ `agent-browser screenshot` สำหรับ capture หน้าจอ
- ใช้ `agent-browser screenshot --full` สำหรับ full-page screenshot
- ใช้ `agent-browser screenshot --annotate` สำหรับ annotated screenshot พร้อม element labels
- ใช้ `agent-browser pdf <path>` สำหรับ save เป็น PDF
- ใช้ `agent-browser console` สำหรับดู console messages
- ใช้ `agent-browser console --clear` สำหรับ clear console
- ใช้ `agent-browser errors` สำหรับดู page errors
- ใช้ `agent-browser errors --clear` สำหรับ clear errors
- ใช้ `agent-browser highlight @e1` สำหรับ highlight element
- ใช้ `agent-browser inspect` สำหรับเปิด Chrome DevTools
- ใช้ `agent-browser trace start` และ `agent-browser trace stop <path>` สำหรับ trace recording
- ใช้ `agent-browser profiler start` และ `agent-browser profiler stop <path>` สำหรับ profiling
- ใช้ `agent-browser record start <path>` และ `agent-browser record stop` สำหรับ video recording
### 5. Error Handling

จัดการ errors ที่เกิดขึ้นอย่างถูกต้อง

- เมื่อเจอ error ต้องเรียก `/resolve-errors` ทันที
- ถ้า `daemon` error ให้ใช้ `browser-preview` tool แทน
- ถ้า `agent-browser` ไม่ติดตั้ง ให้ใช้ `playwriter` skill แทน
- ถ้า click ไม่ได้เพราะ element ถูกบัง ให้ dismiss element ที่บังก่อน แล้ว retry
- บันทึก error logs ด้วย `agent-browser console` และ `agent-browser errors`
- ตรวจสอบ element availability ก่อน interact ด้วย `agent-browser wait @e1`
- ใช้ `agent-browser is visible @e1` ตรวจสอบ visibility ก่อน interact
### 6. Get Information

ดึงข้อมูลจากหน้าเว็บอย่างถูกต้อง

- ใช้ `agent-browser get text @e1` สำหรับดึง element text
- ใช้ `agent-browser get html @e1` สำหรับดึง innerHTML
- ใช้ `agent-browser get value @e1` สำหรับดึง input value
- ใช้ `agent-browser get attr @e1 href` สำหรับดึง attribute
- ใช้ `agent-browser get title` สำหรับดึง page title
- ใช้ `agent-browser get url` สำหรับดึง current URL
- ใช้ `agent-browser get count "<selector>"` สำหรับนับ matching elements
- ใช้ `agent-browser get box @e1` สำหรับดึง bounding box
- ใช้ `agent-browser get styles @e1` สำหรับดึง computed styles
### 7. Tabs And Windows

จัดการ tabs และ windows อย่างถูกต้อง

- ใช้ `agent-browser tab` สำหรับ list tabs
- ใช้ `agent-browser tab new [url]` สำหรับเปิด tab ใหม่
- ใช้ `agent-browser tab new --label <name> [url]` สำหรับเปิด tab พร้อม label
- ใช้ `agent-browser tab <id|label>` สำหรับ switch tab
- ใช้ `agent-browser tab close [id|label]` สำหรับปิด tab
- ใช้ `agent-browser window new` สำหรับเปิด window ใหม่
- tab ids เป็น `t1`, `t2`, `t3` (ไม่รับตัวเลข positional)
- labels ต้อง unique ใน session และไม่ถูก auto-generate
### 8. Fallback Options

ใช้ fallback เมื่อ `agent-browser` ไม่พร้อมใช้งาน

- ถ้า `agent-browser` ไม่ติดตั้ง ให้ใช้ `playwriter` skill (เชื่อมต่อ Chrome ที่เปิดอยู่)
- ติดตั้ง `playwriter` ด้วย `bun i -g playwriter` แล้ว `npx -y skills add remorses/playwriter`
- ถ้า `playwriter` ไม่พร้อม ให้ใช้ `browser-preview` tool สำหรับ preview web server
- ถ้าไม่มี fallback ใดใช้ได้ ให้แจ้งผู้ใช้ว่าต้องติดตั้ง `agent-browser` หรือ `playwriter`
### 9. Security

รักษา security ระหว่างการใช้งาน

- ไม่เก็บ sensitive data ใน browser profiles
- ใช้ isolated sessions สำหรับ sensitive operations
- ลบ temporary files และ profiles หลังใช้งาน
- ไม่แชร์ sessions ระหว่าง test cases
- ใช้ `agent-browser state save <path>` และ `agent-browser state load <path>` สำหรับจัดการ state
### 10. Performance

ปรับปรุง performance สำหรับ operations ต่อเนื่อง

- ใช้ `command chaining` && สำหรับ operations ต่อเนื่อง
- ใช้ `agent-browser --session <name>` สำหรับ isolated sessions (global flag)
- ใช้ `agent-browser --profile <name>` สำหรับ persistent data (global flag)
- ปิด sessions ที่ไม่ได้ใช้ด้วย `agent-browser close` เพื่อประหยัด resources
- ใช้ `--json` flag สำหรับ JSON output ที่ parse ง่ายใน scripts

## Expected Outcome

- Browser automation ทำงานได้อย่างมีประสิทธิภาพ
- การ navigate และ interact ทำงานถูกต้องด้วย refs จาก snapshot
- Console และ errors ถูก monitor อย่างต่อเนื่อง
- Screenshots และ traces ใช้สำหรับ debugging ได้อย่างมีประสิทธิภาพ
- Errors ที่เกิดขึ้นถูกจัดการอย่างถูกต้อง มี fallback options
- Sessions ถูก cleanup หลังใช้งาน
- Fallback ไป `playwriter` หรือ `browser-preview` เมื่อ `agent-browser` ไม่พร้อม