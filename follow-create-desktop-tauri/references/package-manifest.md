# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `tauri` |
| Registry | `crates.io` |
| Latest Version | `2.11.5` |
| Release Date | `2026-07-01` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Tauri Programme (Commons Conservancy)` |
| License | `Apache-2.0 OR MIT` |
| Repository | `https://github.com/tauri-apps/tauri` |
| Website | `https://tauri.app` |
| Documentation | `https://v2.tauri.app` |
| Releases / Changelog | `https://github.com/tauri-apps/tauri/releases` |

## Install

```bash
bunx create-tauri-app   # or: bun add @tauri-apps/api && bun add -D @tauri-apps/cli
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@tauri-apps/cli` | `npm` | `2.11.4` (2026-06-28) | Tauri CLI (`bun run tauri dev/build`) |
| `@tauri-apps/api` | `npm` | `2.11.1` (2026-06-17) | Frontend `invoke()`/event API |
| `create-tauri-app` | `npm` | `unknown` | Project scaffolder |

## Notes

- Breaking changes in latest major: Tauri 2.x uses capabilities files (`src-tauri/capabilities/*.json`) instead of v1 allowlist; mobile targets supported.
- Version pinned in SKILL.md: `tauri@2.11.5` / `@tauri-apps/cli@2.11.4` / `@tauri-apps/api@2.11.1`
