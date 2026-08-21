---
name: follow-create-browser-extensions
description: "Guidelines for creating browser extensions for Chrome, Firefox, Edge, and other browsers..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

สร้าง browser extensions สำหรับ Chrome, Firefox, Edge และ browsers อื่นๆ ตาม Manifest V3 standard


## Scope

ใช้สำหรับการสร้าง extensions ที่ modify web pages, add functionality, integrate กับ web services และ automate browser tasks


## Execute

### 1. Create Project

ใช้ `WXT` หรือ scaffolding tools

### 2. Configure Manifest

ตั้งค่า `manifest.json` ตาม Manifest V3

### 3. Implement Features

- Background scripts
- Content scripts
- Popup UI

### 4. Test

Test บน browsers ที่ต้องการ support


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


## References

- [Chrome Extensions Docs](https://developer.chrome.com/docs/extensions)
- [Firefox Add-ons Docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons)
- [MDN Web Extensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Chrome Web Store](https://chrome.google.com/webstore)
- [Firefox Add-ons](https://addons.mozilla.org)


## Expected Outcome

- Browser extensions ที่ compatible กับ multiple browsers
- Code ที่ follow Manifest V3 standard
- Security ที่เหมาะสม
