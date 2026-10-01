# Capgo Biometric Best Practices

แนวทางใช้ `@capgo/capacitor-native-biometric` สำหรับ biometric authentication (FaceID/TouchID/fingerprint) — credential storage, fallback และ error handling

## Recommended Patterns

### Availability-First Flow

- เรียก `NativeBiometric.isAvailable()` ก่อนเสมอ — check ทั้ง hardware support และ biometry enrollment แล้วค่อยเสนอ biometric login
- ใช้ `biometryType` จาก result เพื่อปรับ UI copy ("Sign in with Face ID" vs "fingerprint") — generic "biometric" copy ดูไม่ native
- Design fallback path ทุกครั้ง: PIN, passcode, หรือ password เมื่อ biometric ไม่พร้อม/ล้มเหลว — biometric คือ convenience ไม่ใช่ auth หลักเดียว
- เช็ค availability ใหม่ทุกครั้งที่จะใช้ ไม่ใช่ cache ตอน app start — user อาจเพิ่ม/ลบ biometric enrollment ระหว่าง session

### Credential Storage

- เก็บ credentials ผ่าน `setCredentials()` เท่านั้น — plugin ใช้ iOS Keychain / Android Keystore (hardware-backed)
- ห้าม fallback ไป `localStorage`/Capacitor Preferences สำหรับ credentials — นั่นคือ plaintext-equivalent storage
- เก็บ server token/refresh token ใน secure enclave — ไม่ใช่เก็บ password ดิบ (เก็บ password ทำให้ token rotation ยาก)
- `deleteCredentials()` เมื่อ logout หรือ revoke — เครื่องที่เปลี่ยนมือต้องไม่เหลือ credentials ค้าง

### Verify Flow

- `verifyIdentity()` พร้อม `reason` ที่สื่อความหมาย — OS แสดง string นี้ใน system dialog
- Handle result แยก per outcome: success → retrieve credentials → login; cancel → กลับหน้า login ปกติ; lockout → เสนอ PIN fallback
- Wrap ใน try/catch — plugin throw error codes ที่ต่างกันระหว่าง iOS/Android (user cancel, biometric lockout, no enrollment)

## Common Pitfalls

| Pitfall | อาการ | วิธีหลีกเลี่ยง |
|---|---|---|
| Assume hardware มีเสมอ | crash/silent fail บน emulator/เครื่องเก่า | `isAvailable()` ก่อนทุกครั้ง + fallback UI |
| เก็บ credentials ใน storage ธรรมดา | token readable โดยไม่ต้อง biometric | `setCredentials()` เท่านั้น |
| ไม่ handle user cancel | app ค้างหรือ error dialog แปลกๆ | catch + treat cancel เป็น normal flow ไม่ใช่ error |
| Biometric lockout (หลายครั้งผิด) | verify fail ตลอด | เสนอ device passcode/PIN fallback |
| Keystore invalidated หลังเพิ่มลายนิ้วมือ | credentials หาย/verify fail | re-enroll flow: clear → login → setCredentials ใหม่ |
| ทดสอบเฉพาะ emulator | biometric edge cases ไม่เจอ | test บน real devices ทั้ง enrolled/not-enrolled/lockout |
| เก็บ password ดิบใน enclave | rotation/reset flow ยุ่งยาก | เก็บ server-issued token แทน |

## Do / Don't

| Do | Don't |
|---|---|
| `isAvailable()` → `verifyIdentity()` → `getCredentials()` เป็นขั้น | เรียก `getCredentials()` โดยไม่ verify ก่อน |
| reason string ที่ user เข้าใจ ("Unlock your account") | reason generic เช่น "Authentication required" |
| fallback PIN เสมอเมื่อ biometric unavailable | block login สำหรับ user ที่ไม่มี biometric |
| `deleteCredentials()` ตอน logout | ค้าง credentials หลัง sign out |
| test enrollment-change scenario | assume keystore valid ตลอดไป |
| treat biometric เป็น unlock UX layer | treat biometric เป็น authentication จริง (server ยังต้อง verify token) |

## Performance And CI Notes

- Biometric APIs ต้องทดสอบบน real devices — emulator/simulator จำลองได้จำกัด (iOS simulator มี FaceID toggle, Android emulator มี fingerprint simulation แต่ไม่ครอบ lockout/keystore cases)
- Manual test checklist สำหรับ release: enrolled → verify ok, not enrolled → fallback, cancel → กลับ flow ปกติ, wrong biometric × N → lockout handling
- `cap sync` หลังติดตั้ง plugin เสมอ — native code injection จำเป็น
- iOS ต้องมี `NSFaceIDUsageDescription` ใน `Info.plist` — ขาดแล้ว app reject ตอน review
- Android ต้องมี biometric permission และ target API ที่ plugin รองรับ — เช็ค plugin README ตอน upgrade
- Biometric verify เป็น local operation — ไม่มี network cost; latency ต่ำ อย่าเพิ่ม artificial loading states

## Config Guidance

- `server`/`username` keys ใน `setCredentials()`/`getCredentials()`: ใช้ stable identifier ต่อ user+app (เช่น `com.app.auth`) — เปลี่ยน key คือทำ credentials เก่าหาไม่เจอ
- เก็บ biometric preference flag (`user opted-in`) ใน Preferences/secure storage แยกจาก credentials — opt-in state เป็น UX decision ไม่ใช่ security boundary
- Document enrollment-change recovery flow ใน code comments — เป็น edge case ที่ QA มัก miss
- Pair กับ OTA channel discipline (`ota-updates.md`): biometric flow changes ที่แตะ JS only → OTA ได้; plugin version upgrade → store release
