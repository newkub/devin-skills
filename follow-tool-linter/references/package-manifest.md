# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `oxlint` |
| Registry | `npm` |
| Latest Version | `1.82.0` |
| Release Date | `2026-09-07` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `oxc-project` |
| License | `MIT` |
| Repository | `https://github.com/oxc-project/oxc` |
| Website | `https://oxc.rs` |
| Documentation | `https://oxc.rs/docs/guide/usage/linter` |
| Releases / Changelog | `https://github.com/oxc-project/oxc/releases` |

## Install

```bash
bun add -D oxlint   # add oxlint-tsgolint for type-aware rules
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `oxlint-tsgolint` | `npm` | `—` | Optional type-aware rules for oxlint |
| `@biomejs/biome` | `npm` | `2.5.13` (2026-09-10) | TS/JS linter + formatter — see `/follow-tool-biome` |
| `eslint` | `npm` | `10.10.0` (2026-09-04) | TS/JS linter — see `/follow-tool-eslint` |
| `ruff` | `PyPI` | `0.16.7` (2026-09-10) | Python linter (`pipx install ruff`) |
| `golangci-lint` | `GitHub Releases` | `2.13.2` (2026-08-27) | Go linter meta-runner (`mise use -g golangci-lint`) — GPL-3.0 |
| `clippy` | `rustup component` | `—` | Rust linter (`rustup component add clippy`) |

## Notes

- Breaking changes in latest major: `oxlint 1.x stable — check https://github.com/oxc-project/oxc/releases per minor`
- Version pinned in SKILL.md: `oxlint@1.82.0`, `biome@2.5.13`, `eslint@10.10.0`, `ruff@0.16.7`, `golangci-lint@2.13.2`
- Skill is linter-agnostic — select per tech stack (step 1)
