# Lib Otplib Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs site | https://otplib.github.io/otplib/ |
| Repository README | https://github.com/yeojz/otplib |
| Migration v12→v13 | https://github.com/yeojz/otplib/releases |
| TOTP spec (RFC 6238) | https://datatracker.ietf.org/doc/html/rfc6238 |

## Key Concepts

- v13: single `otplib` package — exports `totp`, `hotp`, `authenticator`, `generateSecret`, `keyuri`
- `totp.check` return boolean; ใช้ `verify` ถ้าต้องการ delta
- สร้าง QR สำหรับ enroll: `keyuri` → render ด้วย `qrcode` package
- Window tolerance: `totp.options = { window: 1 }`
