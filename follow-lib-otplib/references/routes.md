# Lib Otplib Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs site | https://otplib.yeojz.dev |
| Repository README | https://github.com/yeojz/otplib |
| Migration v12→v13 | https://otplib.yeojz.dev/guide/v12-adapter.html |
| TOTP spec (RFC 6238) | https://datatracker.ietf.org/doc/html/rfc6238 |

## Key Concepts

- v13: single `otplib` package — exports `generateSecret`, `generate`, `verify`, `generateURI` (+ `Sync` variants) และ class `OTP` (`otplib/class`)
- `verify` คืน `VerifyResult` — เช็ค `result.valid`; async-first (ใช้ `*Sync` กับ sync crypto plugin)
- สร้าง QR สำหรับ enroll: `generateURI({issuer, label, secret})` → render ด้วย `qrcode` package
- Clock drift tolerance: `epochTolerance` ใน verify options; scoped packages ต้อง inject `crypto`/`base32` plugins เอง
