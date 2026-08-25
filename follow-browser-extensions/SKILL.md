---
name: follow-browser-extensions
description: ทำตามมาตรฐาน browser extension development ตาม Manifest V3
---

## Goal

ทำตามมาตรฐาน browser extension development สำหรับ Chrome, Firefox, Edge และ browsers อื่นๆ ตาม Manifest V3

## Scope

ใช้สำหรับงานที่เกี่ยวข้องกับ browser extensions ที่มีอยู่แล้ว เช่น แก้ไข features, ปรับ permissions, อัปเดต manifest, หรือทำ cross-browser compatibility

## Execute

### 1. Identify Extension Type

> Goal: ทราบประเภท extension และ browser target

1. อ่าน `manifest.json` เพื่อระบุ `manifest_version`, `permissions`, และ entry points
2. ระบุ browser target: Chrome, Firefox, Edge, หรือ cross-browser
3. ตรวจสอบ framework ที่ใช้: WXT, Plasmo, หรือ vanilla

### 2. Follow Manifest V3

> Goal: manifest ถูกต้องตาม Manifest V3 standard

1. ตรวจสอบ `manifest_version: 3`
2. ใช้ `background.service_worker` แทน background pages
3. ตรวจสอบ `permissions` และ `host_permissions` ให้ minimal
4. ถ้าสร้างใหม่ → ทำ `/follow-create-browser-extensions`

### 3. Implement Features

> Goal: พัฒนา features ตามโครงสร้างของ extension

1. แยก pure logic ออกจาก browser API integration
2. ใช้ content scripts สำหรับ web page modification
3. ใช้ background service worker สำหรับ events และ state
4. ใช้ popup หรือ side panel สำหรับ user interaction

### 4. Test Cross-Browser

> Goal: extension ทำงานได้บนทุก browser target

1. โหลด extension ใน Chrome developer mode
2. ทดสอบบน Firefox ด้วย temporary add-on
3. ตรวจสอบ console errors และ permission warnings
4. ทำ `/run-check` เพื่อตรวจ lint และ typecheck

### 5. Validate And Ship

> Goal: extension ผ่านเกณฑ์และพร้อมส่งมอบ

1. ทำ `/validate` เพื่อตรวจ syntax และ config
2. ถ้า validate ไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)
3. ทำ `/ship-code` เพื่อส่งมอบงาน

## Rules

### 1. Manifest V3

- ใช้ Manifest V3 standard เท่านั้น
- ใช้ service workers แทน background pages
- กำหนด `permissions` ให้ minimal ตามที่จำเป็นจริง

### 2. Security

- ไม่ hardcode API keys หรือ secrets ใน extension code
- ใช้ Content Security Policy ตาม browser guidelines
- Validate user inputs ทุกจุด

### 3. Cross-Browser Compatibility

- ทดสอบบนทุก browser target ก่อน ship
- ใช้ `browser.*` API แทน `chrome.*` เมื่อต้องการ cross-browser
- ตรวจสอบ browser-specific permission differences

## Expected Outcome

- Browser extension ที่ถูกต้องตาม Manifest V3 standard
- `permissions` minimal และเหมาะสม
- Extension ทำงานได้บนทุก browser target
- ผ่าน `/validate` และ `/run-check`
