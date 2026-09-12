# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@workos-inc/node` |
| Registry | `npm` |
| Latest Version | `10.13.0` |
| Release Date | `2026-08-31` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | WorkOS |
| License | `MIT` |
| Repository | `https://github.com/workos/workos-node` |
| Website | `https://workos.com/` |
| Documentation | `https://workos.com/docs` |
| Releases / Changelog | `https://github.com/workos/workos-node/releases` |

## Install

```bash
bun add @workos-inc/node
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `workos` | `PyPI` | `unknown` | `workos-python` SDK for Python backends |
| `@workos-inc/authkit-nextjs` | `npm` | `unknown` | AuthKit helpers for Next.js apps |

## Notes

- Breaking changes in latest major: AuthKit / User Management API is the modern path; `sso.*` calls are the legacy flow
- Version pinned in SKILL.md: `10.13.0`
