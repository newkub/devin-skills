# Agent Browser Setup

## Goal

ติดตั้งและ verify `agent-browser` ให้พร้อม capture หน้าเว็บ พร้อม fallback เมื่อติดตั้งไม่ได้

## Install And Verify

```bash
agent-browser --help
bun add -g agent-browser
agent-browser install
```

- `agent-browser --help` ต้องแสดง commands (open, screenshot, snapshot, click, close)
- `agent-browser install` ดาวน์โหลด Chrome ที่ใช้ควบคุม
- ถ้า command ไม่เจอ → ติดตั้ง global ด้วย `bun add -g agent-browser` แล้ว verify ใหม่

## Core Commands

- `agent-browser open <url> [--headed]` — เปิดหน้าเว็บ
- `agent-browser screenshot [--annotate] [--out <path>]` — capture ภาพ
- `agent-browser snapshot -i` — ดึง interactive elements + state
- `agent-browser reload` — reload หน้าปัจจุบัน
- `agent-browser click|type|select|hover` — interact กับ element
- `agent-browser console` — อ่าน console logs
- `agent-browser close` — ปิด session

## Fallback

- ถ้า `agent-browser` ติดตั้งหรือ launch ไม่ได้ → ใช้ `browser-preview` tool แทน
- `browser-preview` ต้องการ dev server ที่รันอยู่แล้ว — เริ่ม server ก่อน
- บันทึกเหตุผลของ fallback เพื่อให้ evidence traceable

## Retry Policy

- `maxRetries` = 3 สำหรับ crash ของ `agent-browser`
- ถ้า crash ซ้ำ → สลับไป `browser-preview` และแจ้ง user
