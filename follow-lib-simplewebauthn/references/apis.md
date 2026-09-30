| key | value |
|---|---|
| package registry | https://www.npmjs.com/package/@simplewebauthn/server |
| repository | https://github.com/MasterKale/SimpleWebAuthn |
| docs | https://simplewebauthn.dev |

| api | description | default | options |
|---|---|---|---|
| `generateRegistrationOptions({rpName, rpID, userName})` | สร้าง registration options | - | `attestationType`, `authenticatorSelection`, `excludeCredentials` |
| `verifyRegistrationResponse({response, expectedChallenge, expectedOrigin, expectedRPID})` | Verify registration | - | `requireUserVerification` |
| `generateAuthenticationOptions({rpID})` | Login challenge | - | `allowCredentials`, `userVerification` |
| `verifyAuthenticationResponse(...)` | Verify login | - | expectedChallenge/Origin/RPID, `credential` |
| `startRegistration(options)` (browser) | WebAuthn create | - | - |
| `startAuthentication(options)` (browser) | WebAuthn get | - | `useBrowserAutofill` |
