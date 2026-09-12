# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@simplewebauthn/server` |
| Registry | `npm` |
| Latest Version | `14.0.1` |
| Release Date | `2026-09-05` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Matthew Miller (MasterKale)` |
| License | `MIT` |
| Repository | `<https://github.com/MasterKale/SimpleWebAuthn>` |
| Website | `<https://simplewebauthn.dev>` |
| Documentation | `<https://simplewebauthn.dev/docs/>` |
| Releases / Changelog | `<https://github.com/MasterKale/SimpleWebAuthn/releases>` |

## Install

```bash
bun add @simplewebauthn/server @simplewebauthn/browser
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@simplewebauthn/browser` | `npm` | `14.0.0` | Client-side ceremonies (`startRegistration`/`startAuthentication`); released 2026-09-02 |

## Notes

- Breaking changes in latest major: `@simplewebauthn/types` retired since v13 — import types from `server`/`browser` directly; v11+ browser methods take a single options object
- Version pinned in SKILL.md: `@simplewebauthn/server@14.0.1` / `@simplewebauthn/browser@14.0.0`
