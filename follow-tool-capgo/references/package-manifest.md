# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@capgo/capacitor-updater` |
| Registry | `npm` |
| Latest Version | `8.51.15` |
| Release Date | `2026-08-28` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Capgo (Cap-go)` |
| License | `MPL-2.0` |
| Repository | `https://github.com/Cap-go/capacitor-updater` |
| Website | `https://capgo.app` |
| Documentation | `https://capgo.app/docs/plugins/updater/` |
| Releases / Changelog | `https://github.com/Cap-go/capacitor-updater/releases` |

## Install

```bash
bun add @capgo/capacitor-updater
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@capgo/cli` | `npm` | `8.51.0` (2026-09-13) | Capgo CLI for OTA bundle upload/manage |
| `@capgo/capacitor-native-biometric` | `npm` | `8.6.8` (2026-09-13) | Biometric auth plugin (Keychain/Keystore) |
| `@capacitor/core` | `npm` | — | Peer dependency: `^8.0.0` required by updater v8 |

## Notes

- Breaking changes in latest major: `v8` requires `@capacitor/core ^8.0.0` (peer dependency)
- Version pinned in SKILL.md: `@capgo/capacitor-updater@8.51.15` / `@capgo/cli@8.51.0`
