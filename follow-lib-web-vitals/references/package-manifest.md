# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `web-vitals` |
| Registry | `npm` |
| Latest Version | `6.2.1` |
| Release Date | `2026-08-26` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Philip Walton (Google Chrome)` |
| License | `Apache-2.0` |
| Repository | `<https://github.com/GoogleChrome/web-vitals>` |
| Website | `<https://web.dev/articles/vitals>` |
| Documentation | `<https://github.com/GoogleChrome/web-vitals#readme>` |
| Releases / Changelog | `<https://github.com/GoogleChrome/web-vitals/releases>` |

## Install

```bash
bun add web-vitals
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| — | — | — | Single-package skill; no secondary packages |

## Notes

- Breaking changes in latest major: v6 uses `on*` callbacks only (`get*` removed), explicit `import type` for types, soft-navigation support; `onFID` removed since v5 (INP replaced FID since v3)
- Version pinned in SKILL.md: `web-vitals@6.2.1`
