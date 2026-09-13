# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@biomejs/biome` |
| Registry | `npm` |
| Latest Version | `2.5.13` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `biomejs` |
| License | `MIT OR Apache-2.0` |
| Repository | `https://github.com/biomejs/biome` |
| Website | `https://biomejs.dev` |
| Documentation | `https://biomejs.dev/reference/cli/` |
| Releases / Changelog | `https://github.com/biomejs/biome/blob/main/CHANGELOG.md` |

## Install

```bash
bun add -D @biomejs/biome
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `ultracite` | `npm` | `—` | Optional Biome preset (merged from follow-tool-ultracite; see `references/ultracite.md`) |
| `biomejs/setup-biome` | `GitHub Action` | `v2` | CI setup action |

## Notes

- Breaking changes in latest major: `2.x — new config format (\`biome.jsonc\` schema), assist, domains; see https://biomejs.dev/guides/upgrade-to-biome-v2/`
- Version pinned in SKILL.md: `2.5.13`
