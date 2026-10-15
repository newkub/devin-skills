# Capgo Biometric Best Practices

Guidelines for using `@capgo/capacitor-native-biometric` for biometric authentication (FaceID/TouchID/fingerprint) — credential storage, fallback, and error handling

## Recommended Patterns

### Availability-First Flow

- Always call `NativeBiometric.isAvailable()` first — check both hardware support and biometry enrollment before offering biometric login
- Use `biometryType` from the result to adapt UI copy ("Sign in with Face ID" vs "fingerprint") — generic "biometric" copy feels non-native
- Design the fallback path every time: PIN, passcode, or password when biometrics are unavailable/fail — biometrics are a convenience, not the sole primary auth
- Re-check availability at each use, do not cache it at app start — the user may add/remove biometric enrollment mid-session

### Credential Storage

- Store credentials only via `setCredentials()` — the plugin uses the iOS Keychain / Android Keystore (hardware-backed)
- Never fall back to `localStorage`/Capacitor Preferences for credentials — that is plaintext-equivalent storage
- Keep server tokens/refresh tokens in the secure enclave — do not store raw passwords (storing passwords makes token rotation hard)
- Call `deleteCredentials()` on logout or revoke — a handed-over device must not retain credentials

### Verify Flow

- `verifyIdentity()` with a meaningful `reason` — the OS shows this string in the system dialog
- Handle the result per outcome: success → retrieve credentials → login; cancel → return to the normal login screen; lockout → offer the PIN fallback
- Wrap in try/catch — the plugin throws different error codes across iOS/Android (user cancel, biometric lockout, no enrollment)

## Common Pitfalls

| Pitfall | Symptom | Avoidance |
|---|---|---|
| Assuming the hardware always exists | crash/silent fail on emulators/old devices | `isAvailable()` first every time + fallback UI |
| Storing credentials in plain storage | tokens readable without biometrics | `setCredentials()` only |
| Not handling user cancel | app hangs or odd error dialogs | catch + treat cancel as a normal flow, not an error |
| Biometric lockout (many wrong attempts) | verify fails continuously | offer the device passcode/PIN fallback |
| Keystore invalidated after adding a fingerprint | credentials lost / verify fails | re-enroll flow: clear → login → setCredentials again |
| Testing only on an emulator | biometric edge cases missed | test on real devices: enrolled/not-enrolled/lockout |
| Storing raw passwords in the enclave | messy rotation/reset flows | store server-issued tokens instead |

## Do / Don't

| Do | Don't |
|---|---|
| `isAvailable()` → `verifyIdentity()` → `getCredentials()` as steps | call `getCredentials()` without verifying first |
| a reason string the user understands ("Unlock your account") | generic reasons like "Authentication required" |
| always a PIN fallback when biometrics are unavailable | block login for users without biometrics |
| `deleteCredentials()` on logout | leaving credentials behind after sign out |
| test the enrollment-change scenario | assume the keystore stays valid forever |
| treat biometrics as an unlock UX layer | treat biometrics as real authentication (the server must still verify the token) |

## Performance And CI Notes

- Biometric APIs must be tested on real devices — emulators/simulators simulate only partly (iOS simulator has a FaceID toggle, Android emulator has fingerprint simulation, but neither covers lockout/keystore cases)
- Manual test checklist for release: enrolled → verify ok; not enrolled → fallback; cancel → normal flow returns; wrong biometric × N → lockout handling
- Always `cap sync` after installing the plugin — native code injection is required
- iOS needs `NSFaceIDUsageDescription` in `Info.plist` — without it the app is rejected at review
- Android needs the biometric permission and a target API the plugin supports — check the plugin README when upgrading
- Biometric verify is a local operation — no network cost, low latency; do not add artificial loading states

## Config Guidance

- The `server`/`username` keys in `setCredentials()`/`getCredentials()`: use a stable identifier per user+app (e.g. `com.app.auth`) — changing the key makes old credentials unretrievable
- Keep the biometric preference flag (`user opted-in`) in Preferences/secure storage, separate from credentials — opt-in state is a UX decision, not a security boundary
- Document the enrollment-change recovery flow in code comments — it is an edge case QA often misses
- Pair with OTA channel discipline (`ota-updates.md`): biometric flow changes touching JS only → OTA is fine; plugin version upgrades → store release
