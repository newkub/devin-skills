# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `zod` |
| Registry | `npm` |
| Latest Version | `4.6.2` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Colin McDonnell (colinhacks)` |
| License | `MIT` |
| Repository | `<https://github.com/colinhacks/zod>` |
| Website | `<https://zod.dev>` |
| Documentation | `<https://zod.dev>` |
| Releases / Changelog | `<https://github.com/colinhacks/zod/releases>` |

## Install

```bash
bun add zod@latest
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `zod/mini` | `npm` | (subpath of `zod` 4.6.2) | Smaller-bundle API — `import * as z from "zod/mini"` |

## Notes

- Breaking changes in latest major: v4 removed `.errors` (use `error.issues`), deprecated `.merge()`/`.strict()`/`.passthrough()`/`z.string().email()` (use `z.strictObject`/`z.looseObject`/top-level `z.email()`), `error` param replaces `message`, `z.treeifyError` replaces `.format()`/`.flatten()`
- Version pinned in SKILL.md: `zod@4.6.2`
