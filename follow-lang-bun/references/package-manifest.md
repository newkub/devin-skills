# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `bun` |
| Registry | `npm` / `GitHub Releases` |
| Latest Version | `1.4.2` |
| Release Date | `2026-09-05` |
| Verified | `2026-09-18` (date this file was last checked) |
| Author / Publisher | `oven-sh` (Oven) |
| License | `MIT` |
| Repository | `https://github.com/oven-sh/bun` |
| Website | `https://bun.com` |
| Documentation | `https://bun.com/docs` |
| Releases / Changelog | `https://github.com/oven-sh/bun/releases` |

## Install

```bash
mise use -g bun
```

Or via npm wrapper: `npm install -g bun` / `bun upgrade` once installed.

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `bun-types` | `npm` | `n/a` | TypeScript types for Bun APIs (devDependency) |

## Notes

- Breaking changes in latest major: `Bun 1.4 rewrote core internals in Rust; adds Bun.Image, Bun.WebView, Bun.markdown, Bun.cron(), Bun.Terminal, HTTP/2 in Bun.serve, bun run/test --parallel, bun audit fix, bun dedupe, bun prune, isolated installs default for new monorepos`
- Version pinned in SKILL.md: `1.4.2 (verified 2026-09-18)` — matches latest
