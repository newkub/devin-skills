# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `<name>` |
| Registry | `npm` / `crates.io` / `PyPI` / `Go` / `GitHub Releases` / `system` |
| Latest Version | `<x.y.z>` |
| Release Date | `<YYYY-MM-DD>` |
| Verified | `<YYYY-MM-DD>` (date this file was last checked) |
| Author / Publisher | `<org or person>` |
| License | `<SPDX>` |
| Repository | `<https://github.com/org/repo>` |
| Website | `<official site>` |
| Documentation | `<docs URL>` |
| Releases / Changelog | `<releases or changelog URL>` |

## Install

```bash
<primary install command, e.g. bun add -D <name>>
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `<name>` | `<registry>` | `<x.y.z>` | `<role, e.g. peer/optional/CLI>` |

## Notes

- Breaking changes in latest major: `<summary or none>`
- Version pinned in SKILL.md: `<version or none>`
