# Packaging, Platform Caveats & Security

## Recommended patterns

- Release flow: `native build` (ReleaseFast → `zig-out/bin/`) → smoke test on a real machine → `native package --target <os>` → sign (macOS) → distribute
- Per-platform package outputs:
  - macOS: `.app` + styled drag-to-Applications DMG (`--archive`); icons generated from a single `assets/icon.png`
  - Linux: install tree (`.desktop`, hicolor icons, mime)
  - Windows: distributable directory + `register-file-types.ps1` (HKCU, per-user)
  - iOS: the full generated Xcode project set (toolkit host, Info.plist, asset catalog, device slice) → `xcodebuild archive`; signing is still a manual step
  - Android: generated host project → debug APK assembles directly; store signing keys manual; arm64-v8a, minSdk 30
- macOS signing/notarization is the only signing automation available:
  ```sh
  native package --target macos --signing identity --identity "Developer ID Application: …" \
    --entitlements app.entitlements --notarize --notary-profile <profile>
  ```
  credentials stored via `xcrun notarytool store-credentials`; verify with `codesign --verify --strict` — no signing tooling yet on other platforms
- Auto-updates (macOS only, own updater — no Sparkle): `native update keygen` (Ed25519) → manifest `updates{feed_url, public_key, check_on_start}` (HTTPS required) → `native update sign` → reserved command `app.check-for-updates`; no delta/channels/phased rollout
- Security posture is declared in `app.json`:
  - permissions are default-deny per group: `window command view dialog filesystem clipboard credentials network camera microphone system_audio location notifications` — JS bridge groups (`dialogs/os/clipboard/credentials`) always default-deny unless explicitly granted; `js_window_api` opens the window/view/webview groups
  - navigation allowlist: `zero://app`, `zero://inline`, the exact dev origin + `navigation.allowed_origins`
  - external links denied except `.action = .open_system_browser` + `allowed_urls` (exact or a single trailing `/*` — beware over-broad wildcards)
  - symlinks are resolved before filesystem checks; CSP is not the SDK's job — web content must control it itself
- Bridge discipline (web content): JSON via `window.zero.invoke(command, payload)` limits 16KiB msg / 12KiB result — chunk large payloads through files/store instead of squeezing the bridge
- WebView when needed: the system engine is the default on every desktop (macOS WKWebView, Linux WebKitGTK, Windows WebView2 — Evergreen on Win11, `native doctor` checks the runtime); `main` is a reserved window label, child webviews ≤16, zoom 0.25–5.0

## Pitfalls

- Windows = early development for packaging — test the artifact on a real Windows machine before shipping (`tools/windows-truth` style: clipboard round-trips, launch the packaged binary)
- The Linux renderer is a software path — GPU-heavy workloads should be measured on macOS/Windows (report `backend=metal|direct2d|software` in frame events)
- The CEF/Chromium engine exists on macOS only — Linux/Windows Chromium builds fail early by design; don't add it as a cross-platform dependency
- The tray on Linux is still `UnsupportedService` — a menu-bar app (`close_policy="hide"`) on Windows must declare the `"tray"` capability, otherwise hiding fails
- notifications on Windows use the in-box balloon — no app-defined action buttons; action dispatch works only in the process that issued the notification (cold-start activation is not wired yet on macOS/Windows)
- `native vendor . pkg@X.Y.Z` is the right way for frontend npm deps — don't install them yourself and hope the build sees them
- registered fonts on mobile are unverified — don't ship a CJK app on iOS/Android before real testing
- one Zig 0.16.0 pin — code written for 0.15/0.17 will break; read `native skills get zig` / the Zig 0.16 Notes before touching lower-level wiring
