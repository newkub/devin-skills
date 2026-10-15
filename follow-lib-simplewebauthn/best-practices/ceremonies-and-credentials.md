# SimpleWebAuthn — Ceremonies and Credential Storage

Best practices for the registration/authentication ceremonies and storing credentials server-side

## Recommended Patterns

### The correct ceremony flow

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
await saveChallenge(user.id, options.challenge) // short TTL ~5 min, one-time
```

```ts
// client
const attResp = await startRegistration({ optionsJSON: options })
// send attResp back to verifyRegistrationResponse
```

Authentication uses the same pattern: `generateAuthenticationOptions` → `startAuthentication({ optionsJSON })` → `verifyAuthenticationResponse`, passing the stored `credential` record back into verify.

### Challenge Handling

- always generate the challenge with crypto random (the lib generates it, but it must be persisted server-side)
- store the challenge in a server-side store (KV/Redis/session) bound to the user/session id — never trust a challenge sent back by the client
- short TTL (3–5 minutes) and delete after one use — reusing a challenge opens the door to replay attacks
- all verification steps happen server-side only

### rpID / Origin Configuration

| Setting | Correct value | Example |
|---|---|---|
| `rpID` | domain only, no protocol/port | `app.example.com` |
| `expectedOrigin` | full origin | `https://app.example.com` |
| dev origin | localhost is the HTTPS exception | `http://localhost:5173` |

- `rpID` may be a parent domain (e.g. `example.com` covers `app.example.com`) but must never be a subdomain of the real origin
- a single mismatch = the ceremony silently fails with `NotAllowedError` on the client

### Credential Storage Schema

Store at least a per-user record:

| Field | What it is used for |
|---|---|
| `id` | credential id (base64url) — used for the lookup at auth |
| `publicKey` | verify the signature at authentication |
| `counter` | signature counter — detects cloned authenticators |
| `transports` | hint for better re-auth UX |
| `userID` | binds to the user record |

- update `counter` from `verifyAuthenticationResponse` on every successful verify
- a counter that does not increase = possible cloned authenticator — log/alert or reject per risk policy

## Common Pitfalls

- storing the challenge in a client-side JWT/localStorage — if an attacker can modify the challenge, verification passes
- using an `rpID` with `https://` or a port — the ceremony fails immediately
- forgetting `excludeCredentials` on re-register — some authenticators error on duplicate enrollment
- not updating the counter after a successful auth — clone detection never works
- verifying with someone else's credential record — always look up by the credential id from the response
- production without HTTPS — WebAuthn works only in secure contexts (localhost excepted)

## Do / Don't

| Do | Don't |
|---|---|
| store the challenge in a server-side store with a TTL | take the challenge back from the client for verification |
| default to `attestationType: 'none'` | require attestation without a real device-trust need |
| support multiple credentials per user | bind a user to a single credential |
| update `counter` after every verify | skip the counter-regression check |
| pass `optionsJSON` into `startRegistration`/`startAuthentication` | pass options as separate positional arguments |
| use `preferredAuthenticatorType` when you want to constrain hints | force an authenticator type the user doesn't have |

## Performance Notes

- `attestationType: 'none'` reduces payload and verify steps — use attestation only when device provenance must be verified
- don't send an over-long `excludeCredentials` list — filter to only that user's credentials
- ceremony options generation is light, but verify does crypto ops — rate-limit the auth-time endpoints to prevent brute-force challenges
- keep credential records small — store `transports` only when needed

## Ecosystem / Integration

- if the project already uses Better Auth, use its `passkey()` plugin instead of a self-built implementation — `/follow-lib-better-auth`
- import types directly from `@simplewebauthn/server` / `@simplewebauthn/browser` (`@simplewebauthn/types` has been retired)
- on the browser side, check `browserSupportsWebAuthn()` / `browserSupportsWebAuthnAutofill()` before rendering passkey UI
- test ceremonies on the real staging domain — WebAuthn is bound to the origin, so cross-domain testing does not work
