# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `madge` |
| Registry | `npm` |
| Latest Version | `8.0.0` |
| Release Date | `2024-08-05` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Patrik Henningsson` (pahen) |
| License | `MIT` |
| Repository | `https://github.com/pahen/madge` |
| Website | `https://github.com/pahen/madge` |
| Documentation | `https://github.com/pahen/madge#readme` |
| Releases / Changelog | `https://github.com/pahen/madge/releases` |

## Install

```bash
bun add -D madge
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `typescript` | `npm` | `7.0.2` | Optional peer (madge declares `^5.4.4`) — required for TS/TSX analysis |
| `graphviz` | `system` | — | System dependency required only for `--image` graph export |

## Notes

- Breaking changes in latest major: `v8 requires Node.js >=18; CLI/API flag cleanup — check release notes if upgrading from v6/v7`
- Version pinned in SKILL.md: `madge@8.0.0`
- Source: `https://registry.npmjs.org/madge`
