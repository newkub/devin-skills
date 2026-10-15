| key | value |
|---|---|
| version | 13.5.0 |
| package registry | https://www.npmjs.com/package/otplib |
| repository | https://github.com/yeojz/otplib |
| docs | https://github.com/yeojz/otplib |

| api | description | default | options |
|---|---|---|---|
| `generateSecret()` | generate a base32 secret | - | - |
| `generate({secret})` / `generateSync` | generate a TOTP token (async-first) | 30s period, SHA1 | `period`, `digits`, `algorithm` |
| `verify({secret, token})` / `verifySync` | verify token — returns a `VerifyResult`, check `.valid` | - | `epochTolerance` (clock drift) |
| `generateURI({issuer, label, secret})` | otpauth:// URI for QR | - | - |
| `new OTP()` | class API (`otplib/class`) — same methods | TOTP strategy | - |
| `@otplib/totp` functions | scoped TOTP — must pass `crypto`, `base32` plugins | - | - |
