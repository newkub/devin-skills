---
name: follow-create-browser-extensions
description: สร้าง browser extensions ตาม Manifest V3 สำหรับ Chrome, Firefox, Edge
---

## Goal

สร้าง browser extensions สำหรับ Chrome, Firefox, Edge และ browsers อื่นๆ ตาม Manifest V3 standard

## Scope

ใช้สำหรับการสร้าง extensions ที่ modify web pages, add functionality, integrate กับ web services และ automate browser tasks

## Execute

### 1. Create Project

> Goal: เริ่มต้น project ด้วย WXT หรือ scaffolding tool

1. ทำ `/follow-wxt` ถ้าใช้ WXT
2. สร้าง `manifest.json` ตาม Manifest V3
3. สร้างโครงสร้าง: `src/background.ts`, `src/content.ts`, `src/popup/`
4. ติดตั้ง dependencies ด้วย `bun install`

### 2. Configure Manifest

> Goal: ตั้งค่า `manifest.json` ตาม Manifest V3

1. ตั้งค่า `manifest_version: 3`
2. กำหนด `name`, `version`, `description`
3. ระบุ `permissions` และ `host_permissions` เท่านทีจำเป็น
4. ระบุ `background.service_worker`, `content_scripts`, `action.default_popup`

### 3. Implement Features

> Goal: พัฒนา background, content, และ popup scripts

1. สร้าง background service worker สำหรับ events
2. สร้าง content script สำหรับ web page integration
3. สร้าง popup UI สำหรับ user interaction
4. แยก pure logic ออกจาก browser API integration

### 4. Test

> Goal: Test บน browsers ที่ต้องการ support

1. โหลด extension ใน Chrome developer mode
2. ทดสอบบน Firefox ด้วย temporary add-on
3. ตรวจสอบ console errors และ permissions
4. ทดสอบ cross-browser compatibility

### Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### Manifest V3

- ใช้ Manifest V3 standard
- ใช้ service workers แทน background pages
- Configure permissions อย่างเหมาะสม

### Security

- ไม่ hardcode API keys
- ใช้ content security policy
- Validate user inputs

### Best Practices

- ใช้ TypeScript สำหรับ type safety
- Test บนหลาย browsers
- Follow browser extension guidelines

## Expected Outcome

- Browser extensions ที่ compatible กับ multiple browsers
- Code ที่ follow Manifest V3 standard
- Security ที่เหมาะสม
