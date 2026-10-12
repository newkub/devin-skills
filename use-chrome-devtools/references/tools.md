# chrome-devtools-mcp Tools Reference

| key | value |
|-----|-------|
| package | `chrome-devtools-mcp` (npm, GoogleChromeLabs) |
| install/register | `bunx -y chrome-devtools-mcp@1.10.1` หรือ `npx -y chrome-devtools-mcp@1.10.1` เป็น stdio MCP server |
| stable version | `1.10.1` (published 2026-09-23, verified 2026-10-03) |
| requires | Chrome ติดตั้งในเครื่อง (launch/connect ผ่าน CDP) |
| docs/repo | https://github.com/ChromeDevTools/chrome-devtools-mcp |

ทุก tool รับ `pageId` (number) สำหรับ target page — ได้จาก `list_pages`/`new_page`; interact tools รับ `uid` จาก `take_snapshot`

## Pages And Navigation

| tool | description | key params |
|------|-------------|-----------|
| `new_page` | เปิด tab ใหม่พร้อม URL | `url`, `background` |
| `navigate_page` | navigate page ปัจจุบัน | `url`, `type` (navigate/back/forward/reload), `timeout`, `ignoreCache` |
| `list_pages` | list pages ทั้งหมดพร้อม pageId | — |
| `select_page` | เลือก page active | `pageId` |
| `close_page` | ปิด page (page สุดท้ายปิดไม่ได้) | `pageId` |
| `wait_for` | รอเงื่อนไข | `text` (array), `timeout` |
| `resize_page` | resize viewport ของ page | `width`, `height` |

## Interaction (uid จาก snapshot)

| tool | description | key params |
|------|-------------|-----------|
| `take_snapshot` | อ่าน a11y tree → uid ของ elements | `verbose`, `filePath` |
| `click` | click element (`dblClick: true` = double) | `uid`, `dblClick`, `includeSnapshot` |
| `hover` | hover element | `uid`, `includeSnapshot` |
| `fill` | กรอก input/textarea/select | `uid`, `value`, `includeSnapshot` |
| `fill_form` | กรอกหลาย fields ครั้งเดียว — prefer สำหรับฟอร์ม | `elements: [{uid,value}]`, `includeSnapshot` |
| `type_text` | พิมพ์ text (keyboard events) | `text`, `submitKey` |
| `press_key` | กด key/shortcut | `key` (เช่น `Enter`, `Control+A`) |
| `drag` | drag element ไปหาอีก element | `from_uid`, `to_uid` |
| `upload_file` | upload ไฟล์เข้า input | `uid`, `filePath` |
| `handle_dialog` | accept/dismiss dialog + prompt text | `action`, `promptText` |
| `evaluate_script` | รัน JS function ในหน้า (return JSON) | `function`, `args`, `filePath`, `dialogAction`, `waitForStableDom` |

## Inspection

| tool | description | key params |
|------|-------------|-----------|
| `list_console_messages` | console messages ตั้งแต่ navigation ล่าสุด | `types`, `pageSize`, `pageIdx`, `includePreservedMessages`, `includeStackTraces` |
| `get_console_message` | รายละเอียด message ต่อ `msgid` | `msgid` |
| `list_network_requests` | requests ทั้งหมด (status, method, url, type) | `pageSize`, `pageIdx`, `resourceTypes` |
| `get_network_request` | headers/cookies/body ของ request | `reqid`, `requestFilePath`, `responseFilePath` |
| `get_css_styles` | matched/inline/inherited/cascade rules ของ element | `uid`, `pageSize`, `pageIdx` |
| `take_screenshot` | capture ภาพ | `format` (png/jpeg/webp), `quality`, `fullPage`, `uid` (element), `filePath` |

## Performance, Memory And Audits

| tool | description | key params |
|------|-------------|-----------|
| `performance_start_trace` | เริ่ม record performance trace | `reload`, `autoRecord` |
| `performance_stop_trace` | หยุด trace ได้ผลลัพธ์ | `filePath` |
| `performance_analyze_insight` | วิเคราะห์ trace → CWV insights | `insightSetId`, `insightName` |
| `take_heapsnapshot` | heap snapshot สำหรับ memory analysis | `filePath` |
| `lighthouse_audit` | audit a11y/SEO/best-practices/agentic (ไม่รวม perf) | `mode` (navigation/snapshot), `device` (desktop/mobile), `outputDirPath` |

## Emulation

| tool | description | key params |
|------|-------------|-----------|
| `emulate` | จำลอง conditions ต่อ page | `networkConditions`, `cpuThrottlingRate`, `geolocation`, `userAgent`, `colorScheme`, `viewport`, `extraHttpHeaders` |
