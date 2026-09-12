# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@capacitor/core` |
| Registry | `npm` |
| Latest Version | `8.5.2` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Ionic (ionic-team)` |
| License | `MIT` |
| Repository | `<https://github.com/ionic-team/capacitor>` |
| Website | `<https://capacitorjs.com>` |
| Documentation | `<https://capacitorjs.com/docs>` |
| Releases / Changelog | `<https://github.com/ionic-team/capacitor/releases>` |

## Install

```bash
bun add @capacitor/core && bun add -D @capacitor/cli
bunx cap init
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@capacitor/cli` | `npm` | `8.5.2` (2026-09-11) | `cap` CLI — sync/add/run commands |
| `@capacitor/ios` | `npm` | `8.5.2` (2026-09-11) | iOS platform (SPM default in v8) |
| `@capacitor/android` | `npm` | `8.5.2` (2026-09-11) | Android platform |
| `@capgo/capacitor-updater` | `npm` | `unknown` | OTA updates for web bundle |

## Notes

- Breaking changes in latest major: `Capacitor 8 — Node.js >= 22, Xcode >= 26, JDK >= 21, iOS SPM default, @capacitor/system-bars replaces adjustMarginsForEdgeToEdge`
- Version pinned in SKILL.md: `@capacitor/core@8.5.2` / `@capacitor/cli@8.5.2` (verified 2026-09-12)
