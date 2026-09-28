---
name: review-browser-ext-migrate-mv3
description: Migrate extension to MV3 — service worker, action API, declarativeNetRequest, permissions
argument-hint: "[extension-dir]"
related:
  - review-browser-ext
  - run-test
  - report-before-after
  - ask-me
---

## Goal

Migrate browser extension ไป Manifest V3 จริงตาม findings ของ `/review-browser-ext` — background page → service worker และ APIs ใหม่

## Scope

- ใช้หลัง review เสร็จและ user confirm — one-shot migration ไม่ใช่ routine fix
- ครอบคลุม: manifest v3, service worker lifecycle, `action` API, `declarativeNetRequest`, host permissions, storage migration

## Execute

### 1. Inventory MV2 Usage

> Goal: รู้ว่าอะไรต้องเปลี่ยนทั้งหมด

1. `manifest.json` — `manifest_version`, `background`, `browser_action`/`page_action`, `webRequest` usage
2. background scripts — persistent page assumptions, DOM APIs ที่ SW ไม่มี (`window`, long-lived state)
3. permissions — `host_permissions` split, optional_permissions opportunities

### 2. Migrate Manifest + Background

> Goal: MV3 skeleton ทำงาน

1. `manifest_version: 3` — `background.service_worker`, `action` แทน `browser_action`, `host_permissions` แยก
2. service worker — state ไม่ persist ใน memory → `chrome.storage.session` หรือ recompute; event-driven lifecycle
3. DOM-dependent code → offscreen document เมื่อจำเป็นจริง

### 3. Migrate APIs

> Goal: functionality เหมือนเดิมบน APIs ใหม่

1. `webRequest` blocking → `declarativeNetRequest` rules (static/dynamic/session)
2. `chrome.browserAction` → `chrome.action`; callback APIs → promise forms เมื่อรองรับ
3. content scripts — `scripting.executeScript` แทน `tabs.executeScript`

### 4. Verify

> Goal: extension ทำงานเหมือนเดิมบน MV3

1. load unpacked + test core flows บนทุก target browser
2. `web-ext lint` / browser-specific validators ผ่าน
3. `/run-test` + `/report-before-after` — MV2 leftovers เหลือ 0

## Rules

- ทำทีละ subsystem: manifest → SW → APIs — big-bang rewrite ห้าม
- SW เป็น ephemeral — ทุก state ต้อง survive termination
- DNR rule limits — เช็ค quota ก่อน generate rules จำนวนมาก
- user confirm ก่อน permission model changes (UX prompt เปลี่ยน)

## Expected Outcome

- MV3-compliant extension: SW lifecycle-safe, DNR-based blocking
- Functionality parity verified บน target browsers
