# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `firebase-admin` |
| Registry | `npm` |
| Latest Version | `14.4.0` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Google / Firebase |
| License | `Apache-2.0` |
| Repository | `https://github.com/firebase/firebase-admin-node` |
| Website | `https://firebase.google.com/` |
| Documentation | `https://firebase.google.com/docs/admin/setup` |
| Releases / Changelog | `https://github.com/firebase/firebase-admin-node/releases` |

## Install

```bash
bun add firebase-admin
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `firebase-tools` | `npm` | `unknown` | Firebase CLI — needed for emulator suite in dev |
| `firebase` | `npm` | `unknown` | Client-side SDK — separate package, do not confuse with admin SDK |

## Notes

- Breaking changes in latest major: v13+ requires Node 18+; service account JSON must come from secrets/env, never committed
- Version pinned in SKILL.md: `14.4.0`
