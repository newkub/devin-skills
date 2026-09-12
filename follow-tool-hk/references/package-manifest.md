# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `hk` |
| Registry | `GitHub Releases` / `crates.io` |
| Latest Version | `1.58.1` |
| Release Date | `2026-09-05` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `jdx` |
| License | `MIT` |
| Repository | `https://github.com/jdx/hk` |
| Website | `https://hk.jdx.dev` |
| Documentation | `https://hk.jdx.dev` |
| Releases / Changelog | `https://github.com/jdx/hk/releases` |

## Install

```bash
mise use -g hk   # or: cargo install hk / brew install hk
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `pkl` | `system` | `—` | Config language runtime embedded by hk (v1.57+ embeds its own Pkl package) |
| `mise` | `GitHub Releases` | `—` | Tool manager hk integrates with (`mise = true` in `hk.pkl`) — see `/follow-tool-mise` |

## Notes

- Breaking changes in latest major: `v1.x — \`effect = "destructive"\` (v1.55+), \`subprojects\` (v1.52+), \`dir\` Tera templates + \`check_diff\` (v1.57+); see release notes`
- Version pinned in SKILL.md: `1.58.1`
- `hk.pkl` must `amends`/`import` the Pkl package matching the pinned version tag
