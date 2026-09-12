# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@biomejs/biome` |
| Registry | `npm` |
| Latest Version | `2.5.13` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Biome (biomejs)` |
| License | `MIT OR Apache-2.0` |
| Repository | `https://github.com/biomejs/biome` |
| Website | `https://biomejs.dev` |
| Documentation | `https://biomejs.dev/linter/plugins/` |
| Releases / Changelog | `https://github.com/biomejs/biome/blob/main/CHANGELOG.md` |

## Install

```bash
bun add -D @biomejs/biome
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@biomejs/js-api` | `npm` | `6.0.0` (2026-06-12) | JS/WASM API bindings for programmatic lint/format |

## Notes

- Breaking changes in latest major: Biome 2.x renamed config to `biome.jsonc`, added GritQL plugin support (`plugins` array) and `engine biome(1.0)` directive.
- Version pinned in SKILL.md: `@biomejs/biome@2.5.13` / `@biomejs/js-api@6.0.0`
