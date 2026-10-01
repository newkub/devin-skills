# SimpleWebAuthn — Passkey UX และ Client-Side Patterns

Best practices สำหรับฝั่ง browser: conditional UI, error handling, fallback และ multi-device UX

## Recommended Patterns

### Conditional UI (Passkey Autofill)

ให้ user login ด้วย passkey โดยไม่ต้องพิมพ์ username:

```ts
// input field
<input autocomplete="username webauthn" />

// เรียกตอน page load (ไม่รอ user action)
const options = await fetchAuthOptions() // ไม่ผูกกับ user ที่ระบุ
await startAuthentication({ optionsJSON: options, useBrowserAutofill: true })
```

- เรียก autofill ตอน mount ของ login page — browser จะโชว์ passkey ใน autofill dropdown
- ต้องรองรับการ abort เมื่อ user เลือกพิมพ์ password แทน (wrap ใน try/catch + AbortController pattern)
- autofill ceremony ต้อง verify เหมือน ceremony ปกติ — เพียงแต่ challenge ไม่ผูกกับ user ล่วงหน้า ผูกกับ session แทน

### Error Taxonomy ที่ต้อง handle

| Error | สาเหตุ | UX ที่แนะนำ |
|---|---|---|
| `NotAllowedError` | user กด cancel, timeout, หรือ rpID/origin mismatch | แสดงปุ่ม retry + fallback |
| `InvalidStateError` | credential ซ้ำตอน registration | แจ้งว่าอุปกรณ์นี้ลงทะเบียนแล้ว |
| `NotSupportedError` | browser/authenticator ไม่รองรับ | fallback เป็น password/OTP |
| `AbortError` | ceremony ถูก abort (เช่น autofill ถูก cancel) | fail เงียบๆ ไม่ต้องแจ้ง error |
| `SecurityError` | origin/rpID mismatch | log + แจ้งให้ตรวจ domain config |
| network error | fetch options/verify fail | retry พร้อม backoff |

### Multi-Device และ Account UX

- รองรับหลาย passkeys ต่อ user — คนส่วนใหญ่มีหลายอุปกรณ์ (phone + laptop + security key)
- แสดงรายการ passkeys ใน settings พร้อมชื่อที่ user ตั้งได้ + last-used timestamp
- ให้ลบ passkey ได้ — และบอก user ว่าต้องลบบน authenticator ด้วยถ้าเป็น synced credential
- ใช้ `transports` ที่เก็บไว้เป็น hint ใน `allowCredentials` เพื่อลด friction ตอน re-auth

## Common Pitfalls

- ไม่มี fallback path — user ที่ไม่มี authenticator/สลับอุปกรณ์จะ login ไม่ได้เลย
- เรียก `startAuthentication` โดยไม่เช็ค `browserSupportsWebAuthn()` — crash บน browser เก่า
- autofill promise ค้างถาวร — wrap ด้วย error boundary และให้ cancel ได้
- แสดง error message ดิบจาก exception — map เป็น friendly message ตาม taxonomy ข้างบน
- timeout สั้นเกิน — user ใช้เวลาหา security key; default ของ lib เหมาะสมแล้ว อย่าตั้งต่ำกว่า 30s
- ไม่ handle `InvalidStateError` ตอน re-register — user สับสนว่าทำไมสร้าง passkey ไม่ได้

## Do / Don't

| Do | Don't |
|---|---|
| เปิด autofill ตอน page load พร้อม `<input autocomplete="username webauthn">` | รอ user กดปุ่มก่อนค่อย detect passkey |
| เสนอ fallback (password/OTP/magic link) เสมอ | บังคับ passkey-only โดยไม่มีทางรอด |
| map errors เป็น friendly Thai/English messages | แสดง raw exception message ให้ user |
| ให้ user ตั้งชื่อ passkey ตอน register | เก็บ credential โดยไม่มี label |
| log ceremony failures พร้อม error name สำหรับ debug | swallow errors ทั้งหมดไว้ที่ console |
| ใช้ `userVerification` ตามระดับความเสี่ยงของ action | require UV สูงสุดทุก ceremony โดยไม่จำเป็น |

## Performance Notes

- autofill เป็น long-lived promise — ไม่กิน resource แต่ควร cancel เมื่อ navigate ออกจาก login page
- options generation endpoint ถูกเรียกทุก page load เมื่อใช้ autofill — cache session challenge แทนสร้างใหม่ทุก request ถ้า traffic สูง
- เลือก `timeout` สมดุล: สั้นไป user ทำไม่ทัน ยาวไป ceremony ค้าง — ค่า default ของ lib เหมาะสม
- อย่าเรียก `startRegistration` ซ้ำใน loop เมื่อ fail — authenticator บางตัว lock ชั่วคราว

## Ecosystem / Integration

- framework forms (TanStack Form, React Hook Form): เก็บ passkey ceremony แยกจาก form submit — autofill ทำงานนอก form lifecycle
- SSR: เรียก browser API เฉพาะใน client-only context (`onMount`, effect) — `startAuthentication` touch `navigator.credentials`
- Better Auth มี passkey plugin ที่ handle UX เหล่านี้ให้ — พิจารณา `/follow-lib-better-auth` ถ้าไม่อยากเขียนเอง
- ทดสอบบน device จริง: iOS Safari, Android Chrome, Windows Hello มีพฤติกรรมต่างกัน — อย่า test แค่ Chrome desktop
