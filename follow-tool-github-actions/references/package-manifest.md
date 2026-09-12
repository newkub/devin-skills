# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `actionlint` |
| Registry | `GitHub Releases` (`rhysd/actionlint`) |
| Latest Version | `1.7.12` |
| Release Date | `2026-03-30` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `rhysd` |
| License | `MIT` |
| Repository | `https://github.com/rhysd/actionlint` |
| Website | `https://rhysd.github.io/actionlint/` |
| Documentation | `https://github.com/rhysd/actionlint#readme` |
| Releases / Changelog | `https://github.com/rhysd/actionlint/releases` |

## Install

```bash
mise use -g actionlint   # then run: actionlint
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `gh` | `GitHub Releases` | `2.100.0` (2026-09-03) | GitHub CLI (`cli/cli`) |
| `actions/checkout` | `GitHub Releases` | `7.0.1` (2026-07-20) | Use `@v7` in workflows |
| `actions/setup-node` | `GitHub Releases` | `7.0.0` (2026-07-14) | Use `@v7` in workflows |
| `actions/cache` | `GitHub Releases` | `6.1.0` (2026-06-26) | Use `@v6` in workflows |
| `actions/upload-artifact` | `GitHub Releases` | `7.0.1` (2026-04-10) | Use `@v7` in workflows |

## Notes

- Breaking changes in latest major: `none observed`
- Version pinned in SKILL.md: `gh@2.100.0`, `actions/checkout@v7`, `actions/setup-node@v7`, `actions/cache@v6`, `actions/upload-artifact@v7`
- GitHub Actions itself is a hosted platform (no installable package); `actionlint` is the workflow linter this skill relies on
