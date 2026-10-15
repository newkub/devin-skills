# SimpleWebAuthn — Passkey UX and Client-Side Patterns

Best practices for the browser side: conditional UI, error handling, fallbacks, and multi-device UX

## Recommended Patterns

### Conditional UI (Passkey Autofill)

Let the user log in with a passkey without typing a username:

```ts
// input field
<input autocomplete="username webauthn" />

// call at page load (does not wait for user action)
const options = await fetchAuthOptions() // not bound to a specified user
await startAuthentication({ optionsJSON: options, useBrowserAutofill: true })
```

- trigger autofill at mount of the login page — the browser shows passkeys in the autofill dropdown
- must handle the abort when the user chooses to type a password instead (wrap in a try/catch + AbortController pattern)
- the autofill ceremony must be verified like a normal ceremony — only the challenge is not bound to a user upfront; bind it to the session instead

### Error taxonomy to handle

| Error | Cause | Recommended UX |
|---|---|---|
| `NotAllowedError` | user pressed cancel, timeout, or rpID/origin mismatch | show a retry button + fallback |
| `InvalidStateError` | duplicate credential during registration | tell the user this device is already enrolled |
| `NotSupportedError` | browser/authenticator unsupported | fall back to password/OTP |
| `AbortError` | ceremony aborted (e.g. autofill cancelled) | fail silently, no error message |
| `SecurityError` | origin/rpID mismatch | log + prompt to check the domain config |
| network error | fetching options/verify failed | retry with backoff |

### Multi-Device and Account UX

- support multiple passkeys per user — most people have several devices (phone + laptop + security key)
- show the passkey list in settings with a user-assigned name + last-used timestamp
- allow deleting a passkey — and tell the user they must also delete it on the authenticator if it is a synced credential
- use the stored `transports` as a hint in `allowCredentials` to reduce re-auth friction

## Common Pitfalls

- no fallback path — users without an authenticator / who switch devices cannot log in at all
- calling `startAuthentication` without checking `browserSupportsWebAuthn()` — crashes on older browsers
- a permanently hanging autofill promise — wrap with an error boundary and allow cancelling
- showing raw exception messages — map them to friendly messages per the taxonomy above
- timeout too short — users need time to find a security key; the lib's default is appropriate, don't set it below 30s
- not handling `InvalidStateError` on re-register — the user is confused why they can't create a passkey

## Do / Don't

| Do | Don't |
|---|---|
| enable autofill at page load with `<input autocomplete="username webauthn">` | wait for a button press before detecting passkeys |
| always offer a fallback (password/OTP/magic link) | force passkey-only with no way out |
| map errors to friendly Thai/English messages | show raw exception messages to the user |
| let the user name the passkey at registration | store credentials without a label |
| log ceremony failures with the error name for debugging | swallow all errors into the console |
| use `userVerification` per the action's risk level | require max UV on every ceremony unnecessarily |

## Performance Notes

- autofill is a long-lived promise — it consumes no resources, but cancel it when navigating away from the login page
- with autofill, the options-generation endpoint is called on every page load — cache the session challenge instead of generating a new one per request under high traffic
- balance the `timeout`: too short and users can't finish, too long and the ceremony hangs — the lib's defaults are appropriate
- don't re-invoke `startRegistration` in a retry loop after a failure — some authenticators temporarily lock

## Ecosystem / Integration

- framework forms (TanStack Form, React Hook Form): keep the passkey ceremony separate from form submit — autofill works outside the form lifecycle
- SSR: call browser APIs only in client-only contexts (`onMount`, effect) — `startAuthentication` touches `navigator.credentials`
- Better Auth has a passkey plugin that handles this UX — consider `/follow-lib-better-auth` if you don't want to write it yourself
- test on real devices: iOS Safari, Android Chrome, and Windows Hello behave differently — don't test only on desktop Chrome
