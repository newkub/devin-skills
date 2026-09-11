# Lib Qrcode Routes / Topics

| Route / Topic | URL |
|---|---|
| README | https://github.com/soldair/node-qrcode |
| Options | https://github.com/soldair/node-qrcode#qr-code-options |
| Browser usage | https://github.com/soldair/node-qrcode#browser |
| Error correction | https://github.com/soldair/node-qrcode#error-correction-level |

## Key Concepts

- `errorCorrectionLevel`: `L`(7%) `M`(15%) `Q`(25%) `H`(30%) — H สำหรับ QR ที่มี logo
- Segments: `QRCode.create` รับ mixed-mode segments (numeric/alphanumeric/byte/kanji)
- Browser: import `qrcode` ใช้ `toCanvas` หรือ `toDataURL` — ไม่มี deps ใหญ่
- ใช้คู่กับ `otplib` (`keyuri`) สำหรับ TOTP enrollment
