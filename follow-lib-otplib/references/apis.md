| key | value |
|---|---|
| version | 13.5.0 |
| package registry | https://www.npmjs.com/package/otplib |
| repository | https://github.com/yeojz/otplib |
| docs | https://github.com/yeojz/otplib |

| api | description | default | options |
|---|---|---|---|
| `generateSecret()` | สร้าง base32 secret | - | - |
| `generate({secret})` / `generateSync` | สร้าง TOTP token (async-first) | 30s period, SHA1 | `period`, `digits`, `algorithm` |
| `verify({secret, token})` / `verifySync` | verify token — คืน `VerifyResult` เช็ค `.valid` | - | `epochTolerance` (clock drift) |
| `generateURI({issuer, label, secret})` | otpauth:// URI สำหรับ QR | - | - |
| `new OTP()` | class API (`otplib/class`) — method เดียวกัน | TOTP strategy | - |
| `@otplib/totp` functions | scoped TOTP — ต้องส่ง `crypto`, `base32` plugins | - | - |
