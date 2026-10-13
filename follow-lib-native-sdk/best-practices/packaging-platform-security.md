# Packaging, Platform Caveats & Security

## Recommended patterns

- **Release flow:** `native build` (ReleaseFast → `zig-out/bin/`) → smoke บนเครื่องจริง → `native package --target <os>` → sign (macOS) → distribute
- **Per-platform package outputs:**
  - macOS: `.app` + styled drag-to-Applications DMG (`--archive`); codegen icons จาก `assets/icon.png` ตัวเดียว
  - Linux: install tree (`.desktop`, hicolor icons, mime)
  - Windows: distributable directory + `register-file-types.ps1` (HKCU, per-user)
  - iOS: generated Xcode project ทั้งชุด (toolkit host, Info.plist, asset catalog, device slice) → `xcodebuild archive`; **signing ยังเป็น manual step**
  - Android: generated host project → debug APK assembles ตรง; store signing keys manual; arm64-v8a, minSdk 30
- **macOS signing/notarization เป็น automation เดียวที่มี:**
  ```sh
  native package --target macos --signing identity --identity "Developer ID Application: …" \
    --entitlements app.entitlements --notarize --notary-profile <profile>
  ```
  credential เก็บผ่าน `xcrun notarytool store-credentials`; verify ด้วย `codesign --verify --strict` — platform อื่นยังไม่มี signing tooling
- **Auto-updates (macOS เท่านั้น, own updater — ไม่มี Sparkle):** `native update keygen` (Ed25519) → manifest `updates{feed_url, public_key, check_on_start}` (HTTPS บังคับ) → `native update sign` → reserved command `app.check-for-updates`; ไม่มี delta/channels/phased rollout
- **Security posture declares ใน `app.json`:**
  - permissions เป็น default-deny ต่อ group: `window command view dialog filesystem clipboard credentials network camera microphone system_audio location notifications` — JS bridge groups (`dialogs/os/clipboard/credentials`) always default-deny unless explicitly granted; `js_window_api` เปิด window/view/webview groups
  - navigation allowlist: `zero://app`, `zero://inline`, exact dev origin + `navigation.allowed_origins`
  - external links denied ยกเว้น `.action = .open_system_browser` + `allowed_urls` (exact หรือ single trailing `/*` — ระวัง wildcard กว้างเกิน)
  - symlinks ถูก resolve ก่อน filesystem checks; **CSP ไม่ใช่หน้าที่ SDK** — web content ต้องคุมเอง
- **Bridge discipline (web content):** JSON ผ่าน `window.zero.invoke(command, payload)` limits 16KiB msg / 12KiB result — payload ใหญ่ให้ chunk ผ่าน files/store ไม่ใช่บีบ bridge
- **WebView when needed:** system engine เป็น default ทุก desktop (macOS WKWebView, Linux WebKitGTK, Windows WebView2 — Evergreen มีใน Win11, `native doctor` ตรวจ runtime); `main` เป็น reserved window label, child webviews ≤16, zoom 0.25–5.0

## Pitfalls

- **Windows = early development** สำหรับ packaging — ทดสอบ artifact บน Windows machine จริงก่อนปล่อย (`tools/windows-truth` style: clipboard round-trips, launch packaged binary)
- **Linux renderer เป็น software path** — workloads ที่พึ่ง GPU สูงควรวัดบน macOS/Windows (`backend=metal|direct2d|software` report ใน frame events)
- **CEF/Chromium engine มีเฉพาะ macOS** — Linux/Windows Chromium builds fail early โดยเจตนา อย่าใส่เป็น dependency ข้าม platform
- **tray บน Linux ยัง `UnsupportedService`** — menu-bar app (`close_policy="hide"`) บน Windows ต้อง declare `"tray"` capability ไม่งั้น hide fail
- **notifications on Windows** ใช้ in-box balloon — ไม่มี app-defined action button; action dispatch ทำงานเฉพาะ process ที่ออก notification (cold-start activation ยังไม่ wiring บน macOS/Windows)
- **`native vendor . pkg@X.Y.Z`** คือทางที่ถูกต้องสำหรับ npm deps ของ frontend —ห้าม install เองแล้วหวังให้ build เห็น
- **registered fonts บน mobile = unverified** — อย่า shipping CJK app บน iOS/Android ก่อนทดสอบจริง
- **Zig 0.16.0 pin เดียว** — code ที่เขียนบน 0.15/0.17 จะพัง; อ่าน `native skills get zig` / Zig 0.16 Notes ก่อนแตะ lower-level wiring
