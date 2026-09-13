# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `markdown-it` |
| Registry | `npm` |
| Latest Version | `15.0.2` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Vitaly Puzrin, Alex Kocharin` |
| License | `MIT` |
| Repository | `https://github.com/markdown-it/markdown-it` |
| Website | `https://github.com/markdown-it/markdown-it#readme` |
| Documentation | `https://markdown-it.github.io/` |
| Releases / Changelog | `https://github.com/markdown-it/markdown-it/blob/master/CHANGELOG.md` |

## Install

```bash
bun add markdown-it
# v15 bundle types ในตัว — ไม่ต้องติดตั้ง @types/markdown-it (ใช้เฉพาะกับ ≤v14)
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@shikijs/markdown-it` | `npm` | `4.4.3` | Syntax highlighting plugin (async setup) |
| `@types/markdown-it` | `npm` | `14.2.0` | ไม่จำเป็นใน v15 — types รวมใน package แล้ว (ใช้เฉพาะ ≤v14) |

## Notes

- Breaking changes in latest major: `v15 — ESM-focused, dropped old plugin APIs; check CHANGELOG when upgrading from v14`
- Version pinned in SKILL.md: `15.0.2`
