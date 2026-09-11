# Lib Line Liff API & Dependencies

## Install

```sh
bun add @line/liff
```

## Version

- Latest: `2.31.0` (verified 2026-09-11) — npm package เป็น v2.x; "LIFF v2" ใน docs หมายถึง API generation
- [Package Registry](https://www.npmjs.com/package/@line/liff)
- [Repository](https://github.com/line/line-liff-v2-starter)

## Dependencies

- Peer: LINE LIFF app + channel ต้องสร้างผ่าน LINE Developers Console ก่อน
- `@line/liff` เป็น browser-only SDK — ใช้ใน SPA/frontend เท่านั้น

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `liff.init({liffId})` | Initialize SDK | - | `withLoginOnExternalBrowser` |
| `liff.login()` | LINE login redirect | - | `redirectUri` |
| `liff.isLoggedIn()` / `liff.logout()` | Auth state | - | - |
| `liff.getProfile()` / `liff.getIDToken()` | User profile / ID token | - | - |
| `liff.sendMessages([...])` | Send message to chat | - | message objects |
| `liff.shareTargetPicker([...])` | Share picker | - | `isMultiple` |
| `liff.scanCodeV2()` | QR scanner | - | - |
| `liff.getContext()` | LIFF context | - | `type`, `userId`, `chatId` |

## Source

- Official docs: https://developers.line.biz/en/docs/liff/
- Description: LINE Front-end Framework SDK สำหรับ web apps ใน LINE app.
