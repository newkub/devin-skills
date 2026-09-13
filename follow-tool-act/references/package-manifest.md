# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `act` |
| Registry | `GitHub Releases` |
| Latest Version | `0.2.89` |
| Release Date | `2026-06-01` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `nektos` |
| License | `MIT` |
| Repository | `https://github.com/nektos/act` |
| Website | `https://nektosact.com` |
| Documentation | `https://nektosact.com/usage/index.html` |
| Releases / Changelog | `https://github.com/nektos/act/releases` |

## Install

```bash
mise use -g act   # or: scoop install act / winget install nektos.act / brew install act
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `ghcr.io/catthehacker/ubuntu` | `OCI image` | `act-latest` tag | Container image used to run jobs locally |

## Notes

- Breaking changes in latest major: `none (still 0.x — check release notes per version)`
- Version pinned in SKILL.md: `0.2.89`
- Requires a running Docker daemon (`docker info`)
