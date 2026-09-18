# Packaging And Updates Checklist — review-desktop-app

## Code Signing

- [ ] Windows — Authenticode signature on exe + installer, EV cert for SmartScreen rep
- [ ] macOS — Developer ID signature + notarization, hardened runtime, entitlements minimal
- [ ] Linux — GPG-signed packages (deb/rpm) where applicable
- [ ] signature verification — `codesign -v`, `signtool verify` pass on shipped artifacts
- [ ] cert rotation — expiry monitoring, renewal procedure documented

## Installers

- [ ] Windows — MSI/NSIS/MSIX, per-user vs per-machine choice deliberate
- [ ] macOS — DMG with /Applications symlink, or PKG for system installs
- [ ] Linux — AppImage/deb/rpm/flatpak coverage for claimed distros
- [ ] silent install — `/S` or equivalent flags for enterprise deployment
- [ ] uninstall clean — removes app + registrations, optional user-data prompt
- [ ] upgrade path — installer handles existing version, preserves settings/data

## Auto-Update

- [ ] update mechanism — Tauri updater / electron-updater / Squirrel / custom
- [ ] signed updates — signature verified before apply, private key in CI secrets
- [ ] delta updates — bandwidth-efficient patches where supported
- [ ] update channels — stable/beta/nightly separation, user-selectable
- [ ] rollback — failed/corrupt update doesn't brick install
- [ ] update UX — notification, progress, restart flow not disruptive
- [ ] version check — server endpoint secured, no MITM-able version file

## Artifact Integrity

- [ ] reproducible builds — same source → same binary where feasible
- [ ] SBOM — dependency manifest shipped or publishable
- [ ] no dev artifacts — `.map` files, test fixtures, debug symbols (unless needed)
- [ ] bundled deps — vendored runtime/libs match declared versions
- [ ] installer size budget — within target (Electron ~150-250MB, Tauri ~10-30MB)

## Distribution

- [ ] download page — checksums/signatures published, HTTPS
- [ ] store listings — MS Store, Mac App Store, Snap/Flatpak if claimed
- [ ] enterprise — MSI/MSIX for managed deployment, Group Policy notes
- [ ] portable build — if offered, clearly marked, data path documented
- [ ] CI/CD — release pipeline reproducible, signed artifacts only

## Crash Reporting And Telemetry

- [ ] crash reporting — opt-in consent, Sentry/Breakpad/Crashpad
- [ ] PII scrubbing — no user data in crash dumps/logs
- [ ] telemetry — disclosed, opt-out available, minimal collection
- [ ] symbols — debug symbols uploaded for symbolication, not shipped to users

## First-Run Experience

- [ ] onboarding — minimal, skippable, not blocking app use
- [ ] permissions — requested contextually on first need, not all upfront
- [ ] default settings — sensible, documented, reset path
- [ ] license/terms — acceptance flow where required
- [ ] migration — existing user data from older versions imported cleanly

## Detection

- inspect CI release config — signing steps, notarization, updater keys
- `codesign -dv` / `signtool verify` on shipped artifacts
- grep updater config — `tauri.conf.json` updater, `electron-builder.yml` publish
- `npm pack`/`tauri build` artifact inspection — size, contents, no `.map`

Severity: unsigned binaries = Critical, unsigned updates = Critical, no rollback = High, leaked source maps = High, bloated installer = Medium
