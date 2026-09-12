# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `supabase` (Supabase CLI) |
| Registry | `npm` |
| Latest Version | `2.117.0` |
| Release Date | `2026-09-12` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Supabase |
| License | `MIT` |
| Repository | `https://github.com/supabase/cli` |
| Website | `https://supabase.com/` |
| Documentation | `https://supabase.com/docs/reference/cli` |
| Releases / Changelog | `https://github.com/supabase/cli/releases` |

## Install

```bash
bun add -D supabase
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@supabase/supabase-js` | `npm` | `2.116.0` | Client SDK for Auth, PostgREST, Realtime, Storage |
| Docker | `system` | `unknown` | Required for `supabase start` local stack |

## Notes

- Breaking changes in latest major: CLI 2.x line is current; `supabase/config.toml` is the single source of truth
- Version pinned in SKILL.md: `supabase@2.117.0` (CLI), `@supabase/supabase-js@2.116.0`
