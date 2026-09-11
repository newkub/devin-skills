# Lib Otplib API & Dependencies

## Install

```sh
bun add otplib
# v13 เป็น package เดียวทุก runtime (Node/Bun/Deno/Browser) — ไม่มี preset-browser
```

## Version

- Latest: `13.5.0` (verified 2026-09-12) — v13 rewrite ใหม่: ไม่มี `preset-default`/`authenticator`, async-first, plugin-based
- [Package Registry](https://www.npmjs.com/package/otplib)
- [Repository](https://github.com/yeojz/otplib)
- Migration: https://otplib.yeojz.dev/guide/v12-adapter.html (`@otplib/v12-adapter` เป็น bridge ชั่วคราว)

## Dependencies

- `otplib` bundle default plugins ในตัว (`@noble/hashes`, `@scure/base` — audited)
- แยก packages ได้: `@otplib/totp`, `@otplib/hotp`, `@otplib/uri`, `@otplib/plugin-crypto-{node,web,noble}`, `@otplib/plugin-base32-scure` — ต้อง inject `crypto`/`base32` plugin เองเมื่อใช้ scoped packages
- Node 18+ / Bun / Deno / Browser

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `generateSecret()` | สร้าง base32 secret | - | - |
| `generate({secret})` / `generateSync` | สร้าง TOTP token (async-first) | 30s period, SHA1 | `period`, `digits`, `algorithm` |
| `verify({secret, token})` / `verifySync` | verify token — คืน `VerifyResult` เช็ค `.valid` | - | `epochTolerance` (clock drift) |
| `generateURI({issuer, label, secret})` | otpauth:// URI สำหรับ QR | - | - |
| `new OTP()` | class API (`otplib/class`) — method เดียวกัน | TOTP strategy | - |
| `@otplib/totp` functions | scoped TOTP — ต้องส่ง `crypto`, `base32` plugins | - | - |

## Source

- Official docs: https://github.com/yeojz/otplib
- Description: OTP (HOTP/TOTP) library — Google Authenticator compatible.
