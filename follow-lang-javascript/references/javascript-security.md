# JavaScript Security

security practices สำหรับ JavaScript ที่ปลอดภัย

## Input Handling

- ใช้ `textContent` แทน `innerHTML` สำหรับ user input
- Sanitize user input ก่อนใช้

## Network Security

- ใช้ CSP (Content Security Policy)
- ใช้ HTTPS สำหรับ production
- ตรวจสอบ dependencies สำหรับ vulnerabilities

## Code Safety

- หลีกเลี่ยง `eval()` และ `Function()` constructor
- ใช้ `Object.freeze()` สำหรับ immutable configurations
