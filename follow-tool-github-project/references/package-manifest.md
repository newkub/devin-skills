# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `gh` (GitHub CLI — `gh project` subcommands) |
| Registry | `GitHub Releases` (`cli/cli`) |
| Latest Version | `2.100.0` |
| Release Date | `2026-09-03` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `GitHub, Inc.` |
| License | `MIT` |
| Repository | `https://github.com/cli/cli` |
| Website | `https://cli.github.com` |
| Documentation | `https://cli.github.com/manual/gh_project` |
| Releases / Changelog | `https://github.com/cli/cli/releases` |

## Install

```bash
mise use -g gh   # or: winget install --id GitHub.cli / brew install gh / apt install gh
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| — | — | — | `gh project` is built into the `gh` CLI; requires `project` token scope (`gh auth refresh -s project`) |

## Notes

- Breaking changes in latest major: `none observed`
- Version pinned in SKILL.md: `gh@2.100.0`
