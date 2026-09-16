# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `cac` |
| Registry | `npm` |
| Latest Version | `7.0.0` |
| Release Date | `2026-02-27` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `egoist / cacjs` |
| License | `MIT` |
| Repository | `https://github.com/cacjs/cac` |
| Website | `https://github.com/cacjs/cac` |
| Documentation | `https://github.com/cacjs/cac#readme` |
| Releases / Changelog | `https://github.com/cacjs/cac/releases` |

## Install

```bash
bun add cac
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `clap` | `crates.io` | `4.6.7` (2026-08-06) | Rust CLI framework — used by `/follow-create-rust-cli` |
| `commander` | `npm` | `15.0.0` (2026-05-29) | Alternative TS arg parser |
| `clipanion` | `npm` | `4.0.0-rc.4` (2024-09-06) | Alternative TS arg parser (RC) |

## Notes

- Breaking changes in latest major: `cac` v7 is ESM-only and requires Node >=20.19 / Bun; `cli.on` renamed to `cli.addEventListener`.
- Version pinned in SKILL.md: `cac@7.0.0`, `clap@4.6.7`, `commander@15.0.0`, `clipanion@4.0.0-rc.4`
- This skill is a dispatcher — it delegates implementation to `/follow-create-bun-cli` or `/follow-create-rust-cli`; primary package depends on the chosen stack.
