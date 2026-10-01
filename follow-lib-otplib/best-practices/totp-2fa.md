# Best Practices: otplib (TOTP/HOTP 2FA)

แนวทาง implement 2FA ด้วย TOTP ให้ปลอดภัยและใช้งานจริงได้ราบรื่น

## Recommended Patterns

- ใช้ TOTP เป็นหลัก — HOTP เฉพาะ use case ที่ counter-based sync จำเป็นจริงๆ (เช่น hardware token)
- Enroll flow: `generateSecret()` → เก็บ secret encrypted → `generateURI({issuer, label, secret})` → render QR → verify token แรกก่อนเปิดใช้ 2FA
- Verify ด้วย `await verify({secret, token})` แล้วเช็ค `result.valid` — API คืน object ไม่ใช่ boolean
- ตั้ง `epochTolerance` (เช่น 1 window = ±30s) เผื่อ clock drift ระหว่าง server กับ authenticator app
- Secret เก็บ encrypted at rest (AES/KMS) — ห้าม plaintext ใน database หรือ log
- Recovery codes แบบ single-use เป็นช่องทางสำรองเมื่อ user เสีย device — hash ก่อนเก็บเหมือน password

## Do / Don't

| Do | Don't |
|---|---|
| verify ฝั่ง server เท่านั้น | generate/verify TOTP ฝั่ง client (secret หลุด) |
| rate-limit verify endpoint (เช่น 5 ครั้ง/นาที) | ปล่อย brute-force 6-digit token ได้ไม่จำกัด |
| เช็ค `result.valid` จาก `verify()` | assume `verify` คืน boolean |
| เก็บ secret encrypted + masked ใน UI | แสดง secret เต็มหลัง enroll แล้ว |
| ใช้ `generateURI` สร้าง otpauth:// แล้ว render QR | concatenate URI string เอง (issuer/label encoding พลาด) |
| มี recovery path (backup codes, admin reset) | lock user ถาวรเมื่อเสีย device |

## Common Pitfalls

- `verify`/`verifySync` คืน `{valid}` ไม่ใช่ boolean — check ผิดทำให้ทุก token ผ่านหรือไม่ผ่านหมด
- `generateSync`/`verifySync` ใช้ได้เฉพาะ sync crypto plugin (`@otplib/plugin-crypto-node`/`noble`) — เรียกบน async plugin throw error
- Clock drift ทำ valid token fail — อย่าตั้ง `epochTolerance` เป็น 0 โดยไม่จำเป็น (แต่อย่ากว้างเกิน 1-2 windows เพราะลด security)
- secret reuse ข้าม user — `generateSecret()` ต่อ enrollment เสมอ อย่า derive จาก user id
- otpauth URI ผิด format — authenticator app scan ไม่ได้; ใช้ `generateURI` เสมอ
- migrate จาก v12: `@otplib/v12-adapter` เป็น bridge ชั่วคราว — plan ย้ายไป functional/class API ใหม่

## Performance Notes

- TOTP verify เป็น crypto เบา (HMAC) — bottleneck จริงคือ DB lookup + rate limiter ไม่ใช่ token math
- Async API ใช้ WebCrypto/Node crypto async — throughput ดีกว่า sync บน high concurrency
- อย่า re-generate secret ทุก verify — generate ครั้งเดียวตอน enroll
- Cache user record + secret ใน session หลัง login เพื่อลด DB hit ตอน challenge

## Ecosystem / Integration

- QR rendering จาก `otpauth://` URI → `/follow-lib-qrcode` (`toDataURL`/`toString`)
- Issuer/label ใน URI ควรตรง app name — authenticator app แสดงชื่อนี้ให้ user
- Combine กับ session flow: verify TOTP ผ่าน → mark session เป็น `2fa-verified` อย่าเช็คซ้ำทุก request
