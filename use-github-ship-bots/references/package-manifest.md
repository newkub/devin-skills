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

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `bun` | `npm` / `GitHub Releases` | `1.4.2` (2026-09-05) | Runtime for bot projects and `bun test` |
| `@octokit/rest` | `npm` | `n/a` | GitHub API client used/mocked in bot handlers |

## Notes

- Breaking changes in latest major: `none`
- Version pinned in SKILL.md: `gh 2.100.0` and `bun 1.4.2` (verified 2026-09-12) — both match latest
- This is a workflow skill; `gh` is listed as primary because it is the operational dependency for issues/PRs, while `bun` is the build/test runtime
