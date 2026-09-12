# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `knip` |
| Registry | `npm` |
| Latest Version | `6.35.1` |
| Release Date | `2026-09-09` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Lars Kappert (webpro)` |
| License | `ISC` |
| Repository | `https://github.com/webpro-nl/knip` |
| Website | `https://knip.dev` |
| Documentation | `https://knip.dev/overview/getting-started` |
| Releases / Changelog | `https://github.com/webpro-nl/knip/releases` |

## Install

```bash
bun add -D knip
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `oxc-parser` / `oxc-resolver` | `npm` | `—` | v6 parser/resolver internals (2–4x faster); not installed separately |

## Notes

- Breaking changes in latest major: `v6 — requires Node ^20.19.0 || >=22.12.0 (or Bun); \`--include-libs\`/\`--isolate-workspaces\` removed (now default), \`classMembers\` issue type removed, \`namespaceMembers\` added`
- Version pinned in SKILL.md: `6.35.1`
