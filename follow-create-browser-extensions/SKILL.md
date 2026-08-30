---
name: follow-create-browser-extensions
description: สร้างและดูแล browser extensions ตาม Manifest V3 สำหรับ Chrome, Firefox, Edge
related:
  - deploy-to-cloudflare
  - follow-create-web
  - follow-my-tech-stack
  - review-techstack
  - follow-tool-vite
  - follow-framework-wxt
  - deep-validate
---
## Goal

สร้างและดูแล browser extensions สำหรับ Chrome, Firefox, Edge และ browsers อื่นๆ ตาม Manifest V3 standard

## Scope

ใช้สำหรับการสร้าง extensions ใหม่ หรือแก้ไข extensions ที่มีอยู่แล้ว เช่น modify web pages, add functionality, integrate กับ web services, automate browser tasks, ปรับ permissions หรือ cross-browser compatibility

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Identify Or Create Extension

> Goal: ทราบว่าเป็น extension ใหม่หรือมีอยู่แล้ว และเตรียม project

1. ถ้า extension มีอยู่แล้ว:
   - อ่าน `manifest.json` เพื่อระบุ `manifest_version`, `permissions`, และ entry points
   - ระบุ browser target: Chrome, Firefox, Edge หรือ cross-browser
   - ตรวจสอบ framework ที่ใช้: WXT, Plasmo หรือ vanilla
2. ถ้าสร้างใหม่:
   - ทำ `/follow-framework-wxt` ถ้าใช้ WXT
   - สร้าง `manifest.json` ตาม Manifest V3
   - สร้างโครงสร้าง: `src/background.ts`, `src/content.ts`, `src/popup/`
   - ติดตั้ง dependencies ด้วย `bun install`

### 3. Configure Manifest

> Goal: ตั้งค่า `manifest.json` ตาม Manifest V3

1. ตั้งค่า `manifest_version: 3`
2. กำหนด `name`, `version`, `description`
3. ระบุ `permissions` และ `host_permissions` เท่านทีจำเป็น
4. ระบุ `background.service_worker`, `content_scripts`, `action.default_popup`

### 4. Implement Features

> Goal: พัฒนา background, content, และ popup scripts

1. สร้าง background service worker สำหรับ events
2. สร้าง content script สำหรับ web page integration
3. สร้าง popup UI สำหรับ user interaction
4. แยก pure logic ออกจาก browser API integration

### 5. Test Cross-Browser

> Goal: extension ทำงานได้บนทุก browser target

1. โหลด extension ใน Chrome developer mode
2. ทดสอบบน Firefox ด้วย temporary add-on
3. ตรวจสอบ console errors และ permission warnings
4. ทดสอบ cross-browser compatibility

### 6. Validate And Ship

> Goal: extension ผ่านเกณฑ์และพร้อมส่งมอบ

1. ทำ `/deep-validate` เพื่อตรวจ syntax และ config
2. ถ้า validate ไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)
3. ทำ `/ship` เพื่อส่งมอบงาน

## Rules

### 1. Manifest V3

- ใช้ Manifest V3 standard
- ใช้ service workers แทน background pages
- Configure permissions อย่างเหมาะสม

### 2. Security

- ไม่ hardcode API keys
- ใช้ content security policy
- Validate user inputs

### 3. Cross-Browser Compatibility

- ทดสอบบนทุก browser target ก่อน ship
- ใช้ `browser.*` API แทน `chrome.*` เมื่อต้องการ cross-browser
- ตรวจสอบ browser-specific permission differences

### 4. Best Practices

- ใช้ TypeScript สำหรับ type safety
- Test บนหลาย browsers
- Follow browser extension guidelines

- ใช้ /deploy-to-cloudflare ถ้าจำเป็น
- ใช้ /follow-create-web ถ้าจำเป็น
- ใช้ /follow-tool-vite ถ้าจำเป็น

## Expected Outcome

- Browser extensions ที่ compatible กับ multiple browsers
- Code ที่ follow Manifest V3 standard
- Security ที่เหมาะสม
- ผ่าน `/deep-validate` และ `/run-check`
