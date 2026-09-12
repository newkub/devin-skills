# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `ratatui` |
| Registry | `crates.io` |
| Latest Version | `0.30.2` |
| Release Date | `2026-06-19` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Ratatui developers` |
| License | `MIT` |
| Repository | `https://github.com/ratatui/ratatui` |
| Website | `https://ratatui.rs` |
| Documentation | `https://docs.rs/ratatui/latest/ratatui/` |
| Releases / Changelog | `https://github.com/ratatui/ratatui/releases` |

## Install

```bash
cargo add ratatui crossterm anyhow
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `crossterm` | `crates.io` | `0.29.0` (2025-04-05) | Default terminal backend (events, raw mode) |
| `anyhow` | `crates.io` | `1.0.104` (2026-07-18) | Application error handling |
| `color-eyre` | `crates.io` | `0.6.5` (2025-05-30) | Panic hook + error reporting (terminal restore) |

## Notes

- Breaking changes in latest major: ratatui 0.30 adds `ratatui::init()` / `ratatui::try_init()` / `ratatui::restore()` / `ratatui::run(app)` helpers (auto raw mode + alternate screen + restore); MSRV Rust 1.88
- Version pinned in SKILL.md: `ratatui@0.30.2`, `crossterm@0.29.0`
