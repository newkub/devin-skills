# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `gh` (GitHub CLI) |
| Registry | `GitHub Releases` |
| Latest Version | `2.100.0` |
| Release Date | `2026-09-03` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `cli` (GitHub) |
| License | `MIT` |
| Repository | `https://github.com/cli/cli` |
| Website | `https://cli.github.com` |
| Documentation | `https://cli.github.com/manual/` |
| Releases / Changelog | `https://github.com/cli/cli/releases` |

## Install

```bash
winget install --id GitHub.cli
```

Or `mise use -g github-cli` / `brew install gh` / `scoop install gh` per OS.

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `git` | `GitHub Releases` | `2.55.0` (2026-08-20) | Required companion — `gh` shells out to git |

## Notes

- Breaking changes in latest major: `2.100.0 adds gh config set api_host gateway routing (experimental); >= 2.98.0 required for gh codespace ports forward security fix GHSA-vfhh-p7hm-pxfh, gh pr checkout --worktree, and semantic issue search`
- Version pinned in SKILL.md: `2.100.0 (verified 2026-09-12)` — matches latest
