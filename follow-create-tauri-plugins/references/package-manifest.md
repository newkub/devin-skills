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
| Author / Publisher | `Tauri Programme within the Commons Conservancy` |
| License | `MIT OR Apache-2.0` |
| Repository | `https://github.com/tauri-apps/tauri` |
| Website | `https://tauri.app/` |
| Documentation | `https://docs.rs/tauri` / `https://tauri.app/develop/plugins/` |
| Releases / Changelog | `https://github.com/tauri-apps/tauri/releases` |

## Install

```bash
bunx @tauri-apps/cli plugin new <name>
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@tauri-apps/cli` | `npm` | `2.11.4` (2026-06-28) | CLI used for `plugin new`, `plugin android/ios add` |
| `@tauri-apps/api` | `npm` | `2.11.1` (2026-06-17) | JS bindings (`@tauri-apps/api/core` invoke) |

## Notes

- Breaking changes in latest major: Tauri 2.x — plugin = Rust crate (`tauri-plugin-<name>`) + optional NPM guest-js package; commands auto-generate `permissions/` files
- Version pinned in SKILL.md: `tauri@2.11.5`, `@tauri-apps/cli@2.11.4`
