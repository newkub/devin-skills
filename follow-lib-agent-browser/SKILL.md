---
name: follow-lib-agent-browser
description: ใช้ agent-browser CLI สำหรับเปิด browser, interact, capture, a11y audit และ debug บน web apps
argument-hint: "[url]"
related:
---

## Goal

ใช้งาน `agent-browser` CLI (latest v0.36.0) ให้ effective สำหรับเปิด browser, navigate, interact, capture, a11y audit, debug และ batch automation บน web apps

## Scope

ใช้เมื่อต้องการ:
- เปิด/close browser session
- navigate URL หรือ route
- interact กับ elements (click, fill, type, select, hover, scroll, drag, upload)
- ค้นหา interactive elements ผ่าน `snapshot` และ `find`
- capture screenshots / PDF
- ตรวจสอบ accessibility
- monitor `console` และ `errors`
- รัน batch multi-step workflows

## Execute

### 1. Install And Verify

> Goal: Install And Verify

1. `npm install -g agent-browser` หรือ `bun add -g agent-browser`
2. `agent-browser install` (first time Chrome download)
3. `agent-browser --help` เพื่อดู commands
4. `agent-browser doctor` เพื่อตรวจสภาพและ repair ทั่วไป
5. `agent-browser upgrade` เพื่ออัปเดตเป็นเวอร์ชันล่าสุด

### 2. Session Lifecycle

> Goal: Session Lifecycle

```bash
agent-browser open                   # เปิด browser ที่ about:blank
agent-browser open <url>             # เปิดและ navigate
agent-browser open <url> --headed    # เปิดแบบมีหน้าต่าง (debug)
agent-browser close                  # ปิด session ปัจจุบัน
agent-browser close --all            # ปิดทุก session
```

browser session คงอยู่ผ่าน background daemon จึง chain commands ด้วย `&&` ได้

### 3. Navigation

> Goal: Navigation

```bash
agent-browser open <url>
agent-browser reload
agent-browser back
agent-browser forward
agent-browser pushstate <url>        # SPA client-side navigation
agent-browser wait 2000              # wait by milliseconds
agent-browser wait @e1               # wait for element
agent-browser wait --load networkidle
agent-browser wait --url "**/dashboard"
agent-browser wait --text "Welcome"
```

### 4. Discover Interactive Elements

> Goal: Discover Interactive Elements

```bash
agent-browser snapshot               # full accessibility tree
agent-browser snapshot -i            # interactive elements only พร้อม @ref
agent-browser snapshot -i -c         # compact output
agent-browser snapshot -s "#main"    # scope ด้วย CSS selector
agent-browser snapshot --json        # machine-readable output

agent-browser find role button click --name "Submit"
agent-browser find text "Add to cart" click
agent-browser find label "Email" fill "test@test.com"
agent-browser find first ".item" click
```

ใช้ `@ref` จาก `snapshot -i` สำหรับ commands ถัดไป

### 5. Common Interactions

> Goal: Common Interactions

```bash
agent-browser click @e1
agent-browser dblclick @e1
agent-browser hover @e1
agent-browser focus @e1
agent-browser fill @e1 "value"       # clear + type
agent-browser type @e1 "value"
agent-browser keyboard type "text"   # type ที่ focus ปัจจุบัน
agent-browser press Enter
agent-browser select @e1 "option"
agent-browser check @e1
agent-browser uncheck @e1
agent-browser scroll down 500
agent-browser scrollintoview @e1
agent-browser drag @e1 @e2
agent-browser upload @e1 "file.png"
```

### 6. Capture

> Goal: Capture

```bash
agent-browser screenshot
agent-browser screenshot page.png
agent-browser screenshot --full
agent-browser screenshot --annotate
agent-browser screenshot --screenshot-dir ./shots
agent-browser pdf page.pdf
```

### 7. Accessibility Audit

> Goal: Accessibility Audit

```bash
agent-browser a11y
agent-browser a11y <url>
agent-browser a11y --tags wcag2a,wcag2aa
agent-browser a11y --selector "#main"
agent-browser a11y --json
```

### 8. Console And Errors

> Goal: Console And Errors

```bash
agent-browser console
agent-browser console --json
agent-browser console --clear
agent-browser errors
agent-browser errors --clear
```

### 9. Info And State

> Goal: Info And State

```bash
agent-browser get text @e1
agent-browser get html @e1
agent-browser get value @e1
agent-browser get attr @e1 href
agent-browser get title
agent-browser get url
agent-browser get count ".item"
agent-browser is visible @e1
agent-browser is enabled @e1
agent-browser is checked @e1
```

### 10. Batch Commands And Device Settings

> Goal: Batch Commands And Device Settings

```bash
agent-browser batch \
  "open http://localhost:3000" \
  "wait --load networkidle" \
  "snapshot -i" \
  "click @e1" \
  "screenshot step1.png"

echo '[
  ["open","https://example.com"],
  ["snapshot","-i"],
  ["click","@e1"]
]' | agent-browser batch --json
```

ตั้งค่า device และ environment:

```bash
agent-browser set viewport 1280 720
agent-browser set device "iPhone 14"
agent-browser set media dark
agent-browser set offline on
```

## Rules

### 1. Prefer @ref

- ใช้ `@ref` จาก `snapshot -i` แทน CSS selector เมื่อได้
- ถ้าไม่มี `@ref` ให้ใช้ `find` หรือ selector ทั่วไป

### 2. Wait Before Interact

- ใช้ `agent-browser wait @e1` หรือ `wait --load networkidle` ก่อน interact
- ถ้า element โหลดช้า ให้ `wait 2000` แล้ว retry

### 3. Capture On Failure

- เมื่อ action ล้มเหลว ให้ `screenshot --annotate` และ `screenshot --full`
- บันทึก `console` และ `errors` เสมอ

### 4. Headed For Debug

- ใช้ `--headed` เมื่อต้องการ debug หรือ review UX
- ใช้ headless (default) เมื่อรัน automated tests

### 5. Clean Sessions

- ปิด session ด้วย `agent-browser close` เมื่อเสร็จ
- ใช้ `close --all` เมื่อต้องการ cleanup ทุก tab

### 6. CI / Reproducible

- ระบุ `--user-agent`, `--viewport`, `--color-scheme` ถ้าต้องการ reproducible
- ใช้ `batch` หรือ JSON stdin สำหรับ CI workflows

### 7. Clicks Fail Before Dispatch

- ถ้า element ถูก overlay บัง จะ error `covered by ...`
- ให้ dismiss banner หรือ scrollintoview ก่อน retry

## Expected Outcome

- เปิด browser และ navigate ได้
- interact กับทุก action type ได้
- capture screenshot และ audit a11y ได้
- debug ผ่าน console/errors ได้
- ใช้งาน agent-browser เป็น tool หลักสำหรับ browser automation
