# LINE LIFF — Init, Auth And API Boundaries

## Recommended Patterns

### Initialization

- `await liff.init({liffId})` before using any other API — init is a promise, calling APIs before resolve = error
- keep init in the app's main async setup — handle failure with `try/catch` or `.catch` (invalid liffId, endpoint mismatch)
- `withLoginOnExternalBrowser: true` when auto-login outside the LINE app is required — no manual `liff.login()` needed
- `liffId` comes from the LINE Developers Console — keep it in env/config, don't hardcode if it differs per environment

### Environment Detection

- `liff.isInClient()` = opened inside the LINE app or not — behavior differs a lot
- `liff.isLoggedIn()` checks auth state — outside the LINE app you need `liff.login()` (OAuth redirect)
- `liff.login({redirectUri})` redirects to LINE login then back — the redirectUri must match the endpoint in the console
- inside the LINE app: the user logs in automatically via the LINE session — no login flow needed

### Identity And Token

- `liff.getProfile()` gives displayName/pictureUrl — display only, never trust client-side identity
- `liff.getIDToken()` is sent to the server for verification via the LINE verify endpoint — this is the source of truth
- `liff.getContext()` gives `type`, `userId`, `chatId`, `groupId` — use it to adapt UX per context (1:1, group, room)
- `liff.getAccessToken()` for client-side LINE API calls — limited scope

### Feature APIs

- `liff.shareTargetPicker([{...}])` — share a message to friends/groups, `isMultiple` picks several targets
- `liff.sendMessages([{...}])` — sends into the current chat (only inside the LINE app)
- `liff.scanCodeV2()` — QR/barcode scanner (only inside the LINE app)
- some APIs work only under `isInClient()` — always check first, otherwise they throw on an external browser

## Do / Don't

| Do | Don't |
|---|---|
| `await liff.init()` before any other API | calling `liff.getProfile()` before init resolves |
| always verify the ID token server-side | trusting client `getProfile()` as identity |
| check `isInClient()` before using in-app APIs | assuming `sendMessages` works on an external browser |
| handle `liff.init()` rejection | ignoring the init error and leaving the app silently hung |
| test both in-client and external browser | testing only in the LINE app then deploying |
| keep `liffId` in env/config | hardcoding the liffId directly in code |

## Common Pitfalls

- `liff.init` not yet resolved → API calls fail — wrap in an async init function
- the console endpoint URL doesn't match the actual hosted URL → init fails or a redirect loop
- thinking `isInClient()` = mobile — an external browser on a phone is also `false`
- `getProfile()` is for display only — an attacker can fake it; verify `getIDToken()` server-side
- `sendMessages`/`scanCodeV2`/`shareTargetPicker` on an external browser → error — feature-check first
- after `liff.login()` redirects back, the page reloads — in-memory state is lost, persist it before redirect

## Performance Notes

- `liff.init` makes a network call — show a loading state during init
- `getProfile`/`getIDToken`/`getAccessToken` are async — batch independent calls together with `Promise.all`
- LIFF app size affects loading inside the LINE app — bundle optimization matters more than a normal web app
- `liff.getContext()` is sync — no cost

## Ecosystem / Integration

- `@line/liff` is a browser-only SDK — use it in a SPA/frontend only, not server-side
- server-side: verify the ID token via the LINE verify endpoint + Messaging API (send push, reply) — outside this skill's scope
- the LIFF app is created in the LINE Developers Console bound to a channel — you get the `liffId`
- the console endpoint URL must match the deployed URL — an SPA must use one URL (or a dynamic endpoint if the console supports it)
- scope `profile` + `openid` for `getProfile` + `getIDToken` — set them in the console
