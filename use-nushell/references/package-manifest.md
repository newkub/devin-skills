# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `nu` |
| Registry | `crates.io` / `GitHub Releases` / `winget` / `brew` |
| Latest Version | `0.115.1` |
| Release Date | `2026-08-23` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `nushell` |
| License | `MIT` |
| Repository | `https://github.com/nushell/nushell` |
| Website | `https://www.nushell.sh` |
| Documentation | `https://www.nushell.sh/book/` |
| Releases / Changelog | `https://github.com/nushell/nushell/releases` |

## Install

```powershell
winget install --id Nushell.Nushell
```

```bash
brew install nushell
cargo install nu
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| none | — | — | pipelines, data types, `open`/`save` ship with `nu` itself |

## Notes

- Breaking changes in latest major: `into filesize`/`into duration` removed — use literals (`10kb`, `5min`) or `into value`; YAML rework in `0.115.x`
- Version pinned in SKILL.md: `0.115.1 (verified 2026-09-12)` — matches latest
- `nu` releases บ่อย (ทุก ~3-4 สัปดาห์) — re-verify version ก่อนเขียน script ที่ซับซ้อน
