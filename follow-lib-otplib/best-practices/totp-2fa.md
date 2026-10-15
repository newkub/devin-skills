# Best Practices: otplib (TOTP/HOTP 2FA)

Guidance for implementing 2FA with TOTP securely and smoothly in production

## Recommended Patterns

- Prefer TOTP — use HOTP only when counter-based sync is genuinely required (e.g. hardware tokens)
- Enroll flow: `generateSecret()` → store the secret encrypted → `generateURI({issuer, label, secret})` → render QR → verify the first token before enabling 2FA
- Verify with `await verify({secret, token})` then check `result.valid` — the API returns an object, not a boolean
- Set `epochTolerance` (e.g. 1 window = ±30s) for clock drift between the server and the authenticator app
- Store secrets encrypted at rest (AES/KMS) — never plaintext in the database or logs
- Single-use recovery codes as a fallback when the user loses their device — hash them before storing, like passwords

## Do / Don't

| Do | Don't |
|---|---|
| verify on the server only | generate/verify TOTP on the client (secret leaks) |
| rate-limit the verify endpoint (e.g. 5/min) | let 6-digit tokens be brute-forced unlimited |
| check `result.valid` from `verify()` | assume `verify` returns a boolean |
| store the secret encrypted + masked in the UI | show the full secret after enrollment |
| use `generateURI` to build otpauth:// then render the QR | concatenate the URI string yourself (issuer/label encoding goes wrong) |
| provide a recovery path (backup codes, admin reset) | permanently lock out a user who loses a device |

## Common Pitfalls

- `verify`/`verifySync` return `{valid}`, not a boolean — checking wrong makes every token pass or every token fail
- `generateSync`/`verifySync` work only with sync crypto plugins (`@otplib/plugin-crypto-node`/`noble`) — calling them on an async plugin throws
- Clock drift makes valid tokens fail — don't set `epochTolerance` to 0 without reason (but don't go wider than 1-2 windows, it weakens security)
- Secret reuse across users — always `generateSecret()` per enrollment, never derive from a user id
- Malformed otpauth URI — the authenticator app can't scan it; always use `generateURI`
- Migrating from v12: `@otplib/v12-adapter` is a temporary bridge — plan the move to the new functional/class API

## Performance Notes

- TOTP verification is light crypto (HMAC) — the real bottleneck is the DB lookup + rate limiter, not the token math
- The async API uses WebCrypto/Node async crypto — better throughput than sync under high concurrency
- Don't re-generate the secret on every verify — generate once at enrollment
- Cache the user record + secret in the session after login to cut DB hits during the challenge

## Ecosystem / Integration

- QR rendering from the `otpauth://` URI → `/follow-lib-qrcode` (`toDataURL`/`toString`)
- The issuer/label in the URI should match the app name — the authenticator app shows this name to the user
- Combine with the session flow: TOTP verify passes → mark the session `2fa-verified`; don't re-check on every request
