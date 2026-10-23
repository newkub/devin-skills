# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-agents-skills-global` or `/deep-review` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `bun` |
| Registry | `npm` / `GitHub Releases` |
| Latest Version | `1.4.3` |
| Release Date | `n/a` (GitHub API unreachable at last check) |
| Verified | `2026-10-15` (date this file was last checked — `bun --version` on this machine) |
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
| `eta` | `npm` | `4.6.0` | Template/render engine via `https://esm.sh/eta@4.6.0` — `latest` dist-tag verified 2026-10-15 |
| `oxc-parser` | `npm` | `0.154.0` | Fast JS/TS AST parsing — via esm.sh or `bun add oxc-parser` (verified 2026-10-15) |
| `rolldown` | `npm` | `1.2.14` | Fast bundler built on `oxc` — see `/follow-tool-rolldown` (verified 2026-10-15) |
| `nu` | `crates.io` | `0.115.1` | Shell option for `.nu` scripts (see `use-nu-shell`) — `nu --version` on this machine |
| `pwsh` | `GitHub Releases` | `7.6.6` | Shell option for `.ps1` scripts (see `use-pwsh-shell`) |
| `@ast-grep/cli` | `npm` | `0.50.0` | AST-based search/transform option (see `use-astgrep`) — via `bunx` 2026-10-15 |

## Notes

- Breaking changes in latest major: `none`
- Version pinned in SKILL.md: `eta 4.6.0`, `oxc-parser 0.154.0`, `rolldown 1.2.14` (verified 2026-10-15) — all match latest; `bun` itself is not version-pinned in this SKILL.md
