# Ipc And Security Checklist — review-desktop-app

## IPC Surface

- [ ] minimal exposure — only needed commands/channels, not broad APIs
- [ ] Tauri `allowlist`/`capabilities` — scoped per-window, no `all: true`
- [ ] Electron `contextIsolation: true` — renderer can't reach `ipcRenderer` directly
- [ ] Electron `nodeIntegration: false` — no `require` in renderer
- [ ] `contextBridge` — explicit API surface, not `window.electron = everything`
- [ ] IPC input validation — params validated on main/rust side, not trusted from renderer
- [ ] IPC output sanitization — data from native doesn't inject renderer

## Content Security Policy

- [ ] CSP set — `default-src 'self'` or stricter, no `unsafe-inline`/`unsafe-eval`
- [ ] CSP delivered — via meta tag or HTTP header, not just config comment
- [ ] remote content — external URLs loaded in separate non-privileged context
- [ ] `webSecurity` — not disabled (Electron `webSecurity: false` = XSS vector)
- [ ] `allowRunningInsecureContent` — false, no HTTP subresources on HTTPS pages

## Privileged Context Isolation

- [ ] main vs renderer — privileged code only in main/preload, not bundle
- [ ] preload minimal — only necessary bridges, no broad `ipcRenderer.send` pass-through
- [ ] sandboxed renderers — `sandbox: true` where possible
- [ ] separate contexts — settings/dev tools in isolated windows, not same origin
- [ ] webview isolation — `<webview>`/iframe src untrusted, `partition` separate session

## Secrets And Filesystem

- [ ] scoped FS access — `fs` allowlist to specific dirs, not `*` or `$HOME`
- [ ] path traversal — user input in file paths sanitized, no `../` escape
- [ ] shell execution — `shell.openExternal`/`shell.openPath` whitelisted, no arbitrary `exec`
- [ ] secrets storage — OS keychain/credential store, not plaintext config files
- [ ] env vars — not exposed to renderer, filtered in IPC responses

## Remote Content And Navigation

- [ ] navigation limits — `will-navigate`/`new-window` handlers block unexpected URLs
- [ ] external links — `shell.openExternal` for untrusted, not load in window
- [ ] OAuth flows — system browser or separate context, not in-app webview with app secrets
- [ ] permission requests — camera/mic/notifications auto-denied in untrusted contexts

## Source Maps And Build Leaks

- [ ] `.map` files — not shipped in dist, or served only in dev
- [ ] source code — no unminified src in packaged app (unless intentional open-source)
- [ ] dev tools — disabled in production builds
- [ ] debug flags — `NODE_ENV`, `--inspect`, verbose logging off in prod
- [ ] error reporting — stack traces don't leak paths/secrets to users or logs

## Auto-Update Security

- [ ] signed updates — signature verified before apply, not just HTTPS
- [ ] update channel — `latest`/`beta`/`stable` separated, not user-modifiable
- [ ] delta updates — verified same as full updates
- [ ] rollback — failed update doesn't brick app, auto-recovery
- [ ] update server — HTTPS, cert pinning where possible

## Detection

- grep Electron flags — `webPreferences`, `nodeIntegration`, `contextIsolation`, `sandbox`
- grep Tauri allowlist — `tauri.conf.json` `allowlist`, `capabilities`
- grep CSP — `Content-Security-Policy`, meta tags, `setHeader`
- grep FS/shell — `readFile`, `writeFile`, `exec`, `shell.open`
- `/check-source-maps` on packaged build

Severity: `nodeIntegration: true` / `contextIsolation: false` = Critical, unsigned updates = Critical, full FS access = High, missing CSP = High, dev tools in prod = Medium
