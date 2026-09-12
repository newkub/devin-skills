# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `bun` |
| Registry | `npm` / `GitHub Releases` |
| Latest Version | `1.4.2` |
| Release Date | `2026-09-05` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `oven-sh` (Oven) |
| License | `MIT` |
| Repository | `https://github.com/oven-sh/bun` |
| Website | `https://bun.sh` |
| Documentation | `https://bun.sh/docs` |
| Releases / Changelog | `https://github.com/oven-sh/bun/releases` |

## Install

```bash
mise use -g bun
```

Bun is the default script runtime for this skill (`.ts` scripts via `bun run` / `bun -e`).

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `eta` | `npm` | `4.6.0` (2026-04-25) | Template/render engine via `https://esm.sh/eta@4.6.0` |
| `oxc-parser` | `npm` | `0.149.0` (2026-09-07) | Fast JS/TS AST parsing — via esm.sh or `bun add oxc-parser` |
| `rolldown` | `npm` | `1.2.8` (2026-09-09) | Fast bundler built on `oxc` — see `/follow-tool-rolldown` |
| `nu` | `crates.io` | `0.115.1` (2026-08-23) | Shell option for `.nu` scripts (see `use-nu-shell`) |
| `pwsh` | `GitHub Releases` | `7.6.6` (2026-09-08) | Shell option for `.ps1` scripts (see `use-pwsh-shell`) |
| `@ast-grep/cli` | `npm` | `0.45.3` (2026-08-31) | AST-based search/transform option (see `use-astgrep`) |

## Notes

- Breaking changes in latest major: `none`
- Version pinned in SKILL.md: `eta 4.6.0`, `oxc-parser 0.149.0`, `rolldown 1.2.8` (verified 2026-09-12) — all match latest; `bun` itself is not version-pinned in this SKILL.md
