# Lib Line Liff Routes / Topics

| Route / Topic | URL |
|---|---|
| LIFF docs | https://developers.line.biz/en/docs/liff/ |
| Getting started | https://developers.line.biz/en/docs/liff/getting-started/ |
| liff.init | https://developers.line.biz/en/reference/liff/#initialize-liff-app |
| LINE Developers Console | https://developers.line.biz/console/ |
| Versioning policy | https://developers.line.biz/en/docs/liff/versioning-policy/ |

## Key Concepts

- ต้องมี `liffId` จาก LIFF app ใน LINE Developers Console (ผูกกับ channel)
- `liff.init` ต้องรอ promise resolve ก่อนใช้ API อื่น — handle init failures เสมอ
- `getIDToken()` → ส่งให้ backend verify ผ่าน LINE verify endpoint
- นอก LINE app (external browser) → OAuth flow ผ่าน `liff.login()`
