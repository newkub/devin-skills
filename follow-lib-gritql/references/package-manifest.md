# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@biomejs/biome` (bundles the GritQL engine used by `biome search` and `.grit` plugins) |
| Registry | `npm` |
| Latest Version | `2.5.13` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Emanuele Stoppa (Biome)` |
| License | `MIT OR Apache-2.0` |
| Repository | `https://github.com/biomejs/biome` |
| Website | `https://biomejs.dev` |
| Documentation | `https://biomejs.dev/reference/gritql/` |
| Releases / Changelog | `https://github.com/biomejs/biome/releases` |

## Install

```bash
bun add -D @biomejs/biome
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `getgrit/gritql` | `GitHub` | `unknown` | Upstream GritQL language (Rust); Biome embeds a GritQL engine — not installed separately for this skill |

## Notes

- Breaking changes in latest major: `Biome v2 changed config format (biome.json v2 schema), plugin API, and assist actions vs v1`
- Version pinned in SKILL.md: `@biomejs/biome@2.5.13` (as GritQL engine)
