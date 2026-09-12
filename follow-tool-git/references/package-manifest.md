# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `git` |
| Registry | `GitHub Releases` (`git-for-windows/git`; upstream `git/git`) |
| Latest Version | `2.55.0` (tag `v2.55.0.windows.5`) |
| Release Date | `2026-08-20` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Git project / Software Freedom Conservancy` |
| License | `GPL-2.0` |
| Repository | `https://github.com/git/git` |
| Website | `https://git-scm.com` |
| Documentation | `https://git-scm.com/doc` |
| Releases / Changelog | `https://github.com/git-for-windows/git/releases` |

## Install

```bash
mise use -g git   # or: winget install Git.Git / brew install git / apt install git
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `simple-git` | `npm` | `3.36.0` (2026-04-12) | JS/TS programmatic git API |
| `isomorphic-git` | `npm` | `1.42.2` (2026-09-11) | Pure-JS git for browser/Node |
| `gh` | `GitHub Releases` | `2.100.0` (2026-09-03) | GitHub CLI companion (`cli/cli`) |

## Notes

- Breaking changes in latest major: `none observed`
- Version pinned in SKILL.md: `simple-git@3.36.0` / `isomorphic-git@1.42.2` / gh CLI `2.100.0`
- `git/git` publishes tags, not GitHub Releases — `git-for-windows/git` releases used as canonical latest-version source
