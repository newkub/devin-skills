# Lib Simplewebauthn Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs home | https://simplewebauthn.dev |
| Server docs | https://simplewebauthn.dev/docs/packages/server |
| Browser docs | https://simplewebauthn.dev/docs/packages/browser |
| Advanced: passkeys | https://simplewebauthn.dev/docs/advanced/passkeys |
| Testing | https://simplewebauthn.dev/docs/advanced/testing |
| Example project | https://github.com/MasterKale/SimpleWebAuthn/tree/master/example |

## Key Concepts

- Flow: server generate options → browser `startRegistration`/`startAuthentication` → POST response → server verify
- ต้องเก็บ per-user: `credentialID`, `publicKey`, `counter`, `transports`
- Passkey autofill: `startAuthentication({...}, true)` + `<input autocomplete="username webauthn">`
- `expectedOrigin` ต้องตรง origin จริง (`https://app.com`) — dev ใช้ `http://localhost`
