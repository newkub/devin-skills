# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `zod` |
| Registry | `npm` |
| Latest Version | `4.6.5` |
| Release Date | `2026-09-13` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Colin McDonnell (colinhacks)` |
| License | `MIT` |
| Repository | `<https://github.com/colinhacks/zod>` |
| Website | `<https://zod.dev>` |
| Documentation | `<https://zod.dev>` |
| Releases / Changelog | `<https://github.com/colinhacks/zod/releases>` |

## Install

```bash
bun add zod
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `valibot` | `npm` | `1.5.0` | Alternative — modular/tree-shakable validator |
| `arktype` | `npm` | `2.2.3` | Alternative — type-syntax validator |
| `yup` | `npm` | `1.7.1` | Alternative — object schema validator |
| `joi` | `npm` | `18.2.9` | Alternative — Node.js schema validator |

## Notes

- Breaking changes in latest major: `zod v4 — use error param instead of message/invalid_type_error; see SKILL.md rules`
- Version pinned in SKILL.md: `4.6.5` (updated from 4.6.2 on 2026-09-13)
- Skill covers a validator category; `zod` is the recommended default for TypeScript — other ecosystems: `validator`/`garde` (Rust), `pydantic` (Python), `go-playground/validator` (Go)
