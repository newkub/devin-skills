# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `prettier` |
| Registry | `npm` |
| Latest Version | `3.9.6` |
| Release Date | `2026-07-21` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Prettier` |
| License | `MIT` |
| Repository | `https://github.com/prettier/prettier` |
| Website | `https://prettier.io` |
| Documentation | `https://prettier.io/docs/` |
| Releases / Changelog | `https://github.com/prettier/prettier/blob/main/CHANGELOG.md` |

## Install

```bash
bun add -D prettier   # or the stack-appropriate formatter below
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `dprint` | `npm` | `0.57.4` (2026-09-05) | Multi-language pluggable formatter — see `/follow-tool-dprint` |
| `@biomejs/biome` | `npm` | `2.5.13` (2026-09-10) | TS/JS formatter + linter — see `/follow-tool-biome` |
| `ruff` | `PyPI` | `0.16.7` | Python formatter (`ruff format`) + linter |
| `rustfmt` | `rustup component` | `—` | Rust formatter (`rustup component add rustfmt`) |
| `gofmt` | `Go toolchain` | `—` | Go formatter (ships with Go) |

## Notes

- Breaking changes in latest major: `prettier 3.x — async plugin API, new defaults; see https://prettier.io/blog`
- Version pinned in SKILL.md: `prettier@3.9.6` / `dprint@0.57.4` / `@biomejs/biome@2.5.13`
- Skill is formatter-agnostic — pick per tech stack; prefer the project's existing formatter
