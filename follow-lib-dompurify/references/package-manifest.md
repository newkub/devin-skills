# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `dompurify` |
| Registry | `npm` |
| Latest Version | `3.4.15` |
| Release Date | `2026-09-06` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Dr.-Ing. Mario Heiderich, Cure53` |
| License | `(MPL-2.0 OR Apache-2.0)` |
| Repository | `https://github.com/cure53/DOMPurify` |
| Website | `https://github.com/cure53/DOMPurify` |
| Documentation | `https://github.com/cure53/DOMPurify#readme` |
| Releases / Changelog | `https://github.com/cure53/DOMPurify/releases` |

## Install

```bash
bun add dompurify
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `isomorphic-dompurify` | `npm` | `4.2.0` | Optional — SSR/Node wrapper (jsdom-based; jsdom does not run in workerd) |

## Notes

- Breaking changes in latest major: `v3 removed default export CJS shim paths; use ESM/default import and check config option renames when migrating from v2`
- Version pinned in SKILL.md: `dompurify@3.4.15`
