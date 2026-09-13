# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `hurl` (binary) / `@orangeopensource/hurl` (npm wrapper) |
| Registry | `cargo` / `npm` / scoop / winget / docker |
| Latest Version | `8.0.1` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Orange-OpenSource` |
| License | `Apache-2.0` |
| Repository | `https://github.com/Orange-OpenSource/hurl` |
| Website | `https://hurl.dev` |
| Documentation | `https://hurl.dev/docs/manual.html` |
| Releases / Changelog | `https://github.com/Orange-OpenSource/hurl/releases` |

## Install

```bash
scoop install hurl            # Windows
winget install hurl           # Windows
cargo install --locked hurl   # Rust
bun add -D @orangeopensource/hurl  # npm wrapper (dev dep)
```

## Notes

- Written in Rust on top of libcurl — single binary, no runtime
- Windows requires Visual C++ Redistributable (not bundled in installer)
- Version pinned in SKILL.md: `hurl@8.0.1`
- Source: `https://github.com/Orange-OpenSource/hurl/releases`
