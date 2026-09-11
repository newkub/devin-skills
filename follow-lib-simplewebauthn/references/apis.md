# Lib Simplewebauthn API & Dependencies

## Install

```sh
# Server
bun add @simplewebauthn/server
# Browser
bun add @simplewebauthn/browser
```

## Version

- `@simplewebauthn/server`: `14.0.1`, `@simplewebauthn/browser`: `14.0.1` (verified 2026-09-11) — v14 เป็น LTS line
- [Package Registry](https://www.npmjs.com/package/@simplewebauthn/server)
- [Repository](https://github.com/MasterKale/SimpleWebAuthn)

## Dependencies

- Server: `@simplewebauthn/server` ใช้ WebCrypto — ไม่มี heavy deps; storage เป็นของเราเอง
- Browser: ใช้ WebAuthn API ของ browser (`navigator.credentials`)

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `generateRegistrationOptions({rpName, rpID, userName})` | สร้าง registration options | - | `attestationType`, `authenticatorSelection`, `excludeCredentials` |
| `verifyRegistrationResponse({response, expectedChallenge, expectedOrigin, expectedRPID})` | Verify registration | - | `requireUserVerification` |
| `generateAuthenticationOptions({rpID})` | Login challenge | - | `allowCredentials`, `userVerification` |
| `verifyAuthenticationResponse(...)` | Verify login | - | expectedChallenge/Origin/RPID, `credential` |
| `startRegistration(options)` (browser) | WebAuthn create | - | - |
| `startAuthentication(options)` (browser) | WebAuthn get | - | `useBrowserAutofill` |

## Source

- Official docs: https://simplewebauthn.dev
- Description: WebAuthn/passkey server + browser helpers — ง่ายกว่า raw WebAuthn API มาก.
