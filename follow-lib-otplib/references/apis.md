# Lib Otplib API & Dependencies

## Install

```sh
bun add otplib
# browser ให้ใช้ @otplib/preset-browser
```

## Version

- Latest: `13.5.0` (verified 2026-09-11) — v13 รวมเป็น package เดียว `otplib` (แยก `@otplib/*` ใน v12-)
- [Package Registry](https://www.npmjs.com/package/otplib)
- [Repository](https://github.com/yeojz/otplib)

## Dependencies

- v13 รวม crypto adapter ในตัว (`@otplib/core`, `@otplib/plugin-crypto`, `preset-default`)
- Node 18+ / Bun

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `generateSecret()` | สร้าง base32 secret | 20 bytes | - |
| `totp.generate(secret)` / `totp.check(token, secret)` | TOTP | 30s step, SHA1 | `totp.options = {step, digits}` |
| `hotp.generate` / `hotp.check` | HOTP | counter | - |
| `authenticator.generate` / `check` | Google Authenticator compat | - | - |
| `keyuri(user, service, secret)` | otpauth:// URI | - | issuer |
| `totp.timeRemaining()` / `timeUsed()` | Step timing | - | - |

## Source

- Official docs: https://github.com/yeojz/otplib
- Description: OTP (HOTP/TOTP) library — Google Authenticator compatible.
