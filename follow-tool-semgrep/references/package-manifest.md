# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `semgrep` |
| Registry | `PyPI` |
| Latest Version | `1.177.0` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Semgrep, Inc.` |
| License | `LGPL-2.1-or-later` |
| Repository | `<https://github.com/semgrep/semgrep>` |
| Website | `<https://semgrep.dev>` |
| Documentation | `<https://semgrep.dev/docs>` |
| Releases / Changelog | `<https://github.com/semgrep/semgrep/blob/develop/CHANGELOG.md>` |

## Install

```bash
pipx install semgrep   # or: mise use -g semgrep | brew install semgrep
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `semgrep` | `npm` | `0.0.1` (stale stub) | Deprecated placeholder pointing to `returntocorp/sgrep` — do NOT install via npm; use pipx/brew/mise |

## Notes

- Breaking changes in latest major: `1.x stable line; semgrep scan subcommand is the preferred entry point (bare --config still works)`
- Version pinned in SKILL.md: `1.177.0`
