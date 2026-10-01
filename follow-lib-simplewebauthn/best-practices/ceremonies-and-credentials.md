# SimpleWebAuthn — Ceremonies และ Credential Storage

Best practices สำหรับ registration/authentication ceremonies และการเก็บ credentials ฝั่ง server

## Recommended Patterns

### Ceremony Flow ที่ถูกต้อง

Registration:

```ts
// server
const options = await generateRegistrationOptions({
  rpName: 'My App',
  rpID: 'app.example.com',
  userName: user.email,
  attestationType: 'none',
  excludeCredentials: user.credentials.map(c => ({ id: c.id, transports: c.transports })),
})
await saveChallenge(user.id, options.challenge) // TTL สั้น ~5 นาที, one-time
```

```ts
// client
const attResp = await startRegistration({ optionsJSON: options })
// ส่ง attResp กลับไป verifyRegistrationResponse
```

Authentication ใช้ pattern เดียวกัน: `generateAuthenticationOptions` → `startAuthentication({ optionsJSON })` → `verifyAuthenticationResponse` พร้อมส่ง `credential` record ที่เก็บไว้กลับเข้า verify

### Challenge Handling

- สร้าง challenge ด้วย crypto random เสมอ (lib generate ให้ แต่ต้อง persist ฝั่ง server)
- เก็บ challenge ใน server-side store (KV/Redis/session) ผูกกับ user/session id — ห้าม trust challenge ที่ client ส่งกลับ
- TTL สั้น (3–5 นาที) และลบทิ้งหลังใช้ครั้งเดียว — reuse challenge เปิดช่อง replay attack
- verification ทุกขั้นตอนทำฝั่ง server เท่านั้น

### rpID / Origin Configuration

| Setting | ค่าที่ถูก | ตัวอย่าง |
|---|---|---|
| `rpID` | domain เท่านั้น ไม่มี protocol/port | `app.example.com` |
| `expectedOrigin` | full origin | `https://app.example.com` |
| dev origin | localhost ยกเว้น HTTPS | `http://localhost:5173` |

- `rpID` เป็น parent domain ได้ (เช่น `example.com` ครอบ `app.example.com`) แต่ห้ามเป็น subdomain ของ origin จริง
- mismatch ตัวเดียว = ceremony fail เงียบๆ ด้วย `NotAllowedError` ฝั่ง client

### Credential Storage Schema

เก็บ per-user record อย่างน้อย:

| Field | ใช้ทำอะไร |
|---|---|
| `id` | credential id (base64url) — ใช้ lookup ตอน auth |
| `publicKey` | verify signature ตอน authentication |
| `counter` | signature counter — ตรวจ cloned authenticator |
| `transports` | hint เพื่อ UX ที่ดีขึ้นตอน re-auth |
| `userID` | ผูกกับ user record |

- อัปเดต `counter` จาก `verifyAuthenticationResponse` ทุกครั้งที่ verify ผ่าน
- ถ้า counter ไม่เพิ่มจากของเดิม = อาจเป็น cloned authenticator — log/alert หรือ reject ตาม risk policy

## Common Pitfalls

- เก็บ challenge ใน JWT/localStorage ฝั่ง client — attacker แก้ challenge ได้ verify ก็ผ่าน
- ใช้ `rpID` มี `https://` หรือ port — ceremony fail ทันที
- ลืม `excludeCredentials` ตอน re-register — authenticator บางตัว error เมื่อลงทะเบียนซ้ำ
- ไม่อัปเดต counter หลัง auth สำเร็จ — ตรวจ clone ไม่ได้เลย
- verify ด้วย credential record ของคนอื่น — ต้อง lookup ด้วย credential id จาก response เสมอ
- production ไม่มี HTTPS — WebAuthn ใช้ได้เฉพาะ secure context (localhost ยกเว้น)

## Do / Don't

| Do | Don't |
|---|---|
| เก็บ challenge ใน server-side store พร้อม TTL | รับ challenge กลับจาก client ไป verify |
| ตั้ง `attestationType: 'none'` เป็นค่าเริ่มต้น | require attestation ถ้าไม่ได้ต้องการ device trust จริงๆ |
| รองรับหลาย credentials ต่อ user | ผูก user กับ credential เดียว |
| อัปเดต `counter` ทุกครั้งหลัง verify | ข้ามการเช็ค counter regression |
| ส่ง `optionsJSON` เข้า `startRegistration`/`startAuthentication` | ส่ง options แบบ positional arguments แยก |
| ใช้ `preferredAuthenticatorType` เมื่อต้องการกำหนด hints | บังคับ authenticator type ที่ user ไม่มี |

## Performance Notes

- `attestationType: 'none'` ลด payload และขั้นตอน verify — ใช้ attestation เฉพาะเมื่อต้องการ verify device provenance
- `excludeCredentials` อย่าส่ง list ยาวเกิน — filter เฉพาะ credential ของ user นั้น
- ceremony options generation เบา แต่ verify มี crypto ops — rate-limit endpoint ตอน auth เพื่อกัน brute-force challenge
- เก็บ credential record เล็กๆ — `transports` เก็บเฉพาะที่จำเป็น

## Ecosystem / Integration

- ถ้า project ใช้ Better Auth อยู่แล้ว ใช้ `passkey()` plugin แทน implement เอง — `/follow-lib-better-auth`
- import types จาก `@simplewebauthn/server` / `@simplewebauthn/browser` โดยตรง (`@simplewebauthn/types` ถูก retire แล้ว)
- ฝั่ง browser ตรวจ `browserSupportsWebAuthn()` / `browserSupportsWebAuthnAutofill()` ก่อน render passkey UI
- test ceremony บน staging domain จริง — WebAuthn ผูกกับ origin ทำให้ทดสอบข้าม domain ไม่ได้
