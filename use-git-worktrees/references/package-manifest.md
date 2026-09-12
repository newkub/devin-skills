# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `git` |
| Registry | `GitHub Releases` |
| Latest Version | `2.55.0` (Windows build `v2.55.0.windows.5`) |
| Release Date | `2026-08-20` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `git-for-windows` / Git SCM community |
| License | `GPL-2.0` |
| Repository | `https://github.com/git/git` (upstream), `https://github.com/git-for-windows/git` (Windows releases) |
| Website | `https://git-scm.com` |
| Documentation | `https://git-scm.com/doc` |
| Releases / Changelog | `https://github.com/git-for-windows/git/releases` |

## Install

```bash
winget install Git.Git
```

Or `mise use -g git` / `scoop install git` / `brew install git` / `apt install git` per OS.

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `gh` | `GitHub Releases` | `2.100.0` (2026-09-03) | Optional — `gh pr checkout <n> --worktree <path>` checks a PR directly into a worktree (gh >= 2.98.0) |

## Notes

- Breaking changes in latest major: `none — git worktree stable since 2.15+`
- Version pinned in SKILL.md: `2.55.0 (verified 2026-09-12)` — matches latest
